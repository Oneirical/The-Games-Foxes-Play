function generateLevel(){
    tryTo('generate map', function(){
        return generateTiles() == randomPassableTile().getConnectedTiles().length;
    });                                    
}

function generateATonOfWalls(){
    tryTo('generate map', function(){
        return generateWalls() == randomPassableTile().getConnectedTiles().length;
    });                                    
}

function generateWalls(){
    let passableTiles=0;
    for(let i=world.getRoom().extreme["W"]+1;i<world.getRoom().extreme["E"];i++){
        for(let j=world.getRoom().extreme["N"]+1;j<world.getRoom().extreme["S"];j++){
            if(Math.random() < 0.3 && tiles[i][j].mutable){
                tiles[i][j].replace(Wall);
            }
            else{
                if (!tiles[i][j].mutable) tiles[i][j].replace(TrueFloor); //this could bug out if more immutable stuff gets added
                else tiles[i][j].replace(Floor);
                passableTiles++;
            }
        }
    }
    return passableTiles;
}

function generateTiles(){
    let passableTiles=0;
    tiles = [];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if ((j==(numTiles-1)&&i==Math.floor((numTiles-1)/2)) && world.getRoom() instanceof WorldSeed){
                tiles[i][j] = new TermiExit(i,j);
                tiles[i][j].id = 10;
                passableTiles++;
            }
            else if((j==(numTiles-2)&&i==Math.floor((numTiles-1)/2))||(j==1&&i==Math.floor((numTiles-1)/2)) || (j==Math.floor((numTiles-1)/2)&&i==numTiles-2) || (j==Math.floor((numTiles-1)/2)&&i==1)){
                tiles[i][j] = new Floor(i,j);
                passableTiles++;
            }
            else if((((Math.random() < 0.3 && (level % 5 != 1 || level == 1) && level !=0 && level != 17) || !inBounds(i,j)))){
                if (level != 0) tiles[i][j] = new Wall(i,j);
                else tiles[i][j] = new TermiWall(i,j);
            }
            else{
                tiles[i][j] = new Floor(i,j);
                passableTiles++;
            }
        }
    }
    return passableTiles;
}

function flipRoom(id,size,times){
    if (times >= 0){
        for (let x = 0; x<size;x++){
            rooms[id][x] = reverseString(rooms[id][x]);
        }
    }
    if (times <= 0){
        let flippedroom = {};
        for (let i = 0; i<size;i++){
            flippedroom[i] = "";
        }
        for (let i = 0; i<size;i++){
            for (let g = 0; g<size;g++){
                flippedroom[i] += rooms[id][g][i];
            }
        }
        for (let i = 0; i<size;i++){
            rooms[id][i] = flippedroom[i];
        }
        if (rooms[id]["vertical"] != null) rooms[id]["vertical"] = !rooms[id]["vertical"];
    }
}

function locateExits(id){
    let exits = [];
    //if (rooms[id]["tags"].includes("randomflip")) flipRoom(id);
    let vault = rooms[id];
    for(let i=0;i<rooms[id][0].length;i++){
        for(let j=0;j<rooms[id][0].length;j++){
            let tile = vault[j][i];
            if (tile == "E") exits.push([i,j]);
        }
    }
    if (exits.length == 4) exits = [exits[1],exits[0],exits[3],exits[2]];
    else if (exits.length == 8) exits = [exits[2],exits[4],exits[0],exits[1],exits[6],exits[7],exits[3],exits[5]];
    return exits;
}

function generateVault(id,room){
    tiles = [];
    let vault = rooms[id];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            let tile = keytile[vault[j][i]];
            tiles[i][j] = new tile(i,j,room);
        }
    }
    if (vault["tags"].includes("randomwall")) generateATonOfWalls();
    if (vault["tags"].includes("sometimeswall") && Math.random() < 0.5) generateATonOfWalls();
    if (vault["tags"].includes("randomgen")) generateMonsters();
}

