function boltTravel(direction, effect, damage, location, friendly){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster && !newTile.monster.isPlayer&& !newTile.monster.statusEff["Charmed"] > 0 && friendly){
                newTile.monster.hit(damage);
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.statusEff["Charmed"] > 0) && !friendly){
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
            if(newTile.monster && newTile.monster instanceof Binary && !newTile.monster.statusEff["Charmed"] > 0 && !friendly){
                target = newTile;
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.statusEff["Charmed"] > 0) && friendly){
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
            if(newTile.monster && !newTile.monster.isPlayer&& !newTile.monster.statusEff["Charmed"] > 0 && friendly){
                newTile.monster.hit(damage);
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.statusEff["Charmed"] > 0) && !friendly){
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
            if(newTile.monster && (newTile.monster.isPlayer || newTile.monster.statusEff["Charmed"] > 0 || newTile.monster.statusEff["Marked"] > 0)){
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
            if(newTile.monster && (newTile.monster.isPlayer || newTile.monster.statusEff["Charmed"] > 0)){
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
                newTile.monster.statusEff["Marked"] += 25;
                break;
            }
            newTile.setEffect(effect,30);
        }else{
            break;
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
        caster.statusEff["Invincible"] += 1;
        let friendly = (caster.isPlayer || caster.statusEff["Charmed"] > 0);
        let newTile = caster.tile;
        while(true){
            let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                newTile = testTile;
                newTile.getAdjacentNeighbors().forEach(t => {
                    if(t.monster && friendly && !t.monster.isPlayer && !t.monster.statusEff["Charmed"] > 0){
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
                    else if (t.monster && !friendly && (t.monster.isPlayer || t.monster.statusEff["Charmed"] > 0)){
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
                if(t.monster && friendly && !t.monster.isPlayer && !t.monster.statusEff["Charmed"] > 0){
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
                else if (t.monster && !friendly && (t.monster.isPlayer || t.monster.statusEff["Charmed"] > 0)){
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
            caster.statusEff["Invincible"] += 3;
            for(let i=0;i<monsters.length;i++){
                monsters[i].stunned = true;
            }
        }
        else{
            caster.statusEff["Invincible"] += 2;
        }
    },
    STRAIGHTLASER: function(caster){
        boltTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), 4, caster.tile);
    },
    SNAILLASER: function(caster){
        if(caster.statusEff["Charmed"] > 0) csnailTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), 1, caster.tile);
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
            boltTravel(directions[k], 14, 3, caster.tile, (caster.isPlayer||caster.statusEff["Charmed"] > 0));
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
        if (caster.isPlayer || caster.statusEff["Charmed"] > 0) caster.tile.trap = true;
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
        player.specialAttack = "Charmed";
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
        let friendly = (caster.isPlayer || caster.statusEff["Charmed"] > 0);
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
        if (caster.statusEff["Charmed"] > 0) friendly = true;
        for(let k=0;k<directions.length;k++){
            invisBoltTravel(directions[k], 15 + Math.abs(directions[k][1]), 2, caster.tile, friendly);
        }
    },

    PSYDRONE: function(caster){
        caster.tile.getAllNeighbors().forEach(function(t){
            t.setEffect(75, 30);
            if(t.monster && caster.statusEff["Charmed"] > 0 && !t.monster.loveless && !t.monster.isPlayer){
                t.monster.statusEff["Charmed"] = 999;
            }
            else if (t.monster && !caster.statusEff["Charmed"] > 0 && t.monster.isPlayer){
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
            if(t.monster && caster.statusEff["Charmed"] > 0 && !t.monster.loveless && !t.monster.isPlayer){
                let dir = [randomRange(-1,1),randomRange(-1,1)];
                t.monster.fp++;
                let pow = t.monster.fp;
                t.monster.knockback(pow,dir);
                dir = [-dir[0],-dir[1]];
                caster.knockback(caster.fp+1,dir);
            }
            else if (t.monster && !caster.statusEff["Charmed"] > 0 && t.monster.isPlayer){
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
                if ((caster.statusEff["Charmed"] > 0 || caster.isPlayer) && !testTile.monster.isPlayer){
                    testTile.monster.fp++;
                    testTile.monster.knockback(testTile.monster.fp,[0,-1])
                    break;
                }
                else if (!caster.statusEff["Charmed"] > 0 && testTile.monster.isPlayer){
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


function tryMoveOld(dx, dy){
    let newTile = this.tile.getNeighbor(dx,dy);
    if(newTile.passable){
        this.lastMove = [dx,dy];
        if(!newTile.monster || (newTile.monster && newTile.monster instanceof Harmonizer)){
            let boxpull = false;
            if (this.tile.getNeighbor(-dx,-dy).monster && this.tile.getNeighbor(-dx,-dy).monster.pushable && this.isPlayer) boxpull = this.tile;
            if (this.canmove){
                this.move(newTile);
            }
            if (boxpull) boxpull.getNeighbor(-dx,-dy).monster.move(boxpull);
            if (this instanceof Oracle) this.bonusAttack += (1/3);
        }else{
            let crit;
            research.completeResearch("Intro");
            if(((this.isPlayer != newTile.monster.isPlayer)||newTile.monster.statusEff["Marked"] > 0||(this.statusEff["Charmed"] > 0 && !newTile.monster.isPlayer && !newTile.monster.statusEff["Charmed"] > 0))&&!this.isPassive && !newTile.monster.isGuide &&!newTile.monster.pushable && !(this.statusEff["Charmed"] > 0&&newTile.monster.isPlayer)){
                this.attackedThisTurn = true;
                let bonusAttack = this.bonusAttack;
                this.bonusAttack = 0;
                if (!this.fphit) newTile.monster.hit(this.dmg + Math.floor(bonusAttack),player);
                else newTile.monster.fp+=this.fphit;
                if (newTile.monster){
                    if (newTile.monster.fp > 0) {
                        crit = newTile.monster.knockback(newTile.monster.fp, [dx, dy]);
                        if (world.getRoom() instanceof WorldSeed){
                            player.fp = 0;
                            player.hit(1);
                        }
                    }
                }
                if (newTile.monster){
                    if (this.storedAttack) {
                        this.storedAttack.trigger(this);
                        this.storedAttack = false;
                        this.statusEff["Infused"] = 0;
                    }
                }
                if ((this.statusEff["Persuasive"] > 0) && newTile.monster){
                    newTile.monster.statusEff["Charmed"] += 25;
                    this.statusEff["Persuasive"] = lose(this.statusEff["Persuasive"],5);
                }
                if (this.specialAttack == "Harmony" && newTile.monster &&!newTile.monster.isPlayer&&!newTile.monster.loveless){
                    removeItemOnce(monsters, newTile.monster);
                    let fluffy = new BattleFluffy(newTile);
                    monsters.push(fluffy);
                    this.specialAttack = "";
                }
                else if (this.specialAttack == "Harmony" && newTile.monster && newTile.monster.isPlayer){ //fluffification 
                    let fluffy = new BattleFluffy(newTile);
                    player = fluffy;
                    this.specialAttack = "";
                }
                if (this.specialAttack == "DDelay" && newTile.monster){
                    if (newTile.monster.statusEff["Dissociated"] == 0) newTile.monster.falsehp = newTile.monster.hp;
                    newTile.monster.statusEff["Dissociated"] = 2;
                    
                }
                if (this.specialAttack == "Constrict" && newTile.monster && newTile.monster.isPlayer){
                    if (!newTile.monster.constrict) log.addLog("Constricted");
                    newTile.monster.constrict =true;
                }
                if (this.specialAttack == "Tox" && newTile.monster && newTile.monster.isPlayer){
                    newTile.monster.rosetox++;
                    newTile.monster.toxified = true;
                }
                if (this.specialAttack == "Warp" && newTile.monster){
                    spells["WOOP"](this);
                    let around = this.tile.getAdjacentPassableNeighbors();
                    let empty = around.filter(t => !t.monster);
                    if (empty.length > 0) newTile.monster.move(empty[0]);
                }
                if (this.specialAttack == "Trample" && newTile.monster){
                    let lm = this.lastMove;
                    let pushTile = getTile(newTile.x+lm[0],newTile.y+lm[1]);
                    if (inBounds(pushTile.x,pushTile.y) && pushTile.passable){
                        if (pushTile.monster){
                            pushTile.monster.move(getTile(pushTile.x+lm[0],pushTile.y+lm[1]));
                        }
                        newTile.monster.move(pushTile);
                        this.move(newTile);
                    }
                }
                //this.bonusAttack = 0; //if (this.isPlayer) this.bonusAttack = 99; //godmode

                shakeAmount = 5;
                if (crit) shakeAmount = 15;
                if (this.animating && this === player){
                    tickProjectors();
                    this.animating = false;
                    tilesDisplay.projectorDisplay.x = -448;
                    tilesDisplay.projectorDisplay.y = -448;
                    tilesDisplay.creatureDisplay.x = -448;
                    tilesDisplay.creatureDisplay.y = -448;
                }
                this.offsetX = -(newTile.x - this.tile.x)/2;    
                this.offsetY = -(newTile.y - this.tile.y)/2;  
                this.originalOffsetX = this.offsetX;
                this.originalOffsetY = this.offsetY; 
            }
            else if(this.isPlayer && newTile.monster.isGuide && newTile.monster.dialoguecount < newTile.monster.diamax){
                log.addLog(newTile.monster.dialogue[newTile.monster.dialoguecount]);
                newTile.monster.dialoguecount++;
            }else if (this.isPlayer && newTile.monster.isGuide && newTile.monster.dialoguecount == newTile.monster.diamax){
                log.addLog(newTile.monster.dialogue[newTile.monster.dialoguecount]);//message = newTile.monster.dialogue[dialoguecount];
                newTile.monster.dialoguecount = newTile.monster.diareset;
            }else if (newTile.monster.pushable){ //this should integrate more cleanly with step code
                let lm = this.lastMove;
                let coredevour = false;
                let abandon = false;
                let pushTile = getTile(newTile.x+lm[0],newTile.y+lm[1]);
                if (inBounds(pushTile.x,pushTile.y) && pushTile.passable){
                    if (pushTile.monster){
                        if (pushTile.monster instanceof Epsilon){
                            pushTile.monster.cores++;
                            for (let x of monsters){
                                if (x.order == pushTile.monster.cores){
                                    //NYOM!
                                    x.sprite = newTile.monster.sprite;
                                    x.name = newTile.monster.name;
                                    x.ability = newTile.monster.ability;
                                    x.lore = newTile.monster.lore;
                                    x.spritesave = newTile.monster.spritesave;
                                    x.installed = true;
                                    pushTile.monster.corelist.push(newTile.monster.type);
                                }
                            }
                            let corecount = 0;
                            for (let x of monsters){
                                if (x instanceof Tail && ((x.sprite == 21) || (x.sprite == 20) || (x.sprite == 19) || (x.sprite == 73) || (x.sprite == 22))) corecount++;
                            }
                            if (corecount == 4){
                                pushTile.monster.hastalavista = true;
                                log.addLog("EpsilonAllForOne");
                                for (let z of monsters){
                                    if (z.order > 0) z.triggered = true;
                                }
                                pushTile.monster.vulnerability = 99999;
                            }
                            coredevour = true;
                            newTile.monster.hit(99);
                            removeItemOnce(monsters, newTile.monster);
                        }
                        else if (!(pushTile.monster instanceof Box)){
                            abandon = true;
                            let neighbors = this.tile.getAdjacentPassableEmptyNeighbors();
                            if(neighbors.length && !this.isPlayer){
                                this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
                            }
                            else return false;
                        }
                        else return false; //sigh, you used to be able to push multiple objects. idk what happened
                        //else if (pushTile.monster instanceof Tail) return false;
                        //else pushTile.monster.tryMove(getTile(lm[0],lm[1]);
                    }
                    if (!coredevour && !abandon) newTile.monster.move(pushTile);
                    if (!abandon) this.move(newTile);
                }
                else{
                    let neighbors = this.tile.getAdjacentPassableEmptyNeighbors();
                    if(neighbors.length && !this.isPlayer){
                        this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
                    }
                    else return false;
                }
            }
            else{
                let neighbors = this.tile.getAdjacentPassableEmptyNeighbors();
                if(neighbors.length && !this.isPlayer){
                    this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
                }
                else return false;
            }
            return false;
        }
        return true;
    }
    else if (newTile instanceof Airlock){
        newTile.open();
        return false;
    }
}

axiomEffects = {

    MOVE: function(data){
        if (data["targets"].length == 0){
            data["break"] = true;
            return data;
        }
        let targets = data["targets"].slice(0);
        targets.sort((a,b) => a.dist(data["caster"].tile) - b.dist(data["caster"].tile));
        let chosen = targets[0];
        let currentTile = data["caster"].tile;
        if (chosen === currentTile){
            data["break"] = true;
            return data;
        }
        if (Math.abs(chosen.x-currentTile.x) <= 1 && Math.abs(chosen.y-currentTile.y) <= 1 && Math.abs(chosen.x-currentTile.x) + Math.abs(chosen.y-currentTile.y) != 2){
            if (!data["caster"].tryMove(chosen.x-currentTile.x,chosen.y-currentTile.y)){
                data["break"] = true;
            }
            return data;
        }
        let path = astair(currentTile,chosen);
        if(path.length == 0){
            path = line(currentTile,chosen);
            path.shift();
        }
        let dir = [path[0].x-data["caster"].tile.x,path[0].y-data["caster"].tile.y];
        if (!data["caster"].tryMove(dir[0],dir[1])) data["break"] = true;
        return data;
    },

    ///////////////
    //
    //   FORMS
    //
    ///////////////

    EGO: function(data){
        //data["caster"].tile.spellDirection = data["caster"].lastMove;
        data["targets"].push(data["caster"].tile);
        return data;
    },
    SMOOCH : function(data){
        let caster = data["caster"];
        let newTile = caster.tile;
        newTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        newTile.spellDirection = caster.lastMove;
        data["targets"].add(newTile);
        return data;
    },
    PLUS : function (data){
        let caster = data["caster"];
        let newTile = caster.tile;
        const directions = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ];
        for (let i of directions){
            let tarTile = newTile.getNeighbor(i[0],i[1]);
            //tarTile.spellDirection = i;
            data["targets"].push(tarTile);
            tarTile.setEffect(14);
        }
        return data;
    },
    BEAM : function(data){
        let caster = data["caster"];
        for (let i of targetBoltTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), caster.tile)) data["targets"].add(i);
        return data;
    },
    XCROSS : function(data){
        const directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];
        let caster = data["caster"];
        for(let k=0;k<directions.length;k++){
            for (let i of targetBoltTravel(directions[k], 14, caster.tile)) data["targets"].add(i);
        }
        return data;
    },
    PLUSCROSS : function(data){
        const directions = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ];
        let caster = data["caster"];
        for(let k=0;k<directions.length;k++){
            for (let i of targetBoltTravel(directions[k], 14, caster.tile)) data["targets"].add(i);
        }
        return data;
    },

    ///////////////
    //
    //   MUTATORS
    //
    ///////////////

    DEATHCLICK : function(data){
        data["clickTrigger"] = "DEATH";
        return data;
    },

    RANDDIR : function(data){
        const directions = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ];
        for (let o of data["targets"]){
            o.spellDirection = directions[randomRange(0,3)];
        }
        return data;
    },

    SPREAD : function(data){
        let extraTar = new Set();
        let targets = data["targets"];
        for (let o of targets){
            let nei = o.getAdjacentNeighbors();
            for (let f of nei){
                extraTar.add(f);
            }
        }
        for (let o of extraTar) data["targets"].add(o);
        return data;
    },

    SACRIFICE: function(data){
        let bonus = 0;
        for (let i = 0; i<wheel.wheel.length;i++){
            if (!(wheel.wheel[i] instanceof Empty)){
                wheel.exhaustedSouls.push(wheel.wheel[i]);
                wheel.wheel[i] = new Empty();
                bonus++;
            }
        }
        data["power"] += bonus;
        return data;
    },
    JOLTZAZON: function(data){
        let targets = data["targets"];
        for (let o of targets){
            let nei = o.getAdjacentNeighbors();
            for (let f of nei){
                if (f.monster && !sameTile(f,data["caster"].tile)){
                    tiles[f.x][f.y].setEffect(32,45);
                    targets.add(f);
                }
            }
        }
        return data;
    },
    EPHEMERAL: function(data){
        data["flags"].add("ephemeral");
        return data;
    },
    BUFF: function(data){
        data["power"] += 1;
        return data;
    },
    NEUTER: function(data){
        data["power"] -= 1;
        return data;
    },
    DEVOUR: function(data){
        let targets = data["targets"];
        for (let target of targets){
            if (!target.passable && inBounds(target.x,target.y) && target.eat){
                target.replace(Floor);
                data["power"] += 1;
            }
        }
        return data;
    },

    TRAIL: function(data){
        data.flags.add("trailing");
        return data;
    },

    IGNORECASTER: function(data){
        data.flags.add("ignoreCaster");
        return data;
    },

    ///////////////
    //
    //   FUNCTIONS
    //  Click, divide up aspha in "random blink" and "target casts next praxes", make gyvji react to motion instead of just doing it
    ///////////////

    ATKDELAY : function(target,power,data){
        let delayAtk = new DelayedAttack(data);
        if (target.monster){
            target.monster.storedAttack = delayAtk;
            target.monster.giveEffect("Infused",power*2,data);
        }
        return data;
    },

    CLICK : function(target,power,data){
        let trap = new ClickTrap(target,power*5,data);
        target.clickTrap = trap;
        return data;
    },

    SENET: function(target,power,data){ //if power > X, give frenzy, haste?
        if (target.monster){
            target.monster.giveEffect("Charmed",power*3,data);
        }
        return data;
    },
    ZENORIUM: function(target,power,data){
        //probably obsolete
        if (data && target.monster && target.monster.statusEff["Transformed"] == 0){
            let sample = data["targets"].slice();
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
            target.monster.giveEffect("Transformed",power*3,data);
            poly.monster.giveEffect("Transformed",power*3,data);
        }
        return data;
    },
    KASHIA: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Dissociated",power*2,data);
        }
        return data;
    },
    PARACEON: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Invincible",Math.floor(power/2),data);
        }
        return data;
    },
    STOP: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Paralyzed",power,data);
        }
        return data;
    },
    RASEL: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Puppeteered",power*2,data);
        }
        return data;
    },
    APIS: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Constricted",power,data);
        }
        return data;
    },
    HASTE: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Hasted",power,data);
        }
        return data;
    },
    HEAL: function(target,power,data){
        if (target.monster){
            target.monster.heal(power,data);
        }
        return data;
    },
    HARM: function(target,power,data){
        if (target.monster){
            target.monster.hit(power,data);
        }
        return data;
    },
    THRASH: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Thrashing",power*2,data);
        }
        return data;
    },
    GYVJI: function(targeti,power,data){
        let newTile = targeti;
        //newTile.setEffect(14,30);
        let testTile = newTile;
        let target = testTile.monster;
        while(target){
            testTile = newTile.getNeighbor(targeti.spellDirection[0],targeti.spellDirection[0]);
            if(testTile.passable && !testTile.monster){
                newTile.setEffect(target.sprite,30);
                newTile = testTile;
            }else{
                break;
            }
        }
        if(target && target.tile != newTile){
            teleport(target,newTile,data);
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
        return data;
    },
    ASPHA: function(target,power,data){ // make this random blink, then another function that casts the following praxis?
        let tper;
        if (target.monster && !target.monster.isPlayer) tper = monsters[monsters.indexOf(target.monster)];
        else if (target.monster && target.monster.isPlayer) tper = player;
        else return;
        for (let i = 0; i<power; i++){
            teleport(tper,randomPassableTile(),data);
            tper.tile.getAllNeighbors().forEach(function(t){
                t.setEffect(14, 30);
                if(t.monster){
                    t.monster.hit(1);
                }
            });
        }
        return data;
    },
    ABAZON : function(target,power,data){
        let t = target;
        let test = !t.passable && t.sprite != 17;
        if (test){
            let save = tiles[t.x][t.y];
            tiles[t.x][t.y] = new AbazonWall(t.x,t.y)
            let monster = new AbazonSummon(t,save,power*2);
            monsters.push(monster);
        }
        return data;
    },
    SUMMFELIDOL : function(target,power,data){ //scale power somehow, maybe get different felidol types (vinyl, jade...)
        let t = target;
        let test = t.passable;
        if (test){
            let monster = new Felidol(t);
            monsters.push(monster);
        }
        return data;
    },
    BLINK : function(target,power,data){
        if (!target.monster) return data;
        let newTile = target;
        let testTile = newTile;
        let affected = testTile.monster;
        let powCount = power*2;
        while(powCount > 0){
            testTile = newTile.getNeighbor(target.spellDirection[0],target.spellDirection[1]);
            powCount--;
            if(testTile.passable && !testTile.monster){
                //newTile.setEffect(affected.sprite); //this causes a strange bug where an after image stays forever
                newTile = testTile;
            }else{
                break;
            }
        }
        if(affected && affected.tile != newTile){
            teleport(affected,newTile,data);
            affected.lastMove = target.spellDirection;
        }
        return data;
    }

}

