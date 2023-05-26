const powerratings = {
    "EGO" : 4,
    "BEAM" : 3,
    "SMOOCH" : 5,
    "XCROSS" : 2,
    "STEP" : -2,
    "TURNEND" : -3,
    //"ATTACK" : 0,
    "PLUS" : 4,
}

const soulcosts = {
    "STEP" : 3,
    "TURNEND" : 4,
    "ATTACK" : 2,
}
// In the research menu, these should have "history book" descriptions.
// EGO - BEAM - PCROSS - XCROSS - 8ADJ - 4ADJ - RANDOM (up to power) - WALL - ALL - PAYLOAD (summon that unleashes targets on death)

targeters = {
    EGO: function(caster){
        return [caster.tile];
    },
    BEAM : function(caster){
        return targetBoltTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), caster.tile);
    },
    XCROSS : function(caster){
        const directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];
        let targets = [];
        for(let k=0;k<directions.length;k++){
            for (let i of targetBoltTravel(directions[k], 14, caster.tile)) targets.push(i);
        }
        return targets;
    },
    SMOOCH : function(caster){
        let newTile = caster.tile;
        newTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        //newTile.setEffect(14,30);
        return [newTile];
    },
    EPSILON: function(caster){
    },
    PLUS: function(caster){
        let targets = [];
        targets.push(caster.tile);
        caster.tile.getAdjacentNeighbors().forEach(function(t){
            targets.push(t);
        });
        return targets;
    },
}

// ARTISTICMINE - LASTMOVE>RANDOMDIR - SACRIFICE (Dump wheel) - DAMPENER (reduce power, get something in exchange) - ALLOUT (lose all resolve, get power)
//

class DelayedAttack{
    constructor(entity,forms,mutators,functions,power){
        this.forms = forms.slice();
        this.mutators = mutators.slice();
        this.functions = functions.slice();
        this.power = power;
        removeItemOnce(this.mutators,"ATKDELAY");
    }
    trigger(caster){
        let blast = new Axiom([],this.forms,this.mutators,this.functions,"VILE");
        blast.legendCast(caster);
    }
}

modifiers = {
    CLICK: function(mods){
        let targets = mods["targets"];
        let functions = mods["functions"];
        let power = mods["power"];
        for (let i of targets){
            if (i.passable) {
                i.clicktrap = new ClickTrap(i,functions,power);
            }
        }
        mods["continue"] = false;
        return mods;
    },
    ATKDELAY: function(mods){
        let mutators = mods["mutators"];
        let functions = mods["functions"];
        let power = mods["power"];
        let forms = mods["forms"];
        let caster = mods["caster"];
        mods["continue"] = false;
        caster.storedattacks.push(new DelayedAttack(caster,forms,mutators,functions,power));
        return mods;
    },
    SACRIFICE: function(mods){
        let bonus = 0;
        for (let i = 0; i<wheel.wheel.length;i++){
            if (!(wheel.wheel[i] instanceof Empty)){
                wheel.discard.push(wheel.wheel[i]);
                wheel.wheel[i] = new Empty();
                bonus++;
            }
        }
        mods["power"] += bonus;
        return mods;
    },
    JOLTZAZON: function(mods){
        let targets = mods["targets"];
        for (let o of targets){
            let nei = o.getAdjacentNeighbors();
            for (let f of nei){
                if (f.monster && !targets.includes(f) && !sameTile(f,mods["caster"].tile)){
                    tiles[f.x][f.y].setEffect(32,45);
                    targets.push(f);
                }
            }
        }
        return mods;
    },
    BUFF: function(mods){
        mods["power"] += 1;
        return mods;
    },
    NEUTER: function(mods){
        mods["power"] -= 1;
        return mods;
    },
    CRIPPLE: function(mods){
        mods["power"] -= 3;
        return mods;
    },
    WEAKEN: function(mods){
        mods["power"] -= 4;
        return mods;
    },
    DEVOUR: function(mods){
        let targets = mods["targets"];
        for (let target of targets){
            if (!target.passable && inBounds(target.x,target.y) && target.eat){
                target.replace(Floor);
                mods["power"] += 1;
            }
        }
        return mods;
    },
}

// SENET - LASHOL (status) - KILAMI (status) - GYVJI - DASH - RASEL (status) - ASPHA (tp and hit) - SUGCHA (lifesteal)
// ROSE (status) - JOLTZAZON (targets spread to adj) - HARBINGER (summon that will endlessly copy the first spell it is hit by)
// ABAZON (only wall targets affected)

