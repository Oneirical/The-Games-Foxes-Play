class Tile{
    constructor(x, y, sprite, passable){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
        this.eat = true;
        this.souls = [];
        this.tileCon = new PIXI.Container();
        this.graphicsReady = false;
        this.paint = false; // rework this to become more creatures

        this.tangibleCreature = false;
        this.intangibleCreatures = new Set();
    }

    stepOut(creature){
        if (creature.tangible) this.tangibleCreature = false;
        else this.intangibleCreatures.delete(creature);
    };

    stepOn(creature){
        creature.tile = this;
        if (creature.tangible) this.tangibleCreature = creature;
        else this.intangibleCreatures.add(creature);
    }

    isEmpty(){
        return !this.monster && this.passable;
    }

    setUpSprite(){
        //if (this instanceof CageContainer) return;
        if (this.tileCon.children.length == 0) this.tileCon = new PIXI.Container();
        //tilesDisplay.notPlayerTiles.addChild(this.tileCon);
        //this.tileCon.x = (96*2/3*8)-(player.tile.x-this.x)*tileSize;
        //this.tileCon.y = (96*2/3*8)-(player.tile.y-this.y)*tileSize;
        let hai = this.sprite;
        let newSprite;
        if (this instanceof CageContainer){}
        else {

            newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
            newSprite.width = tileSize;
            newSprite.height = tileSize;
            if (newSprite){
                this.tileCon.addChild(newSprite);
                this.spriteDisplay = newSprite;
            }       
            if (this.sprite == 2){
                newSprite.visible = false;
            } 
        }

        //add traps here
        drawHitbox(tileSize/2, tileSize/2,tileSize,this.tileCon);
        this.hitBox = this.tileCon.children[this.tileCon.children.length-1];
        this.tileCon.eventMode = 'static';
        this.tileCon.on('pointerover', (event) => {
            this.hitBox.alpha = 0.4;
            //if (this.souls) for (let i of this.souls) i.absorbSoul(this,player); //debug
        });
        this.tileCon.on('pointerdown', (event) => {
            if (this.monster){
                console.log(this.monster);
                soulTree.updateSlots(this.monster);
                if (!wheel.displayCon.children.includes(wheel.wheelCon)) wheel.displayCon.addChild(wheel.wheelCon);
                if (wheel.currentSoulDisplayed) wheel.displayCon.removeChild(wheel.currentSoulDisplayed.displayCon);
            }
        });
        this.tileCon.on('pointerout', (event) => {
            this.hitBox.alpha = 0;
        });
        this.effect = false;
        this.graphicsReady = true;
        let effectFade = new PIXI.Ticker;
        effectFade.start();
        effectFade.add(() => {
            let i = this;
            if (i.effect){
                i.effect.alpha -= 0.02;
                if (i.effect.alpha <= 0){
                    i.tileCon.removeChild(i.effect);
                    i.effect = false;
                }
            }
        });
        // effect fading on tiles
    }

    setUpResearch(source){
        let hai = this.sprite;
        if (hai == 2) return;
        let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
        this.tileCon.x = this.x*64;
        this.tileCon.y = this.y*64;
        newSprite.width = 64;
        newSprite.height = 64;
        this.tileCon.addChild(newSprite);
        this.spriteDisplay = newSprite;
        source.addChild(this.tileCon);
    }

    tickTile(newTex){
        if (!newTex) return;
        if (!this.spriteDisplay) this.setUpSprite();
        this.spriteDisplay.texture = newTex;
        // if (this.clickTrap){
        //     this.clickTrap.lifetime--;
        //     if (this.clickTrap.lifetime <= 0){
        //         this.clickTrap.destroy();
        //         this.clickTrap = false; 
        //     }
        // }
    }

    replace(newTileType){
        tilesDisplay.removeChild(tiles[this.x][this.y].tileCon);
        tiles[this.x][this.y] = new newTileType(this.x, this.y);
        tiles[this.x][this.y].setUpSprite();
        tilesDisplay.setChildIndex(tiles[this.x][this.y].tileCon,0);
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
        if (this.x + dx > 4 ||this.x + dx < 0 ||this.y + dy < 0 || this.y + dy > 4) return "OOB";
        else return worldgen[this.x + dx][this.y + dy];
    }

    addSoulsOnFloor(){
        for (let i of this.souls){
            i.owner.creaturecon.x = 0;
            i.owner.creaturecon.y = 0;
            this.tileCon.addChild(i.owner.creaturecon);
            i.owner.creaturecon.alpha = 0.5;
            //new GlitchSprite(i.owner.creaturecon,3); // a little too laggy perhaps
        }
    }

    setEffect(effectSprite){
        this.tileCon.removeChild(this.effect);             
        this.effect = new FoxSprite(allsprites.textures["sprite"+effectSprite]);
        this.effect.width = 64;
        this.effect.height = 64;
        this.tileCon.addChild(this.effect);
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

class MarkedFloor extends Tile{
    constructor(x,y,type,num){
        super(x, y, 2, true);
        this.mutable = true;
        this.lore = entityDescription["Floor"];
        this.name = "Marked Tile";
        this.type = type;
        this.num = num;
    };
}

class Floor extends Tile{
    constructor(x,y){
        super(x, y, 2, true);
        this.mutable = true;
        this.lore = entityDescription["Floor"];
        this.name = "Eroded Floortiles";
    };
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
        this.lore = entityDescription["Floor"];
        this.name = "Eroded Floortiles";
        this.sprite = 57;
    };
}

class Ladder extends Floor{
    constructor(x,y){
        super(x, y, 58, true);
        this.lore = entityDescription["Floor"];
        this.name = "Eroded Floortiles";
        this.sprite = 58;
    };
}

class Goop extends Tile{
    constructor(x,y){
        super(x, y, 60, true);
        this.lore = entityDescription["Glamour"];
        this.name = "Glamorous Toxin";
        this.sprite = 60;
    };
}


class Wall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
        this.lore = entityDescription["Barrier"];
        this.name = "Apocalypse Barrier";
        this.mutable = false;
    };
}

