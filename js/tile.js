class Tile{
    constructor(x, y, sprite, passable){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
        this.eat = true;
        this.cuff = false;
        this.trap = false;
        this.eviltrap = false;
        this.siphon = false;
        this.pin = false;
        this.recallpoint = false;
    }

    replace(newTileType){
        tiles[this.x][this.y] = new newTileType(this.x, this.y);
        return tiles[this.x][this.y];
    }

    //formule de distance merci discord
    dist(other){
        return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
    }

    getNeighbor(dx, dy){
        return getTile(this.x + dx, this.y + dy)
    }

    getAdjacentNeighbors(){
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ]);
    }

    getLateralNeighbors(){
        return shuffle([
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ]);
    }

    getAllNeighbors(){
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0),
            this.getNeighbor(1, 1),
            this.getNeighbor(-1, -1),
            this.getNeighbor(-1, 1),
            this.getNeighbor(1, -1),
        ]);
    }

    getAdjacentPassableNeighbors(){
        return this.getAdjacentNeighbors().filter(t => t.passable);
    }

    getAdjacentEmptyNeighbors(){
        return this.getAdjacentNeighbors().filter(t => !t.monster);
    }

    getAdjacentPassableEmptyNeighbors(){
        return (this.getAdjacentNeighbors().filter(t => !t.monster)).filter(t => t.passable);
    }

    getConnectedTiles(){
        let connectedTiles = [this];
        let frontier = [this];
        while(frontier.length){
            let neighbors = frontier.pop()
                                .getAdjacentPassableNeighbors()
                                .filter(t => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        return connectedTiles;
    }

    draw(){
        drawSprite(this.sprite, this.x, this.y);

        if(this.trap){                      
            drawSprite(12, this.x, this.y);
            this.lore = description["Mine"];
            this.name = "Regret-Powered Mine (friendly)";
        }
        if(this.cuff){
            drawSprite(42,this.x, this.y);
            this.lore = description["Bundle"];
            this.name = "Bundle-of-Paws";
        }
        if (this.eviltrap){
            drawSprite(46,this.x, this.y);
            this.lore = description["HMine"];
            this.name = "Regret-Powered Mine (hostile)";
        }
        if (this.siphon){
            drawSprite(50,this.x, this.y);
            this.lore = description["Siphon"];
            this.name = "Soul Siphon";
        }
        if (this.pin){
            drawSprite(51,this.x, this.y);
            this.lore = description["Pinwheel"];
            this.name = "Folded Pinwheel";
        }
        if (this.flufftrap){
            drawSprite(69,this.x,this.y);
            this.lore = description["FluffTrap"];
            this.name = "Harmonic Audioplate";
        }
        if (this.recallpoint){
            drawSprite(69,this.x,this.y);
            this.lore = description["RecallPoint"];
            this.name = "Identity Anchor";
        }
        if(this.effectCounter){                    
            this.effectCounter--;
            ctx.globalAlpha = this.effectCounter/30;
            drawSprite(this.effect, this.x, this.y);
            ctx.globalAlpha = 1;
        }
    }

    setEffect(effectSprite, time){                                  
        this.effect = effectSprite;
        this.effectCounter = time;
    }
    checkDirection(){
        if (this.y == world.getRoom().extreme["N"]) this.direction = "N";
        else if (this.x == world.getRoom().extreme["W"]) this.direction = "W";
        else if (this.x == world.getRoom().extreme["E"]) this.direction = "E";
        else if (this.y == world.getRoom().extreme["S"]) this.direction = "S";
    }
}

class Floor extends Tile{
    constructor(x,y){
        super(x, y, 2, true);
        this.lore = description["Floor"];
        this.name = "Eroded Floortiles";
    };

    stepOn(monster){
        let trapsafe = true;
        if (monster.isPlayer){
            trapsafe = player.activemodule != "Hover";
        }
        if (monster.isPlayer && (this.pin || this.eviltrap || this.cuff) && !trapsafe){
            if (!player.consumeCommon(1,false)) {
                log.addLog("FluffyInsufficientPower");
                player.activemodule = "NONE";
                playSound("off");
                trapsafe = true;
            }
        }
        if((!monster.isPlayer&&!monster.charmed)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if((!monster.isPlayer&&!monster.charmed&&!monster.permacharm)&& this.flufftrap){
            this.flufftrap = false;
            let fluffy = new BattleFluffy(monster.tile);
            removeItemOnce(monsters, monster);
            monsters.push(fluffy);
            playSound("treasure");      
        }
        if (monster.isPlayer && this.cuff && trapsafe){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.charmed) && this.eviltrap && trapsafe){
            playSound("fail");
            spells["ARTTRIGGER"](monster.tile);
            this.eviltrap = false;
        }
        if ((monster.isPlayer) && this.pin && trapsafe){
            playSound("fail");
            for (let x of monsters){
                if (x instanceof Weaver){
                    x.enraged = true;
                    x.isPassive = false;
                }
            }
            this.pin = false;
        }
    }
}

class Platform extends Floor{
    constructor(x,y){
        super(x, y, 57, true);
        this.lore = description["Floor"];
        this.name = "Eroded Floortiles";
        this.sprite = 57;
    };
}

class Ladder extends Floor{
    constructor(x,y){
        super(x, y, 58, true);
        this.lore = description["Floor"];
        this.name = "Eroded Floortiles";
        this.sprite = 58;
    };
}

class Goop extends Tile{
    constructor(x,y){
        super(x, y, 60, true);
        this.lore = description["Glamour"];
        this.name = "Glamorous Toxin";
        this.sprite = 60;
    };
    stepOn(monster){
        if((!monster.isPlayer&&!monster.charmed)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.charmed) && this.eviltrap){
            playSound("fail");
            spells["ARTTRIGGER"](monster.tile);
            this.eviltrap = false;
        }
        if ((monster.isPlayer) && this.pin){
            playSound("fail");
            for (let x of monsters){
                if (x instanceof Weaver){
                    x.enraged = true;
                    x.isPassive = false;
                }
            }
            this.pin = false;
        }
    }
}


