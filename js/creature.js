class Creature{
    constructor(tile, species){
        this.species = species;

        if (this.species.includes("Airlock") && this.species.length == 8){
            this.direction = this.species[7];
            this.species = "Airlock";
            species = "Airlock";
        }
        this.sprite = speciesData[species]["sprite"];

        //this.hp = speciesData[species]["hp"];
        this.numberID = creaturesCreated;
        creaturesCreated++;
        allCreatures.push(this);

        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.souls = {
            "SAINTLY" : false,
            "ORDERED" : false,
            "ARTISTIC" : false,
            "UNHINGED" : false,
            "FERAL" : false,
            "VILE" : false,
        };
        if (speciesData[species]["tags"]) this.tags = new Set(speciesData[species]["tags"]);
        else this.tags = new Set();
        for (let i of Object.keys(speciesData[species]["souls"])){
            this.souls[i] = speciesData[species]["souls"][i];
        }
        this.lastMotion = [0, 0];
        this.tangible = true;
        if (this.hasTag("Intangible")) this.tangible = false;
        this.move(tile);

        this.editedData = { //keep this under "this.move" so not literally everything has a moved position
            "Position" : false,
            "Soul" : false,
            "Species" : false,
            "Opened" : false,
        }
    }

    trigger(event,assi){
        for (let j of this.loopThroughSouls()){
            if (j instanceof Soul) j.trigger(event,assi);
        }
    }

    getSouls(){
        let souls = [];
        for (let i of Object.keys(this.souls)) souls.push(this.souls[i]);
        return souls;
    }

    replaceSoul(caste,soul){
        if (soul){
            this.souls[caste] = soul.cloneSoul();
            this.souls[caste].owner = this;
        } 
        else this.souls[caste] = false;
        this.editedData["Soul"] = true;
    }

    addTag(tag){
        if (tag === "RealityAnchor") player.removeTag("RealityAnchor");
        this.tags.add(tag);
    }

    removeTag(tag){
        this.tags.delete(tag);
    }

    hasTag(tag){
        return this.tags.has(tag);
    }

    twinTags(tags){
        let anchor = false;
        if (this.hasTag("RealityAnchor")) anchor = true;
        this.tags = tags;
        if (anchor) this.addTag("RealityAnchor");
    }

    addSoulAtCaste(caste, soul){
        this.souls[caste] = soul;
        if (this === player) wheel.getMacros(); // TODO add a master "update soul stuff" function with getmacros, get new bindings, etc?
        this.editedData["Soul"] = true;
    }
    
    addSoul(soul){
        this.addSoulAtCaste(this.findFirstEmptySlot(), soul);
        this.editedData["Soul"] = true;
    }

    assimilateCaste(caste,payload){
        let target = this.souls[caste];
        if (!target) return;
        target.dropPayload(payload);
        this.editedData["Soul"] = true;
    }

    forceInjectAxiom(axiomType){
        let souls = this.getSouls();
        for (let i of souls) if (i && i.forceInjectAxiom(axiomType)) return true;
        return false;
    }

    reduceOffset(){
        if (Math.abs(this.offsetX) < 0.02) this.offsetX = 0;
        else {
            let anispeedX = Math.max(Math.abs(this.offsetX/5),0.04);
            this.offsetX = Math.sign(this.offsetX) * (Math.abs(this.offsetX)-anispeedX);
        }
        if (Math.abs(this.offsetY) < 0.02) this.offsetY = 0;
        else {
            let anispeedY = Math.max(Math.abs(this.offsetY/5),0.04);
            this.offsetY = Math.sign(this.offsetY) * (Math.abs(this.offsetY)-anispeedY);
        }
    }

    closeSelf(){
        if (this.editedData["Opened"]) this.editedData["Opened"] = "Closed";
        this.becomeTangible();
    }

    openSelf(){
        this.editedData["Opened"] = "Open";
        this.becomeIntangible();
        if (!this.doorTiles){
            this.representativeSprite.visible = false;
            this.doorTiles = new PIXI.Container;
            this.creaturecon.addChild(this.doorTiles);
            tileSize = 64;
            for (let i = 0; i<2; i++){
                let door = new FoxSprite(allsprites.textures['sprite'+speciesData[this.species]["sprite"]]);
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
                if (this.direction) door.rotation = rotate[this.direction];
                this.doorTiles.addChild(door);
            }
            drawPixel("black",0,0,64,this.creaturecon);
            this.creaturecon.children[this.creaturecon.children.length-1].alpha = 0;
            this.creaturecon.mask = this.creaturecon.children[this.creaturecon.children.length-1];
            this.creaturecon.doorMask = this.creaturecon.children[this.creaturecon.children.length-1]; // so we can remove it later
            //return;
            this.doorAnim = new PIXI.Ticker();
            this.doorAnim.start();
            this.doorAnim.add(() => {
                if (fastReload) return;
                if (!this.direction || this.direction == "E" || this.direction == "W" ){
                    if (this.doorTiles.children[0].y < 88 && !this.tangible){
                        this.doorTiles.children[0].y +=5;
                        this.doorTiles.children[1].y -=5;
                    }
                    else if (this.doorTiles.children[0].y > 32 && this.tangible){
                        this.doorTiles.children[0].y -=5;
                        this.doorTiles.children[1].y +=5;
                    }
                }
                else if (this.direction == "N" || this.direction == "S" ){
                    if (this.doorTiles.children[0].x < 88 && !this.tangible){
                        this.doorTiles.children[0].x +=5;
                        this.doorTiles.children[1].x -=5;
                    }
                    else if (this.doorTiles.children[0].x > 32 && this.tangible){
                        this.doorTiles.children[0].x -=5;
                        this.doorTiles.children[1].x +=5;
                    }
                } 
            });
        }
    }

    knockback(dir){
        let newTile = this.tile;
        const eqs = {
            "N" : [0,-1],
            "W" : [-1,0],
            "E" : [1,0],
            "S" : [0,1],
        }
        let direction = eqs[dir];
        while(true){
            let testTile = newTile.getNeighbor(direction[0], direction[1]);
            if(testTile && !testTile.tangibleCreature){
                newTile = testTile;
            }else{
                break;
            }
        }
        this.move(newTile);
    }

    setUpSprite(){
        this.creaturecon = new PIXI.Container();
        if (this === player){
            this.creaturecon.x = 8*tileSize;
            this.creaturecon.y = 8*tileSize;
        }
        let newSprite = new FoxSprite(allsprites.textures['sprite'+this.sprite]);
        newSprite.width = tileSize;
        newSprite.height = tileSize;
        
        this.creaturecon.addChild(newSprite);
        this.representativeSprite = newSprite;
        this.graphicsReady = true;
        if (this.hasTag("Invisible")) this.representativeSprite.visible = false;
        //remember when you looked for 2 hours for that one bug that made you drop 1 FPS every time Terminal passed a door and it turned
        //out to be that one tiny line under here that caused literal thousands of StatusDisplay to stack on top of each other? Now that was funny
    }

    inRangeOfPlayer(){
        return Math.abs(this.tile.x-player.tile.x) < 11 && Math.abs(this.tile.y-player.tile.y) < 11; 
    }

    extraConfig(){};

    loopThroughSouls(){
        let arr = [];
        for (let i of soulSlotNames){
            arr.push(this.souls[i]);
        }
        return arr;
    }

    findFirstEmptySlot(){
        for (let i of soulSlotNames){
            if (this.souls[i] === false) return i;
        }
        return false;
    }

    heal(damage){
        if (damage <= 0) return;
        this.hp = Math.min(4, this.hp+damage);
        this.updateHp();
    }

    getDisplayX(){                     
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.tile.y + this.offsetY;
    }

    drawHp(){
        if (!this.isInvincible && this.order < 0){
            for(let i=0; i<this.hp; i++){
                drawSprite(
                    9,
                    this.getDisplayX() + (i%8)*(2.7/16),   
                    this.getDisplayY() - Math.floor(i/8)*(2/16)
                );
            }
        }
    }

    rotate(dir){
        if (this === player){
            this.creaturecon.x = 8*tileSize;
            this.creaturecon.y = 8*tileSize;
        }
        else{
            this.creaturecon.x = 0;
            this.creaturecon.y = 0;
        }
        const rotate = {
            "S" : 0,
            "W" : Math.PI/2,
            "E" : 3*Math.PI/2,
            "N" : Math.PI,
        }
        const offset = {
            "S" : 0,
            "W" : tileSize,
            "E" : tileSize,
            "N" : tileSize,
        }
        this.representativeSprite.rotation = rotate[dir];
        if (dir == "W" || dir == "N") this.representativeSprite.x += offset[dir];
        if (dir == "E" || dir == "N") this.representativeSprite.y += offset[dir];
    }

    interactedBy(interactor){
        this.trigger("TAKE");
    }

    interactWith(target){
        this.trigger("GIVE");
        target.interactedBy(this);
    }

    canMove(tile){
        if (!tile) return false;
        else if (!this.tangible) return true;
        else if (!tile.tangibleCreature) return true;
        else return false;
    }

    tryMove(dx,dy){ // make teleport also pass through this but check what dx is and ignore dy
        let newTile = this.tile.getNeighbor(dx,dy);
        if(this.canMove(newTile)){
                this.move(newTile);
                return true;
            }
        else{
            this.interactWith(newTile.tangibleCreature);
            return false;
        }
    }

    changeSpecies(newSpecies){
        this.species = newSpecies;
        if (this.representativeSprite){
            this.representativeSprite.texture = (allsprites.textures['sprite'+speciesData[newSpecies]["sprite"]]);
            //if (speciesData[this.species]["invisible"]) this.representativeSprite.visible = false;
            //else this.representativeSprite.visible = true;
        }
        if (soulTree.trackedEntity === this) soulTree.updateSlots(this);
        //if (speciesData[newSpecies]["intangible"]) this.becomeIntangible(); // these are based on tags now
        //else this.becomeTangible();
        this.editedData["Species"] = true;

    }

    hit(damage,origin){  
        if (damage <= 0) return;          
        this.lastDamageCulprit = origin;
        this.hp -= damage;
        if(this.hp <= 0) this.die();
        this.updateHp();
    }

    die(){
        this.trigger("OBLIVION");
        this.changeSpecies("EntropicHusk");
        this.forceInjectAxiom(UnaffectedTag);
    }

    becomeIntangible(){
        if (this.tangible){
            this.tile.tangibleCreature = false;
            this.tile.intangibleCreatures.add(this);
        }

        this.tangible = false;
        //if (this.representativeSprite) this.representativeSprite.alpha = 0.3;
    }

    becomeTangible(){
        if (!this.tangible){
            this.tile.intangibleCreatures.delete(this);
            this.tile.tangibleCreature = this;
        }
        this.tangible = true;
        //if (this.representativeSprite) this.representativeSprite.alpha = 1;
    }

    reloadMove(tile){
        if(this.tile){
            this.editedData["Position"] = true;
            this.tile.stepOut(this);
            tile.stepOn(this);
        }
    }

    move(tile){
        let currentTileCoords = false;
        if(this.tile){
            this.editedData["Position"] = true;
            currentTileCoords = [this.tile.x,this.tile.y];
            this.tile.monster = null;
            this.tile.stepOut(this);
            if (fastReload){ // kind of ugly
                tile.monster = this;                             
                tile.stepOn(this);
                if (this.tile instanceof CenterTeleport && this === player){
                    let targetWorld = universe.findWorldByID(this.tile.destination);
                    let destPad = targetWorld.findTelepadByDest(world.id);
                    universe.passDown(floors.indexOf(this.tile.destination), destPad.x, destPad.y);
                }
                return;
            }
            if (this.animating && this === player){
                this.animating = false;
            }
            if (this === player) this.animating = true;
            this.offsetX = this.tile.x - tile.x;
            this.offsetY = this.tile.y - tile.y;
            this.anispeed = Math.min(1/6*(Math.abs(this.offsetX)+Math.abs(this.offsetY)),1);
        }
        tile.monster = this;                             
        tile.stepOn(this);
        let newTile = this.tile;
        if (currentTileCoords) this.lastMotion = [newTile.x - currentTileCoords[0], newTile.y - currentTileCoords[1]];

    }
}