class NoBreakWall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
        this.lore = entityDescription["Barrier"];
        this.name = "Apocalypse Barrier";
        this.eat = false;
    };
}

class AbazonWall extends Tile{
    constructor(x,y){
        super(x, y, 2, false);
        this.lore = entityDescription["Abazon"];
        this.name = "Terracotta Sentry";
        this.eat = false;
    };
}

class RoseWall extends Wall{
    constructor(x,y){
        super(x, y, 55, false);
        this.lore = entityDescription["Roseic"];
        this.name = "Roseic Blowglass";
        this.eat = false;
        this.sprite = 55;
    };
}

class BExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, false);
        this.lore = entityDescription["Seal"];
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
        this.lore = entityDescription["Seal"];
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
        this.lore = entityDescription["OpenSeal"];
        this.name = "Unraveled Seal";
        this.eat = false;
        this.checkDirection(room);
        this.textures = {
            "N" : 89,
            "S" : 86,
            "W" : 87,
            "E" : 88
        }
        if (!this.direction) this.sprite = 89;
        else this.sprite = this.textures[this.direction[0]];
    }
}

class AscendExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, true);
        this.lore = entityDescription["OpenSeal"];
        this.name = "Unraveled Seal";
        this.eat = false;
        this.checkDirection(room);
        this.textures = {
            "N" : 94,
            "S" : 91,
            "W" : 92,
            "E" : 93
        }
        this.sprite = this.textures["N"];
    }
}

class TermiWall extends Wall{
    constructor(x, y){
        super(x, y, 37, false);
        this.lore = entityDescription["Circuit"];
        this.name = "Tangled Circuits";
        this.sprite = 37;
    }
}

class RealityWall extends Wall{
    constructor(x, y, quadrant){ //I hope this doesn't break anything
        super(x, y, 2, false);
        this.lore = entityDescription["Reality"];
        this.name = "Nonexistent Nullspace";
        this.sprite = 2;
        this.quadrant = quadrant;
    }
}

class Exit extends Tile{
    constructor(x, y){
        super(x, y, 11, true);
        this.lore = entityDescription["OpenSeal"];
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
}

class TermiExit extends Exit{
    constructor(x, y){
        super(x, y, 38, true);
        this.lore = entityDescription["TermiSeal"];
        this.name = "Hydraulic Gate";
        this.sprite = 38;
    }

}

class FluffExit extends Exit{
    constructor(x, y){
        super(x, y, 23, true);
        this.lore = entityDescription["HarmonicSeal"];
        this.name = "Harmonic Seal";
        this.sprite = 23;
    }
}

class Booster extends Exit{
    constructor(x, y){
        super(x, y, 59, true);
        this.lore = entityDescription["HarmonicSeal"];
        this.name = "Harmonic Seal";
        this.sprite = 59;
    }
}

class Airlock extends Tile{
    constructor(x,y){
        super(x, y, 2, false);
        this.lore = entityDescription["Abazon"];
        this.name = "Terracotta Sentry";
        this.eat = false;
    };