effects = {
    ZENORIUM: function(target,power,mods){
        if (mods && target.monster && target.monster.statuseff["Transformed"] == 0){
            let sample = mods["targets"].slice();
            let poly = shuffle(sample).filter(t => t.monster && t.monster.name != target.monster.name)[0];
            if (!poly) return;
            let polykeys = Object.keys(poly.monster);
            let tarkeys = Object.keys(target.monster);
            let polydata = {};
            let tardata = {};
            let protection = ["spritesave","datasave", "isPlayer"];
            for (let i of polykeys)polydata[i] = poly.monster[i];
            poly.monster.datasave = polydata;
            for (let i of tarkeys) tardata[i] = target.monster[i];
            target.monster.datasave = tardata;
            for (let i of Object.keys(polydata)) if (!protection.includes(i)) target.monster[i] = polydata[i];
            for (let i of Object.keys(tardata)) if (!protection.includes(i)) poly.monster[i] = tardata[i];
            target.monster.soullink = poly.monster;
            poly.monster.soullink = target.monster;
            target.monster.giveEffect("Transformed",power*3);
            poly.monster.giveEffect("Transformed",power*3);
        }
    },
    SENET: function(target,power,mods){ //if power > X, give frenzy, haste?
        if (target.monster){
            target.monster.giveEffect("Persuasive",power*3);
        }
    },
    DEBUG: function(target,power,mods){ //if power > X, give frenzy, haste?
        if (target.monster){
            console.log("hai");
        }
    },
    KASHIA: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Dissociated",power*2);
        }
    },
    PARACEON: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Invincible",power);
        }
    },
    STOP: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Paralyzed",power);
        }
    },
    RASEL: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Puppeteered",power*2);
        }
    },
    APIS: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Constricted",power);
        }
    },
    HASTE: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Hasted",power*2);
        }
    },
    HEAL: function(target,power,mods){
        if (target.monster){
            target.monster.heal(power);
        }
    },
    THRASH: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Thrashing",power*2);
        }
    },
    GYVJI: function(targeti,power,mods){
        let newTile = targeti;
        //newTile.setEffect(14,30);
        let testTile = newTile;
        let target = testTile.monster;
        while(target){
            testTile = newTile.getNeighbor(player.lastMove[0],player.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                newTile.setEffect(target.sprite,30);
                newTile = testTile;
            }else{
                break;
            }
        }
        if(target && target.tile != newTile){
            target.move(newTile);
            playSound("explosion");
            target.tile.setEffect(14,30);
            target.hit(power);
            if (power >= 4){
                newTile.getAllNeighbors().forEach(t => {
                    t.setEffect(14,30);
                    if(t.monster){
                        t.monster.stunned = true;
                        if (!t.monster.isPlayer) t.monster.hit(power);
                    }
                    else if(t.eat && !t.passable && inBounds(t.x, t.y)){
                        t.replace(Floor);
                    }
                });
            }
            shakeAmount = 20 + power*5;
        }
    },
    ASPHA: function(target,power,mods){
        let tper;
        if (target.monster && !target.monster.isPlayer) tper = monsters[monsters.indexOf(target.monster)];
        else if (target.monster && target.monster.isPlayer) tper = player;
        else return;
        for (let i = 0; i<power; i++){
            tper.move(randomPassableTile());
            tper.tile.getAllNeighbors().forEach(function(t){
                t.setEffect(14, 30);
                if(t.monster){
                    t.monster.hit(1);
                }
            });
        }
    },
    ABAZON : function(target,power,mods){
        let t = target;
        let test = !t.passable && t.sprite != 17;
        if (test){
            let save = tiles[t.x][t.y];
            tiles[t.x][t.y] = new AbazonWall(t.x,t.y)
            let monster = new AbazonSummon(t,save,power*2);
            monsters.push(monster);
        }
    }
}

