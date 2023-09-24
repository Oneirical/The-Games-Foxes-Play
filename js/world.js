class CageTemplate{
    constructor(){
        this.slots = [];
        this.tier = 0;
        this.pocketworld;
        this.size = 1;
    }

    generateWorld(){
        if (universe.currentworld == 1) this.pocketworld = universe.worlds[2];
        else if (universe.currentworld == 0) this.pocketworld = universe.worlds[1];
        this.displayon = true;
    }
}

class Universe{
    constructor(){
        this.worlds = [];
        this.currentworld = 0;
    }

    start(){
        tiles = [];
        monsters = [];
        for (let x = 0; x<floors.length; x++){
            this.worlds[x] = new World(x);
            this.worlds[x].layer = x;
            this.worlds[x].id = floors[x];
            this.worlds[x].buildStyle = floorStyles[this.worlds[x].id];
        }
        this.currentworld = 0;
        world = this.worlds[this.currentworld];
        for (let x = 0; x<floors.length; x++){
            this.worlds[x].worldBuilding();
        }
        assignSouls();
        world.currentroom = [0,2];
        world.tranquil = true;
        world.playRoom(world.rooms[2][0]);
        drawTiles();
        drawSprites();
    }

    findWorldByID(id){
        for (let i of this.worlds) if (i.id == id) return i;
    }

    passDown(layer, spawnx, spawny){
        universe.zooming = true;
        this.zoomAnim = new PIXI.Ticker;
        this.currentworld = layer;
        this.zoomAnim.start();
        tilesDisplay.mask = tilesDisplay.maskReference;
        this.viewport = new pixi_viewport.Viewport({
            screenWidth: 1152-64,
            screenHeight: 1152-64,
            events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        })
        tilesDisplay.addChild(this.viewport)
    
        this.viewport
            .animate({
                width: 1143/9,
                time: 700,
            })
    
    
        this.viewport.addChild(tilesDisplay.notPlayerTiles);
        tilesDisplay.addChild(player.creaturecon);
        this.zoomAnim.add(() => {
            if (this.viewport.width >= 9869){
                this.handleDescent(layer, spawnx, spawny);
                universe.zooming = false;
                this.zoomAnim.stop();
            }
        });
    }

    handleDescent(layer, spawnx, spawny){
        
        uiDisplayLeft.removeChild(world.displayCon);
        player.tile.monster = null;
        world.saveRoom(world.playSpace);
        this.worlds[layer-1] = world;
        let spawnCoords = [spawnx, spawny];
        world = this.worlds[layer];
        world.currentroom = spawnCoords;
        monsters.push(player);
        world.appearRoom([spawnx,spawny]);
        world.setUpSprites();
        uiDisplayLeft.addChild(world.displayCon);
        tilesDisplay.addChild(player.creaturecon);
        tickProjectors();
        world.cage.generateWorld()
        world.cage.pocketworld.hypnoDisplay();

        for (let i of monsters){
            for (let j of i.loopThroughSouls()){
                if (!j) continue;
                for (let r of j.axioms){
                    for (let p of r){
                        p.translate();
                    }
                }
            }
        }
    }

    passUp(layer){
        universe.zooming = true;
        this.layeredInfluence.delete(world.influence);
        uiDisplayLeft.removeChild(world.displayCon);
        player.tile.monster = null;
        world.saveRoom(world.playSpace);

        let locspawn = [4,5];
        let receivereward = true;
        for(let j=0;j<5;j++){
            for(let i=0;i<5;i++){
                if (world.rooms[i][j].visited == false && world.rooms[i][j].id != "Void") receivereward = false;
            }
        }
        let reward = false;
        if (world.reward["Sequence"].length > 0 && receivereward) reward = new Axiom(world.reward["Sequence"],shuffle(world.reward["Caste"])[0],world.reward["Potency"]);
        if (reward){
            research.completeResearch("Craft");
            for (let i of world.reward["Sequence"]){
                research.completeResearch(i);
                research.completeResearch(spellpatterns[i]["type"]);
                research.completeResearch(spellpatterns[i]["caste"]);
            }
        }
        this.currentworld = layer;
        this.worlds[layer+1] = world;
        world = this.worlds[layer];
        world.currentroom = [4, 5]; // this will have to be replaced with the cage location
        //world.cage.displayon = false;
        world.appearRoom(locspawn);
        player.offsetX = -motionsave[0];
        player.offsetY = -motionsave[1];

        if (reward){
            for(let j=0;j<5;j++){
                for(let i=0;i<5;i++){
                    world.cage.slots[i][j] = new Empty();
                }
            }
            world.cage.slots[4][4] = reward;
            world.cage.size = 1;
        }
        world.cage.pocketworld.reward = {
            "Sequence" : [],
            "Caste" : "",
            "Potency" : 0,
        }
        //world.cage.legendCheck();
        world.setUpSprites();
        uiDisplayLeft.addChild(world.displayCon);
        world.cage.pocketworld.hypnoDisplay();
        this.zoomAnim.destroy();
        this.zoomAnim = new PIXI.Ticker;
        this.zoomAnim.start();
        tilesDisplay.mask = tilesDisplay.maskReference;
        this.viewport = new pixi_viewport.Viewport({
            screenWidth: 1152-64,
            screenHeight: 1152-64,
            events: app.renderer.events
        })
        tilesDisplay.addChild(this.viewport)
    
        this.viewport.animate({
            width: (1143)/9,
            time: 0,
        })
    
        this.viewport.addChild(tilesDisplay.notPlayerTiles);
        tilesDisplay.addChild(player.creaturecon);
        this.zoomAnim.add(() => {
            if (this.viewport.width >= 9869){
                this.viewport
                .animate({
                    width: (1143),
                    time: 1000,
                })
                universe.zooming = false;
                this.zoomAnim.destroy();
            }
        });
    }
}

