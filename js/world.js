class World{
    constructor(serene){
        this.roompool = [];
        this.roomlist = [];
        this.currentroom = -1;
        this.serene = serene;
        this.fighting = false;
    }

    getRoom(){
        return (this.roomlist[this.currentroom]);
    }
    selectRooms(){
        if (this.serene) this.roompool = [StandardSpire];
        else this.roompool = [StandardFaith];
    }

    addRoom(coordinates, connector){
        let roomType;
        if (gameState == "fluffy") gameState = "running";
        if (level == 0) roomType = WorldSeed;
        else if (level == 17 && !this.serene) roomType = EpsilonArena;
        else if (level % 5 == 1 && level > 5 && this.serene) roomType = FluffianWorkshop; //TODO increase the randomness on these
        else if (level % 5 == 1 && level > 5 && !this.serene) roomType = HarmonyRelay;
        else roomType = shuffle(this.roompool)[0];
        let room = new roomType(this.roomlist.length);
        this.currentroom = this.roomlist.length;
        let numtest = numTiles;
        numTiles = room.size;
        if (level == 17) room.possibleexits = [[1,0], [0,numTiles-2],[numTiles-1,1],[numTiles-2,numTiles-1]];
        tileSize = (numtest/numTiles)*64;
        if (coordinates == "firstroom"){
        }
        else if (coordinates == "N"){
            //room.playerspawn = room.entrancepoints[3];
            room.returnpoint = room.possibleexits[3];
            room.possibleexits.splice(3,1);
        }
        else if (coordinates == "W"){ 
            //room.playerspawn = room.entrancepoints[2];
            room.returnpoint = room.possibleexits[2];
            room.possibleexits.splice(2,1);
        }
        else if (coordinates == "E"){ 
            //room.playerspawn = room.entrancepoints[1];
            room.returnpoint = room.possibleexits[1];
            room.possibleexits.splice(1,1);
        }
        else if (coordinates == "S"){ 
            //room.playerspawn = room.entrancepoints[0];
            room.returnpoint = room.possibleexits[0];
            room.possibleexits.splice(0,1);
        }
        this.roomlist.push(room);
        room.buildRoom(connector);
        return room;
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
        if (gameState == "fluffy") gameState = "running";
        let room = this.roomlist[id];
        monsters = this.roomlist[id].monsters;
        tiles = this.roomlist[id].tiles;
        let spawnlocation;
        if (coordinates == "firstroom"){
        }
        else if (coordinates == "N"){
            spawnlocation = room.entrancepoints[3];
        }
        else if (coordinates == "W"){ 
            spawnlocation = room.entrancepoints[2];
        }
        else if (coordinates == "E"){ 
            spawnlocation = room.entrancepoints[1];
        }
        else if (coordinates == "S"){ 
            spawnlocation = room.entrancepoints[0];
        }
        this.roomlist[id].playerspawn = [spawnlocation.x,spawnlocation.y];
        this.playRoom(this.roomlist[id], player.hp);
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
        this.playerspawn = 0;
        this.effects = [];
        this.previousRoom = -1; //Maybe secretly divide arrow tiles into return/generator tiles?
        this.index = index;
        this.tiles = []; //it will also need to stock the contents of course
        this.monsters = [];
        this.name = "Bugtopia";
        this.fourway = false;
        this.violatereality = false;
    }

    buildRoom(){
        //it does nothing lol
    }

    initializeRoom(){
        exitspawn = 0;
        if (this.music) {
            pauseAllMusic();
            playSound(music);
        }
        let randomtile = randomPassableTile();
        if (this.entrymessage) message = this.entrymessage;
        else message = "Empty";
        if (world.roomlist.length == 1 && level == 0) this.playerspawn = [Math.floor((numTiles-1)/2),Math.floor((numTiles-1)/2)];
        else if (world.roomlist.length == 1) this.playerspawn = [randomtile.x,randomtile.y];
        //if (world.getRoom() instanceof EpsilonArena) this.playerspawn = [1,1];
        player = new Player(getTileButNotCursed(this.playerspawn[0], this.playerspawn[1]));
        wheel.resolve = 3+ Math.floor(resolvebonus/2);
        if (this.effects.includes("Darkness")) player.fov = 2;
        for (let k of wheel.saved){
            if (!(k instanceof Empty))wheel.discard.push(k);
        }
        wheel.saved = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        player.hp = this.startingplayerHP;
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
        this.possibleexits = [[4,8]];
    }

    buildRoom(){
        super.buildRoom();
        generateLevel();
        generateMonsters();
    }

    initializeRoom(){
        this.entrancepoints = [getTileButNotCursed(Math.floor((numTiles-1)/2),1), getTileButNotCursed(1,Math.floor((numTiles-1)/2)),getTileButNotCursed((numTiles-2),Math.floor((numTiles-1)/2)),getTileButNotCursed(Math.floor((numTiles-1)/2),(numTiles-2))];
        super.initializeRoom();
    }
}

