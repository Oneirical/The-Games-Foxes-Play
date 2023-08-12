class CageTemplate{
    constructor(){
        this.slots = [];
        this.tier = 0;
        this.build();
        this.pocketworld;
        this.size = 1;
    }

    build(){
        for(let i=0;i<9;i++){
            this.slots[i] = [];
            for(let j=0;j<9;j++){
                this.slots[i][j] = new Empty();
            }
        }
        this.displayon = false;
    }

    getNeighbor(x,y, dx, dy){
        let ret = this.slots[x+dx];
        if (!ret) return "Any";
        let ret2 = ret[y + dy];
        if (!ret2) return "Any";
        else return ret2;
    }

    getAdjacentNeighbors(x,y){
        return [
            this.getNeighbor(x,y,0, 0),
            this.getNeighbor(x,y,0, -1),
            this.getNeighbor(x,y,0, 1),
            this.getNeighbor(x,y,-1, 0),
            this.getNeighbor(x,y,1, 0),
            this.getNeighbor(x,y,1, 1),
            this.getNeighbor(x,y,-1, -1),
            this.getNeighbor(x,y,-1, 1),
            this.getNeighbor(x,y,1, -1),
        ];
    }

    generateWorld(){
        if (universe.currentworld == 1) this.pocketworld = universe.worlds[0];
        else this.pocketworld = universe.worlds[1];
        this.displayon = true;
    }

    buildAxiom(){
        for(let j=0;j<9;j++){
            for(let i=0;i<9;i++){
                this.slots[i][j].patternFound = false;
            }
        }
        let allSouls = [];
        let potency = 0;
        let praxes = [];
        for(let j=0;j<9;j++){
            for(let i=0;i<9;i++){
                if (!(this.slots[i][j] instanceof Empty) && !this.slots[i][j].patternFound){
                    allSouls.push(this.slots[i][j].id);
                    let origin = this.slots[i][j];
                    origin.patternFound = true;
                    let spreading = new Set();
                    spreading.add(origin);
                    let itSpread = true;
                    while (itSpread){
                        itSpread = false;
                        for (let e of spreading){
                            for (let r of this.getAdjacentNeighbors(e.cageX,e.cageY)){
                                if (r.id == origin.id){
                                    if (!spreading.has(r)) itSpread = true;
                                    spreading.add(r);
                                    r.patternFound = true;
                                }
                            }
                        }
                    }
                    let maxX = 0;
                    let maxY = 0;
                    let minX = 9;
                    let minY = 9;
                    for (let q of spreading){
                        if (q.cageX > maxX) maxX = q.cageX;
                        if (q.cageX < minX) minX = q.cageX;
                        if (q.cageY > maxY) maxY = q.cageY;
                        if (q.cageY < minY) minY = q.cageY;
                    }
                    const patternSize = Math.max(maxY-minY+1,maxX-minX+1);
                    let blueprint = {};
                    for (let q = 0; q<patternSize; q++){
                        blueprint[q] = ".".repeat(patternSize);
                    }
                    for (let q of spreading){
                        blueprint[patternSize-1-(maxY-q.cageY)] = setCharAt(blueprint[patternSize-1-(maxY-q.cageY)],patternSize-1-(maxX-q.cageX),q.id[0]);
                    }
                    for (let k of research.knownSpells){
                        if (!spellpatterns[k]) throw 'Pattern does not exist: '+k;
                        if (spellpatterns[k][0].length != patternSize) continue;
                        let ok = true;
                        for (let q = 0; q<patternSize; q++){
                            if (blueprint[q] != spellpatterns[k][q]) ok = false;
                        }
                        if (!ok) continue;
                        else {
                            praxes.push(k);
                            for (let q of spreading) q.patternFound = k;
                            break;
                        }
                    }
                }
                else{
                    switch(this.tier){
                        case 0:
                            if (between(i,2,6) && between(j,2,6)) potency++;
                            break;
                    }
                }
            }
        }
        this.pocketworld.reward["Caste"] = mode(allSouls);
        this.pocketworld.reward["Sequence"] = praxes;
        this.pocketworld.reward["Potency"] = potency;
        console.log(this.pocketworld.reward);
    }
}

class Universe{
    constructor(){
        this.worlds = [];
        this.currentworld = 0;
        this.layeredInfluence = new Set();
        this.totalInfluence = {
            "Saintly" : 0,
            "Ordered" : 0,
            "Artistic" : 0,
            "Unhinged" : 0,
            "Feral" : 0,
            "Vile" : 0,
            "Serene" : 0,
            "Total" : 0,
        }
        this.background;
    }

    getDepth(){
        if (this.currentworld == 0) return "Faith's End";
        else return ("Vision " + this.currentworld);
    }

    calculatePotency(){
        return Math.floor(this.totalInfluence["Total"]*0.1) + Math.floor(this.totalInfluence["Serene"]*0.5)+1;
    }