// ARTISTICMINE - LASTMOVE>RANDOMDIR - SACRIFICE (Dump wheel) - DAMPENER (reduce power, get something in exchange) - ALLOUT (lose all resolve, get power)
//

// SENET - LASHOL (status) - KILAMI (status) - GYVJI - DASH - RASEL (status) - ASPHA (tp and hit) - SUGCHA (lifesteal)
// ROSE (status) - JOLTZAZON (targets spread to adj) - HARBINGER (summon that will endlessly copy the first spell it is hit by)
// ABAZON (only wall targets affected)

function reviver(_, value) {
    if(value instanceof Object && Object.prototype.hasOwnProperty.call(value, '__type')) {
        clazz = eval(`${value.__type}`);
        if(clazz) {
            let {__type:_, ...valueWithoutClassName} = value;
            return Object.assign(new clazz([1,1]), valueWithoutClassName)
        }
    }
    return value;
}

function reloadGame(){
    //let saveData = JSON.parse(localStorage["saves"],reviver);
    //let reloadData = {1 : monsters, 2 : tiles, 3 : player, 4 : world, 5 : wheel, 6 : log};
    //let reloader = function(player){
    //    Object.keys(player).forEach(function(key){
    //        player[key] = saveData[key] 
    //    });
    //    return player;
    //}
    wheel = JSON.parse(localStorage["wheel"],reviver);
    log = JSON.parse(localStorage["log"],reviver);
    world = JSON.parse(localStorage["world"],reviver);
     
}