function generateUnityTest(){
    tiles = [];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if((j==(numTiles-2)&&i==Math.floor((numTiles-1)/2))||(j==1&&i==Math.floor((numTiles-1)/2)) || (j==Math.floor((numTiles-1)/2)&&i==numTiles-2) || (j==Math.floor((numTiles-1)/2)&&i==1)){
                tiles[i][j] = new Floor(i,j);
            }
            else if(!inBounds(i,j)){
                tiles[i][j] = new Wall(i,j);
            }
            else{
                tiles[i][j] = new Floor(i,j);
            }
        }
    }
}

function generateRelay(){
    tiles = [];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if((j==(numTiles-2)&&i==Math.floor((numTiles-1)/2))||(j==1&&i==Math.floor((numTiles-1)/2)) || (j==Math.floor((numTiles-1)/2)&&i==numTiles-2) || (j==Math.floor((numTiles-1)/2)&&i==1)){
                tiles[i][j] = new Floor(i,j);
            }
            else if(!inBounds(i,j)){
                tiles[i][j] = new AbazonWall(i,j);
            }
            else if(((((j == 2) && (i == 4)))||((j==3)&&(i==1))||((j == 3) && (i == 7)))){
                tiles[i][j] = new PosAltar(i,j);
            }
            else if(((((j == 6) && (i == 4)))||((j==5)&&(i==1))||((j == 5) && (i == 7)))){
                tiles[i][j] = new NegAltar(i,j);
            }
            else if (j==4 && i == 3 || j==4 && i == 5){ //||((j==5)&&(i==3))||((j==5)&&(i==5))||((j==3)&&(i==3)))
                tiles[i][j] = new BetAltar(i,j);
            }
            else{
                tiles[i][j] = new Floor(i,j);
            }
        }
    }
}

function blockedExits(){
    let exitlocations = world.getRoom().possibleexits;
    let returnpoint = world.getRoom().returnpoint;
    let shifts;
    if (exitlocations.length == 8) shifts = [-10,-9,-1,-11,2,12,20,21];
    else shifts = {
        "N" : -10,
        "W" : -1,
        "E" : 1,
        "S" : 10
    }
    for (let i = 0;i<exitlocations.length;i++){
        let exitdirection = exitlocations[i];
        tiles[exitdirection[0]][exitdirection[1]].replace(BExit);
        if (exitlocations.length == 8) tiles[exitdirection[0]][exitdirection[1]].id = shifts[i];
        else tiles[exitdirection[0]][exitdirection[1]].id = shifts[tiles[exitdirection[0]][exitdirection[1]].direction];
    }
    //for (let i = 0;i<6-exitnumber;i++){
    //    let exitdirection = exitlocations[i];
    //    if (!walls.includes(exitdirection)){
    //        tiles[exitdirection[0]][exitdirection[1]].replace(world.getRoom().filler);
    //        tiles[exitdirection[0]][exitdirection[1]].eat = false;
    //    }
    //}
    if (returnpoint != null) {
        tiles[returnpoint[0]][returnpoint[1]].replace(BReturnExit);
        if (exitlocations.length == 8) tiles[returnpoint[0]][returnpoint[1]].id = shifts[exitlocations.indexOf(returnpoint)];
        else tiles[returnpoint[0]][returnpoint[1]].id = shifts[tiles[returnpoint[0]][returnpoint[1]].direction];
        let playerspawner = tiles[returnpoint[0]][returnpoint[1]];
        world.getRoom().playerspawn = [playerspawner.x+playerspawner.textures[playerspawner.direction + "W"][0], playerspawner.y+playerspawner.textures[playerspawner.direction + "W"][1]];
    }

}