    getTotalInfluence(){
        this.totalInfluence = {
            "Saintly" : 0,
            "Ordered" : 0,
            "Artistic" : 0,
            "Unhinged" : 0,
            "Feral" : 0,
            "Vile" : 0,
            "Serene" : 0,
            "Total" : 0,
        }
        for (let i of Object.keys(research.influence)){
            this.totalInfluence[i] = research.influence[i];
        }
        for (let i of this.layeredInfluence){
            for (let j of Object.keys(i)){
                this.totalInfluence[j] += i[j];
            }
        }
        for (let i of Object.keys(this.totalInfluence)){
            if (i != "Total") this.totalInfluence["Total"] += this.totalInfluence[i];
        }
        return this.totalInfluence;
    }

    start(startingHp){
        tiles = [];
        monsters = [];
        this.worlds[0] = new World(0);
        this.worlds[1] = new World(1);
        this.currentworld = 0;
        world = this.worlds[this.currentworld];
        world.layer = 0;
        world.confirmWorldFromVault();
        this.worlds[1].confirmWorld();
        assignSouls();
        world.currentroom = [4,8];
        world.tranquil = true;
        world.playRoom(world.rooms[4][8],startingHp);
        drawTiles();
        drawSprites();
    }

    passDown(layer, spawnx, spawny){
        universe.zooming = true;
        this.zoomAnim = new PIXI.Ticker;
        this.currentworld = layer;
        this.zoomAnim.start();
        tilesDisplay.mask = app.stage.children[app.stage.children.length-1];
        this.viewport = new pixi_viewport.Viewport({
            screenWidth: 1152-64,
            screenHeight: 1152-64,
            events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        })
        tilesDisplay.addChild(this.viewport)
    
        // activate plugins
        this.viewport
            .animate({
                width: (1143)/9,
                time: 1000,
            })
    
    
        // add a red box
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
        // if (this.worlds[layer].rooms[spawnx-world.cageCorner[0]][spawny-world.cageCorner[1]].corridor){
        //     shakeAmount = 5;
        //     return;
        // }
        
        level = 0;
        player.tile.monster = null;
        world.saveRoom(world.getRoom());
        this.worlds[layer-1] = world;
        let spawnCoords = [spawnx, spawny];
        world = this.worlds[layer];
        world.currentroom = spawnCoords;
        let locspawn;
        if (player.lastMove[0] == -1) locspawn = [7,4];
        else if (player.lastMove[0] == 1) locspawn = [1,4];
        else if (player.lastMove[1] == 1) locspawn = [4,1];
        else locspawn = [4,7];
        world.appearRoom([spawnx,spawny]);
        if(!world.getRoom().hostile) summonExits();
        for(let i=0;i<wheel.wheel.length;i++){
            if (wheel.wheel[i].turbulent){
                wheel.turbulentSouls.push(wheel.wheel[i]);
                wheel.wheel[i] = new Empty();
            }
        }
        research.completeResearch("Vision");
        if(!world.getRoom().hostile){
            research.completeResearch("Subdued");
            research.completeResearch("Estate");
        }
        player.hp = maxHp;
        
        world.setUpSprites();

        uiDisplayLeft.addChild(world.displayCon);
        this.layeredInfluence.add(world.influence);
        tilesDisplay.addChild(player.creaturecon);
        tickProjectors();
        world.cage.generateWorld()
        world.cage.pocketworld.hypnoDisplay();
    }

