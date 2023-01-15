class Universe{
    constructor(){
        this.worlds = [];
        this.currentworld = [4,4];
        this.maze;
        this.initiate();
    }

    initiate(){
        for (let i = 0; i<81;i++){
            this.worlds[i] = [];
            for (let j = 0; j<81;j++){
                this.worlds[i][j] = new EmptyWorld(i,j);
            }
        }
        this.maze = new MazeBuilder(40, 40).maze;
    }

    display(){
        drawFilter(blackfilter);
        for (let i = 0; i<81;i++){
            for (let j = 0; j<81;j++){
                let colour = 5;
                if (this.maze[i][j][0] != "wall") colour = 0;
                if (i > 28 && i < 36 && j > 28 && j < 36 && this.maze[i][j][0] != "wall") colour = 6;
                else if (i > 28 && i < 36 && j > 28 && j < 36) colour = 7;
                this.worlds[i][j].represent(colour);
            }
        }
    }
}

class EmptyWorld{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    represent(colour){
        drawPixel(colour,this.x*7.11,this.y*7.11);
    }
}

class World{
    constructor(serene){
        this.roompool = [];
        this.roomlist = {};
        this.currentroom = 44; //parseInt((randomRange(0,8).toString()+randomRange(0,8).toString()));
        this.serene = serene;
        this.fighting = false;
        this.fabrication;
        this.avoiddraw = [];
    }

    checkPixel(tile){
        if (tile.passable || tile instanceof BExit || tile instanceof BReturnExit || tile instanceof RealityWall) return 1;
        else return 0;
    }

    display(){
        drawFilter(blackfilter);
        for(let i = 0; i<numTiles;i++){
            for (let j = 0; j<numTiles; j++){
                //if (world.getRoom().extreme["W"] == i || world.getRoom().extreme["E"] == i || world.getRoom().extreme["S"] == j || world.getRoom().extreme["N"] == j )drawPixel(4,i*7//+lastDigit(this.currentroom)*64,j*7+firstDigit(this.currentroom)*64);
                //else
                drawPixel(this.checkPixel(tiles[i][j]),i*7.11+lastDigit(this.currentroom)*64,j*7.11+firstDigit(this.currentroom)*64);
                if (tiles[i][j].monster && tiles[i][j].monster.isPlayer) drawPixel(3,i*7.11+lastDigit(this.currentroom)*64,j*7.11+firstDigit(this.currentroom)*64);
            }
        }
        for(let y = 0; y<9;y++){
            for(let x = 0; x<9;x++){
                if (this.roomlist[y*10+x] && !this.avoiddraw.includes(y*10+x) && y*10+x != this.currentroom){
                    for(let i = 0; i<this.roomlist[y*10+x].size;i++){
                        for (let j = 0; j<this.roomlist[y*10+x].size; j++){
                            drawPixel(this.checkPixel(this.roomlist[y*10+x].tiles[i][j]),i*7.11+lastDigit(y*10+x)*64,j*7.11+firstDigit(y*10+x)*64);
                        }
                    }
                }
            }
        }
    }

    getRoom(){
        return (this.roomlist[this.currentroom]);
    }
    getBuildingRoom(){
        return this.fabrication;
    }
    selectRooms(){
        if (this.serene) this.roompool = [StandardSpire];
        else this.roompool = [StandardFaith]; //GrandHallFaith,BloxFaith,BridgeFaith,HideFaith,PipesFaith,GrandHallFaith,,TriangleFaith,NarrowFaith,EmptyFaith
    }

    confirmWorld(){
        tryTo('generate a world', function(){
            return world.generateWorld() == randomPassableRoom().getConnectedRooms().length;
        });      
    }

