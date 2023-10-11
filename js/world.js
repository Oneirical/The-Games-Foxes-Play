class Universe{
    constructor(){
        this.worlds = [];
        this.currentWorld = 0;
    }

    start(){
        tiles = [];
        monsters = [];
        this.composeLinks();
        for (let x = 0; x<floors.length; x++){
            this.worlds[x] = new World(x);
            this.worlds[x].layer = x;
            this.worlds[x].id = floors[x];
            this.worlds[x].buildStyle = floorStyles[this.worlds[x].id];
        }
        this.currentWorld = 0;
        world = this.worlds[this.currentWorld];
        for (let x = 0; x<floors.length; x++){
            this.worlds[x].worldBuilding();
        }
        //drawTiles();
        drawSprites();
        assignRotations();
        assignSouls();
        this.placeHypnoDisplays(); // that was an adventure, wasn't it? I'm proud of you. Fu!

    }

    composeLinks(){
        for (let z of Object.keys(worldMaps)){
            for (let i = 0; i<5; i++){
                for (let j = 0; j<5; j++){
                    let w = worldMaps[z];
                    if (w[i][j] != "."){
                        let region = w["keys"][w[i][j]];
                        floorLinks[region] = [];
                        let adj = [];
                        if (i != 0) adj.push(w[i-1][j]);
                        if (i != 4) adj.push(w[i+1][j]);
                        if (j != 0) adj.push(w[i][j-1]);
                        if (j != 4) adj.push(w[i][j+1]);
                        for (let r of adj){
                            if (r != ".") floorLinks[region].push(w["keys"][r])
                        }
                    }
                }
            }
        }
    }

    findWorldByID(id){
        for (let i of this.worlds) if (i.id == id) return i;
    }

    placeHypnoDisplays(){
        for (let w of this.worlds){
            for (let p of w.establishedPaths){
                let tileWhichDisplays = w.playSpace.tiles[p.tile.x-1][p.tile.y-1].getAllCreatures()[0]; // this is a little ugly but oh well, if it is what it takes to remove the visual setEffect() bug
                if (!(tileWhichDisplays.species == "HoloStabilizer")) throw new Error("The chosen hypnotic display was not a portal creature.")
                if (tileWhichDisplays.hypnoticScenes) {
                    for (let h of tileWhichDisplays.hypnoticScenes) tileWhichDisplays.creaturecon.removeChild(h); // it can technically be reused, but the hypnodisplay only pulls from sprites, not paint and entities
                }
                let gazingInto = this.findWorldByID(p.destination);
                let gazingPoint = gazingInto.findTelepadByDest(w.id);
                let zoomSize = 14; //don't touch that! it's not the same as the graphics one
                let cont = gazingInto.grabSpritesOfSection(gazingPoint.tile.x-zoomSize+1,gazingPoint.tile.y-zoomSize+1,gazingPoint.tile.x+zoomSize,gazingPoint.tile.y+zoomSize);
                let contSmall = w.grabSpritesOfSection(p.tile.x-zoomSize+1,p.tile.y-zoomSize+1,p.tile.x+zoomSize,p.tile.y+zoomSize);
                tileWhichDisplays.creaturecon.addChild(cont);
                contSmall.width = 64/3;
                contSmall.height = 64/3;
                tileWhichDisplays.creaturecon.addChild(contSmall);
                tileWhichDisplays.hypnoticScenes = [cont,contSmall];
                cont.x-=64-((22-gazingPoint.tile.x)/9*64);
                cont.y-=64-((22-gazingPoint.tile.y)/9*64);
                contSmall.x += 128/9+((22-p.tile.x)/9*64/9)+64;
                contSmall.y += 128/9+((22-p.tile.y)/9*64/9)+64;
            }
        }
    }

    passDown(layer, spawnx, spawny){
        if (fastReload) {
            this.handleDescent(layer, spawnx, spawny);
            return;
        }
        universe.zooming = true;
        this.zoomAnim = new PIXI.Ticker;
        
        this.zoomAnim.start();
        this.viewport = new pixi_viewport.Viewport({
            screenWidth: 1152-64,
            screenHeight: 1152-64,
            events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        })
        tilesDisplay.addChild(this.viewport)
        this.viewport.startingWidth = this.viewport.width;
        this.viewport.startingHeight = this.viewport.height;
        this.viewport
            .animate({
                width: 1143/9,
                time: 700,
            })
    
    
        this.viewport.addChild(tilesDisplay.notPlayerTiles);
        tilesDisplay.addChild(player.creaturecon);
        this.zoomAnim.add(() => {
            if (this.viewport.scaled > 8.56){
                this.handleDescent(layer, spawnx, spawny);
                universe.zooming = false;
                this.viewport.removeChild(tilesDisplay.notPlayerTiles);
                tilesDisplay.removeChild(this.viewport);
                this.zoomAnim.stop();
            }
        });
    }

    handleDescent(layer, spawnx, spawny){
        this.currentWorld = layer;
        uiDisplayLeft.removeChild(world.displayCon);
        player.tile.monster = null;
        world.saveRoom(world.playSpace);
        let spawnCoords = [spawnx, spawny];
        world = this.worlds[layer];
        world.currentroom = spawnCoords;
        monsters.push(player);
        world.appearRoom([spawnx,spawny]);
        world.setUpSprites();
        uiDisplayLeft.addChild(world.displayCon);
        reloadDisplay(tilesDisplay.worldDisplay);
        tilesDisplay.addChild(tilesDisplay.notPlayerTiles);
        tilesDisplay.addChild(player.creaturecon);
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
        this.currentWorld = layer;
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
        //world.cage.pocketworld.hypnoDisplay();
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
        //this.cage = new CageTemplate();
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

    grabSpritesOfSection(x,y,w,h){
        let hypnoCon = new PIXI.Container();
        //let size = 112;
        for(let i = x; i<w;i++){
            for (let j = y; j<h; j++){
                if (!this.playSpace.tiles[i] || !this.playSpace.tiles[i][j]) {
                    drawPixel("black", i*(64/9),j*(64/9),64/9,hypnoCon);
                    continue;
                };
                let area = this.playSpace.tiles[i][j];
                if (!area) continue;
                let hai = area.sprite;
                let visible = true;
                if (area.monster){
                    hai = speciesData[area.monster.species]["sprite"];
                    if (speciesData[area.monster.species]["invisible"]) visible = false;
                }
                let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
                newSprite.visible = visible;
                newSprite.width = 64/9;
                newSprite.height = 64/9;
                newSprite.x = i*(64/9);
                newSprite.y = j*(64/9);
                if (area.monster && area.monster.direction){
                    newSprite.anchor.set(0.5,0.5);
                    newSprite.x += 64/9/2;
                    newSprite.y += 64/9/2;
                    const rotate = {
                        "S" : 0,
                        "W" : Math.PI/2,
                        "E" : 3*Math.PI/2,
                        "N" : Math.PI,
                    }
                    newSprite.rotation = rotate[area.monster.direction];
                }
                hypnoCon.addChild(newSprite);                
            }
        }
        return hypnoCon;
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
                if (j instanceof Floor) usable.push(j);
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

    generateWorld(){
        let passableRooms=0;
        worldgen = [];
        for(let i=0;i<5;i++){
            worldgen[i] = [];
            for(let j=0;j<5;j++){
                if(seededRNG() < 0.4){
                    worldgen[i][j] = new Wall(i,j); // ridiculous, but ingenious!
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
        //tilesDisplay.removeChildren();
        //tilesDisplay.notPlayerTiles.removeChildren();
        //tilesDisplay.addChild(tilesDisplay.notPlayerTiles);
        room.initializeRoom();
        animationTick.destroy();
        animationTick = new PIXI.Ticker;
        animationTick.start();
        
        //drawProjectors();
        drawSprites();
        if (areaname.displayCon) areaname.update();
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
        this.vault = false;
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
                let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
                newSprite.width = 112/9;
                newSprite.height = 112/9;
                newSprite.x = i*(112/9);
                newSprite.y = j*(112/9);
                this.displayCon.addChild(newSprite);                
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
                if (!keytile[vault[j][i]] || (vault["creatures"] && vault["creatures"][vault[j][i]]) || typeof keytile[vault[j][i]] === "string") tile = Floor; //cursed
                else tile = keytile[vault[j][i]];
                if ("nswe".includes(vault[j][i])){
                    let dir;
                    dir = vault[j][i];
                    this.tiles[i][j] = new tile(i,j,dir);
                }
                else{
                    this.tiles[i][j] = new tile(i,j,this);
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
                if (typeof keytile[vault[j][i]] === "string"|| vault["creatures"] && vault["creatures"][vault[j][i]]){
                    let entity;
                    if (typeof keytile[vault[j][i]] === "string") entity = new Creature(this.tiles[i][j],keytile[vault[j][i]]);
                    else entity = new Creature(this.tiles[i][j],vault["creatures"][vault[j][i]]);
                    if (vault["marks"] && vault["marks"][vault[j][i]]) entity.generationMark = vault["marks"][vault[j][i]];
                    this.monsters.push(entity);
                    if (entity.species === "DimensionWarp"){
                        entity.destination = floorLinks[this.sourceWorld.id][this.sourceWorld.establishedPaths.length];
                        if (!entity.destination) throw new Error("Destination failed to be linked to pad.")
                        this.sourceWorld.establishedPaths.push(entity);
                    }
                    if (entity.species === "Terminal") player = entity;
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
}

class VoidRoom extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Void";
        this.tangible = false;
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
    }
}