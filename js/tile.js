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
        this.souls = [];
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

    getConnectedRooms(){
        let connectedTiles = [this];
        let frontier = [this];
        while(frontier.length){
            let neighbors = frontier.pop()
                                .getAdjacentPassableRooms()
                                .filter(t => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        return connectedTiles; 
    }

    getAdjacentPassableRooms(){
        return this.getAdjacentRooms().filter(t => t != "OOB" && t.passable);
    }

    getAdjacentRooms(){
        return shuffle([
            this.getRoom(0, -1),
            this.getRoom(0, 1),
            this.getRoom(-1, 0),
            this.getRoom(1, 0)
        ]);
    }

    getRoom(dx, dy){
        if (this.x + dx > 8 || this.x + dx < 0 || this.y + dy < 0 || this.y + dy > 8) return "OOB";
        else return worldgen[this.x + dx][this.y + dy];
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
    checkDirection(room){
        if (room.size == 9){
            if (this.y == 0) this.direction = "N";
            else if (this.x == 0) this.direction = "W";
            else if (this.x == room.size-1) this.direction = "E";
            else if (this.y == room.size-1) this.direction = "S";
        }
        else{
            if (this.y == 0 && this.x < 9) this.direction = "N";
            else if (this.x == 0 && this.y < 9) this.direction = "W";
            else if (this.y == 0 && this.x > 9) this.direction = "N2";
            else if (this.x == 0 && this.y > 9) this.direction = "W2";
            else if (this.x == room.size-1 && this.y < 9) this.direction = "EE";
            else if (this.x == room.size-1 && this.y > 9) this.direction = "E2";
            else if (this.y == room.size-1 && this.x > 9) this.direction = "S2";
            else if (this.y == room.size-1 && this.x < 9) this.direction = "SS";
        }
    }
}


class Floor extends Tile{
    constructor(x,y){
        super(x, y, 2, true);
        this.mutable = true;
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

class TrueFloor extends Floor{
    constructor(x,y){
        super(x,y,2,true);
        this.mutable = false;
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
        this.mutable = false;
    };

    stepOn(monster){
    }
}

class NoBreakWall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
        this.lore = description["Barrier"];
        this.name = "Apocalypse Barrier";
        this.eat = false;
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
    constructor(x,y,room){
        super(x, y, 17, false);
        this.lore = description["Seal"];
        this.name = "Soulsteel Seal";
        this.eat = false;
        this.id = 0;
        this.checkDirection(room);
        this.textures = {
            "N" : 84,
            "S" : 17,
            "W" : 83,
            "E" : 85
        }
        this.sprite = this.textures[this.direction[0]];
    }
}

class BAscendExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, false);
        this.lore = description["Seal"];
        this.name = "Soulsteel Seal";
        this.eat = false;
        this.id = 0;
        this.checkDirection(room);
        this.textures = {
            "N" : 84,
            "S" : 17,
            "W" : 83,
            "E" : 85
        }
        this.sprite = this.textures[this.direction[0]];
    }
}

class MapExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
        this.eat = false;
        this.checkDirection(room);
        this.textures = {
            "N" : 89,
            "S" : 86,
            "W" : 87,
            "E" : 88
        }
        this.sprite = this.textures[this.direction[0]];
    }
    stepOn(monster){
        if(monster.isPlayer){
            playSound("newLevel");
            this.monster = 0;
            world.saveRoom(world.getRoom());
            world.enterRoom(this.direction);
        }
    }
}

class AscendExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
        this.eat = false;
        this.checkDirection(room);
        this.textures = {
            "N" : 94,
            "S" : 91,
            "W" : 92,
            "E" : 93
        }
        this.sprite = this.textures[this.direction[0]];
    }
    stepOn(monster){
        if(monster.isPlayer){
            playSound("newLevel");
            this.monster = 0;
            world.saveRoom(world.getRoom());
            universe.passUp(universe.currentworld-1,this.direction);
        }
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
    constructor(x, y, quadrant){ //I hope this doesn't break anything
        super(x, y, 2, false);
        this.lore = description["Reality"];
        this.name = "Nonexistent Nullspace";
        this.sprite = 2;
        this.quadrant = quadrant;
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
                addScore(score, true); 
                showTitle();
            }else{
                level++;
                //startLevel(Math.min(maxHp, player.hp+2));
                sacritotal = "nan";
                rerolled = false;
                gameState = "running";
                rosetoxin = 0;
                //if (level == 17 && area == "Faith"){
                //    log.addLog("EpsilonWelcome1");
                //}
            }
        }
    }
}

class TermiExit extends Exit{
    constructor(x, y){
        super(x, y, 38, true);
        this.lore = description["TermiSeal"];
        this.name = "Hydraulic Gate";
        this.sprite = 38;
    }