function saveGame(){
    localStorage.clear();

    //1 : monsters, 2 : tiles, 3 : player, 
    //let saveFile = {4 : world, 5 : wheel, 6 : log};
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          value.__type = value.constructor.name
          return value;
        };
      };
    localStorage["wheel"] = JSON.stringify(wheel, getCircularReplacer());
    localStorage["log"] = JSON.stringify(log, getCircularReplacer());
    localStorage["world"] = JSON.stringify(world, getCircularReplacer());
}

function initSounds(){
    sounds = {
        hit1: new Audio('sounds/hit1.wav'),
        hit2: new Audio('sounds/hit2.wav'),
        treasure: new Audio('sounds/treasure.wav'),
        newLevel: new Audio('sounds/newLevel.wav'),
        spell: new Audio('sounds/soulcast.wav'),
        death: new Audio('sounds/death.wav'),
        title: new Audio('music/The_Game_Foxes_Play.m4a'),
        cage: new Audio('music/CageLoop.wav'),
        fail: new Audio('sounds/fail.wav'),
        max: new Audio('music/Max.m4a'),
        harmony2: new Audio('music/Harmony2.wav'),
        harmony4: new Audio('music/Harmony4.m4a'),
        harmony6: new Audio('music/Harmony6.m4a'),
        falsity: new Audio('music/falsity.mp3'),
        seal: new Audio('music/Seal.m4a'),
        quarry: new Audio('music/Quarry.wav'),
        explosion: new Audio('sounds/explosion.wav'),
        deathdelay: new Audio('sounds/deathdelay.wav'),
        on: new Audio('sounds/moduleon.wav'),
        off: new Audio('sounds/moduleoff.wav'),
        roseic: new Audio('music/A_Roseic_Problem.mp3'),
        toxic: new Audio('music/ROSEROSEROSE.wav'),
        toxicdeath : new Audio('sounds/toxicdeath.wav'),
        spire : new Audio('music/Fly_on_The_Wall.wav'),
        spireloop : new Audio('music/Buzzard.wav'),
        boost : new Audio('sounds/boost.wav'),
        epsilon: new Audio('music/Infracted.wav'),
        epsirepair : new Audio('sounds/EpsilonRepair.wav'),
        epsideath : new Audio('sounds/EpsilonDeath.wav'),
        epsitink : new Audio('sounds/EpsilonTink.wav'),
        epsivuln : new Audio('sounds/EpsilonVuln.wav'),
        malform : new Audio('music/Malform.wav'),
        learn : new Audio('sounds/learn.wav'),
    };
}