class World{
    constructor(depth){
        this.cageCorner;
        this.cageLocation = [2,4];
        this.rooms;
        this.buildStyle = "Vault";
        this.cage = new CageTemplate();
        this.layer = depth;
        this.name = "World Seed";
        this.id = "WorldSeed";
        this.establishedPaths = []; // how many telepads have been linked
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*4;
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,10,this.displayCon);
        this.setUpMap();
    }

    getComps(i,j){
        return this.exppage.cage[i][j].value.type;
    }

    findTelepadByDest(dest){
        for (let i of this.establishedPaths) if (i.destination == dest) return i;
    }

    setUpMap(){
        this.mapCon = new PIXI.Container();
        let size = 112;
        drawPixel("black",0,0,112*9,this.mapCon);
        this.mapCon.children[0].alpha = 0.0;
        this.roomsInMap = new PIXI.Container();
        this.mapCon.addChild(this.roomsInMap);
        for(let y = 0; y<5;y++){
            for(let x = 0; x<5;x++){
                if (this.rooms[x][y].tangible && this.rooms[x][y].displayCon){
                    this.rooms[x][y].displayCon.x = x*size;
                    this.rooms[x][y].displayCon.y = y*size;
                    this.roomsInMap.addChild(this.rooms[x][y].displayCon);
                }
            }
        }
        this.roomsInMap.x += 24;
        this.roomsInMap.y += 24;
        //this.roomsInMap.scale.set(0.95,0.95);
        this.mapCon.width = 32*15;
        this.mapCon.height = 32*15;
        //this.mapCon.pivot.set(1/2,1/2);
        this.displayCon.addChild(this.mapCon);

        this.playerMarker = new FoxSprite(allsprites.textures["sprite0"]);
        this.playerMarker.width = 112/9;
        this.playerMarker.height = 112/9;
        this.mapCon.addChild(this.playerMarker);
    }

    tickMap(){
        this.playerMarker.x = player.tile.x*112/9+world.getRoom().index[0]*112+(2*(112/9));
        this.playerMarker.y = player.tile.y*112/9+world.getRoom().index[1]*112+(2*(112/9));

    }

    hypnoDisplay(){
        let xindic = 3;
        let yindic = 3;
        for(let y = this.cageLocation[1]-1; y<this.cageLocation[1]+2;y++){
            for(let x = this.cageLocation[0]-1; x<this.cageLocation[0]+2;x++){
                drawPixel("black",0,0,64,tiles[world.cageCorner[0]+xindic][world.cageCorner[1]+yindic].tilecon);
                if (!this.rooms[x] || !this.rooms[x][y]){
                    xindic++;
                    continue;
                } 
                if (this.rooms[x][y].tangible){
                    this.rooms[x][y].displayCon.width = 64;
                    this.rooms[x][y].displayCon.height = 64;
                    this.rooms[x][y].displayCon.x = 0;
                    this.rooms[x][y].displayCon.y = 0;
                    tiles[world.cageCorner[0]+xindic][world.cageCorner[1]+yindic].tilecon.addChild(this.rooms[x][y].displayCon);                    
                }
                xindic++;
            }
            yindic++;
            xindic = 3;
        }
    }

    vaultBuild(){
        let vault = this.id;
        if (!vault) throw new Error("This world, at depth "+ this.layer +" has no ID.")
        if (vault == "Epsilon"){
            this.cageLocation = [2,6];
        }
        this.cageCorner = [this.cageLocation[0]*9,this.cageLocation[1]*9];
        this.rooms = [];
        for(let i=0;i<5;i++){
            this.rooms[i] = [];
            for(let j=0;j<5;j++){
                let flip = false;
                let roomType;
                if (genstruct[vault]["keys"]) roomType = genstruct[vault]["keys"][genstruct[vault][j][i]];
                else roomType = keyroom[genstruct[vault][j][i]];
                if (genstruct[vault][j][i] == "H") flip = true;
                try{
                    this.rooms[i][j] = new roomType([i,j]);
                }
                catch (err) {throw new Error("Unknown room glyph: "+ genstruct[vault][j][i])}
                this.rooms[i][j].sourceWorld = this;
                if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,0);
                this.rooms[i][j].insertRoom(this.depth);
                if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,0);
            }
        }
        this.depositTiles = [];
        this.depositCreatures = [];
        for(let i=0;i<45;i++){
            this.depositTiles[i] = [];
        }
        for(let i=0;i<5;i++){
            for(let j=0;j<5;j++){
                if ("Facility" == "Facility"){//replace this if more vaults get added
                    if (this.rooms[i][j] instanceof WorldSeed) this.rooms[i][j].filler = TermiWall;
                    else this.rooms[i][j].filler = Wall;
                }
                for(let x=0;x<this.rooms[i][j].size;x++){
                    for(let y=0;y<this.rooms[i][j].size;y++){
                        this.depositTiles[i*9+x][j*9+y] = this.rooms[i][j].tiles[x][y];
                    }
                }
                for (let u of this.rooms[i][j].monsters){
                    u.room = this.rooms[i][j];
                    this.depositCreatures.push(u);
                }
                this.rooms[i][j].layer = this.layer;
            }
        }
        this.playSpace = new HugeMap([0,0],this);
        for(let i=0;i<45;i++){
            for(let j=0;j<45;j++){
                this.playSpace.tiles[i][j].existSpace = this.playSpace.tiles;
                this.playSpace.tiles[i][j].x = i;
                this.playSpace.tiles[i][j].y = j;            
            }
        }
        for(let i=0;i<45;i++){
            for(let j=0;j<45;j++){   
                if (this.playSpace.tiles[i][j] instanceof Airlock) this.playSpace.tiles[i][j].findDirection();        
            }
        }
    }

    blockBuild(){
        tryTo('generate a world', function(){
            return world.generateWorld() == randomPassableRoom().getConnectedRooms().length;
        });
        this.rooms = [];
        this.blessRooms();
        for(let i=0;i<5;i++){
            this.rooms[i] = [];
            for(let j=0;j<5;j++){
                if (worldgen[i][j].passable){
                    let roomType;
                    let flip = false;
                    let corridor = false;
                    if (worldgen[i][j] instanceof MarkedFloor){
                        const roo = worldgen[i][j];
                        let place = roo.type;
                        if (roo.num != 0) place += roo.num;
                        roomType = new DefaultVaultRoom([i,j],place);
                    }
                    //if ((j == 8 && i == 4) || (j == 4 && i == 8) ||(j == 0 && i == 4) ||(j == 4 && i == 0)) roomType = EmptyFaith;
                    //else if (j == 4 && i == 4) roomType = PlateGenerator;
                    else if (j < 4 && j > 0 && worldgen[i][j+1].passable && worldgen[i][j-1].passable){
                        if ((i == 4 || !worldgen[i+1][j].passable) && (i == 0 || !worldgen[i-1][j].passable)){
                            roomType = shuffle([NarrowFaith,BridgeFaith])[0];
                            corridor = true;
                        }
                        else roomType = EmptyFaith;
                        
                    }
                    else if (i < 4 && i > 0 && worldgen[i+1][j].passable && worldgen[i-1][j].passable){
                        if ((j == 4 || !worldgen[i][j+1].passable) && (j == 0 || !worldgen[i][j-1].passable)){
                            roomType = shuffle([NarrowFaith,BridgeFaith])[0];
                            corridor = true;
                        }
                        else roomType = EmptyFaith;
                        flip = true;
                        
                    }
                    //else if (Math.random() < 0.3 && (i+1 == 9 || !worldgen[i+1][j].passable) + (i-1 == -1 || !worldgen[i-1][j].passable) + (j+1 == 9 || !worldgen[i][j+1].passable) + (j-1 == -1 || !worldgen[i][j-1].passable == 3)){
                    //    roomType = HarmonyRelay;
                    //}
                    else roomType = EmptyFaith;
                    if (!(worldgen[i][j] instanceof MarkedFloor)) this.rooms[i][j] = new roomType([i,j]); // kind of cursed
                    else this.rooms[i][j] = roomType;
                    this.rooms[i][j].sourceWorld = this;
                    let times = shuffle([-1,0,1])[0];
                    if (corridor) times = 0;
                    if (rooms[this.rooms[i][j].id]["tags"].includes("randomflip") && !corridor) flip = true;
                    if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,times);
                    this.rooms[i][j].insertRoom(this.depth);
                    if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,times);
                    if (corridor && flip) this.rooms[i][j].verticality = "side";
                    else if (corridor) this.rooms[i][j].verticality = "up";
                }
                else{
                    this.rooms[i][j] = new VoidRoom([i,j]);
                    this.rooms[i][j].insertRoom(this.depth);
                }
            }
        }
        this.depositTiles = [];
        this.depositCreatures = [];
        for(let i=0;i<45;i++){
            this.depositTiles[i] = [];
        }
        for(let i=0;i<5;i++){
            for(let j=0;j<5;j++){
                for(let x=0;x<this.rooms[i][j].size;x++){
                    for(let y=0;y<this.rooms[i][j].size;y++){
                        this.depositTiles[i*9+x][j*9+y] = this.rooms[i][j].tiles[x][y];
                    }
                }
                for (let u of this.rooms[i][j].monsters){
                    u.room = this.rooms[i][j];
                    this.depositCreatures.push(u);
                    if (this.layer == 0) throw new Error("WTF");
                }
                this.rooms[i][j].layer = this.layer;
            }
        }        
        this.generated = true;
        this.playSpace = new HugeMap([0,0],this);
        for(let i=0;i<45;i++){
            for(let j=0;j<45;j++){
                this.playSpace.tiles[i][j].existSpace = this.playSpace.tiles;
                this.playSpace.tiles[i][j].x = i;
                this.playSpace.tiles[i][j].y = j;            
            }
        }
        for(let i=0;i<45;i++){
            for(let j=0;j<45;j++){   
                if (this.playSpace.tiles[i][j] instanceof Airlock) this.playSpace.tiles[i][j].findDirection();        
            }
        }
    }

    worldBuilding(){
        switch (this.buildStyle){
            case "Vault":
                this.vaultBuild();
                break;
            case "Blocks":
                this.blockBuild();
                break;
        }
    }

    blessRooms(){
        const specialTypes = {
            "Epsilon" : 2,
            "HarmonicTransport" : 1,
            "ScarabWaypoint" : 1,
            "ScarabFactory" : 1,
            "Garnison" : 1,
            "VileTransport" : 1,
            "ScarabSample" : 1,
        }
        let usable = [];
        for (let i of worldgen){
            for (let j of i){
                if (j.name == "Eroded Floortiles") usable.push(j);
            }
        }
        for (let r of Object.keys(specialTypes)){
            const size = specialTypes[r];
            let randomized = shuffle(usable);
            let chosen;
            for (let i of randomized){
                if (i.x+size <= 5 && i.y+size <= 5 && i.x-size >= -1 && i.y-size >= -1){
                    chosen = i;
                    break;
                }
            }
            const chX = chosen.x;
            const chY = chosen.y;
            for (let i = 0; i<size;i++){
                for (let j = 0; j<size;j++){
                    removeItemOnce(usable,worldgen[chX+i][chY+j]);
                    worldgen[chX+i][chY+j] = new MarkedFloor(chX+i,chY+j,r,i+j*size+1);
                    if (size == 1) worldgen[chX+i][chY+j].num = 0;
                    if (r == "HarmonicTransport"){
                        this.cageLocation = [chX+i,chY+j];
                        this.cageCorner = [this.cageLocation[0]*9,this.cageLocation[1]*9];
                    }
                    else if (r == "ScarabWaypoint"){
                        this.waypointLocation = [chX*9+4,chY*9+4];
                    }
                }
            }
        }
    }

    generateCage(){
        let passableRooms=0;
        worldgen = [];
        for(let i=0;i<5;i++){
            worldgen[i] = [];
            for(let j=0;j<5;j++){
                if (this.cage.slots[i][j] instanceof Empty) worldgen[i][j] = new Wall(i,j);
                else{
                    worldgen[i][j] = new Floor(i,j);
                    passableRooms++;
                } 
            }
        }
        return passableRooms;
    }

    generateWorld(){
        let passableRooms=0;
        worldgen = [];
        for(let i=0;i<5;i++){
            worldgen[i] = [];
            for(let j=0;j<5;j++){
                if(false){
                    worldgen[i][j] = new Wall(i,j); // ridiculous, but ingenious!
                    //passableRooms++;
                }
                else if(Math.random() < 0.4){
                    worldgen[i][j] = new Wall(i,j);
                }
                else{
                    worldgen[i][j] = new Floor(i,j);
                    passableRooms++;
                }
            }
        }
        return passableRooms;
    }

    playRoom(room){
        if (!room.playerspawn) room.playerspawn = [4,4];
        tiles = room.tiles;
        if (room instanceof WorldSeed) room.populateRoom();
        tilesDisplay.removeChildren();
        tilesDisplay.notPlayerTiles.removeChildren();
        tilesDisplay.addChild(tilesDisplay.notPlayerTiles);
        room.initializeRoom();
        animationTick.destroy();
        animationTick = new PIXI.Ticker;
        animationTick.start();
        
        drawProjectors();
        drawSprites();
        if (areaname.displayCon) areaname.update();
        wheel.reshuffle();
        animateAll();
    }

    saveRoom(room){
        room.playerspawn = null;
        room.monsters = monsters;
        room.tiles = tiles;
        room.visited = room.visited;
        monsters = [];
    }

    appearRoom(spawnl){
        let room = world.playSpace;
        // let spawnhandledflag = false;
        // if (room instanceof BigRoomVoid){
        //     let direction;
        //     if (spawnl[0] == 7) direction = "W";
        //     else if (spawnl[0] == 1) direction = "E";
        //     else if (spawnl[1] == 1) direction = "S";
        //     else direction = "N";
        //     room = this.handleBigRoom(room,direction);
        //     spawnhandledflag = true;
        // }
        numTiles = room.size;
        tileSize = (9/numTiles)*64;
        tiles = room.tiles;
        player.tile = getTile(spawnl[0],spawnl[1]);
        room.populateRoom();
        monsters = room.monsters;
        let playerisIn = locatePlayer();
        if (!playerisIn) monsters.push(player);
        this.playRoom(room);
    }

    enterRoom(direction){
        const shifts = {
            "N" : [0,-1],
            "W" : [-1,0],
            "E" : [1,0],
            "S" : [0,1],
            "N2" : [1,-1],
            "W2" : [-1,1],
            "EE" : [2,0],
            "SS" : [0,2],
            "E2" : [2,1],
            "S2" : [1,2],
        }
        let shift = shifts[direction];
        this.currentroom = [this.currentroom[0] + shift[0],this.currentroom[1] + shift[1]];
        let room = this.rooms[this.currentroom[0]][this.currentroom[1]];
        if (room instanceof BigRoomVoid) room = this.handleBigRoom(room,direction[0]);

        room = world.playSpace;

        numTiles = room.size;
        tileSize = (9/numTiles)*64;
        tiles = room.tiles;
        if (!room.playerspawn) room.playerspawn = [22,4];
        room.populateRoom();
        if (!room.visited){
            level++;
            world.fighting = true;
            room.visited = true;
        }
        else{
            monsters = room.monsters;
        }
        this.playRoom(room, player.hp);
    }

    handleBigRoom(room,direction){
        let correctroom;
        if (room.quadrant == "e"){
            correctroom = this.rooms[this.currentroom[0]-1][this.currentroom[1]];
            if (direction == "W") correctroom.playerspawn = [16,4];
            else if (direction == "S") correctroom.playerspawn = [13,1];
            this.currentroom[0] -= 1;
        }
        else if (room.quadrant == "s"){
            correctroom = this.rooms[this.currentroom[0]-1][this.currentroom[1]-1];
            if (direction == "W") correctroom.playerspawn = [16,13];
            else if (direction == "N") correctroom.playerspawn = [13,16];
            this.currentroom[0] -= 1;
            this.currentroom[1] -= 1;
        }
        else if (room.quadrant == "w"){
            correctroom = this.rooms[this.currentroom[0]][this.currentroom[1]-1];
            if (direction == "N") correctroom.playerspawn = [4,16];
            else if (direction == "E") correctroom.playerspawn = [1,13];
            this.currentroom[1] -= 1;
        }
        else throw new Error('This big room transcends time and space!');
        return correctroom;
    }

    selectPlayerExit(direction){
        const exits = {
            "N" : [4,7],
            "W" : [7,4],
            "E" : [1,4],
            "S" : [4,1],
        }
        return exits[direction];
    }
}