class Wall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
        this.lore = description["Barrier"];
        this.name = "Apocalypse Barrier";
    };

    stepOn(monster){
    }
}

class AbazonWall extends Tile{
    constructor(x,y){
        super(x, y, 2, false);
        this.lore = description["Abazon"];
        this.name = "Terracotta Sentry";
        this.eat = false;
    };

    stepOn(monster){
    }
}

class RoseWall extends Wall{
    constructor(x,y){
        super(x, y, 55, false);
        this.lore = description["Roseic"];
        this.name = "Roseic Blowglass";
        this.eat = false;
        this.sprite = 55;
    };

    stepOn(monster){
    }
}

class BExit extends Tile{
    constructor(x,y){
        super(x, y, 17, false);
        this.lore = description["Seal"];
        this.name = "Soulsteel Seal";
        this.eat = false;
        this.checkDirection();
        this.textures = {
            "N" : 84,
            "S" : 17,
            "W" : 83,
            "E" : 85
        }
        this.sprite = this.textures[this.direction];
    }
}

class BReturnExit extends Tile{
    constructor(x,y){
        super(x, y, 17, false);
        this.lore = description["Seal"];
        this.name = "Soulsteel Seal";
        this.eat = false;
        //this.tile = 56;
        this.id = -1;
        this.checkDirection();
        this.textures = {
            "N" : 84,
            "S" : 17,
            "W" : 83,
            "E" : 85,
            "NW" : [0,1],
            "SW" : [0,-1],
            "WW" : [1,0],
            "EW" : [-1,0],
        }
        this.sprite = this.textures[this.direction];
        world.getRoom().playerspawn = [this.x+this.textures[this.direction + "W"][0], this.y+this.textures[this.direction + "W"][1]];
    }
}

class TermiWall extends Wall{
    constructor(x, y){
        super(x, y, 37, false);
        this.lore = description["Circuit"];
        this.name = "Tangled Circuits";
        this.sprite = 37;
    }
}

class RealityWall extends Wall{
    constructor(x, y){
        super(x, y, 56, false);
        this.lore = description["Reality"];
        this.name = "Nonexistent Nullspace";
        this.sprite = 56;
    }
}

class Exit extends Tile{
    constructor(x, y){
        super(x, y, 11, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
        super.checkDirection();
        this.textures = {
            "N" : 89,
            "S" : 86,
            "W" : 87,
            "E" : 88
        }
        this.sprite = this.textures[this.direction];
        if (world.getRoom() instanceof WorldSeed) this.sprite = 38;
    }

    stepOn(monster){
        if(monster.isPlayer){
            playSound("newLevel"); 
            if(level == numLevels){
                player.inventory = [];
                addScore(score, true); 
                showTitle();
            }else{
                level++;
                for(let i=0;i<player.inhand.length;i++){
                    player.discard.push(player.inhand[i]);
                }
                for(let i=0;i<player.saved.length;i++){
                    player.discard.push(player.saved[i]);
                }
                invsave = player.inventory;
                dissave = player.discard;
                pauseSound("harmony2");
                //startLevel(Math.min(maxHp, player.hp+2));
                sacritotal = "nan";
                rerolled = false;
                gameState = "running";
                sacrifice = 0;
                rolled = 0;
                rosetoxin = 0;
                //if (level == 17 && area == "Faith"){
                //    log.addLog("EpsilonWelcome1");
                //}
            }
        }
    }
}

class ExpandExit extends Exit{
    constructor(x, y){
        super(x, y, 11, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
        this.checkDirection();
    }
    stepOn(monster){
        super.stepOn(monster);
        if(monster.isPlayer){
            world.fighting = true;
            let newexit = this.replace(ReturnExit);
            newexit.id = world.roomlist.length;
            world.saveRoom(tiles, monsters);
            let entering = world.addRoom(this.direction,world.currentroom);
            player.hp = Math.min(maxHp, player.hp+1);
            world.playRoom(entering, player.hp);
        }
    }
}

class ReturnExit extends Exit {
    constructor(x, y){
        super(x, y, 12, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
        this.id = -1;
        //this.sprite = 12;
        
    }
    stepOn(monster){
        super.stepOn(monster);
        if(monster.isPlayer){
            //world.saveRoom(tiles, monsters);
            world.fighting = false;
            level--;
            this.monster = null;
            world.saveRoom(tiles, monsters);
            world.reloadRoom(this.id, this.direction);
        }
    }
}

class TermiExit extends ExpandExit{
    constructor(x, y){
        super(x, y, 38, true);
        this.lore = description["TermiSeal"];
        this.name = "Hydraulic Gate";
        this.sprite = 38;
    }