function nukeRoom(){
    for (let i of monsters){
        i.hit(99);
    } 
}

function playSound(soundName){      
    return;                 
    sounds[soundName].currentTime = 0;
    sounds[soundName].play();
    let loops = ["cage","max","roseic","title","harmony2","harmony4","harmony6","falsity","seal","quarry","toxic","spire","spireloop","epsilon","malform"];
    if (loops.includes(soundName)) sounds[soundName].loop = true; 
}
function pauseSound(soundName){  
    sounds[soundName].pause();                     
    sounds[soundName].currentTime = 0;  
}

function pauseAllMusic(){
    let loops = ["cage","roseic","max","title","harmony2","harmony4","harmony6","falsity","seal","quarry","toxic","spire","spireloop","epsilon","malform"];
    loops.forEach(function(sound){
        pauseSound(sound);
    });
}

function playMusic(){
    if (level % 5 == 1 && level > 5){
        pauseAllMusic();
        playSound("harmony2");
    }
    else if (area == "Circus"){
        pauseAllMusic();
        playSound("roseic");
         log.addLog("RoseWelcome1");
    }
    else if (area == "Spire" && areachange){
        pauseAllMusic();
        if (!spirevisited) playSound("spireloop");
        else playSound("spireloop");
    }
    else if (level == 0){
        pauseAllMusic();
        playSound("cage");
    }
    else if (level == 7&& area == "Faith"){
        pauseAllMusic();
        playSound("seal");
    }
    else if (level == 1&& area == "Faith"){
        pauseAllMusic();
        playSound("max");
    }
    else if (level == 12&& area == "Faith"){
        pauseAllMusic();
        playSound("quarry");
    }
    else if (world.getRoom() instanceof EpsilonArena && area == "Faith"){
        pauseAllMusic();
        playSound("epsilon");
    }
    
}