function generateSpire(){
    let passableTiles=0;
    tiles = [];
    let platformstart = randomRange(1,7);
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if(j == 8 && i == platformstart){
                tiles[i][j] = new Platform(i,j);
                passableTiles++;
            }
            else{
                tiles[i][j] = new Floor(i,j);
                passableTiles++;
            }
        }
    }
    let pcon = tiles[platformstart][8];
    spirespawner = pcon;
    let top = 8;
    while (top > 0){
        let surface = [];
        for (let i=0;i<randomRange(5,12);i++){
            let platform = pcon.getLateralNeighbors().filter(t => t.passable || !t instanceof Platform);
            platform[0].replace(Platform);
            surface.push(platform[0]);
            pcon = platform[0];
        }
        let ladder = surface[randomRange(0,surface.length-1)].getNeighbor(0, -1);
        if (ladder.y > 0) ladder.replace(Ladder);
        else ladder.replace(Booster);
        for (let i=0;i<randomRange(0,2);i++){
            let lad = ladder.getNeighbor(0, -1);
            if (lad.y > 0) lad.replace(Ladder);
            else lad.replace(Booster);
            ladder = lad;
        }
        pcon = ladder.getNeighbor(0, -1);
        if (pcon.y > 0) pcon.replace(Platform);
        else pcon.replace(Booster);
        top = pcon.y;
    }

    return passableTiles;
}

function generateModule(){
    let vault = {
        0: [Booster, Floor, Floor,Floor,Floor,Floor,Floor,Floor,Floor],
        1: [Platform,Platform,Platform,Platform,Floor,Floor,Floor,Floor, Floor],
        2: [Floor, Floor, Ladder, Floor, Floor, Floor, Platform, Platform, Platform],
        3: [Floor, Floor, Ladder, Floor,Floor,Floor,Ladder,Floor,Floor],
        4: [Floor,Floor,Ladder,Floor,Platform,Platform,Platform,Platform,Platform],
        5: [Floor,Floor,Ladder,Floor,Floor,Floor,Floor,Floor,Floor],
        6: [Floor,Floor,Ladder,Floor,Floor,Floor,Floor,Floor,Floor],
        7: [Platform,Platform,Platform,Floor,Floor,Platform,Platform,Platform,Floor],
        8: [Floor,Ladder,Floor,Floor,Floor,Floor,Floor,Floor,Floor],
    }
    tiles = [];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            let tile = vault[j][i];
            tiles[i][j] = new tile(i,j);
        }
    }
}

function inBounds(x,y){
    for (let g of world.getRoom().possibleexits){
        if (g[0] == x && g[1] == y) return true;
    }
    //if((x == (Math.floor((numTiles-1)/2)) && (y == (numTiles-1)||y==0)) || (x == (numTiles-1)||x==0) && y == (Math.floor((numTiles-1)/2))){
    //    if (world.getRoom() instanceof WorldSeed && y != numTiles-1) return false;
    //    else return true;
    //}
    if (area != "Spire" && area != "Circus"){
        if (player){
            if (player.infested > 0) return x>-1 && y>-1 && x<numTiles && y<numTiles;
            else return x>0 && y>0 && x<numTiles-1 && y<numTiles-1;
        }
        else return x>0 && y>0 && x<numTiles-1 && y<numTiles-1;
    }
    else return x>-1 && y>-1 && x<numTiles && y<numTiles
}

function getTile(x, y){
    if (x > numTiles-1 || x < 0 || y < 0 || y > numTiles-1) return new RoseWall(x,y);
    else return tiles[x][y];
}

function randomExcluded(min, max, excluded) {
    var n = Math.floor(Math.random() * (max-min) + min);
    if (n >= excluded) n++;
    return n;
}
function randomPassableTile(){
    let tile;
    tryTo('get random passable tile', function(){
        let x = randomRange(1,numTiles-2);
        let y = randomRange(1,numTiles-2);
        tile = getTile(x, y);
        let surround = tile.getAdjacentNeighbors();
        for (i of surround){
            if (i instanceof BExit) return false;
        }
        return tile.passable && !tile.monster;
    });
    return tile;
}
function randomPassableRoom(){
    let tile;
    tryTo('get random passable tile', function(){
        let x = randomRange(0,8);
        let y = randomRange(0,8);
        tile = worldgen[x][y];
        return (tile instanceof Floor);
    });
    return tile;
}
function randomPushableTile(){
    let tile;
    tryTo('get random passable tile', function(){
        let x = randomExcluded(0,numTiles-1,4);
        let y = randomExcluded(0,numTiles-1,1);
        tile = getTile(x, y);
        let box = true;
        for (let x of tile.getAdjacentNeighbors()){
            if (x.monster) box = false;
        }
        return box && tile.passable && !tile.monster && !(tile instanceof Mobilizer) && tile.x > 1 && tile.x < 16 && tile.y > 1 && tile.y < 16;
    });
    return tile;
}
function centralTile(){
    let tile;
    let x = (numTiles-1)/2;
    let y = (numTiles-1)/2;
    tile = getTile(x,y);
    return tile;
}
function playerTile(){
    let tile;
    tile = player.tile;
    return tile;
}