class Room{
    constructor(index){
        this.tier = level;
        this.roseic = false;
        this.size = 9;
        this.entrancepoints;
        this.returnpoint;
        this.verticality = "none";
        //up left right down
        this.music = false;
        this.entrymessage = false;
        this.generatedexits = [];
        this.core;
        this.corridor = false;
        this.playerspawn;
        this.tangible = true;
        this.hostile = false;
        this.effects = [];
        this.index = [index[0],index[1]];
        this.tiles = []; //it will also need to stock the contents of course
        this.monsters = [];
        this.creatures = "";
        this.vault = true;
        this.name = "Bugtopia";
        this.filler = NoBreakWall;
        this.vault = false;
        this.extreme = {
            "N" : 0,
            "W" : 0,
            "E" : numTiles-1,
            "S" : numTiles-1,
        }
        this.visited = false;
        this.layer;
        this.graphicsReady = false;
        this.sourceWorld;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        let size = 112;
        for(let i = 0; i<this.size;i++){
            for (let j = 0; j<this.size; j++){
                let hai = this.tiles[i][j].sprite;
                if (this.tiles[i][j].monster) hai = this.tiles[i][j].monster.sprite;
                else if (this.tiles[i][j] instanceof Airlock && this.tiles[i][j].direction) hai = 17;
                else if (this.tiles[i][j] instanceof Airlock) hai = 3;
                let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
                newSprite.width = 112/9;
                newSprite.height = 112/9;
                newSprite.x = i*(112/9);
                newSprite.y = j*(112/9);
                if (this.tiles[i][j] instanceof Airlock && this.tiles[i][j].direction){
                    newSprite.anchor.set(0.5,0.5);
                    newSprite.x += 112/9/2;
                    newSprite.y += 112/9/2;
                    const rotate = {
                        "S" : 0,
                        "W" : Math.PI/2,
                        "E" : 3*Math.PI/2,
                        "N" : Math.PI,
                    }
                    newSprite.rotation = rotate[this.tiles[i][j].direction];
                }
                this.displayCon.addChild(newSprite);
                
                //if (!(this.tiles[i][j] instanceof RealityWall)) drawPixel(checkPixel(this.tiles[i][j]),i*brush,j*brush,14,this.displayCon);
            }
        }
        this.hypnoCon = new PIXI.Container();
        size = 64;
        for(let i = 0; i<this.size;i++){
            for (let j = 0; j<this.size; j++){
                let hai = this.tiles[i][j].sprite;
                if (this.tiles[i][j].monster) hai = this.tiles[i][j].monster.sprite;
                else if (this.tiles[i][j] instanceof Airlock && this.tiles[i][j].direction) hai = 17;
                else if (this.tiles[i][j] instanceof Airlock) hai = 3;
                let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
                newSprite.width = 64/9;
                newSprite.height = 64/9;
                newSprite.x = i*(64/9);
                newSprite.y = j*(64/9);
                if (this.tiles[i][j] instanceof Airlock && this.tiles[i][j].direction){
                    newSprite.anchor.set(0.5,0.5);
                    newSprite.x += 64/9/2;
                    newSprite.y += 64/9/2;
                    const rotate = {
                        "S" : 0,
                        "W" : Math.PI/2,
                        "E" : 3*Math.PI/2,
                        "N" : Math.PI,
                    }
                    newSprite.rotation = rotate[this.tiles[i][j].direction];
                }
                this.hypnoCon.addChild(newSprite);
                //if (!(this.tiles[i][j] instanceof RealityWall)) drawPixel(checkPixel(this.tiles[i][j]),i*brush,j*brush,14,this.displayCon);
            }
        }
        this.graphicsReady = true;
    }