    generateWorld(){
        let passableRooms=0;
        worldgen = [];
        for(let i=0;i<9;i++){
            worldgen[i] = [];
            for(let j=0;j<9;j++){
                if((j==8&&i==4)||(j==0&&i==4) || (j==4&&i==8) || (j==4&&i==0)){
                    worldgen[i][j] = new Floor(i,j); // ridiculous, but ingenious!
                    passableRooms++;
                }
                else if(Math.random() < 0.3){
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

    addRoom(coordinates, connector,id){
        log.allgrey = true;
        let roomType;
        if (level == 0) roomType = WorldSeed;
        else if (level == 17 && !this.serene) roomType = EpsilonArena;
        else if (level % 5 == 1 && level > 5 && this.serene) roomType = FluffianWorkshop;
        else if (level % 5 == 1 && level > 5 && !this.serene) roomType = HarmonyRelay;
        else{
            tryTo("find a suitable room",function(){
                roomType = shuffle(world.roompool)[0];
                let testRoom = new roomType(99);
                if (rooms[testRoom.id]["vertical"] != null){
                    if (!rooms[testRoom.id]["vertical"] && (coordinates == "N" || coordinates == "S")) return true;
                    else if (rooms[testRoom.id]["vertical"] && (coordinates == "W" || coordinates == "E")) return true;
                    else return false;
                }
                if (testRoom.size > 99){
                    if (coordinates == "N" && world.roomlist[world.currentroom-20] == null && world.roomlist[world.currentroom-19] == null && world.roomlist[world.currentroom-9] == null) return true;
                    else if (coordinates == "W" && world.roomlist[world.currentroom-2] == null && world.roomlist[world.currentroom+9] == null && world.roomlist[world.currentroom+8] == null) return true;
                    else if (coordinates == "E" && world.roomlist[world.currentroom+2] == null && world.roomlist[world.currentroom+11] == null && world.roomlist[world.currentroom+12] == null) return true;
                    else if (coordinates == "S" && world.roomlist[world.currentroom+20] == null && world.roomlist[world.currentroom+21] == null && world.roomlist[world.currentroom+11] == null) return true;
                    else return false;
                     // test if big room can be included and where
                }
                else return true;
            });
        }
        let shift = 0;
        let testRoom = new roomType(99);
        numTiles = testRoom.size;
        tileSize = (9/numTiles)*64;
        if (id) shift = id;
        else if (coordinates == "N") shift = -10*(testRoom.size/9);
        else if (coordinates == "W") shift = -1*(testRoom.size/9);
        else if (coordinates == "E") shift = 1;
        else if (coordinates == "S") shift = 10;
        if (id){
            if (coordinates == "W") shift+= -1*(testRoom.size/9-1);
            else if (coordinates == "N") shift+= -10*(testRoom.size/9-1);
        }
        //let bigroomtests = [1,10,11];
        //for (let i of bigroomtests){
        //    if (this.roomlist[this.currentroom+shift+i] && this.roomlist[this.currentroom+shift+i].size > 9){
        //        shift+=i;
        //    }
        //}
        //if (testRoom.size > 9 && this.roomlist[this.currentroom+shift+11]){ // check this more
        //    shift-=1;
        //}
        if (this.roomlist[this.currentroom+shift]){
            this.reloadRoom(shift,coordinates);
            return "goback";
        }
        let room = new roomType(this.currentroom+shift);
        this.fabrication = room;
        if (room.vault) room.setUp();
        if (coordinates != "firstroom"){
            if (this.getRoom().music){
        //        if (this.getRoom().music == room.music) room.music = false;
            }
        }
        let list = [10,1,-1,-10];
        let motion = [[0,1],[1,0],[-1,0],[0,-1]];
        if (coordinates != "firstroom"){
            if (world.getRoom().possibleexits.length == 2 && rooms[world.getRoom().id].vertical){
                list = [-10,10];
                motion = [[0,1],[0,-1]];
            }
            else if (world.getRoom().possibleexits.length == 2 && !rooms[world.getRoom().id].vertical){
                list = [-1,1];
                motion = [[1,0],[-1,0]];
            }
            else if (world.getRoom().possibleexits.length == 8){
                list = [20,21,2,12,-1,-11,-10,-9];
                motion = [[0,1],[0,1],[1,0],[1,0],[-1,0],[-1,0],[0,-1],[0,-1]];
            }
        }
        this.currentroom = this.currentroom+shift;
        if (coordinates == "firstroom"){
        }
        else if (id) {
            room.returnpoint = room.possibleexits[list.indexOf(id)];
            room.playerlastmove = motion[list.indexOf(id)];
        }
        else if (coordinates == "N"){
            room.returnpoint = room.possibleexits[list[0]];
            room.playerlastmove = [0,-1];
        }
        else if (coordinates == "W"){ 
            room.returnpoint = room.possibleexits[list[1]];
            room.playerlastmove = [-1,0];
        }
        else if (coordinates == "E"){ 
            room.returnpoint = room.possibleexits[list[2]];
            room.playerlastmove = [1,0];
        }
        else if (coordinates == "S"){ 
            room.returnpoint = room.possibleexits[list[3]];
            room.playerlastmove = [0,1];
        }
        this.roomlist[this.currentroom] = room;
        if (room.size > 9){
            room.core = this.currentroom;
            this.roomlist[this.currentroom+10] = room;
            this.roomlist[this.currentroom+1] = room;
            this.roomlist[this.currentroom+11] = room;
            this.avoiddraw.push(this.currentroom+10);
            this.avoiddraw.push(this.currentroom+1);
            this.avoiddraw.push(this.currentroom+11);
        }
        room.buildRoom(connector);
        wheel.resolve = 3+ Math.floor(resolvebonus/2);
        exitspawn = 0;
        return room;
    }

    checkCompatibility(){

    }

    playRoom(room,playerHp){
        this.currentroom = room.index;
        room.startingplayerHP = playerHp;
        room.initializeRoom();
    }

    saveRoom(tiles, monsters){
        this.roomlist[this.currentroom].monsters = monsters;
        this.roomlist[this.currentroom].tiles = tiles;
    }

    reloadRoom(id, coordinates){
        exitspawn = 1;
        numTiles = this.roomlist[id+this.currentroom].size;
        tileSize = (9/numTiles)*64;
        let room = this.roomlist[id+this.currentroom];
        monsters = this.roomlist[id+this.currentroom].monsters;
        tiles = this.roomlist[id+this.currentroom].tiles;
        let spawnlocation;

        let quadrant; // code gods, forgive me for what is to come
        let exitnum;
        if (room.core){
            quadrant = id+this.currentroom-room.core;
            if (quadrant == 0 && coordinates == "S") exitnum = 1;
            else if (quadrant == 0 && coordinates == "E") exitnum = 3;
            else if (quadrant == 1 && coordinates == "S") exitnum = 2;
            else if (quadrant == 1 && coordinates == "W") exitnum = 5;
            else if (quadrant == 10 && coordinates == "E") exitnum = 4;
            else if (quadrant == 10 && coordinates == "N") exitnum = 7;
            else if (quadrant == 11 && coordinates == "N") exitnum = 8;
            else if (quadrant == 11 && coordinates == "W") exitnum = 6;
        }

        let list = [10,1,-1,-10];
        let motion = [[0,1],[1,0],[-1,0],[0,-1]];
        if (room.possibleexits.length == 2 && rooms[world.getRoom().id+this.currentroom].vertical){
            list = [-10,10];
            motion = [[0,1],[0,-1]];
        }
        else if (room.possibleexits.length == 2 && !rooms[world.getRoom().id+this.currentroom].vertical){
            list = [-1,1];
            motion = [[1,0],[-1,0]];
        }
        else if (room.possibleexits.length == 8){
            list = [20,21,2,12,-1,-11,-10,-9];
            motion = [[0,1],[0,1],[1,0],[1,0],[-1,0],[-1,0],[0,-1],[0,-1]];
        }
        if (coordinates == "firstroom"){
        }
        else if (exitnum){
            spawnlocation = room.entrancepoints[exitnum-1];
            room.playerlastmove = motion[exitnum-1];
        }
        else if (id) {
            spawnlocation = room.entrancepoints[list.indexOf(id)];
            room.playerlastmove = motion[list.indexOf(id)];
        }
        else if (coordinates == "N"){
            spawnlocation = room.entrancepoints[list[0]];
            room.playerlastmove = [0,-1];
        }
        else if (coordinates == "W"){ 
            spawnlocation = room.entrancepoints[list[1]];
            room.playerlastmove = [-1,0];
        }
        else if (coordinates == "E"){ 
            spawnlocation = room.entrancepoints[list[2]];
            room.playerlastmove = [1,0];
        }
        else if (coordinates == "S"){ 
            spawnlocation = room.entrancepoints[list[3]];
            room.playerlastmove = [0,1];
        }
        this.roomlist[id+this.currentroom].playerspawn = [spawnlocation[0],spawnlocation[1]];
        if (!(room instanceof WorldSeed)) room.recheckExits();
        this.playRoom(this.roomlist[id+this.currentroom], player.hp);
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
        //up left right down
        this.music = false;
        this.entrymessage = false;
        this.generatedexits = [];
        this.playerlastmove = [0,-1];
        this.core;
        this.playerspawn = [];
        this.effects = [];
        this.previousRoom = -1; //Maybe secretly divide arrow tiles into return/generator tiles?
        this.index = index;
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
    }

    draw(){

    }

    initializeRoom(){
        if (this.music && this.music != currenttrack) {
            pauseAllMusic();
            playSound(this.music);
            currenttrack = this.music;
        }
        let randomtile = randomPassableTile();
        if (this.entrymessage) log.addLog(this.entrymessage);
        if (world.getRoom() instanceof WorldSeed && world.getRoom().generatedexits.length == 0) this.playerspawn = [Math.floor((numTiles-1)/2),Math.floor((numTiles-1)/2)];
        else if (this.playerspawn.length == 0){
            this.playerspawn[0] = randomtile.x;
            this.playerspawn[1] = randomtile.y;
        }
        //if (world.getRoom() instanceof EpsilonArena) this.playerspawn = [1,1];
        player = new Player(getTileButNotCursed(this.playerspawn[0], this.playerspawn[1]));
        if (this.effects.includes("Darkness")) player.fov = 2;
        for (let k of wheel.saved){
            if (!(k instanceof Empty))wheel.discard.push(k);
        }
        wheel.saved = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        player.hp = this.startingplayerHP;
        player.lastMove = this.playerlastmove;
        sacritotal = "nan";
        sacrifice = 0;
        rolled = 0;
        gameState = "running";
    }
}

class WorldSeed extends Room{
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

    buildRoom(connector){
        generateVault(this.id);
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

class HarmonyRelay extends DefaultVaultRoom{
    constructor(index){
        super(index);
        this.entrymessage = "FluffyWelcome";
        this.name = "Test of Unity";
        this.music = "harmony2";
        this.fuffspawn = null;
        //this.filler = AbazonWall;
        this.id = "Empty";
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
        this.playerspawn = getTileButNotCursed(8,8);
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

    buildRoom(connector){
        super.buildRoom(connector);
        showboss = true;
    }

    initializeRoom(){
        //this.entrancepoints = [getTileButNotCursed(1,1), getTileButNotCursed(1,numTiles-2),getTileButNotCursed(numTiles-2,1),getTileButNotCursed(numTiles-2,numTiles-2)];
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
        this.playerspawn = getTileButNotCursed(1,8);
        super.initializeRoom();
    }
}