function toResearchMode(){
    if (inInventory) toAxiomMode();
    if (inMap) toMapMode();
    inResearch = !inResearch;
    if (inResearch){
        tilesDisplay.eventMode = 'static';
        uiDisplayLeft.removeChildren();
        uiDisplayRight.removeChildren();
        tilesDisplay.notPlayerTiles.addChild(research.displayCon);
        uiDisplayLeft.addChild(research.tabContainer);
        uiDisplayRight.addChild(buttons.displayCon);
        uiDisplayRight.addChild(research.descriptionBox.displayCon);
    }
    else{
        tilesDisplay.eventMode = 'passive';
        tilesDisplay.removeChild(research.displayCon);
        uiDisplayLeft.removeChild(research.tabContainer);
        uiDisplayRight.removeChild(research.descriptionBox.displayCon);
        uiDisplayLeft.addChild(areaname.displayCon);
        uiDisplayLeft.addChild(statuses.displayCon);
        uiDisplayLeft.addChild(world.displayCon);
        uiDisplayRight.addChild(wheel.displayCon);
        uiDisplayRight.addChild(log.displayCon);
    }
}

function toMapMode(){

}

function toAxiomMode(){
    if (inResearch) toResearchMode();
    if (inMap) toMapMode();
    inInventory = !inInventory;
    if (inInventory){
        tilesDisplay.eventMode = 'static';
        uiDisplayLeft.removeChildren();
        uiDisplayRight.removeChildren();
        drawPixel("black",0,0,112*9,tilesDisplay);
        tilesDisplay.notPlayerTiles.addChild(player.axioms.displayCon);
        player.axioms.displayCon.x = 0;
        player.axioms.displayCon.y = 0;
        player.axioms.axiomCon.width = 112*9;
        player.axioms.axiomCon.height = 112*9;
        player.axioms.axiomCon.x = 8;
        for (let i of player.axioms.displayCon.children){
            if (i instanceof PIXI.ParticleContainer) player.axioms.displayCon.removeChild(i);
        }
        //uiDisplayRight.addChild(research.descriptionBox.displayCon);
        uiDisplayRight.addChild(buttons.displayCon);
        uiDisplayRight.addChild(player.axioms.axiomList.displayCon);
        player.axioms.axiomList.fillInRows(player);
    }
    else{
        tilesDisplay.eventMode = 'passive';
        drawChainBorder(10,11,player.axioms.displayCon);
        player.axioms.displayCon.y = 32*21;
        player.axioms.axiomCon.x = -8;
        player.axioms.axiomCon.y = 10;
        player.axioms.axiomCon.width = (7+12)*16;
        player.axioms.axiomCon.height = (7+12)*16;
        tilesDisplay.removeChild(player.axioms.displayCon);
        tilesDisplay.removeChildAt(tilesDisplay.children.length-1);
        uiDisplayLeft.addChild(areaname.displayCon);
        uiDisplayLeft.addChild(statuses.displayCon);
        uiDisplayLeft.addChild(world.displayCon);
        uiDisplayRight.addChild(wheel.displayCon);
        uiDisplayRight.addChild(log.displayCon);
        uiDisplayRight.removeChild(research.descriptionBox.displayCon);
        uiDisplayRight.removeChild(player.axioms.axiomList.displayCon);
    }
}

class Research{
    constructor(){
        this.tabs = [];
        this.page;
        this.currentpage = 0;
        this.knownnodes = [];
        this.knownSpells = [];
        this.buildTabs();
        this.looking = false;
        this.exppage = new TutorialDisplay();
        this.monsterpool = [Tinker, Slug, Snail, Shrike, Apis, Felidol];
        this.infectedConnectors = [];
        this.influence = {
            "Saintly" : 0,
            "Ordered" : 0,
            "Artistic" : 0,
            "Unhinged" : 0,
            "Feral" : 0,
            "Vile" : 0,
            "Serene" : 0,
        }
    }

