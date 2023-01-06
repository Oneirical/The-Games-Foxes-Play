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
        log.allgrey = true;
        let roomType;
        if (level == 0) roomType = WorldSeed;
        else if (level == 17 && !this.serene) roomType = EpsilonArena;
        else if (level % 5 == 1 && level > 5 && this.serene) roomType = FluffianWorkshop;
        else if (level % 5 == 1 && level > 5 && !this.serene) roomType = HarmonyRelay;
        else roomType = shuffle(this.roompool)[0];
        let room = new roomType(this.roomlist.length);
        if (coordinates != "firstroom"){
            if (this.getRoom().music){
                if (this.getRoom().music == room.music) room.music = false;
                currenttrack = this.getRoom().music;
            }
        }
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
            room.playerlastmove = [0,-1];
        }
        else if (coordinates == "W"){ 
            //room.playerspawn = room.entrancepoints[2];
            room.returnpoint = room.possibleexits[2];
            room.possibleexits.splice(2,1);
            room.playerlastmove = [-1,0];
        }
        else if (coordinates == "E"){ 
            //room.playerspawn = room.entrancepoints[1];
            room.returnpoint = room.possibleexits[1];
            room.possibleexits.splice(1,1);
            room.playerlastmove = [1,0];
        }
        else if (coordinates == "S"){ 
            //room.playerspawn = room.entrancepoints[0];
            room.returnpoint = room.possibleexits[0];
            room.possibleexits.splice(0,1);
            room.playerlastmove = [0,1];
        }
        this.roomlist.push(room);
        room.buildRoom(connector);
        wheel.resolve = 3+ Math.floor(resolvebonus/2);
        exitspawn = 0;
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
        exitspawn = 1;
        let room = this.roomlist[id];
        monsters = this.roomlist[id].monsters;
        tiles = this.roomlist[id].tiles;
        let spawnlocation;
        if (coordinates == "firstroom"){
        }
        else if (coordinates == "N"){
            spawnlocation = room.entrancepoints[3];
            room.playerlastmove = [0,-1];
        }
        else if (coordinates == "W"){ 
            spawnlocation = room.entrancepoints[2];
            room.playerlastmove = [-1,0];
        }
        else if (coordinates == "E"){ 
            spawnlocation = room.entrancepoints[1];
            room.playerlastmove = [1,0];
        }
        else if (coordinates == "S"){ 
            spawnlocation = room.entrancepoints[0];
            room.playerlastmove = [0,1];
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
        this.playerlastmove = [0,-1];
        this.playerspawn = [4,4];
        this.effects = [];
        this.previousRoom = -1; //Maybe secretly divide arrow tiles into return/generator tiles?
        this.index = index;
        this.tiles = []; //it will also need to stock the contents of course
        this.monsters = [];
        this.name = "Bugtopia";
        this.fourway = false;
        this.violatereality = false;
        this.filler = Wall;
    }

    buildRoom(){
        //it does nothing lol
    }

    draw(){

    }

    initializeRoom(){
        if (this.music && this.music != currenttrack) {
            pauseAllMusic();
            playSound(this.music);
        }
        let randomtile = randomPassableTile();
        if (this.entrymessage) log.addLog(this.entrymessage);
        if (world.roomlist.length == 1 && level == 0) this.playerspawn = [Math.floor((numTiles-1)/2),Math.floor((numTiles-1)/2)];
        else if (world.roomlist.length == 1){
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
        this.music = "cage"
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
        this.music = "malform";
        if (level > 5) this.music = "max";
        else if (level > 10) this.music = "quarry";
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
        this.music = "harmony2";
        this.fuffspawn = null;
        //this.filler = AbazonWall;
        this.entrancepoints = [getTileButNotCursed(Math.floor((numTiles-1)/2),1), getTileButNotCursed(1,Math.floor((numTiles-1)/2)),getTileButNotCursed((numTiles-2),Math.floor(numTiles-1)/2),getTileButNotCursed(Math.floor((numTiles-1)/2),(numTiles-2))];
        this.possibleexits = [[Math.floor((numTiles-1)/2),0], [0,Math.floor((numTiles-1)/2)],[(numTiles-1),Math.floor((numTiles-1)/2)],[Math.floor((numTiles-1)/2),numTiles-1]];
    }
    
    buildRoom(connector){
        super.buildRoom();
        generateUnityTest();
        blockedExits(connector);
        generateMonsters();
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
        this.music = "epsilon";
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