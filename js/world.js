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

    addRoom(previousRoom, entranceTile){
        let roomType;
        if (level == 0) roomType = WorldSeed;
        else if (level == 17 && !this.serene) roomType = EpsilonArena;
        else if (level % 5 == 1 && level > 5 && this.serene) roomType = FluffianWorkshop; //TODO increase the randomness on these
        else if (level % 5 == 1 && level > 5 && !this.serene) roomType = HarmonyRelay;
        else roomType = shuffle(this.roompool)[0];
        let room = new roomType();
        let previous;
        let position;
        room.buildRoom(previous, position);
        if (this.roomlist.length == 0){
            previous = "NONE";
            position = randomPassableTile();
        }
        else{
            previous = previousRoom; //make the exit tile transfer this data
            position = entranceTile;
        }
        room.index = this.roomlist.length;
        this.roomlist.push(room);
        return room;
    }

    playRoom(room,playerHp, coordinates){
        this.currentroom = room.index;
        room.startingplayerHP = playerHp;
        if (coordinates == 3) room.playerspawn = room.entrancepoints[0];
        else if (coordinates == -3) room.playerspawn = room.entrancepoints[1];
        else if (coordinates == 4) room.playerspawn = room.entrancepoints[2];
        else if (coordinates == -4) room.playerspawn = room.entrancepoints[3];
        room.initializeRoom();
        console.log(monsters);
    }

    saveRoom(tiles, monsters){
        this.roomlist[this.currentroom].monsters = monsters;
        this.roomlist[this.currentroom].tiles = tiles;
        this.roomlist[this.currentroom].tiles[4][8].usedup = true;
        this.roomlist[this.currentroom].tiles[4][8].sprite = 38;
    }

    reloadRoom(id, dirx, diry){
        monsters = this.roomlist[id].monsters;
        tiles = this.roomlist[id].tiles;
        let spawnlocation;
        if (dirx == 4){
            if (diry == 0) spawnlocation = getTile(Math.floor((numTiles-1)/2),numTiles-2);
            else spawnlocation = getTile(Math.floor((numTiles-1)/2),1);
        }
        this.roomlist[id].playerspawn = spawnlocation;
        this.playRoom(this.roomlist[id], player.hp);
    }
}

class Room{
    constructor(size){
        this.tier = level;
        this.startingplayerHP = 0;
        this.roseic = false;
        this.size = size;
        this.entrancepoints = [getTile(Math.floor((numTiles-1)/2),1), getTile(1,Math.floor((numTiles-1)/2)),getTile((numTiles-2),Math.floor((numTiles-1)/2)),getTile(Math.floor((numTiles-1)/2)),(numTiles-2)];
        //up left right down
        this.music = false;
        this.entrymessage = false;
        this.playerspawn = 0; //TODO adjust depending on NSWE entrance
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
        if (this.entrymessage) message = this.entrymessage;
        else message = "Empty";
        if (level == 0) this.playerspawn = getTile(Math.floor((numTiles-1)/2),Math.floor((numTiles-1)/2));
        player = new Player(this.playerspawn);
        player.resolve = 3+ Math.floor(resolvebonus/2);
        if (this.effects.includes("Darkness")) player.fov = 2;
        player.discard = dissave;
        player.inventory = invsave;
        player.teleportCounter = 0;
        player.isPlayer = true;
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
        super.initializeRoom();
    }
}

class StandardFaith extends Room{
    constructor(){
        super(9);
        this.playerspawn = getTile(Math.floor((numTiles-1)/2),1);
        this.name = "Faith's End";
    }

    buildRoom(){
        super.buildRoom();
        generateLevel();
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