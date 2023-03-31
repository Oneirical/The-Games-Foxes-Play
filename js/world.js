class CageTemplate{
    constructor(){
        this.slots = [];
        this.build();
    }

    build(){
        for(let i=0;i<9;i++){
            this.slots[i] = [];
            for(let j=0;j<9;j++){
                this.slots[i][j] = new Empty();
            }
        }
    }
}

class Universe{
    constructor(){
        this.worlds = [];
        this.currentworld = [4,4];
        this.maze;
        this.initiate();
    }

    initiate(){
        this.maze = new MazeBuilder(40, 40).maze;
        for (let i = 0; i<81;i++){
            this.worlds[i] = [];
            for (let j = 0; j<81;j++){
                this.worlds[i][j] = new World(i,j);
                if (this.maze[i][j][0] != "wall") this.worlds[i][j].isAccessible = true;
                else this.worlds[i][j].isAccessible = false;
            }
        }
    }

    display(){
        drawFilter(blackfilter);
        for (let i = 0; i<81;i++){
            for (let j = 0; j<81;j++){
                let colour = 5;
                if (this.worlds[i][j].isAccessible) colour = 0;
                this.worlds[i][j].represent(colour);
            }
        }
        drawPixel(6,this.currentworld[0]*7.11,this.currentworld[1]*7.11);
    }

    start(startingHp){
        tiles = [];
        monsters = [];
        const debut = this.randomAvailableWorld();
        const position = [debut.x,debut.y];
        this.currentworld = position;
        world = this.worlds[position[0]][position[1]];
        world.confirmWorldFromVault();
        for (let i = 1; i<7;i++){
            this.infestRandom(i);
        }
        //let i = 0;
        //while(i < 300){
        //    if (this.spreadHarmony()) break;
        //    i++;
        //}
        world.currentroom = [4,4];
        world.playRoom(world.rooms[4][4],startingHp);
        log.addLog("MapDebug");
    }

    infestRandom(faction){
        const debut = this.randomAvailableWorld();
        let position = [debut.x,debut.y];
        const positions = {
            1: [41,41],
            2: [1,1],
            3: [79,1],
            4: [1,79],
            5: position,
            6: [79,79]
        }
        position = positions[faction];
        this.worlds[position[0]][position[1]].faction = faction;
    }

    spreadHarmony(){
        let finished = true;
        for (let i = 0; i<80;i++){
            for (let j = 0; j<80;j++){
                if (this.worlds[i][j].faction > 0 && !this.worlds[i][j].finishedspread){
                    this.worlds[i][j].finishedspread = true;
                    if (this.worlds[i+1][j].isAccessible && this.worlds[i+1][j].faction == 0){
                        this.worlds[i+1][j].faction = this.worlds[i][j].faction;
                        this.worlds[i+1][j].finishedspread = true;
                    }
                    if (this.worlds[i-1][j].isAccessible && this.worlds[i-1][j].faction == 0){
                    this.worlds[i-1][j].faction = this.worlds[i][j].faction;
                    this.worlds[i-1][j].finishedspread = true;
                    }
                    if (this.worlds[i][j+1].isAccessible && this.worlds[i][j+1].faction == 0){
                    this.worlds[i][j+1].faction = this.worlds[i][j].faction;
                    this.worlds[i][j+1].finishedspread = true;
                    }
                    if (this.worlds[i][j-1].isAccessible && this.worlds[i][j-1].faction == 0){
                    this.worlds[i][j-1].faction = this.worlds[i][j].faction;
                    this.worlds[i][j-1].finishedspread = true;
                    }
                }
            }
        }
        for (let i = 0; i<80;i++){
            for (let j = 0; j<80;j++){
                this.worlds[i][j].finishedspread = false;
                if (this.worlds[i][j].faction == 0) finished = false;
            }
        }
        return finished;
    }

