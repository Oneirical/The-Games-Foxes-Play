class World{
    constructor(serene){
        this.roompool = [];
        this.roomlist = [];
        this.currentroom = -1;
        this.serene = serene;
        this.fighting = false;
    }

    getRoom(){
        return (this.roomlist[this.currentroom])
    }
    selectRooms(){
        if (this.serene) this.roompool = [StandardSpire];
        else this.roompool = [StandardFaith];
    }

    addRoom(coordinates, connector){
        let roomType;
        if (level == 0) roomType = WorldSeed;
        else if (level == 17 && !this.serene) roomType = EpsilonArena;
        else if (level % 5 == 1 && level > 5 && this.serene) roomType = FluffianWorkshop; //TODO increase the randomness on these
        else if (level % 5 == 1 && level > 5 && !this.serene) roomType = HarmonyRelay;
        else roomType = shuffle(this.roompool)[0];
        let room = new roomType();
        room.index = this.roomlist.length;
        this.currentroom = room.index;
        if (coordinates == "firstroom"){
        }
        else if (coordinates == room.possibleexits[0]){
            //room.playerspawn = room.entrancepoints[3];
            room.returnpoint = room.possibleexits[3];
            room.possibleexits.splice(3,1);
        }
        else if (coordinates == room.possibleexits[1]){ 
            //room.playerspawn = room.entrancepoints[2];
            room.returnpoint = room.possibleexits[2];
            room.possibleexits.splice(2,1);
        }
        else if (coordinates == room.possibleexits[2]){ 
            //room.playerspawn = room.entrancepoints[1];
            room.returnpoint = room.possibleexits[1];
            room.possibleexits.splice(1,1);
        }
        else if (coordinates == room.possibleexits[3]){ 
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
        else console.log("uh oh")
        this.roomlist[id].playerspawn = [spawnlocation.x,spawnlocation.y];
        this.playRoom(this.roomlist[id], player.hp);
    }
}

class Room{
    constructor(size){
        this.tier = level;
        this.startingplayerHP = 0;
        this.roseic = false;
        this.size = size;
        this.entrancepoints;
        this.returnpoint;
        //up left right down
        this.music = false;
        this.entrymessage = false;
        this.playerspawn = 0;
        this.effects = [];
        this.previousRoom = -1; //Maybe secretly divide arrow tiles into return/generator tiles?
        this.index = -1;
        this.tiles = []; //it will also need to stock the contents of course
        this.monsters = [];
        this.name = "Bugtopia";
    }

    buildRoom(){
        let numtest = numTiles;
        numTiles = this.size;
        tileSize = (numtest/numTiles)*64;
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
        else if (world.roomlist.length == 1) this.playerspawn = getTile(randomtile.x,randomtile.y);
        player = new Player(getTile(this.playerspawn[0], this.playerspawn[1]));
        player.resolve = 3+ Math.floor(resolvebonus/2);
        if (this.effects.includes("Darkness")) player.fov = 2;
        player.discard = dissave;
        player.inventory = invsave;
        player.hp = this.startingplayerHP;
        sacritotal = "nan";
        sacrifice = 0;
        rolled = 0;
    }
}

class WorldSeed extends Room{
    constructor(){
        super(9);
        this.name = "World Seed";
    }

    buildRoom(){
        super.buildRoom();
        generateLevel();
    }

    initializeRoom(){
        this.entrancepoints = [getTile(Math.floor((numTiles-1)/2),1), getTile(1,Math.floor((numTiles-1)/2)),getTile((numTiles-2),Math.floor((numTiles-1)/2)),getTile(Math.floor((numTiles-1)/2),(numTiles-2))];
        super.initializeRoom();
    }
}

class StandardFaith extends Room{
    constructor(){
        super(9);
        //this.playerspawn = getTile(Math.floor((numTiles-1)/2),1);
        this.name = "Faith's End";
        this.entrancepoints = [getTile(Math.floor((numTiles-1)/2),1), getTile(1,Math.floor((numTiles-1)/2)),getTile((numTiles-2),Math.floor((numTiles-1)/2)),getTile(Math.floor((numTiles-1)/2),(numTiles-2))];
        this.possibleexits = [getTile(Math.floor((numTiles-1)/2),0), getTile(0,Math.floor((numTiles-1)/2)),getTile((numTiles-1),Math.floor((numTiles-1)/2)),getTile(Math.floor((numTiles-1)/2),numTiles-1)];
    }

    buildRoom(connector){
        super.buildRoom();
        generateLevel();
        blockedExits(connector);
    }

    initializeRoom(){
        //this.playerspawn = getTile(Math.floor((numTiles-1)/2),1);
        super.initializeRoom();
    }
}

class HarmonyRelay extends Room{
    constructor(){
        super(9);
        this.entrymessage = "FluffyWelcome";
        this.name = "Test of Unity";
        this.entrancepoints = [getTile(Math.floor((numTiles-1)/2),1), getTile(1,Math.floor((numTiles-1)/2)),getTile((numTiles-2),Math.floor((numTiles-1)/2)),getTile(Math.floor((numTiles-1)/2)),(numTiles-2)];
        this.possibleexits = [getTile(Math.floor((numTiles-1)/2),0), getTile(0,Math.floor((numTiles-1)/2)),getTile((numTiles-1),Math.floor((numTiles-1)/2)),getTile(Math.floor((numTiles-1)/2),numTiles-1)];
    }
    
    buildRoom(){
        super.buildRoom();
        generateLevel();
    }

    initializeRoom(){
        dialoguecount = 0;
        gameState = "fluffy";
        super.initializeRoom();
    }
} 

class StandardSpire extends Room{
    constructor(){
        super(9);
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
    constructor(){
        super(18);
        this.name = "Roseic Circus";
    }

    buildRoom(){
        super.buildRoom();
        generateCircus();
    }

    initializeRoom(){
        this.playerspawn = getTile(8,8);
        super.initializeRoom();
    }
}

class EpsilonArena extends Room{
    constructor(){
        super(18);
        this.entrymessage = "EpsilonWelcome1";
        this.name = "Industrial Apex";
    }

    buildRoom(){
        super.buildRoom();
        generateEpsilon();
        showboss = true;
        generateMonsters();
    }

    initializeRoom(){
        this.playerspawn = getTile(1,1);
        super.initializeRoom();
    }
}

class FluffianWorkshop extends Room{
    constructor(){
        super(9);
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
        this.playerspawn = getTile(1,8);
        super.initializeRoom();
    }
}