class StandardFaith extends Room{
    constructor(index){
        super(index);
        //this.playerspawn = getTileButNotCursed(Math.floor((numTiles-1)/2),1);
        this.name = "Faith's End";
        this.entrancepoints = [getTileButNotCursed(Math.floor((numTiles-1)/2),1), getTileButNotCursed(1,Math.floor((numTiles-1)/2)),getTileButNotCursed((numTiles-2),Math.floor((numTiles-1)/2)),getTileButNotCursed(Math.floor((numTiles-1)/2),(numTiles-2))];
        this.possibleexits = [[Math.floor((numTiles-1)/2),0], [0,Math.floor((numTiles-1)/2)],[(numTiles-1),Math.floor((numTiles-1)/2)],[Math.floor((numTiles-1)/2),numTiles-1]];
    }

    buildRoom(connector){
        super.buildRoom();
        generateLevel();
        blockedExits(connector);
        generateMonsters();
    }

    initializeRoom(){
        //this.playerspawn = getTileButNotCursed(Math.floor((numTiles-1)/2),1);
        super.initializeRoom();
    }
}

class HarmonyRelay extends Room{
    constructor(index){
        super(index);
        this.entrymessage = "FluffyWelcome";
        this.name = "Test of Unity";
        this.entrancepoints = [getTileButNotCursed(Math.floor((numTiles-1)/2),1), getTileButNotCursed(1,Math.floor((numTiles-1)/2)),getTileButNotCursed((numTiles-2),Math.floor((numTiles-1)/2)),getTileButNotCursed(Math.floor((numTiles-1)/2)),(numTiles-2)];
        this.possibleexits = [[Math.floor((numTiles-1)/2),0], [0,Math.floor((numTiles-1)/2)],[(numTiles-1),Math.floor((numTiles-1)/2)],[Math.floor((numTiles-1)/2),numTiles-1]];
    }
    
    buildRoom(connector){
        super.buildRoom();
        generateRelay();
        blockedExits(connector);
        generateMonsters();
    }

    initializeRoom(){
        world.fighting = false;
        dialoguecount = 0;
        super.initializeRoom();
        gameState = "fluffy";
        summonExits();
    }
} 

class StandardSpire extends Room{
    constructor(index){
        super(index);
        this.name = "Serene Spire";
    }

    buildRoom(){
        super.buildRoom();
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
        super.buildRoom();
        generateCircus();
    }

    initializeRoom(){
        this.playerspawn = getTileButNotCursed(8,8);
        super.initializeRoom();
    }
}

class EpsilonArena extends Room{
    constructor(index){
        super(index);
        this.size = 18;
        this.entrymessage = "EpsilonWelcome1";
        this.name = "Industrial Apex";
        this.fourway = true;
        this.possibleexits = [[1,0], [0,numTiles-2],[numTiles-1,1],[numTiles-2,numTiles-1]];
        this.entrancepoints = [getTileButNotCursed(1,1), getTileButNotCursed(1,numTiles-2),getTileButNotCursed(numTiles-2,1),getTileButNotCursed(numTiles-2,numTiles-2)];
        this.violatereality = true;
    }

    buildRoom(connector){
        super.buildRoom();
        generateEpsilon();
        showboss = true;
        blockedExits(connector);
        this.violatereality = false;
        generateMonsters();
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
        super.buildRoom();
        generateModule();
        generateMonsters();
    }

    initializeRoom(){
        dialoguecount = 0;
        this.playerspawn = getTileButNotCursed(1,8);
        super.initializeRoom();
    }
}