    randomAvailableWorld(){
        let world;
        tryTo('get random passable world', function(){
            let x = randomRange(50,70);
            let y = randomRange(50,70);
            world = universe.worlds[x][y];
            return (world.isAccessible && world.faction == 0);
        });
        return world;
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
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.roompool = [];
        this.isAccessible = false;
        this.finishedspread = false;
        this.generated = false;
        this.currentroom = [4,4]; //parseInt((randomRange(0,8).toString()+randomRange(0,8).toString()));
        this.serene = false;
        this.faction = 0;
        this.fighting = false;
        this.rooms;
        this.cage = new CageTemplate();
    }

    checkPixel(tile){
        if (tile instanceof BExit || tile instanceof MapExit) return 6;
        else if (tile.passable) return 5;
        else return 0;
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

    display(){
        //drawFilter(blackfilter);
        for(let y = 0; y<9;y++){
            for(let x = 0; x<9;x++){
                if (this.rooms[x][y].tangible){
                    for(let i = 0; i<this.rooms[x][y].size;i++){
                        for (let j = 0; j<this.rooms[x][y].size; j++){
                            if (!(this.rooms[x][y].tiles[i][j] instanceof RealityWall)) drawPixel(this.checkPixel(this.rooms[x][y].tiles[i][j]),i*7+x*64,j*7+y*64);
                        }
                    }
                    if (this.rooms[x][y] instanceof HarmonyRelay) drawPixel(4,4*7+x*64,4*7+y*64);
                }
            }
        }
        for(let i = 0; i<numTiles;i++){
            for (let j = 0; j<numTiles; j++){
                if (!(tiles[i][j] instanceof RealityWall)) drawPixel(this.checkPixel(tiles[i][j]),i*7+this.currentroom[0]*64,j*7+this.currentroom[1]*64);
                if (tiles[i][j].monster && tiles[i][j].monster.isPlayer) drawPixel(3,i*7+this.currentroom[0]*64,j*7+this.currentroom[1]*64);
            }
        }
    }

    getRoom(){
        return this.rooms[this.currentroom[0]][this.currentroom[1]];
    }

    selectRooms(){
        if (this.serene) this.roompool = [StandardSpire];
        else this.roompool = [StandardFaith,BloxFaith,EmptyFaith,HideFaith,PipesFaith,TriangleFaith,StarFaith]; //GrandHallFaith,BridgeFaith,HideFaith,PipesFaith,GrandHallFaith,,TriangleFaith,NarrowFaith
    }

    confirmWorldFromVault(){
        this.rooms = [];
        for(let i=0;i<9;i++){
            this.rooms[i] = [];
            for(let j=0;j<9;j++){
                let flip = false;
                let roomType = keyroom[genstruct["Facility"][j][i]];
                if (genstruct["Facility"][j][i] == "H") flip = true;
                this.rooms[i][j] = new roomType([i,j]);
                if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,0);
                this.rooms[i][j].setUp();
                this.rooms[i][j].insertRoom();
                if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,0);
            }
        }
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if (this.rooms[i][j].tangible) this.spreadExits(i,j);
            }
        }
    }

    confirmWorld(){
        //tryTo('generate a world', function(){
            //return world.generateWorld() == randomPassableRoom().getConnectedRooms().length;
        //});

        if (world.generateCage() != randomPassableRoom().getConnectedRooms().length){
            log.addLog("WrongCageError");
            return;
        }

        this.rooms = [];
        this.selectRooms();
        let placedboss = false;
        for(let i=0;i<9;i++){
            this.rooms[i] = [];
            for(let j=0;j<9;j++){
                if (worldgen[i][j] instanceof RealityWall) this.rooms[i][j] = new BigRoomVoid([i,j],worldgen[i][j].quadrant);
                else if (worldgen[i][j].passable){
                    let roomType;
                    let flip = false;
                    let corridor = false;
                    let bannedsquares = [[4,8],[8,4],[0,4],[4,0],[4,4]];
                    if ((j == 8 && i == 4) || (j == 4 && i == 8) || (j == 0 && i == 4) || (j == 4 && i == 0)) roomType = EmptyFaith;
                    else if (j == 4 && i == 4) roomType = PlateGenerator;
                    else if (Math.random() < 0.9 && j < 8 && i < 8 && worldgen[i+1][j].passable && worldgen[i][j+1].passable && worldgen[i+1][j+1].passable && !isArrayInArray(bannedsquares,[i+1,j]) && !isArrayInArray(bannedsquares,[i+1,j+1]) && !isArrayInArray(bannedsquares,[i,j+1])){
                        if (!placedboss){
                            roomType = EpsilonArena;
                            placedboss = true; // temporary
                        }
                        else roomType = shuffle([RogueFaith,GrandHallFaith])[0];
                        worldgen[i+1][j] = new RealityWall(i+1,j,"E");
                        worldgen[i][j+1] = new RealityWall(i,j+1,"S");
                        worldgen[i+1][j+1] = new RealityWall(i+1,j+1,"ES");
                    }
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
                    else if (Math.random() < 0.3 && (i+1 == 9 || !worldgen[i+1][j].passable) + (i-1 == -1 || !worldgen[i-1][j].passable) + (j+1 == 9 || !worldgen[i][j+1].passable) + (j-1 == -1 || !worldgen[i][j-1].passable == 3)){
                        roomType = HarmonyRelay;
                    }
                    else roomType = shuffle(this.roompool)[0];
                    this.rooms[i][j] = new roomType([i,j]);
                    let times = shuffle([-1,0,1])[0];
                    if (corridor) times = 0;
                    if (rooms[this.rooms[i][j].id]["tags"].includes("randomflip") && !corridor) flip = true;
                    if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,times);
                    this.rooms[i][j].setUp();
                    this.rooms[i][j].insertRoom();
                    if (flip) flipRoom(this.rooms[i][j].id,this.rooms[i][j].size,times);
                    if (corridor && flip) this.rooms[i][j].verticality = "side";
                    else if (corridor) this.rooms[i][j].verticality = "up";
                }
                else this.rooms[i][j] = new VoidRoom([i,j]);
            }
        }
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if (this.rooms[i][j].tangible) this.spreadExits(i,j);
            }
        }
        this.generated = true;
    }

    spreadExits(i,j){
        for (let l of this.rooms[i][j].possibleexits){
            const exit = this.rooms[i][j].tiles[l[0]][l[1]];
            const spreads = {
                "N" : universe.worlds[this.x][this.y-1] && universe.worlds[this.x][this.y-1].isAccessible,
                "W" : universe.worlds[this.x-1][this.y] && universe.worlds[this.x-1][this.y].isAccessible,
                "E" : universe.worlds[this.x+1][this.y] && universe.worlds[this.x+1][this.y].isAccessible,
                "S" : universe.worlds[this.x][this.y+1] && universe.worlds[this.x][this.y+1].isAccessible,
            };
            if (i == 4 && j == 8 && l[1] == 8 && spreads["S"]) continue;
            else if (i == 4 && j == 0 && l[1] == 0 && spreads["N"]) continue;
            else if (i == 8 && j == 4 && l[0] == 8 && spreads["E"]) continue;
            else if (i == 0 && j == 4 && l[0] == 0 && spreads["W"]) continue;
            else if (exit.direction == "N" && (j==0 || this.rooms[i][j-1] instanceof VoidRoom)) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "S" && (j==8 || this.rooms[i][j+1] instanceof VoidRoom)) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "W" && (i==0 || this.rooms[i-1][j] instanceof VoidRoom)) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "E" && (i==8 || this.rooms[i+1][j] instanceof VoidRoom)) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "N2" && (j==0 || this.rooms[i+1][j-1] instanceof VoidRoom|| this.rooms[i+1][j-1].verticality == "side")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "W2" && (i==0 || this.rooms[i-1][j+1] instanceof VoidRoom|| this.rooms[i-1][j+1].verticality == "up")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "SS" && (j==7 || this.rooms[i][j+2] instanceof VoidRoom|| this.rooms[i][j+2].verticality == "side")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "S2" && (j==7 || this.rooms[i+1][j+2] instanceof VoidRoom|| this.rooms[i+1][j+2].verticality == "side")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "EE" && (i==7 || this.rooms[i+2][j] instanceof VoidRoom|| this.rooms[i+2][j].verticality == "up")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
            else if (exit.direction == "E2" && (i==7 || this.rooms[i+2][j+1] instanceof VoidRoom|| this.rooms[i+2][j+1].verticality == "up")) this.rooms[i][j].tiles[l[0]][l[1]] = new this.rooms[i][j].filler(l[0],l[1]);
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
                if((j==8&&i==4)||(j==0&&i==4) || (j==4&&i==8) || (j==4&&i==0) || (j==4&&i==4)){
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
        room.initializeRoom();
    }

    saveRoom(room){
        this.rooms[this.currentroom[0]][this.currentroom[1]].playerspawn = null;
        this.rooms[this.currentroom[0]][this.currentroom[1]].monsters = monsters;
        this.rooms[this.currentroom[0]][this.currentroom[1]].tiles = tiles;
        this.rooms[this.currentroom[0]][this.currentroom[1]].visited = room.visited;
        monsters = [];
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
        numTiles = room.size;
        tileSize = (9/numTiles)*64;
        tiles = room.tiles;
        if (!room.visited){
            level++;
            world.fighting = true;
            room.populateRoom();
            room.visited = true;
            wheel.resolve = 3+Math.floor(resolvebonus/2);
            player.hp = Math.min(maxHp, player.hp+1);
        }
        else{
            monsters = room.monsters;
        }
        room.playerlastmove = shifts[direction[0]];
        if (!room.playerspawn) room.playerspawn = this.selectPlayerExit(direction[0]);
        this.playRoom(room, player.hp);
    }

    handleBigRoom(room,direction){
        let correctroom;
        if (room.quadrant == "E"){
            correctroom = this.rooms[this.currentroom[0]-1][this.currentroom[1]];
            if (direction == "W") correctroom.playerspawn = [16,4];
            else if (direction == "S") correctroom.playerspawn = [13,1];
            this.currentroom[0] -= 1;
        }
        else if (room.quadrant == "ES"){
            correctroom = this.rooms[this.currentroom[0]-1][this.currentroom[1]-1];
            if (direction == "W") correctroom.playerspawn = [16,13];
            else if (direction == "N") correctroom.playerspawn = [13,16];
            this.currentroom[0] -= 1;
            this.currentroom[1] -= 1;
        }
        else if (room.quadrant == "S"){
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
        this.playerspawn;
        this.tangible = true;
        this.effects = [];
        this.previousRoom = -1; //Maybe secretly divide arrow tiles into return/generator tiles?
        this.index = [index[0],index[1]];
        this.tiles = []; //it will also need to stock the contents of course
        this.monsters = [];
        this.vault = true;
        this.name = "Bugtopia";
        this.fourway = false;
        this.filler = Wall;
        this.vault = false;
        this.extreme = {
            "N" : 0,
            "W" : 0,
            "E" : numTiles-1,
            "S" : numTiles-1,
        }
        this.visited = false;
    }

    draw(){

    }

    populateRoom(){
        return; //for now
        const squadskey = Object.keys(squads);
        const classeskey = Object.keys(classes);
        const difficulty = 1;//Math.ceil(level/5);
        for (let i = 0; i<difficulty; i++){
            
            let origin = randomRange(0,1);
            origin = 1; //debug
            if (origin){
                let team = squads[squadskey[randomRange(0,squadskey.length-1)]];
                team = squads["Test"]; //debug
                for (let l of team){
                    let creature = new l(randomPassableTile());
                    monsters.push(creature);
                }
            }
            else{
                for (let j = 0; j<3; j++){
                    let pool = classes[classeskey[randomRange(0,classeskey.length-1)]]
                    let creature = new pool[randomRange(0,pool.length-1)](randomPassableTile());
                    monsters.push(creature);
                }
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
        player = new Player(getTile(this.playerspawn[0], this.playerspawn[1]));
        if (this.effects.includes("Darkness")) player.fov = 2;
        for (let k of wheel.saved){
            if (!(k instanceof Empty))wheel.discard.push(k);
        }
        wheel.saved = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        player.hp = this.startingplayerHP;
        player.lastMove = this.playerlastmove;
        gameState = "running";
    }
}

class WorldSeedUnused extends Room{
    constructor(index){
        super(index);
        this.name = "World Seed";
        this.music = "cage";
        this.possibleexits = [[4,8]];
    }

    buildRoom(){
        
        generateLevel();
        generateMonsters();
    }

    initializeRoom(){
        this.entrancepoints = [[Math.floor((numTiles-1)/2),1], [1,Math.floor((numTiles-1)/2)],[(numTiles-2),Math.floor((numTiles-1)/2)],[Math.floor((numTiles-1)/2),(numTiles-2)]];
        super.initializeRoom();
        this.generatedexits = ["S"];
    }
}

class DefaultVaultRoom extends Room{
    constructor(index){
        super(index);
        this.vault = true;
        this.possibleexits;
        this.entrancepoints;
        this.name = "Faith's End";
        this.music = "malform";
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

    insertRoom(){
        this.tiles = [];
        let vault = rooms[this.id];
        for(let i=0;i<this.size;i++){
            this.tiles[i] = [];
            for(let j=0;j<this.size;j++){
                let tile = keytile[vault[j][i]];
                if ("nswe".includes(vault[j][i])){
                    let dir;
                    dir = vault[j][i];
                    this.tiles[i][j] = new tile(i,j,dir);
                }
                else this.tiles[i][j] = new tile(i,j,this);
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
        this.id = "Standard";
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
        this.id = "Narrow";
    }
}
class GrandHallFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "GrandHall";
        this.size = 18;
    }
}

class WorldSeed extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Seed";
        this.visited = true;
        this.name = "World Seed";
        this.music = "cage";
        this.filler = TermiWall;
        this.stage = 0;
    }

    initializeRoom(){
        world.fighting = false;
        super.initializeRoom();
        summonExits();
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
                if (j.monster) j.monster = 0;
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

    populateRoom(){
        let monsterType = shuffle([Hologram])[0];
        let tile = getTile(4,6);
        let monster = new monsterType(tile);
        monsters.push(monster);
    }
}

class EmptyFaith extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Empty";
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
        this.id = "Corners";
    }
}