    selectCaste(num){
        this.displayCon.children[this.currentpage+1].visible = false;
        this.tabContainer.children[this.currentpage].extended = false;
        this.tabContainer.children[this.currentpage].truePos = 252;
        this.displayCon.children[num+1].visible = true;
        this.tabContainer.children[num].extended = true;
        this.currentpage = num;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        drawPixel("black",-24,-24,112*9,this.displayCon);
        this.displayCon.children[0].alpha = 1; //if this is lower the chains show up
        this.displayCon.x = 24;
        this.displayCon.y = 24;
        // let newSprite = new FoxSprite(allsprites.textures['sprite0']); //background image
        // newSprite.x = -24;
        // newSprite.y = -24;
        // newSprite.width = 112*9;
        // newSprite.height = 112*9;
        // newSprite.alpha = 0.2;
        // this.displayCon.addChild(newSprite);
        for (let k = 0; k<7; k++){
            let tabCon = new PIXI.Container();
            tabCon.visible = false;
            this.displayCon.addChild(tabCon);
            for(let i=0;i<15;i++){
                for(let j=0;j<15;j++){
                    this.tabs[k][i][j].setUpResearch(tabCon);
                }
            }
        }
        this.tabContainer = new PIXI.Container();
        for (let i = 0; i<7; i++){
            let sprite = i-1;
            if (i == 0) sprite = 33;
            let selector = new CasteTab(sprite);
            selector.setUpSprites();
            selector.casteNum = i;
            selector.displayCon.y = i*112+16;
            selector.displayCon.x = 252;
            if (i > 0) selector.displayCon.visible = false;
            this.tabContainer.addChild(selector.displayCon);
        }
        this.descriptionBox = new NodeDescription();
        this.descriptionBox.setUpSprites();
        this.selectCaste(this.currentpage);
        this.completeResearch("Research");
    }

    sereneSpread(){
        if (this.infectedConnectors.length == 0) this.infectedConnectors.push(this.tabs[0][7][12]);

        const neig = [[-1,0],[1,0],[0,1],[0,-1]];
        let candidates = [];
        for (let g of this.infectedConnectors){
            let k = g.page;
            for (let x of neig){
                if (this.tabs[k][g.x+x[0]] && this.tabs[k][g.x+x[0]][g.y+x[1]]){
                    if (!this.tabs[k][g.x+x[0]][g.y+x[1]].fuffified && !(this.tabs[k][g.x+x[0]][g.y+x[1]] instanceof RealityWall)){
                        candidates.push(this.tabs[k][g.x+x[0]][g.y+x[1]]);
                        this.tabs[k][g.x+x[0]][g.y+x[1]].fuffified = true;
                        if (this.tabs[k][g.x+x[0]][g.y+x[1]] instanceof ResearchNode){
                            this.tabs[k][g.x+x[0]][g.y+x[1]].tileCon.alpha = 1;
                            this.tabs[k][g.x+x[0]][g.y+x[1]].discovered = true;
                            this.tabs[k][g.x+x[0]][g.y+x[1]].completed = true;
                            this.influence["Serene"]++;
                            universe.getTotalInfluence();
                            if (this.tabs[k][g.x+x[0]][g.y+x[1]].axiomComponent) this.tabs[k][g.x+x[0]][g.y+x[1]].innerSymbol.texture = (allsprites.textures['icon'+inside[this.tabs[k][g.x+x[0]][g.y+x[1]].id]]);
                            this.tabs[k][g.x+x[0]][g.y+x[1]].spriteDisplay.texture = allsprites.textures['sprite150'];
                        }
                        else{
                            this.tabs[k][g.x+x[0]][g.y+x[1]].tileCon.alpha = 1;
                            this.tabs[k][g.x+x[0]][g.y+x[1]].tileCon.filters = [];
                            this.tabs[k][g.x+x[0]][g.y+x[1]].spriteDisplay.texture = allsprites.textures['sprite'+(this.tabs[k][g.x+x[0]][g.y+x[1]].sprite+30)];
                        }
                    }
                }
            }
        }
        this.infectedConnectors = candidates;
    }

    goopSpread(k,i,j){
        this.tabs[k][i][j].tileCon.alpha = 1;
        this.tabs[k][i][j].spriteDisplay.texture = allsprites.textures['sprite'+this.tabs[k][i][j].sprite];
        let goo = [];
        const neig = [[-1,0],[1,0],[0,1],[0,-1]];
        for (let x of neig){
            if (this.tabs[k][i+x[0]] && this.tabs[k][i+x[0]][j+x[1]]) goo.push(this.tabs[k][i+x[0]][j+x[1]]);
        }
        goo = goo.filter(t => t instanceof ResearchConnector && t.tileCon.alpha != 1);
        while (goo.length){
            for (let g of goo){
                if (!(g instanceof ResearchConnector)){
                    removeItemOnce(goo,g);
                    g.alpha = 1;
                    g.filters = [];
                    continue;
                }
                const neig = [[-1,0],[1,0],[0,1],[0,-1]];
                for (let x of neig){
                    if (this.tabs[k][g.x+x[0]] && this.tabs[k][g.x+x[0]][g.y+x[1]]){
                        goo.push(this.tabs[k][g.x+x[0]][g.y+x[1]]);
                        if (this.tabs[k][g.x+x[0]][g.y+x[1]] instanceof ResearchNode){
                            this.tabs[k][g.x+x[0]][g.y+x[1]].discoverNode();
                        }
                    }
                }
                goo = goo.filter(t => t instanceof ResearchConnector && t.tileCon.alpha != 1);
                g.tileCon.alpha = 1;
                g.tileCon.filters = [];
            }
            if (goo.length > 20) return "uh oh";
        }
    }

    buildTabs(){
        for (let k=0; k<7;k++){
            this.tabs[k] = [];
            let web = k;
            if (web > 0) web = 2;
            for(let i=0;i<15;i++){
                this.tabs[k][i] = [];
                for(let j=0;j<15;j++){
                    let nodeType = keyresearch[researchpage["Web"+web][j][i]];
                    if ("TL)><I-+KYJ".includes(researchpage["Web"+web][j][i])) this.tabs[k][i][j] = new ResearchConnector(i,j,nodeType,k);
                    else if (nodeType == ".") this.tabs[k][i][j] = new RealityWall(i,j);
                    else this.tabs[k][i][j] = new ResearchNode(i,j,researchpage["Web"+web][j][i],k);
                }
            }
        }
        this.page = this.tabs[0];
    }