    stepOn(monster){
        pauseAllMusic();
        super.stepOn(monster);
        //level+=14; //debug
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

class Plate extends Floor{
    constructor(x, y){
        super(x, y, 75, true);
        this.lore = description["Mobilizer"];
        this.name = "Automaton Mobilizer";
        this.sprite = 75;
    }
    stepOn(monster){
        wheel.complexity++;
        super.stepOn(monster);
    }
}

class Altar extends Floor{
    constructor(x,y){
        super(x, y, 30, true); //30
        this.value = new Empty();
        this.name = "Positive Harmonic Relay";
        this.lore = description["PosRelay"];
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.speed = 0.05;
        this.thrashcounter = 0;
    }

    getDisplayX(){                     
        return this.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.y + this.offsetY;
    }

    draw(){
        super.draw();
        if (!this.value.turbulent) drawSymbol(this.value.icon, this.x*tileSize+8, this.y*tileSize+8,48);
        else{
            this.thrashcounter++;
            if (this.thrashcounter > 10 && this.offsetX == 0 && this.offsetY == 0){
                let rt = randomRange(1,4);
                if (rt == 1) this.offsetX+= 0.1;
                else if (rt == 2) this.offsetX-= 0.1;
                else if (rt == 3)this.offsetY+= 0.1;
                else if (rt == 4)this.offsetY-= 0.1;
                this.thrashcounter = 0;
            }
            drawSymbol(this.value.icon, this.getDisplayX()*tileSize + shakeX+8,  this.getDisplayY()*tileSize + shakeY+8,48);
            ctx.globalAlpha = 1;
            this.offsetX -= Math.sign(this.offsetX)*(this.speed);     
            this.offsetY -= Math.sign(this.offsetY)*(this.speed);
        }
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

class CageWall extends Floor{
    constructor(x,y, dir){
        super(x, y, 107, true);
        this.lore = description["IvoryCage"];
        this.name = "Ivory Bars";
        this.direction = dir;
        this.sprite = 107;
        if (this.direction == "w") this.sprite += 2;
        else if (this.direction == "e") this.sprite += 0;
        else if (this.direction == "n") this.sprite += 1;
        else if (this.direction == "s") this.sprite -= 1;
    };
}

class FloorSoul extends Floor{ //unused
    constructor(x, y, type){
        super(x,y,100, true);
        const sprites = {
            "Saintly" : 0,
            "Ordered" : 1,
            "Artistic" : 2,
            "Unhinged" : 3,
            "Feral" : 4,
            "Vile" : 5, 
        }
        this.type = type;
        this.sprite = sprites[type];
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.speed = 0.05;
        this.thrashcounter = 0;
    }

    getDisplayX(){                     
        return this.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.y + this.offsetY;
    }

    draw(){
        this.thrashcounter++;
        if (this.thrashcounter > 10 && this.offsetX == 0 && this.offsetY == 0){
            let rt = randomRange(1,4);
            if (rt == 1) this.offsetX+= 0.1;
            else if (rt == 2) this.offsetX-= 0.1;
            else if (rt == 3)this.offsetY+= 0.1;
            else if (rt == 4)this.offsetY-= 0.1;
            this.thrashcounter = 0;
        }
        drawSymbol(this.sprite, this.getDisplayX()*tileSize + shakeX,  this.getDisplayY()*tileSize + shakeY,tileSize);
        ctx.globalAlpha = 1;
        this.offsetX -= Math.sign(this.offsetX)*(this.speed);     
        this.offsetY -= Math.sign(this.offsetY)*(this.speed);
    }
}

class CageContainer extends Altar{
    constructor(x, y){
        super(x,y,110, true);
        this.sprite = 110;
        this.lore = description["Floor"];
        this.name = "Eroded Floortiles";
        this.value = new Empty();
    }
}

class HypnoticProjector extends Floor{
    constructor(x, y){
        super(x,y,110, true);
        this.sprite = 110;
        this.lore = description["Floor"];
        this.name = "Hypnotic Projector";
        this.value = new Empty();
    }

    stepOn(monster){
        super.stepOn(monster);
        if(monster.isPlayer && world.cage.displayon){
            if (world.cage.pocketworld.rooms[this.x][this.y].corridor){
                player.move(getTile(player.tile.x - player.lastMove[0],player.tile.y - player.lastMove[1]));
                player.offsetX = 0;
                player.offsetY = 0;
            } 
            else if (world.cage.slots[this.x][this.y].id != "EMPTY") universe.passDown(world.depth+1, this.x, this.y);
        }
    }
}

class ResearchConnector extends Floor{
    constructor(x,y,type){
        super(x,y,110, true);
        const conn = {
            "ur" : 116,
            "ul" : 117,
            "dr" : 115,
            "dl" : 114,
            "u" : 112,
            "t" : 118,
            "s" : 113,    
        }
        this.sprite = conn[type];
        this.lore = description["Floor"];
        this.name = "Hypnotic Projector";
    }
}

class ResearchNode extends Floor{
    constructor(x,y,type){
        super(x,y,110, true);
        this.sprite = 111;
        this.contents = "abcdefghijklmnopqrstuvwxyz".indexOf(type);
        this.lore = description["Floor"];
        this.name = "Hypnotic Projector";
    }

    draw(){
        super.draw();
        drawSymbol(this.contents, this.x*tileSize+8, this.y*tileSize+8,48);
    }
}