    interact(){
        this.open();
    }

    findDirection(){
        if (this.direction) return;
        const directions = {
            "N" : [0,-1],
            "W" : [-1,0],
            "E" : [1,0],
            "S" : [0,1],
        };
        for (let i of Object.keys(directions)){
            let nextTile;
            if (this.existSpace[this.x+directions[i][0]] && this.existSpace[this.x+directions[i][0]][this.y+directions[i][1]]) nextTile = this.existSpace[this.x+directions[i][0]][this.y+directions[i][1]];
            if (nextTile instanceof Airlock){
                this.direction = i;
                break;
            }
        }
        if (!this.direction){
            this.existSpace[this.x][this.y] = new NoBreakWall(this.x, this.y); // this is a little gory, replace later with "filler" tile
            //this.existSpace[this.x][this.y].setUpSprite();
        }
    }

    setUpSprite(){
        this.doorTiles = new PIXI.Container();
        super.setUpSprite();
        this.tileCon.addChild(this.doorTiles);
        let door;
        for (let i = 0; i<2; i++){
            door = new FoxSprite(allsprites.textures['sprite'+(17)]);
            door.width = tileSize;
            door.height = tileSize;
            door.anchor.set(0.5,0.5);
            door.x = tileSize/2;
            door.y = tileSize/2;
            const rotate = {
                "S" : 0,
                "W" : Math.PI/2,
                "E" : 3*Math.PI/2,
                "N" : Math.PI,
            }
            door.rotation = rotate[this.direction];
            this.doorTiles.addChild(door);
        }
        drawPixel("black",0,0,tileSize,this.tileCon);
        this.tileCon.children[this.tileCon.children.length-1].alpha = 0;
        this.tileCon.mask = this.tileCon.children[this.tileCon.children.length-1];
        this.doorAnim = new PIXI.Ticker();
        this.doorAnim.start();
        this.doorAnim.add(() => {
            if (fastReload) return;
            if (this.direction == "N" || this.direction == "S" ){
                if (this.doorTiles.children[0].x < 90 && this.passable){
                    this.doorTiles.children[0].x +=3;
                    this.doorTiles.children[1].x -=3;
                }
                else if (this.doorTiles.children[0].x > 32 && !this.passable){
                    this.doorTiles.children[0].x -=3;
                    this.doorTiles.children[1].x +=3;
                }
            }
            else if (this.direction == "W" || this.direction == "E" ){
                if (this.doorTiles.children[0].y < 90 && this.passable){
                    this.doorTiles.children[0].y +=3;
                    this.doorTiles.children[1].y -=3;
                }
                else if (this.doorTiles.children[0].y > 32 && !this.passable){
                    this.doorTiles.children[0].y -=3;
                    this.doorTiles.children[1].y +=3;
                }
            }
        }); 
    }

    open(){

        this.passable = true;

    }
}

class Plate extends Floor{ //delete later
    constructor(x, y){
        super(x, y, 75, true);
        this.lore = entityDescription["Mobilizer"];
        this.name = "Automaton Mobilizer";
        this.sprite = 75;
    }
}

class Altar extends Floor{
    constructor(x,y){
        super(x, y, 30, true); //30
        this.value = new Empty();
        this.name = "Positive Harmonic Relay";
        this.lore = entityDescription["PosRelay"];
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.speed = 0.05;
    }