    buildTabsOld(){
        for (let k=0; k<Object.keys(researchpage).length-1;k++){
            this.tabs[k] = [];
            for(let i=0;i<5;i++){
                this.tabs[k][i] = [];
                for(let j=0;j<5;j++){
                    let nodeType = keyresearch[researchpage["Page"+k][j][i]];
                    if ("TL)><I-+KY".includes(researchpage["Page"+k][j][i])) this.tabs[k][i][j] = new ResearchConnector(i,j,nodeType);
                    else if (nodeType == ".") this.tabs[k][i][j] = new Floor(i,j);
                    else this.tabs[k][i][j] = new ResearchNode(i,j,researchpage["Page"+k][j][i],k);
                }
            }
        }
        this.page = this.tabs[0];
    }

    changeTab(inc){
        if (this.tabs.length == this.currentpage + inc ||this.currentpage + inc < 0) return;
        this.currentpage+= inc;
        this.page = this.tabs[this.currentpage];
    }

    completeResearch(dis){
        return;
        if (this.knownnodes.includes(dis)) return;
        for (let k = 0; k<7; k++){
            for(let i=0;i<15;i++){
                for(let j=0;j<15;j++){
                    if (this.tabs[k][i][j] instanceof ResearchNode && dis == this.tabs[k][i][j].id && this.tabs[k][i][j].discovered){
                        this.tabs[k][i][j].completeNode();
                        if (k > 0) this.influence[Object.keys(this.influence)[k-1]]++;
                        universe.getTotalInfluence();
                        playSound("learn");
                        this.knownnodes.push(dis);
                        this.goopSpread(k,i,j);
                        break;
                    }
                }
            }
        }
    }

    findletter(letter,k){
        let searchpage = k;
        if (letter[0] == "<"){
            searchpage--;
            letter = letter[1];
        }
        for(let i=0;i<5;i++){
            for(let j=0;j<5;j++){
                if (this.tabs[searchpage][i][j] instanceof ResearchNode && this.tabs[searchpage][i][j].letter == letter && this.tabs[searchpage][i][j].completed) return true;
            }
        }
        return false;
    }

    checkforLinks(candidate,k){
        let match = 0;
        for (let i of candidate){
            for (let j of i){
                if (this.findletter(j,k)){
                    match++;
                    break;
                }
            }
        }
        if (match == candidate.length) return true;
        else return false;
    }
}

let lootPool = {
    "CONTINGENCY" : {
        "S" : [],
        "O" : [],
        "A" : [],
        "U" : [],
        "F" : [],
        "V" : [],
    },
    "FORM" : {
        "S" : [],
        "O" : [],
        "A" : [],
        "U" : [],
        "F" : [],
        "V" : [],
    },
    "FUNCTION" : {
        "S" : [],
        "O" : [],
        "A" : [],
        "U" : [],
        "F" : [],
        "V" : [],
    },
    "MUTATOR" : {
        "S" : [],
        "O" : [],
        "A" : [],
        "U" : [],
        "F" : [],
        "V" : [],
    }
}

var researchpage = {
    
    "Basic" : {
        0 : ".........",
        1 : ".........",
        2 : ".........",
        3 : ".........",
        4 : ".........",
        5 : ".........",
        6 : ".........",
        7 : ".........",
        8 : ".........",
    },
    "Web0" : {
        0 :  "c.............f",
        1 :  ".>-----------<.",
        2 :  ".I...........I.",
        3 :  ".I...........I.",
        4 :  ".I..>-----<..I.",
        5 :  ".I..I.....I..I.",
        6 :  ".I..I.....I..I.",
        7 :  ".I..I.....I..I.",
        8 :  ".I..I.....I..I.",
        9 :  ".a..I.....I..I.",
        10 : ".I..L--T--)..I.",
        11:  ".a.....I.....I.",
        12:  ".I.....I.....I.",
        13:  ".a.....I-----).",
        14:  "...............",
    },
    "Template" : {
        0 :  "...............",
        1 :  "...............",
        2 :  "...............",
        3 :  "...............",
        4 :  "...............",
        5 :  "...............",
        6 :  "...............",
        7 :  "...............",
        8 :  "...............",
        9 :  "...............",
        10:  "...............",
        11:  "...............",
        12:  "...............",
        13:  "...............",
        14:  "...............",
    },
    "Web3" : {//Fundamentals
        0 :  "..a.........c..", //f for fuffypocalypse
        1 :  "..I..cTc....I..",//s for spellcraft
        2 :  "..a...I...m.Kc.",// inhale exhale
        3 :  "..I...I.s-K.I..", // o and m contin and mut
        4 :  "..h...n-K.a-K..",//shattereds and subdueds
        5 :  "..I...I.s-K.I..", // t for structures
        6 :  "k-+-l-o...o.I..",// dreamscape
        7 :  "..I.........d..", // d for deeper still, i for influences
        8 :  "i-f-<.......I..",// paint & seed
        9 :  "I...d...>-i-+-c", 
        10:  "c-b-)...I...I..",//herald
        11:  "..I.....t...c..",
        12:  "..a.....I......",//move
        13:  "..I...r-)......",
        14:  "..z............",//research tree
    },
    "Web2" : {
        0 :  "c.............f",
        1 :  "L-s-m.....m-c-)",
        2 :  "....K-sTs-J....",
        3 :  "f-c-s..I..m-s-s",
        4 :  "..I....f....I..",
        5 :  "..m-f..I..c-f..",
        6 :  "....I..I..I....",
        7 :  "....Ks-a-sJ....",
        8 :  "....I..I..I....",
        9 :  "....m..I..m....",
        10 : ".......f.......",
        11 : ".......I.......",
        12 : "......sYm......",
        13 : "......I.I......",
        14 : "......Lc)......",
    },
    "Web0" : {
        0 :  "C-D----T----T-C",
        1 :  "..I....I....I..",
        2 :  "C-J...>A<...C..",
        3 :  "..I...I.I......",
        4 :  "N-).O-FTU-M.C..",
        5 :  "I......I....I..",
        6 :  "I..k-l-o--T-+-C",
        7 :  "I....I....I.I..",
        8 :  "S..>-f-<..g.n..",
        9 :  "I..I...I..I....",
        10 : "I..i-T-d..H....",
        11 : "I....I.........",
        12 : "L-r..c-b-<.....",
        13 : ".........a.....",
        14 : ".......z-).....",
    },
    "Page0" : {
        0 : "....I....",
        1 : ".>--f--<.",
        2 : ".d.....i.",
        3 : ".L--c--).",
        4 : "....I....",
        5 : "....b--e.",
        6 : "....I....",
        7 : "....a....",
        8 : ".........",
        "links" : {
            "a" : [[]],
            "b" : [["a"]],
            "c" : [["b"]],
            "d" : [["c"]],
            "f" : [["d"],["i"]],
            "e" : [["b"]],
            "i" : [["c"]],
        }
    },
    // a - A Tingling In The Soul (intro)
    // b - The Herald of the Old World (cold storage)
    // c - Containing the Intangible (soul cage)
    // d - Synchronized Daydreaming (world seed)
    // e - Unruly Prey (turbulents)
    // f - Visions of the Old World (visions)
    // g - With Prudence Comes Serenity (security)
    // h - The Song That Stirs Souls (tier 1 harmony)
    "Page1" : {
        0 : ".I.I.I...",
        1 : ".I.iTj...",
        2 : ".K-<I....", // extend from e at some point
        3 : ".f.hI....", // and add e, anyhow... right above d
        4 : ".LT)I....",
        5 : "..L-cTd..",
        6 : ".g--)I...",
        7 : "...aTb...",
        8 : "....I....",
        "links" : {
            "b" : [["<f"]],
            "a" : [["<f"]],
            "c" : [["b"]],
            "d" : [["b"]],
            //"e" : [["d"]],
            "j" : [["c"]],
            "g" : [["c"]],
            "i" : [["c"]],
            "f" : [["c"]],
            "h" : [["c"]],
        }
    },
    // a - Spiritual Sewage (shattered souls)
    // b - The Servitude of Still Minds (subdued souls)
    // c - Wear Beings Like Costumes (spellcasting)
    // d - Estate of Servants' Dreams (subdued souls in cage)
    // e - The Bottomless Dream-Pit (soul cage pattern)
    // f - 
    // g - Reforging Legends Past (spell crafting)
    // h - 
    "Page2" : {
        0 : ".........",
        1 : "....i....",
        2 : "..>-+-<..",
        3 : "..h.f.I..",
        4 : ".>Y<I.g..",
        5 : ".e.dLT)..",
        6 : ".I.I.I...",
        7 : ".a.b.c...",
        8 : ".I.I.I...",
        "links" : {
            "a" : [["<f","<h"]],
            "b" : [["<i"]],
            "c" : [["<j"]],
            "e" : [["a"]],
            "h" : [["e","d"]],
            "d" : [["b"]],
            "g" : [["c"]],
            "f" : [["c"]],
            "i" : [["h","f","g"]],
        }
    },
}