spells = {
    WOOP: function(caster){
        caster.move(randomPassableTile());
    },
    ANNIHILATE: function(caster){
        for (i of monsters){
            if (!(i instanceof Ragemaw)) i.hit(99);
        }
        for (i of monsters){
            if (i instanceof Ragemaw) i.hit(99);
        }
    },
    QUAKE: function(){                  
        for(let i=0; i<numTiles; i++){
            for(let j=0; j<numTiles; j++){
                let tile = getTile(i,j);
                if(tile.monster){
                    let numWalls = 4 - tile.getAdjacentPassableNeighbors().length;
                    tile.monster.hit(numWalls*2);
                }
            }
        }
        shakeAmount = 20;
    },
    MAELSTROM: function(){
        for(let i=0;i<monsters.length;i++){
            monsters[i].move(randomPassableTile());
            monsters[i].teleportCounter = 2;
        }
    },
    SAINTLY: function(caster){
        caster.tile.getAdjacentNeighbors().forEach(function(t){
            t.setEffect(13, 30);
            if(t.monster){
                t.monster.heal(2);
            }
        });
        caster.tile.setEffect(13,30);
        caster.heal(2);
    },
    SAINTLYS: function(caster){
        caster.tile.getAllNeighbors().forEach(function(t){
            t.setEffect(13, 30);
            if(t.monster){
                t.monster.fp = Math.max(0,t.monster.fp-2);
                t.monster.stunned = true;
                t.monster.knockback(1, [t.x-caster.tile.x,t.y-caster.tile.y]);
            }
        });
        caster.tile.setEffect(13,30);
        caster.fp = Math.max(0,caster.fp-2);
    },
    ORDEREDS: function(caster){
        spells["FUFFYSTOMP"](caster);
    },
    UNHINGEDS: function(caster){
        let newTile = caster.tile;
        newTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        newTile.setEffect(14,30);
        if (newTile.passable){
            let orb = new Exploder(newTile);
            orb.direction = [caster.lastMove[0],caster.lastMove[1]];
            monsters.push(orb);
        }
    },
    FERALS: function(caster){
        for(let i=0;i<monsters.length;i++){
            monsters[i].stunned = true;
        }
        caster.entranced = true;
    },
    FERALNODMGS: function(caster, x, y){
        let newTile = caster.tile;
        let target;
        let punch = false; //maybe enable this if players gets fluffified
        while(true){
            let testTile = newTile.getNeighbor(x,y);
            if(testTile.passable && !testTile.monster && inBounds(testTile.x,testTile.y)) newTile = testTile;
            else{
                if (testTile.monster){
                    punch = true;
                    testTile.monster.stunned = true;
                    target = testTile.monster;
                } 
                break;
            }
        }
        if(true){
            caster.move(newTile);
            shakeAmount = 30;
            if (punch){
                target.fp++;
                target.knockback(target.fp+1,[x,y]);
                playSound("explosion");
                return true;
            } 
            else {
                playSound("off");
                return false;
            }
        }
    },
    VILES: function(caster){
        let targetlist = [];
        caster.tile.getAllNeighbors().forEach(function(t){
            t.setEffect(75, 30);
            if (t.monster) targetlist.push(t.monster);
        });
        let target = targetlist[randomRange(0,targetlist.length-1)];
        let dir = [target.tile.x-caster.tile.x,target.tile.y-caster.tile.y];
        target.fp++;
        let pow = target.fp;
        target.knockback(pow,dir);
        dir = [-dir[0],-dir[1]];
        caster.knockback(caster.fp+1,dir,true);
    },
    ARTISTICS: function(caster){
        caster.tile.recallpoint = true;
    },
        
    FERAL: function(caster){
        caster.statuseff["Invincible"] += 1;
        let friendly = (caster.isPlayer || caster.statuseff["Charmed"] > 0);
        let newTile = caster.tile;
        while(true){
            let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                newTile = testTile;
                newTile.getAdjacentNeighbors().forEach(t => {
                    if(t.monster && friendly && !t.monster.isPlayer && !t.monster.statuseff["Charmed"] > 0){
                        t.setEffect(14,30);
                        t.monster.stunned = true;
                        t.monster.hit(1);
                        if (t.monster instanceof Blehh){
                            player.move(getTile(4,6));
                            world.getRoom().stage = 7;
                            world.getRoom().progressTutorial(7);
                            return;
                        }
                    }
                    else if (t.monster && !friendly && (t.monster.isPlayer || t.monster.statuseff["Charmed"] > 0)){
                        t.setEffect(14,30);
                        t.monster.stunned = true;
                        t.monster.hit(1);
                    }
                });
            }else{
                break;
            }
        }
        if(caster.tile != newTile){
            caster.move(newTile);
            if (world.getRoom().stage == 7) caster.move (getTile(4,6));
            newTile.getAdjacentNeighbors().forEach(t => {
                if(t.monster && friendly && !t.monster.isPlayer && !t.monster.statuseff["Charmed"] > 0){
                    t.setEffect(14,30);
                    t.monster.stunned = true;
                    t.monster.hit(1);
                    if (t.monster instanceof Blehh){
                        player.move(getTile(4,6));
                        world.getRoom().stage = 7;
                        world.getRoom().progressTutorial(7);
                        return;
                    }
                }
                else if (t.monster && !friendly && (t.monster.isPlayer || t.monster.statuseff["Charmed"] > 0)){
                    t.setEffect(14,30);
                    t.monster.stunned = true;
                    t.monster.hit(1);
                }
            });
        }
    },
    FERALNODMG: function(caster, x, y){
        let newTile = caster.tile;
        let shaker = false;
        let punch = false; //maybe enable this if players gets fluffified
        while(true){
            let testTile = newTile.getNeighbor(x,y);
            if(testTile.passable && !testTile.monster){
                newTile = testTile;
            }else{
                if (!testTile.passable) shaker = true;
                //if (testTile.monster) punch = true;
                break;
            }
        }
        if(caster.tile != newTile){
            caster.move(newTile);
            if (shaker){
                shakeAmount = 30;
                playSound("explosion");
            }
            if (punch) spells["GYVJI"](caster);
        }
    },
    DIG: function(){
        for(let i=1;i<numTiles-1;i++){
            for(let j=1;j<numTiles-1;j++){
                let tile = getTile(i,j);
                if(!tile.passable){
                    tile.replace(Floor);
                }
            }
        }
        player.tile.setEffect(13,30);
        player.heal(2);
    },
    DIEU: function(){
        for(let i=0;i<monsters.length;i++){
            monsters[i].heal(1);
            monsters[i].tile.treasure = true;
        }
    },
    ALCHIMIE: function(){
        player.tile.getAdjacentNeighbors().forEach(function(t){
            if(!t.passable && inBounds(t.x, t.y)){
                t.replace(Floor).treasure = true;
            }
        });
    },
    VILE: function(caster){
        caster.bonusAttack=4;
    },
    BULLE: function(){
        for(let i=player.spells.length-1;i>0;i--){
            if(!player.spells[i]){
                player.spells[i] = player.spells[i-1];
            }
        }
    },
    ORDERED: function(caster){
        if (caster.isPlayer){
            caster.statuseff["Invincible"] += 3;
            for(let i=0;i<monsters.length;i++){
                monsters[i].stunned = true;
            }
        }
        else{
            caster.statuseff["Invincible"] += 2;
        }
    },
    STRAIGHTLASER: function(caster){
        boltTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), 4, caster.tile);
    },
    SNAILLASER: function(caster){
        if(caster.statuseff["Charmed"] > 0) csnailTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), 1, caster.tile);
        else snailTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), 1, caster.tile);
        let newTile = caster.tile;
        while(true){
            let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                newTile = testTile;
            }else{
                break;
            }
        }
        if(caster.tile != newTile){
            caster.move(newTile);
        }
    },
    ARTTRIGGER: function(caster){
        let directions = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0]
        ];
        let friendly = true;
        if (caster.eviltrap) friendly = false;
        caster.trap = false;
        caster.eviltrap = false;
        
        for(let k=0;k<directions.length;k++){
            boltTravel(directions[k], 15 + Math.abs(directions[k][1]), 2, caster, friendly);
        }
        if (caster.monster) caster.monster.hit(3);
    },
    QUADBOLT: function(caster){
        let directions = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0]
        ];
        let friendly = false;
        caster.trap = false;
        caster.eviltrap = false;
        
        for(let k=0;k<directions.length;k++){
            boltTravel(directions[k], 15 + Math.abs(directions[k][1]), 2, caster, friendly);
        }
    },
    ARTTRIGGERS: function(caster){
        let directions = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0]
        ];
        for(let k=0;k<directions.length;k++){
            knockbackBoltTravel(directions[k], 15 + Math.abs(directions[k][1]), caster);
        }
    },
    UNHINGED: function(caster){
        let directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];
        for(let k=0;k<directions.length;k++){
            boltTravel(directions[k], 14, 3, caster.tile, (caster.isPlayer||caster.statuseff["Charmed"] > 0));
        }
    },
    UNHINGEDSTRIGGER: function(caster){
        let directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];
        for(let k=0;k<directions.length;k++){
            knockbackBoltTravel(directions[k], 14, caster);
        }
    },
    TAINTED: function(){
        shakeAmount = 20;
    },
    ARTISTIC: function(caster){
        if (caster.isPlayer || caster.statuseff["Charmed"] > 0) caster.tile.trap = true;
        else caster.tile.eviltrap = true;
    },

    SERENE: function(){
        player.specialAttack = "Harmony";
        fail = false;
    },

    SERENEFU: function(){
        if (wheel.pile.length == 0){
            shuffle(wheel.discard)
            for(let i=0;i<wheel.discard.length;i++){
                wheel.pile.push(wheel.discard[i]);
            }
            wheel.discard = [];
        }
        for (let x of wheel.wheel){
            if (!(x instanceof Empty)){
                wheel.wheel[indexOf(x)] = new Empty();
                player.specialAttack = "Harmony";
                fail = false;
                return;
            }
            log.addLog("FluffyNoConvertTaunt");
        }
    },

    JOLTZAZON: function(){
        monsters.forEach(function(entity){
            if (!entity.isPlayer){
                let tile = [];
                entity.tile.getAdjacentNeighbors().forEach(t => {
                    if(t.monster && !t.monster.isPlayer){
                        tile.push(t);
                    }
                });
                if (tile.length == 1){
                    entity.stunned = true;
                    entity.tile.setEffect(32,45);
                    entity.targeted = true;
                }
            }
        });
        monsters.forEach(function(entity){
            if (entity.targeted) {
                entity.targeted = false;
                entity.hit(2);
            }
        });
    },
    PURPIZUG: function(){
        let draw = 0;
        wheel.wheel.forEach(t => {
            if (!(t instanceof Empty)){
                wheel.discard.push(t);
                draw++;
            }
        });
        wheel.wheel = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        for(var i = 0; i < draw; i++){
            wheel.drawSoulFree();
        }
    },
    ROSE: function(){
        ribbonTravel(player.lastMove, 33 + Math.abs(player.lastMove[1]), player.tile);
    },
    SENET: function(){
        player.specialAttack = "Charm";
    },
    KILAMI: function(){
       // doublecounter = 2;
    },
    AUBE: function(){
        monsters.forEach(function(entity){
            entity.heal(2);
            entity.tile.setEffect(13,30);
        });
        aubecounter++
        if (aubecounter == 3){
            removeItemOnce(player.saved, "AUBE");
            player.saved.push("ZENITH");
        }
    },
    ZENITH: function(){
        scytheTravel([0,1], 14, 4, player.tile, 3);
        scytheTravel([0,-1], 14, 4, player.tile, 3);
        aubecounter++
        if (aubecounter == 6){
            removeItemOnce(player.saved, "ZENITH");
            player.saved.push("CREPUSCULUM");
        }
    },
    CREPUSCULUM: function(){
        gameState = "contemplation";
        falseagony = true;
        agony = 1;
        aubecounter++
        if (aubecounter == 9){
            removeItemOnce(player.saved, "CREPUSCULUM");
            truehp += 3;
        }
    },
    SUGCHA: function(caster, soul){
        let adj = caster.tile.getAllNeighbors();
        adj = shuffle(adj);
        let cap = 8-soul.uses;
        for (let x of adj){
            if (cap == 0) break;
            else if (x.monster){
                x.monster.hit(1);
                x.setEffect(14, 30);
                caster.heal(1);
                cap--;
            }
        }
        player.axioms.active[player.axioms.active.indexOf(soul)].uses++;
    },
    SHIZAPIS: function(caster){
        if (caster.inventory.length > 2){
            player.discarded = 1;
            stack = 0;
            gameState = "vision";
            player.viewSpell();
        }
        else{
            playSound("fail");
            fail = true;
        }
    },
    ABAZON: function(){
        let neighbors = player.tile.getAdjacentNeighbors().filter(t => !t.passable && t.eat && inBounds(t.x,t.y) && t.sprite != 17);
        if(neighbors.length){
            let tile = neighbors.pop();
            tiles[tile.x][tile.y] = new AbazonWall(tile.x,tile.y)
            let monster = new AbazonSummon(tile);
            monsters.push(monster);
            fail = false;
        }
        else{
            shakeAmount = 20;
            playSound("fail");
            fail = true;
        }
    },
    ZAINT: function(caster){
        monsters.forEach(function(entity){
            if (entity.name != caster.name && !(entity instanceof Box) && entity.order < 0){
                entity.paralyzed = true;
            }
        });
        player.axioms.active.forEach(function(soul){
            if (soul instanceof Zaint){
                player.axioms.active[5] = new Saintly(); // if there ever is a soul that lets you place things anywhere it will mess this up
            }
        });
    },
    RASEL: function(){
        player.reaping = true;
    },
    BORERORA: function(caster){
        monsters.forEach(function(entity){
            if (!entity.isPlayer){
                entity.stunned = true;
            }
        });
        let bouncecount = 0;
        for (let x of wheel.wheel){
            if (!(x instanceof Empty)) bouncecount++;
        }
        let key;
        if (caster.lastMove[0] == -1) key = "left";
        else if (caster.lastMove[1] == 1) key = "down";
        else if (caster.lastMove[0] == 1) key = "right";
        else key = "up";
        let equi = {
            "left" : [-1,-1],
            "down" : [-1,1],
            "right" : [1,1],
            "up" : [1,-1]
        }
        if (bouncecount > 0) bounceboltTravel(equi[key], 14, 2, caster.tile, bouncecount*2);
    },
    ASPHA: function(){
        gameState = "discard";
        player.discarded = 0;
        log.addLog("Discard");
    },
    ASPHAF: function(power){
        for (let i = 0; i<power; i++){
            player.move(randomPassableTile());
            player.tile.getAllNeighbors().forEach(function(t){
                t.setEffect(14, 30);
                if(t.monster){
                    t.monster.hit(2);
                }
            });
        }
        log.addLog("ASPHA");
    },
    NAIA: function(caster){
        if (naiamode){
            log.addLog("NaiaProtect");
            spells["ORDERED"](caster)
            return;
        }
        gameState = "discard";
        player.discarded = 0;
        log.addLog("NaiaTime");
        naiamode = true;
    },
    LASHOL: function(){
        //cannot be evoked
        log.addLog("Bug");
    },
    EZEZZA: function(){
        //cannot be evoked
        log.addLog("Bug");
    },
    ASTER: function(){
        let ragemawcount = 0;
        for (let mon of monsters){
            if (!mon.name.includes("Ragemaw")){
                let name = mon.name;
                let damage = -1;
                for (let chec of monsters){
                    if (chec.name == name) damage++;
                }
                mon.hit(damage);
                if (damage > 0) mon.tile.setEffect(14, 30);
            }
            else{
                ragemawcount++;
            }
        }
        for (let mon of monsters){
            if (mon.name.includes("Ragemaw") && ragemawcount > 0){
                let name = mon.name;
                let damage = -1;
                for (let chec of monsters){
                    if (chec.name == name) damage++;
                }
                mon.hit(damage);
                if (damage > 0) mon.tile.setEffect(14, 30);
                ragemawcount--;
            }
        }

    },
    GYVJI: function(caster){
        let friendly = (caster.isPlayer || caster.statuseff["Charmed"] > 0);
        let newTile = caster.tile;
        newTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        newTile.setEffect(14,30);
        let testTile = newTile;
        let target = testTile.monster;
        while(target != null){
            testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                newTile.setEffect(target.sprite,30);
                newTile = testTile;
            }else{
                break;
            }
        }
        if(target != null && target.tile != newTile){
            target.move(newTile);
            playSound("explosion");
            newTile.getAllNeighbors().forEach(t => {
                t.setEffect(14,30);
                if(t.monster){
                    t.monster.stunned = true;
                    if (!t.monster.isPlayer) t.monster.hit(3);
                }
                else if(t.eat && !t.passable && inBounds(t.x, t.y)){
                    t.replace(Floor);
                }
                target.tile.setEffect(14,30);
                if (friendly) target.hit(3);
                else target.hit(1);
            });
            shakeAmount = 35;
        }
    },
    GYVJINODMG: function(caster){
        let newTile = caster.tile;
        newTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        let testTile = newTile;
        let target = testTile.monster;
        while(target != null){
            testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                if (target.isPlayer) newTile.setEffect(target.sprite,30);
                newTile = testTile;
            }else{
                break;
            }
        }
        if(target != null && target.tile != newTile && target.isPlayer){
            target.move(newTile);
            playSound("explosion");
            shakeAmount = 35;
        }
    },
    FLUFFPUNCH: function(target, direction){
        let newTile = target.tile;
        let testTile = newTile;
        while(target != null){
            testTile = newTile.getNeighbor(direction[0],direction[1]);
            if(testTile.passable && !testTile.monster){
                newTile.setEffect(target.sprite,30);
                newTile = testTile;
            }else{
                break;
            }
        }
        if(target != null && target.tile != newTile){
            target.move(newTile);
            playSound("explosion");
            target.hit(1);
            target.fuffified = 10;
            target.sprite = 26;
            shakeAmount = 35;
        }
    },
    KASHIA: function(caster){
        log.addLog("Bug");
    },
    Pink: function(caster){
        for (let x of monsters){
            if (x instanceof Tail){
                let tiles = x.tile.getAdjacentNeighbors();
                for (let y of tiles){
                    if (!y.monster && y.passable){
                        if (!(y instanceof Mobilizer)) y.replace(Goop);
                    }
                }
            }
        }
    },
    Red: function(caster){
        caster.turbo = true;
        let shaker = false;
        for (let i of monsters){
            if (i instanceof Tail){
                i.turbo = true;
            }
        }
        let newTile = caster.tile;
        while(true){
            let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                newTile = testTile;
                //newTile.eviltrap = true;
                //caster.tryMove(caster.lastMove[0],caster.lastMove[1]);
            }else{
                if (!testTile.passable) shaker = true;
                if (testTile.monster) testTile.monster.hit(2);
                break;
            }
        }
        let allok = true;
        for (let i of monsters){
            if (i.order > 0){
                let dashtest = [];
                if (i.order > 0 && caster.lastMove[0] == 0 && caster.lastMove[1] < 0) dashtest = getTile(newTile.x, newTile.y+i.order);
                else if (i.order > 0 && caster.lastMove[0] == 0  && caster.lastMove[1] > 0) dashtest = getTile(newTile.x, newTile.y-i.order);
                else if (i.order > 0 && caster.lastMove[0] > 0  && caster.lastMove[1] == 0) dashtest = getTile(newTile.x-i.order, newTile.y);
                else if (i.order > 0 && caster.lastMove[0] < 0  && caster.lastMove[1] == 0) dashtest = getTile(newTile.x+i.order, newTile.y);
                if (!dashtest.passable || dashtest.monster) allok = false;
            }
        }
        if (allok){
            caster.move(newTile);
            if (shaker){
                shakeAmount = 30;
                playSound("explosion");
            }
            for (let i of monsters){
                if (i.order > 0 && caster.lastMove[0] == 0 && caster.lastMove[1] < 0) i.move(getTile(caster.tile.x, caster.tile.y+i.order));
                else if (i.order > 0 && caster.lastMove[0] == 0  && caster.lastMove[1] > 0) i.move(getTile(caster.tile.x, caster.tile.y-i.order));
                else if (i.order > 0 && caster.lastMove[0] > 0  && caster.lastMove[1] == 0) i.move(getTile(caster.tile.x-i.order, caster.tile.y));
                else if (i.order > 0 && caster.lastMove[0] < 0  && caster.lastMove[1] == 0) i.move(getTile(caster.tile.x+i.order, caster.tile.y));
            }
        }
        else{
            removeItemOnce(caster.corelist,"Red");
            if (caster.corelist.length > 0) spells[caster.corelist[randomRange(0,caster.corelist.length-1)]](caster);
            caster.corelist.push("Red");
        }
    },
    Cyan: function(caster){
        for (let x of monsters){
            if (x instanceof Tail){
                let tiles = x.tile.getAdjacentNeighbors();
                for (let y of tiles){
                    if (!y.monster){
                        let shoot = [y.x-x.tile.x,y.y-x.tile.y];
                        fluffBoltTravel(shoot, 15 + Math.abs(shoot[1]), 0, x.tile, false);
                    }
                }
            }
        }
    },
    White: function(caster){
        let spawners = [];
        for (let x of tiles){
            for (let y of x){
                if (y instanceof Mobilizer) spawners.push(y);
            }
        }
        let type = shuffle([Psydrone,Titanic,Paradox,Binary])[0];
        for (let u of spawners){
            if (!u.monster){
                monsters.push(new type(u));
            }
            else playSound("fail");
        }
    },
    BINARY: function(caster){
        let directions = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0]
        ];
        let friendly = false;
        if (caster.statuseff["Charmed"] > 0) friendly = true;
        for(let k=0;k<directions.length;k++){
            invisBoltTravel(directions[k], 15 + Math.abs(directions[k][1]), 2, caster.tile, friendly);
        }
    },

    PSYDRONE: function(caster){
        caster.tile.getAllNeighbors().forEach(function(t){
            t.setEffect(75, 30);
            if(t.monster && caster.statuseff["Charmed"] > 0 && !t.monster.loveless && !t.monster.isPlayer){
                t.monster.statuseff["Charmed"] = 999;
            }
            else if (t.monster && !caster.statuseff["Charmed"] > 0 && t.monster.isPlayer){
                let fullempty = true;
                for (let i of wheel.wheel){
                    if (!(i instanceof Empty)) fullempty = false;
                }
                if (fullempty) return;
                else{
                    while (true){
                        let id = randomRange(0,wheel.wheel.length);
                        if (!(wheel.wheel[id] instanceof Empty)){
                            wheel.wheel[id] = new Ordered();
                            break;
                        }
                    }
                }
            }
        });
    },

    FUFFYORI: function(caster){
        caster.tile.getAllNeighbors().forEach(function(t){
            t.setEffect(75, 30);
            if(t.monster && caster.statuseff["Charmed"] > 0 && !t.monster.loveless && !t.monster.isPlayer){
                let dir = [randomRange(-1,1),randomRange(-1,1)];
                t.monster.fp++;
                let pow = t.monster.fp;
                t.monster.knockback(pow,dir);
                dir = [-dir[0],-dir[1]];
                caster.knockback(caster.fp+1,dir);
            }
            else if (t.monster && !caster.statuseff["Charmed"] > 0 && t.monster.isPlayer){
                let dir = [randomRange(-1,1),randomRange(-1,1)];
                t.monster.fp++;
                let pow = t.monster.fp;
                t.monster.knockback(pow,dir);
                dir = [-dir[0],-dir[1]];
                caster.knockback(caster.fp+1,dir);
            }
        });
    },

    FUFFYSTOMP: function(caster){
        let newTile = caster.tile;
        let doit = false;
        while(true){
            let testTile = newTile.getNeighbor(0,1);
            if(!(testTile instanceof Platform) && !(testTile instanceof Ladder) && !testTile.monster && testTile.y < 9){
                newTile = testTile;
            }else if (testTile instanceof Platform){
                doit = true;
                break;
            }
            else if(testTile.monster){
                if ((caster.statuseff["Charmed"] > 0 || caster.isPlayer) && !testTile.monster.isPlayer){
                    testTile.monster.fp++;
                    testTile.monster.knockback(testTile.monster.fp,[0,-1])
                    break;
                }
                else if (!caster.statuseff["Charmed"] > 0 && testTile.monster.isPlayer){
                    testTile.monster.fp++;
                    testTile.monster.knockback(testTile.monster.fp,[0,-1])
                    break;
                }
                else break;
            }
            else if (testTile.y > 8) break;
            else break;
        }
        if(caster.tile != newTile && doit){
            caster.move(newTile);
            shakeAmount = 30;
            playSound("explosion");
            while(true){
                let testTile = newTile.getNeighbor(1,0);
                let platTile = testTile.getNeighbor(0,1);
                if((platTile instanceof Platform)){
                    testTile.setEffect(75,30);
                    if (testTile.monster && testTile != caster.tile){
                        testTile.monster.fp++;
                        testTile.monster.knockback(testTile.monster.fp,[0,-1]);
                    }
                    newTile = testTile;
                }else{
                    break;
                }
            }
            while(true){
                let testTile = newTile.getNeighbor(-1,0);
                let platTile = testTile.getNeighbor(0,1);
                if((platTile instanceof Platform)){
                    testTile.setEffect(75,30);
                    if (testTile.monster && testTile != caster.tile){
                        testTile.monster.fp++;
                        testTile.monster.knockback(testTile.monster.fp,[0,-1]);
                    }
                    newTile = testTile;
                }else{
                    break;
                }
            }
        }
    },
};