    getDisplayX(){                     
        return this.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.y + this.offsetY;
    }
}


class PosAltar extends Altar{
    constructor(x,y){
        super(x, y, 30, true); //30
        this.value = new Empty();
        this.sprite = 30;
        this.name = "Positive Harmonic Relay";
        this.lore = entityDescription["PosRelay"];
    }
}

class NegAltar extends Altar{
    constructor(x,y){
        super(x, y, 31, true); //31
        this.name = "Negative Harmonic Relay";
        this.sprite = 31;
        this.lore = entityDescription["NegRelay"];
        this.value = new Empty();
    }

}

class BetAltar extends Altar{
    constructor(x,y){
        super(x, y, 43, true); 
        this.name = "Soulscribe";
        this.sprite = 43;
        this.lore = entityDescription["Soulscribe"];
        this.value = new Empty();
    }
}

class RoseThrone extends Wall{
    constructor(x, y){
        super(x, y, 61, false);
        this.lore = entityDescription["Rose"];
        this.name = "Rose, Last of the Saints";
        this.sprite = 61;
    }
}

class SereneThrone extends Wall{
    constructor(x, y){
        super(x, y, 26, false);
        this.lore = entityDescription["Harmonizer"];
        this.name = "Serene Harmonizer";
        this.sprite = 26;
    }
}

class RoseServant extends Wall{
    constructor(x, y){
        super(x, y, 62, false);
        this.lore = entityDescription["RoseS"];
        this.name = "Tangled Servitor";
        this.sprite = 62;
    }
}

class RoseSpawner extends Tile{
    constructor(x, y){
        super(x, y, 63, true);
        this.lore = entityDescription["RoseSpawn"];
        this.name = "Aleatory Teleconstructor";
        this.sprite = 63;
    }
}

class Mobilizer extends Tile{
    constructor(x, y){
        super(x, y, 75, true);
        this.lore = entityDescription["Mobilizer"];
        this.name = "Automaton Mobilizer";
        this.sprite = 75;
    }
}

class CageWall extends Floor{
    constructor(x,y, dir){
        super(x, y, 107, true);
        this.lore = entityDescription["IvoryCage"];
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
    }

    getDisplayX(){                     
        return this.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.y + this.offsetY;
    }
}

class CageContainer extends Altar{
    constructor(x, y){
        super(x,y,2, true);
        this.sprite = 2;
        this.lore = entityDescription["Floor"];
        this.name = "Eroded Floortiles";
        this.value = new Empty();
        this.seq = 0;
        this.spritesave = 0;
    }
}

class CenterTeleport extends CageContainer{
    constructor(x,y){
        super(x,y);
    }
}

class HypnoticProjector extends Floor{
    constructor(x, y){
        super(x,y,110, true);
        this.sprite = 110;
        this.lore = entityDescription["Hypno"];
        this.name = "Hypnotic Projector";
        this.value = new Empty();
    }
}

class ResearchConnector extends Floor{
    constructor(x,y,type,page){
        super(x,y,110, true);
        const conn = {
            "ur" : 116,
            "ul" : 117,
            "dr" : 115,
            "dl" : 114,
            "u" : 112,
            "t" : 118,
            "s" : 113,
            "+" : 119,
            "K" : 127,
            "Y" : 128,
            "J" : 127,
        }
        this.page = page;
        this.sprite = conn[type];
        this.lore = entityDescription["Floor"];
        this.name = "hai";
        this.connectType = type;
    }