    stepOn(monster){
        pauseAllMusic();
        super.stepOn(monster);
        //level+=4; //debug
    }

}

class FluffExit extends Exit{
    constructor(x, y){
        super(x, y, 23, true);
        this.lore = description["HarmonicSeal"];
        this.name = "Harmonic Seal";
        this.sprite = 23;
    }

    stepOn(monster){
        super.stepOn(monster);
        log.addLog("FluffyWelcome");
        gameState = "fluffy";

    }
}

class Booster extends Exit{
    constructor(x, y){
        super(x, y, 59, true);
        this.lore = description["HarmonicSeal"];
        this.name = "Harmonic Seal";
        this.sprite = 59;
    }
    stepOn(monster){
        player.fall = 0;
        areachange = false;
        super.stepOn(monster);
        if (level % 5 == 1 && level > 5) message= "FluffyWorkshop";
    }
}

class Altar extends Floor{
    constructor(x,y){
        super(x, y, 30, true); //30
        this.value = new Empty();
        this.name = "Positive Harmonic Relay";
        this.lore = description["PosRelay"];
    }

    draw(){
        super.draw();
        drawSymbol(this.value.icon, this.x*tileSize+8, this.y*tileSize+8,48);
    }

    getValue(){
        let number = "?";
        if (this.value instanceof Saintly) number = "6";
        else if (this.value instanceof Ordered) number = "5";
        else if (this.value instanceof Artistic) number = "4";
        else if (this.value instanceof Unhinged) number = "3";
        else if (this.value instanceof Feral) number = "2";
        else if (this.value instanceof Vile) number = "1";
        return number;
    }
}


class PosAltar extends Altar{
    constructor(x,y){
        super(x, y, 30, true); //30
        this.value = new Empty();
        this.sprite = 30;
        this.name = "Positive Harmonic Relay";
        this.lore = description["PosRelay"];
    }
}

class NegAltar extends Altar{
    constructor(x,y){
        super(x, y, 31, true); //31
        this.name = "Negative Harmonic Relay";
        this.sprite = 31;
        this.lore = description["NegRelay"];
        this.value = new Empty();
    }

}

class BetAltar extends Altar{
    constructor(x,y){
        super(x, y, 43, true); 
        this.name = "Soulscribe";
        this.sprite = 43;
        this.lore = description["Soulscribe"];
        this.value = new Empty();
    }
}

class RoseThrone extends Wall{
    constructor(x, y){
        super(x, y, 61, false);
        this.lore = description["Rose"];
        this.name = "Rose, Last of the Saints";
        this.sprite = 61;
    }
}

class SereneThrone extends Wall{
    constructor(x, y){
        super(x, y, 26, false);
        this.lore = description["Harmonizer"];
        this.name = "Serene Harmonizer";
        this.sprite = 26;
    }
}

class RoseServant extends Wall{
    constructor(x, y){
        super(x, y, 62, false);
        this.lore = description["RoseS"];
        this.name = "Tangled Servitor";
        this.sprite = 62;
    }
}

class RoseSpawner extends Tile{
    constructor(x, y){
        super(x, y, 63, true);
        this.lore = description["RoseSpawn"];
        this.name = "Aleatory Teleconstructor";
        this.sprite = 63;
    }
    stepOn(monster){
        if((!monster.isPlayer&&!monster.charmed)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.charmed) && this.eviltrap){
            playSound("fail");
            spells["ARTTRIGGER"](monster.tile);
            this.eviltrap = false;
        }
        if ((monster.isPlayer) && this.pin){
            playSound("fail");
            for (let x of monsters){
                if (x instanceof Weaver){
                    x.enraged = true;
                    x.isPassive = false;
                }
            }
            this.pin = false;
        }
    }
}

class Mobilizer extends Tile{
    constructor(x, y){
        super(x, y, 75, true);
        this.lore = description["Mobilizer"];
        this.name = "Automaton Mobilizer";
        this.sprite = 75;
    }
    stepOn(monster){
        if((!monster.isPlayer&&!monster.charmed)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.charmed) && this.eviltrap){
            playSound("fail");
            spells["ARTTRIGGER"](monster.tile);
            this.eviltrap = false;
        }
        if ((monster.isPlayer) && this.pin){
            playSound("fail");
            for (let x of monsters){
                if (x instanceof Weaver){
                    x.enraged = true;
                    x.isPassive = false;
                }
            }
            this.pin = false;
        }
    }
}