function targetBoltTravel(direction, effect, location){
    let newTile = location;
    let targets = [];
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        targets.push(testTile);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster) break;
            //newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
    return targets;
}

function boltTravel(direction, effect, damage, location, friendly){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster && !newTile.monster.isPlayer&& !newTile.monster.statuseff["Charmed"] > 0 && friendly){
                newTile.monster.hit(damage);
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.statuseff["Charmed"] > 0) && !friendly){
                newTile.monster.hit(damage);
            }
            newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
}

function knockbackBoltTravel(direction, effect, location){
    let newTile = location.tile;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if (newTile.monster){
                newTile.monster.fp++;
                newTile.monster.knockback(newTile.monster.fp,direction);
                break;
            }
            else newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
}

function fluffBoltTravel(direction, effect, damage, location, friendly){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if (newTile.monster){
                if (newTile.monster.isPlayer) {
                    spells["FLUFFPUNCH"](newTile.monster,direction);
                    }
                break;
            }
            newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
}

function invisBoltTravel(direction, effect, damage, location, friendly){
    let newTile = location;
    let target;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster && newTile.monster instanceof Binary && !newTile.monster.statuseff["Charmed"] > 0 && !friendly){
                target = newTile;
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.statuseff["Charmed"] > 0) && friendly){
                target = newTile;
            }
        }else{
            break;
        }
    }
    if (target){
        stopBoltTravel(direction, effect, 2, target, location, friendly);
    }
}