//spawns: N - W - E - S

function generateSpire(){
    let passableTiles=0;
    tiles = [];
    let platformstart = randomRange(1,7);
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if(j == 8 && i == platformstart){
                tiles[i][j] = new Platform(i,j);
                passableTiles++;
            }
            else{
                tiles[i][j] = new Floor(i,j);
                passableTiles++;
            }
        }
    }
    let pcon = tiles[platformstart][8];
    spirespawner = pcon;
    let top = 8;
    while (top > 0){
        let surface = [];
        for (let i=0;i<randomRange(5,12);i++){
            let platform = pcon.getLateralNeighbors().filter(t => t.passable || !t instanceof Platform);
            platform[0].replace(Platform);
            surface.push(platform[0]);
            pcon = platform[0];
        }
        let ladder = surface[randomRange(0,surface.length-1)].getNeighbor(0, -1);
        if (ladder.y > 0) ladder.replace(Ladder);
        else ladder.replace(Booster);
        for (let i=0;i<randomRange(0,2);i++){
            let lad = ladder.getNeighbor(0, -1);
            if (lad.y > 0) lad.replace(Ladder);
            else lad.replace(Booster);
            ladder = lad;
        }
        pcon = ladder.getNeighbor(0, -1);
        if (pcon.y > 0) pcon.replace(Platform);
        else pcon.replace(Booster);
        top = pcon.y;
    }

    return passableTiles;
}

class CasteTab{
    constructor(caste){
        this.caste = caste;
        this.extension = 4;
        this.extended = false;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.truePos = 252;
        drawChainBorder(12,3,this.displayCon);
        for (let i of this.displayCon.children[0].children){
            if (i.x == 11*32) this.displayCon.children[0].removeChild(i);
        }
        let newSprite = new FoxSprite(allsprites.textures['icon'+this.caste]);
        newSprite.width = 64;
        newSprite.height = 64;
        newSprite.alpha = 0.8;
        this.displayCon.addChild(newSprite);
        const tabText = {
            33: "Fundamentals",
            0: "Saintly",
            1: "Ordered",
            2: "Artistic",
            3: "Unhinged",
            4: "Feral",
            5: "Vile"
        };
        const tabColor = {
            33: "white",
            0: "lime",
            1: "orangered",
            2: "orange",
            3: "yellow",
            4: "yellowgreen",
            5: "plum"
        };
        const style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 32,
            fill: tabColor[this.caste],
        });
        printOutText(tabText[this.caste],92,15,style,this.displayCon);
        for (let i of this.displayCon.children[2].children) i.anchor.set(0.5,0.5);
        const graphics = new PIXI.Graphics();
        graphics.beginFill("white");
        graphics.drawRect(-16, -16, 11*32, 3*32);
        graphics.endFill();
        graphics.alpha = 0.1;
        graphics.eventMode = 'static';
        graphics.on('pointerover', (event) => {
            this.displayCon.truePos = 16;
        });
        graphics.on('pointerdown', (event) => {
            research.selectCaste(this.casteNum);
        });
        graphics.on('pointerout', (event) => {
            if (!this.displayCon.extended) this.displayCon.truePos = 252;
        });
        this.displayCon.addChild(graphics);
        app.ticker.add(() => {
            if (this.displayCon.extended) this.displayCon.truePos = 16;
            if (this.displayCon.x < this.displayCon.truePos) this.displayCon.x = Math.min(this.displayCon.x+24,this.displayCon.truePos);
            else if (this.displayCon.x > this.displayCon.truePos) this.displayCon.x = Math.max(this.displayCon.x-24,this.displayCon.truePos);
        });
    }
}