    populateRoom(){
        if (this.monsters.length && !this.visited) {
            for (let i of this.monsters){
                monsters.push(i);
            }
        }
    }

    initializeRoom(){};
}

class DefaultVaultRoom extends Room{
    constructor(index,id){
        super(index);
        this.vault = true;
        this.id = id;
        this.depth = 0;
    }

    insertRoom(depth){
        this.depth = depth;
        this.tiles = [];
        let vault = rooms[this.id];
        if (vault["creatures"] && vault["creatures"]["ANY"]){
            for (let i of "abcdefghijklmnopqrstuvwxyz"){
                vault["creatures"][i] = vault["creatures"]["ANY"];
            }
        }
        for(let i=0;i<this.size;i++){
            this.tiles[i] = [];
            for(let j=0;j<this.size;j++){
                let tile;
                let airlockDirOverride;
                if (!keytile[vault[j][i]] || (vault["creatures"] && vault["creatures"][vault[j][i]])) tile = Floor;
                else tile = keytile[vault[j][i]];
                if (tile == Airlock && ["V","^","<",">"].includes(vault[j][i])) airlockDirOverride = vault[j][i];
                //if (depth == 1 && (tile == Wall || tile == NoBreakWall)) tile = RoseWall;
                if ("nswe".includes(vault[j][i])){
                    let dir;
                    dir = vault[j][i];
                    this.tiles[i][j] = new tile(i,j,dir);
                }
                else{
                    this.tiles[i][j] = new tile(i,j,this);
                    if (this.tiles[i][j] instanceof CenterTeleport){
                        this.tiles[i][j].destination = floorLinks[this.sourceWorld.id][this.sourceWorld.establishedPaths.length];
                        if (!this.tiles[i][j].destination) throw new Error("Destination failed to be linked to pad.")
                        this.sourceWorld.establishedPaths.push(this.tiles[i][j]);
                    }
                }
                if (airlockDirOverride){
                    const eqs = {
                        "V" : "S",
                        "^" : "N",
                        "<" : "W",
                        ">" : "E",
                    }
                    this.tiles[i][j].direction = eqs[airlockDirOverride];
                }
                if (vault["creatures"] && vault["creatures"][vault[j][i]]){
                    let entity = new vault["creatures"][vault[j][i]](this.tiles[i][j]);
                    if (vault["marks"] && vault["marks"][vault[j][i]]) entity.generationMark = vault["marks"][vault[j][i]];
                    this.monsters.push(entity);
                    if (entity instanceof Terminal) player = entity;
                }
            }
        }
    }
}

class StandardFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = shuffle(["Standard"])[0];
    }
}

class TriangleFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Triangle";
    }
}

class NarrowFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = shuffle(["Narrow"])[0]; //,"LaserHall"
        this.corridor = true;
    }
}
class GrandHallFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "GrandHall";
        this.size = 18;
    }
}

class SpawnRoom extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Empty";
        this.size = 9;
    }
    initializeRoom(){
        world.fighting = false;
        super.populateRoom();
        super.initializeRoom();
    }
}

class WorldSeed extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Seed";
        this.visited = true;
        this.name = "World Seed";
        this.music = "malform";
        this.filler = TermiWall;
        this.stage = 0;
    }

    initializeRoom(){
        world.fighting = false;
        super.populateRoom();
        super.initializeRoom();
    }
}

class AnnounceCorridor extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Announce";
    }
    populateRoom(){
        super.populateRoom();
    }
}

class EmptyFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Empty";
    }
}

class StareL extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "StareL";
    }
}

class StareR extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "StareR";
    }
}

class HideFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Hide";
    }
}

class StarFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Star";
    }
}

class Tele1 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Tele1";
    }
}

class Tele2 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Tele2";
    }
}

class Tele3 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Tele3";
    }
}

class Tele4 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Tele4";
    }
}

