class World{
    constructor(tier, serene){
        this.roomlist = [];
        this.tier = tier;
        this.serene = serene;
    }

    createWorld(){
        let room = new Room();
        room.buildRoom();
        this.roomlist.push(room);
    }
}

class Room{
    constructor(N,S,E,W,size){
        this.NExit = N;
        this.SExit = S;
        this.EExit = E;
        this.WExit = W;
        this.roseic = false;
        this.size = size;
    }

    buildRoom(){
        let numtest = numTiles;
        numTiles = this.size;
        tileSize = (numtest/numTiles)*64;
        exitspawn = 0;
        resolve = 3+ Math.floor(resolvebonus/2);
    }
}

class StandardRoom extends Room{

}

class StandardSpireRoom extends Room{
    constructor(tile){
        super(tile, 65, 2, "VILE", description["Third"]);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Third Emblem of Sin";
        this.ability = monabi["Third"];
        this.abitimer = 0;
    }
}