class World{
    constructor(serene){
        this.roompool = [];
        this.roomlist = [];
        this.serene = serene;
    }

    selectRooms(){
        if (this.serene) this.roompool = [StandardSpire];
        else this.roompool = [StandardFaith];
    }

    addRoom(previousRoom, entranceTile){
        let roomType;
        if (level == 0) roomType = WorldSeed;
        else if (level == 17 && !this.serene) roomType = EpsilonArena;
        else if (level % 5 == 1 && level > 5 && this.serene) roomType = FluffianWorkshop; //increase the randomness on these
        else if (level % 5 == 1 && level > 5 && !this.serene) roomType = HarmonyRelay;
        else roomType = shuffle(this.roompool)[0];
        let room = new roomType();
        let previous;
        let position;
        if (this.roomlist.length == 0){
            previous = "NONE";
            position = randomPassableTile();
        }
        else{
            previous = previousRoom; //make the exit tile transfer this data
            position = entranceTile;
        }
        room.buildRoom(previous, position);
        this.roomlist.push(room);
    }

    playRoom(room){
        room.initializeRoom();
    }
}

class Room{
    constructor(size){
        this.tier = level;
        this.NExit = 0;
        this.SExit = 0;
        this.EExit = 0;
        this.WExit = 0;
        this.roseic = false;
        this.size = size;
        this.music = false;
        this.entrymessage = false;
        this.playerspawn = getTile(Math.floor((numTiles-1)/2), 1); //TODO adjust depending on NSWE entrance
        this.effects = [];
        this.previousRoom = -1; //Maybe secretly divide arrow tiles into return/generator tiles?
        this.contents = []; //it will also need to stock the contents of course
    }

    buildRoom(){
        let numtest = numTiles;
        numTiles = this.size;
        tileSize = (numtest/numTiles)*64;
    }

    saveRoom(){
        this.contents = tiles;
    }

    initializeRoom(){
        exitspawn = 0;
        resolve = 3+ Math.floor(resolvebonus/2);
        if (this.music) {
            pauseAllMusic();
            playSound(music);
        }
        if (this.entrymessage) message = this.entrymessage;
        else message = "Empty";
        player = new Player(this.playerspawn);
        if (this.effects.includes("Darkness")) player.fov = 2;
        player.discard = dissave;
        player.inventory = invsave;
        player.teleportCounter = 0;
        player.isPlayer = true;
        player.hp = playerHp;
        sacritotal = "nan";
        sacrifice = 0;
        rolled = 0;
    }
}

class WorldSeed extends Room{
    constructor(){
        super(9);
        this.playerspawn = getTile(Math.floor((numTiles-1)/2),Math.floor((numTiles-1)/2));
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
    }

    buildRoom(){
        super.buildRoom();
        generateLevel();
    }

    initializeRoom(){
        super.initializeRoom();
    }
}

class HarmonyRelay extends Room{
    constructor(){
        super(9);
        this.entrymessage = "FluffyWelcome";
    }
    
    buildRoom(){
        super.buildRoom();
        generateLevel();
    }

    initializeRoom(){
        dialoguecount = 0;
        super.initializeRoom();
    }
} 

class StandardSpire extends Room{
    constructor(){
        super(9);
        this.playerspawn = spirespawner;
    }

    buildRoom(){
        super.buildRoom();
        generateSpire();
        generateMonsters();
    }

    initializeRoom(){
        this.playerspawn.replace(Ladder);
        super.initializeRoom();
    }
}

class RoseicCogArena extends Room{
    constructor(){
        super(18);
        this.playerspawn = getTile(8,8);
    }

    buildRoom(){
        super.buildRoom();
        generateCircus();
    }

    initializeRoom(){
        super.initializeRoom();
    }
}

class EpsilonArena extends Room{
    constructor(){
        super(18);
        this.playerspawn = getTile(1,1);
    }

    buildRoom(){
        super.buildRoom();
        generateEpsilon();
        showboss = true;
        generateMonsters();
    }

    initializeRoom(){
        super.initializeRoom();
    }
}

class FluffianWorkshop extends Room{
    constructor(){
        super(9);
        this.playerspawn = getTile(1,8);
        this.entrymessage = "FluffyWorkshop";
    }

    buildRoom(){
        super.buildRoom();
        generateModule();
        generateMonsters();
    }

    initializeRoom(){
        dialoguecount = 0;
        super.initializeRoom();
    }
}