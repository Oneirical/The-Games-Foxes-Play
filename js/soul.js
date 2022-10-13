//ils ne sont pas tous utilisés, donc retravailler ceux qui utilisent les vieux trésors
spells = {
    WOOP: function(caster){
        caster.move(randomPassableTile());
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
    FERAL: function(caster){
        caster.shield = 1;
        let friendly = (caster.isPlayer || caster.charmed);
        let newTile = caster.tile;
        while(true){
            let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                newTile = testTile;
                newTile.getAdjacentNeighbors().forEach(t => {
                    if(t.monster && friendly && !t.monster.isPlayer && !t.monster.charmed){
                        t.setEffect(14,30);
                        t.monster.stunned = true;
                        t.monster.hit(1);
                    }
                    else if (t.monster && !friendly && (t.monster.isPlayer || t.monster.charmed)){
                        t.setEffect(14,30);
                        t.monster.hit(1);
                    }
                });
            }else{
                break;
            }
        }
        if(caster.tile != newTile){
            caster.move(newTile);
            newTile.getAdjacentNeighbors().forEach(t => {
                if(t.monster){
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
            caster.shield = 3;
            for(let i=0;i<monsters.length;i++){
                monsters[i].stunned = true;
            }
        }
        else{
            caster.shield = 2;
        }
    },
    STRAIGHTLASER: function(caster){
        boltTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), 4, caster.tile);
    },
    SNAILLASER: function(caster){
        if(caster.charmed) csnailTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), 1, caster.tile);
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
        caster.monster.hit(3);
    },
    UNHINGED: function(caster){
        let directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];
        for(let k=0;k<directions.length;k++){
            boltTravel(directions[k], 14, 3, caster.tile, (caster.isPlayer||caster.charmed));
        }
    },
    TAINTED: function(){
        shakeAmount = 20;
    },
    ARTISTIC: function(caster){
        if (caster.isPlayer || caster.charmed) caster.tile.trap = true;
        else caster.tile.eviltrap = true;
    },

    SERENE: function(){
        if (player.inventory.length == 0){
            //player.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
            shuffle(player.discard)
            for(let i=0;i<player.discard.length;i++){
                player.inventory.push(player.discard[i]);
            }
            player.discard = [];
        }
        if (player.activemodule != "Selective"){
            if (!player.harmonizeAny(1)){
                message = "FluffyNoConvertTaunt";
                removeItemOnce(player.saved,"SERENE");
                fail = true;
            }
            else{
                player.specialAttack = "Harmony";
                fail = false;
            }
        }
        else{
            if (player.consumeCommon(1,false)){ // pay the price
                if (!player.consumeCommon(1,true)){
                    player.discard.push(dontremove[0]);
                    message = "FluffyNoConvertTaunt";
                    removeItemOnce(player.saved,"SERENE");
                    fail = true;
                }
                else{
                    player.specialAttack = "Harmony";
                    fail = false;
                }
            }
            else{
                message = "FluffyInsufficientPower";
                playSound("off");
                player.activemodule = "NONE";
                if (!player.harmonizeAny(1)){
                    message = "FluffyNoConvertTaunt";
                    removeItemOnce(player.saved,"SERENE");
                    fail = true;
                }
                else{
                    player.specialAttack = "Harmony";
                    fail = false;
                }
            }
        }

    },
    JOLTZAZON: function(){
        monsters.forEach(function(entity){
            if (!entity.isPlayer){
                entity.tile.getAdjacentNeighbors().forEach(t => {
                    if(t.monster && !t.monster.isPlayer){
                        t.monster.stunned = true;
                        t.setEffect(32,30);
                        t.monster.hit(2);
                    }
                });
            }
        });
    },
    PURPIZUG: function(){
        let draw = player.inhand.length+1;
        player.inhand.forEach(t => {
            player.discard.push(t);
        });
        player.inhand.length = 0;
        for(var i = 0; i < draw; i++){
            resolve++
            player.drawSpell();
        }
    },
    ROSE: function(){
        ribbonTravel(player.lastMove, 33 + Math.abs(player.lastMove[1]), player.tile);
    },
    ZENESTE: function(){
        player.specialAttack = "Charm";
    },
    KILAMI: function(){
        doublecounter = 2;
    },
    AUBE: function(){
        monsters.forEach(function(entity){
            entity.heal(2);
            entity.tile.setEffect(13,30);
        });
        aubecounter++
        if (aubecounter == 5){
            removeItemOnce(player.saved, "AUBE");
            player.saved.push("ZENITH");
        }
    },
    ZENITH: function(){
        scytheTravel([0,1], 14, 4, player.tile, 3);
        scytheTravel([0,-1], 14, 4, player.tile, 3);
        aubecounter++
        if (aubecounter == 10){
            removeItemOnce(player.saved, "ZENITH");
            player.saved.push("CREPUSCULUM");
        }
    },
    CREPUSCULUM: function(){
        gameState = "contemplation";
        falseagony = true;
        agony = 1;
        aubecounter++
        if (aubecounter == 15){
            removeItemOnce(player.saved, "CREPUSCULUM");
            truehp += 3;
        }
    },
    SHIZAPIS: function(caster){
        if (caster.inventory.length > 2){
            discarded = 1;
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
        let neighbors = player.tile.getAdjacentNeighbors().filter(t => !t.passable && inBounds(t.x,t.y) && t.sprite != 17);
        if(neighbors.length){
            let tile = neighbors.pop();
            tiles[tile.x][tile.y] = new AbazonWall(tile.x,tile.y)
            let monster = new Abazon(tile);
            tile.monster
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
        removeItemOnce(caster.saved,"ZAINT");
    },
    RASEL: function(){
        player.reaping = true;
    },
    BORERORA: function(){
        if (player.inhand.length >= 1){
           bounceboltTravel(player.lastMove, 15 + Math.abs(player.lastMove[1]), 2, player.tile, player.inhand.length*2);
        }
    },
    ASPHA: function(){
        gameState = "discard";
        discarded = 0;
        message = "Discard";
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
    },
    NAIA: function(){
        gameState = "discard";
        discarded = 0;
        message = "Discard";
        naiamode = true;
    },
    LASHOL: function(){
    },
    EZEZZA: function(){
    },
    ASTER: function(){
        removeItemAll(player.inhand, "SERENE");
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
        let friendly = (caster.isPlayer || caster.charmed);
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
        if (caster.falsehp == 0) caster.falsehp = caster.hp;
        caster.deathdelay = 7;
        playSound("deathdelay");
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
        if (caster.charmed) friendly = true;
        for(let k=0;k<directions.length;k++){
            invisBoltTravel(directions[k], 15 + Math.abs(directions[k][1]), 2, caster.tile, friendly);
        }
    },

    PSYDRONE: function(caster){
        caster.tile.getAllNeighbors().forEach(function(t){
            t.setEffect(75, 30);
            if(t.monster && caster.charmed && !t.monster.loveless){
                t.monster.charmed = true;
            }
            else if (t.monster && !caster.charmed && t.monster.isPlayer){
                if (t.monster.inhand.length > 0) t.monster.inhand[randomRange(0,t.monster.inhand.length-1)] = "ORDERED";
            }
        });
    },
};

function boltTravel(direction, effect, damage, location, friendly){
    let newTile = location;
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster && !newTile.monster.isPlayer&& !newTile.monster.charmed && friendly){
                newTile.monster.hit(damage);
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.charmed) && !friendly){
                newTile.monster.hit(damage);
            }
            newTile.setEffect(effect,30);
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
            if(newTile.monster && newTile.monster instanceof Binary && !newTile.monster.charmed && !friendly){
                target = newTile;
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.charmed) && friendly){
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
            if(newTile.monster && !newTile.monster.isPlayer&& !newTile.monster.charmed && friendly){
                newTile.monster.hit(damage);
            }
            else if (newTile.monster && (newTile.monster.isPlayer || newTile.monster.charmed) && !friendly){
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
        if(testTile.x <= 8 && testTile.y <= 8 && testTile.x >= 0 && testTile.y >= 0){
            newTile = testTile;
            if(newTile.monster && !newTile.monster.isPlayer){
                newTile.monster.hit(damage);
            }
            newTile.setEffect(effect,30);
        }else{
            let testTile = newTile.getNeighbor(direction[0], -direction[1]);
            times--;
            let newdir = [];
            if (direction[0] == 0 && direction[1] == 1) newdir = [-1,-1];
            else if (direction[0] == 1 && direction[1] == 0) newdir = [-1,1];
            else if (direction[0] == 0 && direction[1] == -1) newdir = [-1,-1];
            else if (direction[0] == -1 && direction[1] == 0) newdir = [-1,-1];
            else if (direction[0] == -1 && direction[1] == -1) newdir = [1,-1];
            else if (direction[0] == 1 && direction[1] == -1) newdir = [1,1];
            else if (direction[0] == 1 && direction[1] == 1) newdir = [-1,1];
            else if (direction[0] == -1 && direction[1] == 1) newdir = [-1,-1];
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
            if(newTile.monster && (newTile.monster.isPlayer || newTile.monster.charmed || newTile.monster.marked)){
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
            if(newTile.monster && (newTile.monster.isPlayer || newTile.monster.charmed)){
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
                newTile.monster.marked = true;
                break;
            }
            newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
}