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

    toSaveFormat(){
        return this.z +";"+ this.x + ";" + this.y;
    }

    inRangeOfPlayer(){
        return Math.abs(this.x-player.tile.x) < 11 && Math.abs(this.y-player.tile.y) < 11; 
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
    }

    //formule de distance merci discord
    dist(other){
        return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
    }

    getNeighbor(dx, dy){
        return getTile(this.x + dx, this.y + dy, this.z);
    }

    getAdjacentNeighbors(){
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ].filter(t => t));
    }

    getLateralNeighbors(){
        return shuffle([
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ].filter(t => t));
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
        ].filter(t => t));
    }

    getAdjacentPassableNeighbors(){
        return this.getAdjacentNeighbors().filter(t => t.passable);
    }

    getAdjacentEmptyNeighbors(){
        return this.getAdjacentNeighbors().filter(t => !t.tangibleCreature);
    }

    getAdjacentAffectedNeighbors(){
        return this.getAdjacentNeighbors().filter(t => !t.tangibleCreature || !t.tangibleCreature.hasTag("Unaffected"));//yikes, this is ugly
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
        //this.z = z; // depth value (which world)
    };
}

class Wall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
        //this.z = z;
    };
}