    setUpResearch(source){
        super.setUpResearch(source);
        if (this.connectType == "J"){
            this.tileCon.rotation = Math.PI;
            this.tileCon.x += 64;
            this.tileCon.y += 64;
        }
        let wai = new PIXI.filters.GrayscaleFilter();
        this.tileCon.filters = [wai];
        this.tileCon.alpha = 0.3;
    }
}

const inside = {
    "Research" : 67,
    "Form" : 68,
    "Function" : 69,
    "Mutator" : 70,
    "Contingency" : 72,
    "Influence" : 71,
    "Structures" : 73,
    "RoseQuest" : 75,
    "Song" : 76,
    "Cage" : 35,
    "Herald" : 37,
    "Intro" : 36,
    "Turbulent" : 28,
    "Subdued" : 13,
    "Breath" : 33,
    "Seed" : 24,
    "Vision" : 26,
    "Security" : 1,
    "Shattered" : 49,
    "Estate" : 14,
    "PCage" : 39,
    "Craft" : 74,
    "Spellcast" : 40,
    "GYVJI" : 27,
    "SENET" : 8,
    "EGO" : 29,
    "BEAM" : 66,
    "PARACEON" : 41,
    "SMOOCH" : 17,
    "ASPHA" : 18,
    "CLICK" : 30,
    "KASHIA" : 43,
    "SACRIFICE" : 42,
    "STEP" : 32,
    "XCROSS" : 38,
    "EPSILON" : 44,
    "Brush" : 65,
    "STOP" : 20,
    "Saintly" : 0,
    "Ordered" : 1,
    "Unhinged" : 3,
    "Feral" : 4,
    "Vile" : 5,
    "Artistic" : 2,
    "JOLTZAZON" : 15,
    "PURPIZUG" : 16,
    "SHIZAPIS" : 20,
    "RASEL" : 25,
    "ABAZON" : 22,
    "Axioms" : 6,
    
    
    "ZENORIUM" : 65,
}

class ResearchNode extends Floor{
    constructor(x,y,type, page){
        super(x,y,110, true);
        this.sprite = 111;
        this.page = page;
        this.letter = type;
        this.axiomComponent = false;
        let source = 0;
        if (page > 0) source = 1;
        const castePages = {
            1 : "S",
            2: "O",
            3: "A",
            4 : "U",
            5 : "F",
            6: "V"
        }
        if (researchequivalences[source][type]) this.id = researchequivalences[source][type];
        if (this.id == "Caste"){
            this.id = shuffle(casteNodes)[0];
            removeItemOnce(casteNodes,this.id);
        }
        if (this.id == "INITIAL"){
            const casteTabNum = {
                1 : "EGO",
                2 : "PARACEON",
                3 : "GYVJI",
                4 : "BEAM",
                5 : "BLINK",
                6 : "HARM"
            }
            this.id = casteTabNum[page];
        }
        //if (Object.keys(nodeloot).includes(this.id)){
        //    this.axiomComponent = this.id;
        //    let axiomType = lootPool[this.id][castePages[page]];
        //    this.id = shuffle(lootPool[this.id][castePages[page]])[0];
        //    removeItemOnce(axiomType,this.id);
        //}
        this.lore = researchlore[this.id];
        this.name = researchnames[this.id];
        this.flags = researchflags[this.id];
        this.description = researchexpl[this.id];
        this.unlock = researchunlocks[this.id];
        if (!this.unlock) this.unlock = researchunlocks["None"];
        this.discovered = false;
        this.completed = false;
        if (this.id == "Research") this.discovered = true;

        this.contents = inside[this.id];
    }

    discoverNode(){
        if (this.id == "Vision" && !(research.knownnodes.includes("Seed") && research.knownnodes.includes("Brush"))) return;
        else if (this.id == "Axioms" && !(research.knownnodes.includes("Form") && research.knownnodes.includes("Function"))) return;
        this.tileCon.alpha = 1;
        this.discovered = true;
        if (this.axiomComponent) this.innerSymbol.texture = (allsprites.textures['icon'+inside[this.id]]);
        if (this.page > 0 && !research.knownSpells.includes(this.id)) research.knownSpells.push(this.id);
        if (["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"].includes(this.id)){
            research.tabs[["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"].indexOf(this.id)+1][7][7].discoverNode();
            research.tabContainer.children[["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"].indexOf(this.id)+1].visible = true;
        }
    }

    completeNode(){
        this.completed = true;
        this.sprite = 120;
    }

    setUpResearch(source){
        let hai = 7;
        if (this.axiomComponent && !this.discovered){
            const typeSymbols = {
                "FORM" : 68,
                "FUNCTION" : 69,
                "MUTATOR" : 70,
                "CONTINGENCY" : 72,
            }
            hai = typeSymbols[this.axiomComponent];
        }
        else if (this.id) hai = inside[this.id];
        let newSprite = new FoxSprite(allsprites.textures['icon'+hai]);
        newSprite.width = 48;
        newSprite.x = 8;
        newSprite.y = 8;
        this.tileCon.alpha = 0.3;
        newSprite.height = 48;
        this.tileCon.addChild(newSprite);
        this.innerSymbol = newSprite;
        super.setUpResearch(source);
        this.spriteDisplay.eventMode = 'static';
        this.spriteDisplay.on('pointerover', (event) => {
            research.descriptionBox.getDescription(this);
            let wai = new PIXI.filters.GlowFilter();
            wai.outerStrength = 1;
            this.tileCon.filters = [wai];
        });
        this.spriteDisplay.on('pointerout', (event) => {
            this.tileCon.filters = [];
        });
    }
}

class Window extends Wall{
    constructor(x, y){
        super(x, y, 129, false);
        this.lore = entityDescription["Barrier"];
        this.name = "Apocalypse Barrier";
        this.mutable = false;
        this.sprite = 129;
    };
}