    passUp(layer,origin){
        universe.zooming = true;
        this.layeredInfluence.delete(world.influence);
        uiDisplayLeft.removeChild(world.displayCon);
        player.tile.monster = null;
        world.saveRoom(world.getRoom());
        const scale = {
            "N" : [0,0],
            "S" : [0,0],
            "E" : [0,0],
            "W" : [0,0],
            "N2" : [1,0],
            "W2" : [0,1],
            "EE" : [1,0],
            "SS" : [0,1],
            "E2" : [1,1],
            "S2" : [1,1],
        }
        //let locspawn = [world.currentroom[0] + player.lastMove[0] + scale[origin][0], world.currentroom[1] + player.lastMove[1] + scale[origin][1]];
        let locspawn = [4,5];
        let motionsave = player.lastMove;
        let receivereward = true;
        for(let j=0;j<9;j++){
            for(let i=0;i<9;i++){
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
            for(let j=0;j<9;j++){
                for(let i=0;i<9;i++){
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
        tilesDisplay.mask = app.stage.children[app.stage.children.length-1];
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

    playRandomWorld(oldWorld){
        this.worlds[world.x][world.y].rooms = oldWorld.rooms;
        world = this.randomAvailableWorld();
        this.currentworld = [world.x,world.y];
        if (!world.generated) world.confirmWorldFromVault();
        world.currentroom = [4,4];
        let room = world.rooms[world.currentroom[0]][world.currentroom[1]];
        if (room instanceof BigRoomVoid) room = world.handleBigRoom(room,direction[0]);
        numTiles = room.size;
        tileSize = (9/numTiles)*64;
        tiles = room.tiles;
        monsters = room.monsters;
        room.playerlastmove = [0,-1];
        let spawn = randomPassableTile();
        if (!room.playerspawn) room.playerspawn = [spawn.x,spawn.y];
        world.playRoom(room, 6);
    }

    shuntWorld(oldWorld,direction){
        this.worlds[world.x][world.y].rooms = oldWorld.rooms;
        const shifts = {
            "N" : [0,-1],
            "W" : [-1,0],
            "E" : [1,0],
            "S" : [0,1],
        }
        const spawns = {
            "N" : [4,8],
            "W" : [8,4],
            "E" : [0,4],
            "S" : [4,0], 
        }
        this.currentworld[0] += shifts[direction][0]; // this won't work on the edges
        this.currentworld[1] += shifts[direction][1];
        world = this.worlds[this.currentworld[0]][this.currentworld[1]];
        if (!world.generated) world.confirmWorldFromVault();
        world.currentroom = spawns[direction];
        let room = world.rooms[world.currentroom[0]][world.currentroom[1]];
        if (room instanceof BigRoomVoid) room = world.handleBigRoom(room,direction[0]);
        numTiles = room.size;
        tileSize = (9/numTiles)*64;
        tiles = room.tiles;
        monsters = room.monsters;
        room.playerlastmove = shifts[direction[0]];
        if (!room.playerspawn) room.playerspawn = world.selectPlayerExit(direction[0]);
        world.playRoom(room, player.hp);
    }
}

class EmptyWorld{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }


}

class World{
    constructor(depth){
        this.depth = depth;
        this.cageCorner;
        this.cageLocation = [4,5];
        this.roompool = [];
        this.isAccessible = false;
        this.finishedspread = false;
        this.generated = false;
        this.currentroom = [4,4]; //parseInt((randomRange(0,8).toString()+randomRange(0,8).toString()));
        this.serene = false;
        this.tranquil = false;
        this.faction = 0;
        this.fighting = false;
        this.rooms;
        this.cage = new CageTemplate();
        this.layer;
        this.reward = {
            "Sequence" : [],
            "Caste" : "",
            "Potency" : 0,
        };
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

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*4;
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,10,this.displayCon);
        this.setUpMap();
        //this.displayCon.addChild(newSprite);
    }

    represent(colour){
        const factionc = {
            0: 0,
            1: 8,
            2: 9,
            3: 10,
            4: 11,
            5: 12,
            6: 13
        }
        if (this.isAccessible) colour = factionc[this.faction];
        if (this.serene && this.isAccessible) colour = 4;
        drawPixel(colour,this.x*7.11,this.y*7.11);
    }

    getComps(i,j){
        return this.exppage.cage[i][j].value.type;
    }

    setUpMap(){
        this.mapCon = new PIXI.Container();
        let size = 112;
        drawPixel("black",0,0,112*9,this.mapCon);
        this.mapCon.children[0].alpha = 0.9;
        this.roomsInMap = new PIXI.Container();
        this.mapCon.addChild(this.roomsInMap);
        for(let y = 0; y<9;y++){
            for(let x = 0; x<9;x++){
                if (this.rooms[x][y].tangible && this.rooms[x][y].displayCon){
                    this.rooms[x][y].displayCon.x = x*size;
                    this.rooms[x][y].displayCon.y = y*size;
                    this.roomsInMap.addChild(this.rooms[x][y].displayCon);
                }
            }
        }
        this.mapCon.x -= -12; //used to be 8
        this.mapCon.y -= -12;
        this.roomsInMap.x += 24;
        this.roomsInMap.y += 24;
        //this.roomsInMap.scale.set(0.95,0.95);
        this.mapCon.scale.set(1/4,1/4);
        //this.mapCon.pivot.set(1/2,1/2);
        this.displayCon.addChild(this.mapCon);
                    //if (this.rooms[x][y].visited) drawPixel(9,4*7+x*size,4*7+y*size);
        //for(let i = 0; i<numTiles;i++){
           // for (let j = 0; j<numTiles; j++){
                //if (!(tiles[i][j] instanceof RealityWall)) drawPixel(this.checkPixel(tiles[i][j]),i*brush+this.currentroom[0]*size,j*brush+this.currentroom[1]*size,14);
                //if (tiles[i][j].monster && tiles[i][j].monster.isPlayer) drawPixel(3,i*brush+this.currentroom[0]*size,j*brush+this.currentroom[1]*size,14);
        //    }
        //}
        //if (this.currentroom.visited) drawPixel(9,4*7+x*size,4*7+y*size,14);

        this.playerMarker = new FoxSprite(allsprites.textures["sprite0"]);
        this.playerMarker.width = 112/9;
        this.playerMarker.height = 112/9;
        this.mapCon.addChild(this.playerMarker);
    }

    tickMap(){
        this.playerMarker.x = player.tile.x*112/9+world.getRoom().index[0]*112+(2*(112/9));
        this.playerMarker.y = player.tile.y*112/9+world.getRoom().index[1]*112+(2*(112/9));

    }

    miniMap(){
        let size = 64;
        let brush = (size/9);
        let range = 3;
        for(let y = world.getRoom().index[1]-range; y<world.getRoom().index[1]+range+1;y++){
            for(let x = world.getRoom().index[0]-range; x<world.getRoom().index[0]+range+1;x++){
                if (this.rooms[x] && this.rooms[x][y] && this.rooms[x][y].tangible){
                    for(let i = 0; i<this.rooms[x][y].size;i++){
                        for (let j = 0; j<this.rooms[x][y].size; j++){
                            if (!(this.rooms[x][y].tiles[i][j] instanceof RealityWall)) drawPixel(this.checkPixel(this.rooms[x][y].tiles[i][j]),i*brush+canvas.width-156+size*(x-world.getRoom().index[0]),j*brush+130+size*(y-world.getRoom().index[1]));
                        }//+673+128+size*(x-world.getRoom().index[0])
                        //+546+128+size*(y-world.getRoom().index[1])
                    }
                    //if (this.rooms[x][y].visited) drawPixel(9,4*7+x*size,4*7+y*size);
                }
            }
        }
        for(let i = 0; i<numTiles;i++){
            for (let j = 0; j<numTiles; j++){
                if (!(tiles[i][j] instanceof RealityWall)) drawPixel(this.checkPixel(tiles[i][j]),i*brush+canvas.width-156,j*brush+130);
                if (tiles[i][j].monster && tiles[i][j].monster.isPlayer) drawPixel(3,i*brush+canvas.width-156,j*brush+130);
            }
        }
    }

    hypnoDisplay(){
        this.hypnosis = new PIXI.Container();
        new GlitchSprite(this.hypnosis,3);
        tilesDisplay.addChild(this.hypnosis);
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
                    this.rooms[x][y].hypnoCon.width = 64;
                    this.rooms[x][y].hypnoCon.height = 64;
                    this.rooms[x][y].hypnoCon.x = 0;
                    this.rooms[x][y].hypnoCon.y = 0;
                    tiles[world.cageCorner[0]+xindic][world.cageCorner[1]+yindic].tilecon.addChild(this.rooms[x][y].hypnoCon);                    
                }
                xindic++;
                //else if (betweenIncl(x,4-this.cage.size,4+this.cage.size) && betweenIncl(y,4-this.cage.size,4+this.cage.size)) drawPixel("black",x*112,y*112,112,this.hypnosis);
            }
            yindic++;
            xindic = 3;
        }
    }