function generateMonsters(){
    monsters = [];
    let numMonsters;
    if (level < 6 && area != "Spire") numMonsters = level+2;
    else if (area == "Spire") numMonsters = Math.ceil(level/2);
    else if (level >= 6 && level != 17 && !(world.getRoom() instanceof HarmonyRelay)) numMonsters = level;
    else if ((world.getRoom() instanceof HarmonyRelay) || (world.getRoom() instanceof EpsilonArena)) numMonsters = 1;
    if (numMonsters > randomPassableTile().getConnectedTiles().length) numMonsters = randomPassableTile().getConnectedTiles().length-2;
    for(let i=0;i<numMonsters;i++){
        if (spawnMonster() == "Embalm"){
            spawnEmbalm();
            spawnEmbalm();
            numMonsters -= 2;
        } 
    }
    if (area == "Spire" && level % 5 == 1 && level > 5){
        let wtfisthisbug = randomRange(0,modulators.length-1);
        let moddrop = modulators[wtfisthisbug];
        modulators.splice(wtfisthisbug, 1)
        spawnCages(moddrop, getTile(6,6));
        let monster = new Harmonizer(getTile(7,1));
        monsters.push(monster);
    }
}

function spawnEmbalm(){
    let monsterType = shuffle([Brute])[0]; //
    let monster = new monsterType(randomPassableTile());
    monsters.push(monster);
}

function spawnMonster(){
    if (area == "Spire"){
        let monsterType = shuffle([HostileFluffy])[0]; //
        let monster = new monsterType(randomPassableTile());
        monsters.push(monster);
    }
    else if (world.getRoom() instanceof EpsilonArena){
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
    else if (level >= 0){
        let monsterType;
        if (level < 6 && level >= 0) monsterType = shuffle([Apis, Second, Tinker, Slug,Scion, Shrike, Apiarist])[0]; //Rendfly     //
        else if (level < 11 && level > 5)  monsterType = shuffle([Apis,Weaver, Second, Tinker,Oracle, Snail,Slug,Ragemaw, Felidol,Scion, Shrike, Apiarist])[0];
        else if (level < 17 && level > 10) monsterType = shuffle([Embalmer,Apis,Weaver, Second, Tinker,Oracle, Snail,Slug,Ragemaw, Felidol,Monk,Scion, Shrike, Apiarist])[0];
        let monster = new monsterType(randomPassableTile());
        monsters.push(monster);
        if (monsterType == Embalmer) return "Embalm";
    }
    else if (false){
        let monsterType = shuffle([Harmonizer])[0];
        let tile = getTile(4,4);
        world.getRoom().fuffspawn = tile;
        let monster = new monsterType(tile);
        monsters.push(monster);
        //tiles[(numTiles-1)/2][numTiles-1] = new Exit((numTiles-1)/2,numTiles-1);
    }
    else if (level == 0){
        let monsterType = shuffle([Hologram])[0];
        let tile = getTile(4,6);
        let monster = new monsterType(tile);
        monsters.push(monster);
    }

}

//summon cages in harmonic relay rooms
function spawnCages(loot, tile){
    let cage;
    if (smod.includes(loot)) cage = new Modulorb(tile, loot);
    else cage = new Cage(tile, loot);
    if (cage.loot == "SERENE") cage.lore = description["FluffyCage"];
    monsters.push(cage);
}