class Tele5 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Tele5";
    }
}

class Tele6 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Tele6";
    }
}

class Epsilon1 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Epsilon1";
    }
}

class Epsilon2 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Epsilon2";
    }
}

class Epsilon3 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Epsilon3";
    }
}

class Epsilon4 extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Epsilon4";
    }
}

class TCross extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "TCross";
    }
}

class RogueFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Rogue";
        this.size = 18;
    }
}

class BloxFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Blox";
    }
}

class BridgeFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Bridge";
        this.corridor = true;
    }
}

class PipesFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Pipes";
    }
}

class PlateGenerator extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Storage";
        this.name = "Sacred Offering";
    }
}

class SoulCage extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "HarmonicTransport";
        this.name = "Soul Cage";
        this.cataloguedis;
        this.currentcat;
    }
    initializeRoom(){
        research.completeResearch("Cage");
        for(let i=0;i<wheel.wheel.length;i++){
            if (!(wheel.wheel[i] instanceof Empty)){
                wheel.subduedSouls.push(wheel.wheel[i]);
                wheel.wheel[i] = new Empty();
            }
        }
        //wheel.toPaintMode();
    }
}

class VoidRoom extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Void";
        this.tangible = false;
    }
}

class BigRoomVoid extends DefaultVaultRoom{
    constructor(index,quadrant){
        super(index);
        this.id = "Void";
        this.tangible = false;
        this.quadrant = quadrant;
    }
}