function stopBoltTravel(direction, effect, damage, target, location, friendly){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable && testTile != target){
            newTile = testTile;
            if(newTile.monster && !newTile.monster.isPlayer&& !newTile.monster.statuseff["Charmed"] > 0 && friendly){
                newTile.monster.hit(damage);
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.statuseff["Charmed"] > 0) && !friendly){
                newTile.monster.hit(damage);
            }
            newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
}


function bounceboltTravel(direction, effect, damage, location, times){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        testTile.setEffect(effect,120);
        if(testTile.monster && !testTile.monster.isPlayer){
            testTile.monster.hit(damage);
        }
        if(testTile.x <= numTiles-3 && testTile.y <= numTiles-3 && testTile.x >= 2 && testTile.y >= 2){
            newTile = testTile;
        }else{
            times--;
            let newdir = [];
            if (testTile.y<2 || testTile.y > numTiles-3) newdir = [direction[0],-direction[1]];
            else if (testTile.x<2 || testTile.x > numTiles-3) newdir = [-direction[0],direction[1]];
            if (times > 0){
                bounceboltTravel(newdir, 14, damage, testTile, times);
            }
            break;
        }
    }
}

function snailTravel(direction, effect, damage, location){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster && (newTile.monster.isPlayer || newTile.monster.statuseff["Charmed"] > 0 || newTile.monster.statuseff["Marked"] > 0)){
                newTile.monster.hit(damage);
            }
            else if (newTile.monster && !newTile.monster.isPlayer){
                newTile.monster.heal(damage);
            }
            newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
}