    getRoom(){
        return this.rooms[this.currentroom[0]][this.currentroom[1]];
    }

    selectRooms(){
        if (this.serene) this.roompool = [StandardSpire];
        else this.roompool = [StandardFaith]; //BloxFaith,EmptyFaith,HideFaith,PipesFaith,TriangleFaith,StarFaith
    }

    confirmWorldFromVault(vault){
        if (!vault) vault = "Facility";
        if (vault == "Epsilon"){
            this.cageLocation = [2,6];
        }
        this.cageCorner = [this.cageLocation[0]*9,this.cageLocation[1]*9];
        this.rooms = [];
        for(let i=0;i<9;i++){
            this.rooms[i] = [];
            for(let j=0;j<9;j++){
                let flip = false;
                let roomType;
                if (genstruct[vault]["keys"]) roomType = genstruct[vault]["keys"][genstruct[vault][j][i]];
                else roomType = keyroom[genstruct[vault][j][i]];
                if (genstruct[vault][j][i] == "H") flip = true;
                try{
                    this.rooms[i][j] = new roomType([i,j]);
                }
                catch (err) {throw new Error("Unknown room glyph: "+ genstruct[vault][j][i])}
                if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,0);
                this.rooms[i][j].setUp();
                this.rooms[i][j].insertRoom(this.depth);
                if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,0);
            }
        }
        this.depositTiles = [];
        this.depositCreatures = [];
        for(let i=0;i<81;i++){
            this.depositTiles[i] = [];
        }
        let airlocks = [];
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if ("Facility" == "Facility"){//replace this if more vaults get added
                    if (this.rooms[i][j] instanceof WorldSeed) this.rooms[i][j].filler = TermiWall;
                    else this.rooms[i][j].filler = Wall;
                }
                if (this.rooms[i][j].tangible){
                    this.spreadExits(i,j);
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
                if (this.rooms[i][j] instanceof HugeMap) this.giga = this.rooms[i][j];
            }
        }
        this.playSpace = new HugeMap([0,0],this);
        for(let i=0;i<81;i++){
            for(let j=0;j<81;j++){
                this.playSpace.tiles[i][j].existSpace = this.playSpace.tiles;
                this.playSpace.tiles[i][j].x = i;
                this.playSpace.tiles[i][j].y = j;            
            }
        }
        for(let i=0;i<81;i++){
            for(let j=0;j<81;j++){   
                if (this.playSpace.tiles[i][j] instanceof Airlock) this.playSpace.tiles[i][j].findDirection();        
            }
        }

    }

    blessRooms(){
        const specialTypes = {
            "Epsilon" : 2,
            "HarmonicTransport" : 1,
            "ScarabWaypoint" : 1,
            "ScarabFactory" : 1,
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
                if (i.x+size <= 9 && i.y+size <= 9 && i.x-size >= -1 && i.y-size >= -1){
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

    confirmWorld(){
        tryTo('generate a world', function(){
            return world.generateWorld() == randomPassableRoom().getConnectedRooms().length;
        });

        // if (world.generateCage() != randomPassableRoom().getConnectedRooms().length){
        //     //log.addLog("WrongCageError");
        //     world.cage.displayon = false;
        //     return;
        // }

        this.rooms = [];
        this.selectRooms();
        this.blessRooms();
        for(let i=0;i<9;i++){
            this.rooms[i] = [];
            for(let j=0;j<9;j++){
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
                    else if (j < 8 && j > 0 && worldgen[i][j+1].passable && worldgen[i][j-1].passable){
                        if ((i == 8 || !worldgen[i+1][j].passable) && (i == 0 || !worldgen[i-1][j].passable)){
                            roomType = shuffle([NarrowFaith,BridgeFaith])[0];
                            corridor = true;
                        }
                        else roomType = shuffle(this.roompool)[0];
                        
                    }
                    else if (i < 8 && i > 0 && worldgen[i+1][j].passable && worldgen[i-1][j].passable){
                        if ((j == 8 || !worldgen[i][j+1].passable) && (j == 0 || !worldgen[i][j-1].passable)){
                            roomType = shuffle([NarrowFaith,BridgeFaith])[0];
                            corridor = true;
                        }
                        else roomType = shuffle(this.roompool)[0];
                        flip = true;
                        
                    }
                    //else if (Math.random() < 0.3 && (i+1 == 9 || !worldgen[i+1][j].passable) + (i-1 == -1 || !worldgen[i-1][j].passable) + (j+1 == 9 || !worldgen[i][j+1].passable) + (j-1 == -1 || !worldgen[i][j-1].passable == 3)){
                    //    roomType = HarmonyRelay;
                    //}
                    else roomType = shuffle(this.roompool)[0];
                    if (!(worldgen[i][j] instanceof MarkedFloor)) this.rooms[i][j] = new roomType([i,j]); // kind of cursed
                    else this.rooms[i][j] = roomType;
                    if (universe.worlds[universe.currentworld].cage.slots[i][j].turbulent) this.rooms[i][j].hostile = true;
                    let times = shuffle([-1,0,1])[0];
                    if (corridor) times = 0;
                    if (rooms[this.rooms[i][j].id]["tags"].includes("randomflip") && !corridor) flip = true;
                    if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,times);
                    this.rooms[i][j].setUp();
                    this.rooms[i][j].insertRoom(this.depth);
                    if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,times);
                    if (corridor && flip) this.rooms[i][j].verticality = "side";
                    else if (corridor) this.rooms[i][j].verticality = "up";
                }
                else{
                    this.rooms[i][j] = new VoidRoom([i,j]);
                    this.rooms[i][j].setUp();
                    this.rooms[i][j].insertRoom(this.depth);
                }
            }
        }
        this.depositTiles = [];
        this.depositCreatures = [];
        for(let i=0;i<81;i++){
            this.depositTiles[i] = [];
        }
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if (this.rooms[i][j].tangible){
                    this.spreadExits(i,j);
                    //this.rooms[i][j].setUpSprites();
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
        this.generated = true;
        this.playSpace = new HugeMap([0,0],this);
        for(let i=0;i<81;i++){
            for(let j=0;j<81;j++){
                this.playSpace.tiles[i][j].existSpace = this.playSpace.tiles;
                this.playSpace.tiles[i][j].x = i;
                this.playSpace.tiles[i][j].y = j;            
            }
        }
        for(let i=0;i<81;i++){
            for(let j=0;j<81;j++){   
                if (this.playSpace.tiles[i][j] instanceof Airlock) this.playSpace.tiles[i][j].findDirection();        
            }
        }
    }


    spreadExits(i,j){
        for (let l of this.rooms[i][j].possibleexits){
            const exit = this.rooms[i][j].tiles[l[0]][l[1]];
            //const spreads = {
             //   "N" : universe.worlds[this.x][this.y-1] && universe.worlds[this.x][this.y-1].isAccessible,
            //    "W" : universe.worlds[this.x-1][this.y] && universe.worlds[this.x-1][this.y].isAccessible,
             //   "E" : universe.worlds[this.x+1][this.y] && universe.worlds[this.x+1][this.y].isAccessible,
             //   "S" : universe.worlds[this.x][this.y+1] && universe.worlds[this.x][this.y+1].isAccessible,
            //};
            //if (i == 4 && j == 8 && l[1] == 8 && spreads["S"]) continue;
            //else if (i == 4 && j == 0 && l[1] == 0 && spreads["N"]) continue;
            //else if (i == 8 && j == 4 && l[0] == 8 && spreads["E"]) continue;
            //else if (i == 0 && j == 4 && l[0] == 0 && spreads["W"]) continue;
            if (exit.direction == "N" && (j==0 || this.rooms[i][j-1] instanceof VoidRoom)) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "S" && (j==8 || this.rooms[i][j+1] instanceof VoidRoom)) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "W" && (i==0 || this.rooms[i-1][j] instanceof VoidRoom)) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "E" && (i==8 || this.rooms[i+1][j] instanceof VoidRoom)) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "N2" && (j==0 || this.rooms[i+1][j-1] instanceof VoidRoom|| this.rooms[i+1][j-1].verticality == "side")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "W2" && (i==0 || this.rooms[i-1][j+1] instanceof VoidRoom|| this.rooms[i-1][j+1].verticality == "up")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "SS" && (j==7 || this.rooms[i][j+2] instanceof VoidRoom|| this.rooms[i][j+2].verticality == "side")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "S2" && (j==7 || this.rooms[i+1][j+2] instanceof VoidRoom|| this.rooms[i+1][j+2].verticality == "side")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "EE" && (i==7 || this.rooms[i+2][j] instanceof VoidRoom|| this.rooms[i+2][j].verticality == "up")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            else if (exit.direction == "E2" && (i==7 || this.rooms[i+2][j+1] instanceof VoidRoom|| this.rooms[i+2][j+1].verticality == "up")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1],this.rooms[i][j]);
            this.rooms[i][j].tiles[l[0]][l[1]].eat = false;
        }
    }

    generateCage(){
        let passableRooms=0;
        worldgen = [];
        for(let i=0;i<9;i++){
            worldgen[i] = [];
            for(let j=0;j<9;j++){
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
        for(let i=0;i<9;i++){
            worldgen[i] = [];
            for(let j=0;j<9;j++){
                if((j==8&&i==4)||(j==0&&i==4) || (j==4&&i==8) || (j==4&&i==0) ||(j==4&&i==4)){
                    worldgen[i][j] = new Floor(i,j); // ridiculous, but ingenious!
                    passableRooms++;
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

    playRoom(room,playerHp){
        room.startingplayerHP = playerHp;
        if (!room.playerspawn) room.playerspawn = [4,4];
        tiles = room.tiles;
        if (room instanceof WorldSeed && level == 1) room.populateRoom();
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
        this.rooms[this.currentroom[0]][this.currentroom[1]].playerspawn = null;
        this.rooms[this.currentroom[0]][this.currentroom[1]].monsters = monsters;
        this.rooms[this.currentroom[0]][this.currentroom[1]].tiles = tiles;
        this.rooms[this.currentroom[0]][this.currentroom[1]].visited = room.visited;
        monsters = [];
        let pkeys = Object.keys(player);
        for (let i of pkeys) pdata[i] = player[i];
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
        room.playerspawn = [40+(spawnl[0]-4)*9,40+(spawnl[1]-4)*9];
        room.populateRoom();
        if (!room.visited){
            level++;
            world.fighting = true;
            room.visited = true;
            player.hp = Math.min(maxHp, player.hp+1);
        }
        else{
            monsters = room.monsters;
        }
        this.playRoom(room, player.hp);
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
        if (this.currentroom[0] > 8 || this.currentroom[0] < 0 ||this.currentroom[1] > 8 || this.currentroom[1] < 0){
            universe.shuntWorld(this,direction);
            return;
        }
        let room = this.rooms[this.currentroom[0]][this.currentroom[1]];
        if (room instanceof BigRoomVoid) room = this.handleBigRoom(room,direction[0]);

        room = world.playSpace;

        numTiles = room.size;
        tileSize = (9/numTiles)*64;
        tiles = room.tiles;
        room.playerlastmove = shifts[direction[0]];
        if (!room.playerspawn) room.playerspawn = [40,76];
        room.populateRoom();
        if (!room.visited){
            level++;
            world.fighting = true;
            room.visited = true;
            player.hp = Math.min(maxHp, player.hp+1);
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
        this.startingplayerHP = 0;
        this.roseic = false;
        this.size = 9;
        this.entrancepoints;
        this.returnpoint;
        this.verticality = "none";
        //up left right down
        this.music = false;
        this.entrymessage = false;
        this.generatedexits = [];
        this.playerlastmove = [0,-1];
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
        let hp;
        if(player) hp = player.hp;
        if (!player) player = new Terminal(getTile(this.playerspawn[0], this.playerspawn[1]));
        else{
            player.tile = (getTile(this.playerspawn[0], this.playerspawn[1]));
        }
        //for (let i of Object.keys(pdata)) player[i] = pdata[i];
        player.soul.owner = player;
        player.hp = hp;
        //player.tile = getTile(this.playerspawn[0], this.playerspawn[1]);
        //if (this.hostile && !this.visited) generateMonsters();
        if (this.monsters.length && !this.visited) {
            for (let i of this.monsters){
                monsters.push(i);
            }
        } 
    }

    initializeRoom(){
        if (this.music && this.music != currenttrack) {
            pauseAllMusic();
            playSound(this.music);
            currenttrack = this.music;
        }
        //let randomtile = randomPassableTile();
        if (this.entrymessage) log.addLog(this.entrymessage);
        //if (world.getRoom() instanceof WorldSeed && world.getRoom().generatedexits.length == 0) this.playerspawn = [Math.floor((numTiles-1)/2),Math.floor((numTiles-1)/2)];
        //else if (this.playerspawn.length == 0){
        //    this.playerspawn[0] = randomtile.x;
        //    this.playerspawn[1] = randomtile.y;
        //}
        //if (world.getRoom() instanceof EpsilonArena) this.playerspawn = [1,1];
        if (this.effects.includes("Darkness")) player.fov = 2;
        player.hp = this.startingplayerHP;
        player.lastMove = this.playerlastmove;
        gameState = "running";
    }
}

class DefaultVaultRoom extends Room{
    constructor(index,id){
        super(index);
        this.vault = true;
        this.id = id;
        this.possibleexits;
        this.entrancepoints;
        this.name = "Bleak Corridors";
        this.music = "malform";
        this.depth = 0;
        if (level > 5) this.music = "max";
        else if (level > 10) this.music = "quarry";
    }

    setUp(){
        this.possibleexits = locateExits(this.id);
        if (rooms[this.id]["vertical"] != null){
            if (rooms[this.id]["vertical"] && this.possibleexits.length == 2){
                this.extreme = {
                    "N" : this.possibleexits[0][1],
                    "S" : this.possibleexits[1][1],
                }
                this.entrancepoints = [[this.possibleexits[0][0],this.possibleexits[0][1]+1],[this.possibleexits[1][0],this.possibleexits[1][1]-1]];

            }
            else if (this.possibleexits.length == 2){
                this.extreme = {
                    "W" : this.possibleexits[0][0],
                    "E" : this.possibleexits[1][0],
                }
                this.entrancepoints = [[this.possibleexits[0][0]+1,this.possibleexits[0][1]],[this.possibleexits[1][0]-1,this.possibleexits[1][1]]];
            }
        }
        else{
            if (this.possibleexits.length == 4){
                this.extreme = {
                    "N" : this.possibleexits[0][1],
                    "W" : this.possibleexits[1][0],
                    "E" : this.possibleexits[2][0],
                    "S" : this.possibleexits[3][1],
                }
                this.entrancepoints = [[this.possibleexits[0][0],this.possibleexits[0][1]+1],[this.possibleexits[1][0]+1,this.possibleexits[1][1]],[this.possibleexits[2][0]-1,this.possibleexits[2][1]],[this.possibleexits[3][0],this.possibleexits[3][1]-1]];
            }
            else if (this.possibleexits.length == 8){
                this.extreme = {
                    "N" : this.possibleexits[0][1],
                    "W" : this.possibleexits[2][0],
                    "E" : this.possibleexits[4][0],
                    "S" : this.possibleexits[6][1],
                }
                this.entrancepoints = [[this.possibleexits[0][0],this.possibleexits[0][1]+1],[this.possibleexits[1][0],this.possibleexits[1][1]+1],[this.possibleexits[2][0]+1,this.possibleexits[2][1]],[this.possibleexits[3][0]+1,this.possibleexits[3][1]],[this.possibleexits[4][0]-1,this.possibleexits[4][1]],[this.possibleexits[5][0]-1,this.possibleexits[5][1]],[this.possibleexits[6][0],this.possibleexits[6][1]-1],[this.possibleexits[7][0],this.possibleexits[7][1]-1]];
            }
        }
    }

    recheckExits(){
        let returns = {
            "N" : "S",
            "S" : "N",
            "W" : "E",
            "E" : "W"
        }
        let equiva = {
            "N" : -10,
            "S" : 10,
            "W" : -1,
            "E" : 1
        }
        for (let i of tiles){
            for (let j of i){
                if (j instanceof BExit){
                    this.generatedexits.push(j.direction);
                    let connect;
                    let id = j.id;
                    if (j.id) connect = this.index+j.id;
                    else connect = this.index + equiva[j.direction];
                    if (world.roomlist[connect]){
                        if (world.roomlist[connect].generatedexits.includes(returns[j.direction])){
                            tiles[j.x][j.y].replace(BReturnExit);
                            tiles[j.x][j.y].id = id;
                        }
                        else{
                            tiles[j.x][j.y].replace(world.getRoom().filler);
                            tiles[j.x][j.y].eat = false;
                        }
                    }
                }
            }
        }
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
                if (!keytile[vault[j][i]] || (vault["creatures"] && vault["creatures"][vault[j][i]])) tile = Floor;
                else tile = keytile[vault[j][i]];
                //if (depth == 1 && (tile == Wall || tile == NoBreakWall)) tile = RoseWall;
                if ("nswe".includes(vault[j][i])){
                    let dir;
                    dir = vault[j][i];
                    this.tiles[i][j] = new tile(i,j,dir);
                }
                else this.tiles[i][j] = new tile(i,j,this);
                if (vault["creatures"] && vault["creatures"][vault[j][i]]){
                    let entity = new vault["creatures"][vault[j][i]](this.tiles[i][j]);
                    if (vault["marks"] && vault["marks"][vault[j][i]]) entity.generationMark = vault["marks"][vault[j][i]];
                    this.monsters.push(entity);
                }
            }
        }
    }

    buildRoom(connector){
        generateVault(this.id,this);
        blockedExits(connector);
        let returns = {
            "N" : "S",
            "S" : "N",
            "W" : "E",
            "E" : "W"
        }
        let equiva = {
            "N" : -10,
            "S" : 10,
            "W" : -1,
            "E" : 1
        }
        for (let i of tiles){
            for (let j of i){
                if (j instanceof BExit){
                    this.generatedexits.push(j.direction);
                    let connect;
                    let id = j.id;
                    if (j.id) connect = this.index+j.id;
                    else connect = this.index + equiva[j.direction];
                    if (world.roomlist[connect]){
                        if (world.roomlist[connect].generatedexits.includes(returns[j.direction])){
                            tiles[j.x][j.y].replace(BReturnExit);
                            tiles[j.x][j.y].id = id;
                        }
                        else{
                            tiles[j.x][j.y].replace(world.getRoom().filler);
                            tiles[j.x][j.y].eat = false;
                        }
                    }
                }
            }
        }
    }
}

class StandardFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = shuffle(["Standard","CatsCross","Garnison"])[0];
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
        this.id = shuffle(["LaserHall"])[0]; //"Narrow",
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
        summonExits();
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
        //world.fighting = false;
        //super.populateRoom();
        super.initializeRoom();
        summonExits();
        if (research.knownnodes.includes("Cage")) research.completeResearch("Seed");
        //this.startTutorial();
    }

    startTutorial(){
        world.getRoom().tiles = tiles;
        world.getRoom().monsters = monsters;
        generateVault("Tutorial",this);
        let monster = new Blehh(getTile(4,2));
        monster.paralyzed = true;
        monsters.push(monster);
    }

    progressTutorial(stage){
        for (let i of tiles){
            for (let j of i){
                if (j.monster) j.monster = null;
            }
        }
        player.move(getTile(4,6));
        monsters = [];
        let source;
        player.hp = 6;
        let monster = new Blehh(getTile(4,2));
        monster.stage = stage;
        wheel.wheel = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        switch(stage){
            case 1:
                log.addLog("Blehh1");
                monster.canmove = false;
                break;
            case 2:
                log.addLog("Blehh2");
                source = new Scion(getTile(4,4));
                source.hp = 1;
                source.paralyzed = true;
                monsters.push(source);
                monster.canmove = false;
                player.hp = 1;
                break;
                //both of you have 1 hp, heal then hit
            case 3:
                log.addLog("Blehh3");
                source = new Apiarist(getTile(4,4));
                monsters.push(source);
                monster.canmove = false;
                monster.bonusAttack = 10;
                break;
                //guard then strike
            case 5:
                log.addLog("Blehh5");
                source = new Tinker(getTile(3,4));
                monsters.push(source);
                source = new KnockbackBot(getTile(5,1));
                monsters.push(source);
                source = new KnockbackBot(getTile(3,3));
                monsters.push(source);
                source = new WalkBot(getTile(5,4));
                source.isInvincible = true;
                monster.canmove = false;
                monsters.push(source);
                break;
                //guarded by knockback drones, get the beam to hit zaint
            case 4:
                log.addLog("Blehh4");
                source = new Apis(getTile(4,4));
                monsters.push(source);
                source = new KnockbackBot(getTile(5,1));
                monsters.push(source);
                source = new KnockbackBot(getTile(3,3));
                monsters.push(source);
                monster.canmove = false;
                //shoot through the diagonal gap
                break;
            case 6:
                log.addLog("Blehh6");
                monster.canmove = false;
                player.hp = 5;
                source = new Shrike(getTile(4,4));
                monsters.push(source);
                //perma X and + beams, dash on the side to succeed
                break;
            case 7:
                log.addLog("Blehh7");
                monster.canmove = false;
                source = new Second(getTile(6,4));
                monsters.push(source);
                monster.hp = 5;
                player.hp = 3;
                //tons of felidols weakening you, buff up to 1hit zaint
                break;
            case 8:
                //do epic zhit
                log.addLog("Blehh8");
        }
        monsters.push(monster);
    }
}

class AnnounceCorridor extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Announce";
    }
    populateRoom(){
        super.populateRoom();
        summonExits();
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
        wheel.toPaintMode();
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
        summonExits();
    }

    determineLoot(type){
        let lootdrop = new Senet();
        lootdrop = relayPool[type][randomRange(0,relayPool[type].length-1)];
        return lootdrop;
    }

    draw(){
        wheel.hide = false;
        if (player.tile instanceof BetAltar){
            let commoncheck = false;
            for (let x of commons){
                if (player.tile.value instanceof x) commoncheck = true;
            }
            if (!commoncheck && !inInventory && !inResearch){
                player.tile.value.describeAbridged();
                wheel.hide = true;
            }
        }
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
        this.size = 81;
        this.id = "Beeg";
        this.world = myWorld;
        for (let i=0; i<81; i++){
            rooms[this.id][i] = ".".repeat(81);
        }
        this.tiles = this.world.depositTiles;
        this.monsters = this.world.depositCreatures;
        if (!this.monsters) this.monsters = [];

    }

    initializeRoom(){
        super.initializeRoom();
        for (let i=0; i<81; i++){
            for (let j=0; j<81; j++){
                tiles[i][j].x = i;
                tiles[i][j].y = j;
            }
        }
        summonExits();
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