class SoulCage extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.id = "Cage2";
        this.name = "Soul Cage";
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
        //this.filler = AbazonWall;
        this.id = "Empty";
    }

    populateRoom(){
        let monsterType = shuffle([Harmonizer])[0];
        let tile = getTile(4,4);
        world.getRoom().fuffspawn = tile;
        let monster = new monsterType(tile);
        monsters.push(monster);
    }

    initializeRoom(){
        world.fighting = false;
        dialoguecount = 0;
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
            if (!commoncheck && !inInventory && !inModules){
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

class EpsilonArena extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.size = 18;
        this.entrymessage = "EpsilonWelcome1";
        this.name = "Industrial Apex";
        this.music = "epsilon";
        this.id = "Epsilon";
        this.fourway = true;
    }

    populateRoom(){
        showboss = true;
        let monsterType = shuffle([Epsilon])[0];
        let monster = new monsterType(getTile(9,8));
        monsters.push(monster);
        for (let i = 1; i < 5; i++){
            let tail = new Tail(getTile(9,i+8),i);
            monsters.push(tail);
        }
        let corelist = ["Red","Pink","Cyan","White"];
        for (let i = 0;i<4;i++){
            let corecolour = shuffle(corelist)[0];
            removeItemOnce(corelist,corecolour);
            let box = new Box(randomPushableTile(), corecolour);
            monsters.push(box);
        }
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
        dialoguecount = 0;
        this.playerspawn = getTile(1,8);
        super.initializeRoom();
    }
}