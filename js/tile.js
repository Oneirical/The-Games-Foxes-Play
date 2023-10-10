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
        if (creature === player && this.getSpecies("DimensionWarp")){
            player.playerPassDown(); // temp remove
        }
    }

    getAllCreatures(){
        let creatures = [...this.intangibleCreatures];
        if (this.tangibleCreature) creatures.unshift(this.tangibleCreature);
        return creatures;
    }

    getSpecies(species){
        let creatures = this.getAllCreatures();
        for (let i of creatures) if (i.species === species) return i;
        return false;
    }

    isEmpty(){
        return !this.monster && this.passable;
    }

    hasNothing(){
        return !this.tangibleCreature && this.intangibleCreatures.size === 0;
    }

    setUpSprite(){
        return;
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
        this.type = type;
        this.num = num;
    };
}

class Floor extends Tile{
    constructor(x,y){
        super(x, y, 2, true);
    };
}

class Wall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
    };
}