class HarmonyRelay extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.entrymessage = "FluffyWelcome";
        this.name = "Test of Unity";
        this.music = "harmony2";
        this.fuffspawn = 0;
        this.hostile = false;
        //this.filler = AbazonWall;
        this.id = "Empty";
    }

    populateRoom(){
        super.populateRoom();
        let monsterType = shuffle([Harmonizer])[0];
        let tile = getTile(4,4);
        world.getRoom().fuffspawn = tile;
        let monster = new monsterType(tile);
        monsters.push(monster);
    }

    initializeRoom(){
        world.fighting = false;
        super.initializeRoom();
    }

    determineLoot(type){
        let lootdrop = new Senet();
        lootdrop = relayPool[type][randomRange(0,relayPool[type].length-1)];
        return lootdrop;
    }

    summonLoot(elegance, slot1, slot2){
        let fluffchance  = elegance/5;
        let bonusartifact = false;
        let zones = [tiles[3][4],tiles[5][4]];
        let lootdrop = [this.determineLoot(slot1.value.caste),this.determineLoot(slot2.value.caste)];
        if (elegance < 0){
            log.addLog("FluffyAppalled");
            fluffchance = 100;
        }
        else if (elegance >= 300){
            log.addLog("FluffyMocking");
        }
        else if (elegance > 99 && elegance <= 299){
            log.addLog("FluffyDisgusted");
        }
        else if (elegance > 10 && elegance <= 99){
            log.addLog("FluffySatisfied");
        }
        else if (elegance > 0 && elegance <= 10){
            log.addLog("FluffyImpressed");
            fluffchance = 0;
        }
        else if (elegance == 0){
            log.addLog("FluffyExalted");
            fluffchance = 0;
            bonusartifact = true;
        }
        else{
            log.addLog("FluffyCheat");
            lootdrop = [new Shizapis(), new Shizapis()];
            fluffchance = 0;
        }
            
        for (let i = 0;i<lootdrop.length;i++){
            if (randomRange(0,100) < fluffchance) lootdrop[i] = new Serene();
            zones[i].value = lootdrop[i]; 
        }
        //if (bonusartifact){
        //    let moddrop = modulators[randomRange(0,modulators.length-1)];
        //    removeItemOnce(modulators,moddrop);
        //    spawnCages(moddrop,getTile(4,4));
        //}
    }
} 