function csnailTravel(direction, effect, damage, location){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster && (newTile.monster.isPlayer || newTile.monster.statuseff["Charmed"] > 0)){
                newTile.monster.heal(damage);
            }
            else if (newTile.monster && !newTile.monster.isPlayer){
                newTile.monster.hit(damage);
            }
            newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
}

function scytheTravel(direction, effect, damage, location, range){
    let newTile = location;
    let travel = 0;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(travel <= range){
            newTile = testTile;
            if(newTile.monster && !newTile.monster.isPlayer){
                newTile.monster.hit(damage);
            }
            newTile.setEffect(effect,30);
            travel++;
            let leftTile = newTile.getNeighbor(direction[1], direction[0]);
            let rightTile = leftTile.getNeighbor(-direction[1], direction[0]);
            for(var i = 1; i < travel; i++){
                if(leftTile.monster && !leftTile.monster.isPlayer){
                    leftTile.monster.hit(damage);
                }
                leftTile.setEffect(effect,30);
                leftTile = leftTile.getNeighbor(direction[1], direction[0]);
            }
            for(var i = 0; i < travel; i++){
                if(rightTile.monster && !rightTile.monster.isPlayer){
                    rightTile.monster.hit(damage);
                }
                rightTile.setEffect(effect,30);
                rightTile = rightTile.getNeighbor(-direction[1], direction[0]);
            }
        }else{
            break;
        }
    }
}

function ribbonTravel(direction, effect, location){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster && !newTile.monster.isPlayer){
                newTile.monster.paralyzed = false;
                newTile.monster.statuseff["Marked"] += 25;
                break;
            }
            newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
}