class StandardSpire extends Room{
    constructor(index){
        super(index);
        this.name = "Serene Spire";
    }

    buildRoom(){
        
        generateSpire();
        generateMonsters();
    }

    initializeRoom(){
        this.playerspawn = spirespawner;
        this.playerspawn.replace(Ladder);
        super.initializeRoom();
    }
}

class RoseicCogArena extends Room{
    constructor(index){
        super(index);
        this.name = "Roseic Circus";
        this.size = 18;
    }

    buildRoom(){
        
        generateCircus();
    }

    initializeRoom(){
        this.playerspawn = getTile(8,8);
        super.initializeRoom();
    }
}

class HugeMap extends DefaultVaultRoom{
    constructor(index,myWorld){
        super(index);
        this.name = "Beeg";
        this.size = 45;
        this.id = "Beeg";
        this.world = myWorld;
        for (let i=0; i<45; i++){
            rooms[this.id][i] = ".".repeat(81);
        }
        this.tiles = this.world.depositTiles;
        this.monsters = this.world.depositCreatures;
        if (!this.monsters) this.monsters = [];

    }

    initializeRoom(){
        super.initializeRoom();
        for (let i=0; i<45; i++){
            for (let j=0; j<45; j++){
                tiles[i][j].x = i;
                tiles[i][j].y = j;
            }
        }
        tickProjectors();
    }
}

class SixfoldStand extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.name = "Sixfold Node";
        this.size = 18;
        this.id = "Sixfold";
    }
}

class EpsilonArena extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.size = 18;
        this.entrymessage = "EpsilonWelcome1";
        this.name = "Industrial Apex";
        this.music = "epsilon";
        this.id = "Epsilon";
        this.hostile = true;
    }

    buildRoom(connector){
        super.buildRoom(connector);
        showboss = true;
    }

    initializeRoom(){
        //this.entrancepoints = [getTile(1,1), getTile(1,numTiles-2),getTile(numTiles-2,1),getTile(numTiles-2,numTiles-2)];
        super.initializeRoom();
    }
}

class FluffianWorkshop extends Room{
    constructor(index){
        super(index);
        this.entrymessage = "FluffyWorkshop";
        this.name = "Fluffian Workshop";
    }

    buildRoom(){
        
        generateModule();
        generateMonsters();
    }

    initializeRoom(){
        this.playerspawn = getTile(1,8);
        super.initializeRoom();
    }
}