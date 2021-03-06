function generateLevel(){
    tryTo('generate map', function(){
        return generateTiles() == randomPassableTile().getConnectedTiles().length;
    });

    generateMonsters();
                                           

}

function generateEdgeLevel(){
    tryTo('generate map', function(){
        return generateEdge() == randomPassableTile().getConnectedTiles().length;
        
    });

    generateMonsters();
                                           

}

function generateTiles(){
    let passableTiles=0;
    tiles = [];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if((j==(numTiles-1)&&i==Math.floor((numTiles-1)/2))&&level!= 0||(j==0&&i==Math.floor((numTiles-1)/2))){
                if (level!=0) tiles[i][j] = new BExit(i,j);
                else tiles[i][j] = new TermiWall(i,j);
            }
            else if ((j==(numTiles-1)&&i==Math.floor((numTiles-1)/2))&&level==0){
                tiles[i][j] = new TermiExit(i,j);
                passableTiles++;
            }
            else if((j==(numTiles-2)&&i==Math.floor((numTiles-1)/2))||(j==1&&i==Math.floor((numTiles-1)/2))){
                tiles[i][j] = new Floor(i,j);
                passableTiles++;
            }
            else if((((Math.random() < 0.3 && (level % 5 != 1 || level == 1) && level !=0 && level != 17) || !inBounds(i,j)))){
                tiles[i][j] = new Wall(i,j);
            }
            else if(level % 5 == 1 && level > 5 && ((((j == 2) && (i == 4)))||((j==3)&&(i==2))||((j == 3) && (i == 6)))){
                tiles[i][j] = new PosAltar(i,j);
                passableTiles++;
            }
            else if(level % 5 == 1 && level > 5 && ((((j == 6) && (i == 4)))||((j==5)&&(i==2))||((j == 5) && (i == 6)))){
                tiles[i][j] = new NegAltar(i,j);
                passableTiles++;
            }
            else if (level % 5 == 1 && level > 5 && ((((j==3) && (i == 5)))||((j==5)&&(i==3))||((j==5)&&(i==5))||((j==3)&&(i==3)))){
                tiles[i][j] = new BetAltar(i,j);
                passableTiles++;
            }
            else{
                tiles[i][j] = new Floor(i,j);
                passableTiles++;
            }
        }
    }
    return passableTiles;
}

function generateEdge(section){
    let passableTiles=0;
    tiles = [];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if(Math.random() < 0.3){
                tiles[i][j] = new RealityWall(i,j);
            }
            else{
                tiles[i][j] = new Floor(i,j);
                passableTiles++;
            }
        }
    }
    return passableTiles;
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

function generateCircus(){
    let vault = {
        0: [RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,AbazonWall,AbazonWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall],
        1: [RoseWall,AbazonWall,RoseServant,AbazonWall,RoseServant,AbazonWall,RoseWall , AbazonWall,RoseThrone,SereneThrone,AbazonWall, RoseWall, AbazonWall,RoseServant,AbazonWall,RoseServant,Floor, RoseWall],
        2: [RoseWall,RoseServant,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseServant,RoseWall],
        3: [RoseWall,AbazonWall,RoseWall,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,RoseWall,AbazonWall,RoseWall,],
        4: [RoseWall,RoseServant,RoseWall,Goop,Goop,Goop,Goop,Goop,Floor,Floor,Goop,Goop,Goop,Goop,Goop,RoseWall,RoseServant,RoseWall,],
        5: [RoseWall,AbazonWall,RoseWall,Goop,Goop,Floor,Floor,Goop,Floor,Floor,Goop,Floor,Floor,Goop,Goop,RoseWall,AbazonWall,RoseWall,],
        6: [RoseWall,RoseServant,RoseWall,Goop,Goop,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Goop,Goop,RoseWall,RoseServant,RoseWall,],
        7: [RoseWall,AbazonWall,RoseWall,Goop,Goop,Goop,Floor,Floor,Floor,Floor,Floor,Floor,Goop,Goop,Goop,RoseWall,AbazonWall,RoseWall,],
        8: [AbazonWall,AbazonWall,RoseWall,Goop,Floor,Floor,Floor,Floor,RoseSpawner,RoseSpawner,Floor,Floor,Floor,Floor,Goop,RoseWall,AbazonWall,AbazonWall,],
        9: [AbazonWall,AbazonWall,RoseWall,Goop,Floor,Floor,Floor,Floor,RoseSpawner,RoseSpawner,Floor,Floor,Floor,Floor,Goop,RoseWall,AbazonWall,AbazonWall,],
        10: [RoseWall,AbazonWall,RoseWall,Goop,Goop,Goop,Floor,Floor,Floor,Floor,Floor,Floor,Goop,Goop,Goop,RoseWall,AbazonWall,RoseWall,],
        11: [RoseWall,RoseServant,RoseWall,Goop,Goop,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Goop,Goop,RoseWall,RoseServant,RoseWall,],
        12: [RoseWall,AbazonWall,RoseWall,Goop,Goop,Floor,Floor,Goop,Floor,Floor,Goop,Floor,Floor,Goop,Goop,RoseWall,AbazonWall,RoseWall,],
        13: [RoseWall,RoseServant,RoseWall,Goop,Goop,Goop,Goop,Goop,Floor,Floor,Goop,Goop,Goop,Goop,Goop,RoseWall,RoseServant,RoseWall,],
        14: [RoseWall,AbazonWall,RoseWall,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,Goop,RoseWall,AbazonWall,RoseWall,],
        15: [RoseWall,RoseServant,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,Goop,Goop,Goop,Goop,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseServant,RoseWall],
        16: [RoseWall,AbazonWall,RoseServant,AbazonWall,RoseServant,AbazonWall,RoseWall , Goop,Goop,Goop,Goop, RoseWall, AbazonWall,RoseServant,AbazonWall,RoseServant,AbazonWall, RoseWall],
        17: [RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall,RoseWall]
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

function generateEpsilon(){
    let vault = {
        0: [Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall],
        1: [Wall,Floor,Floor,Floor,Floor,Wall,Floor,Wall,Floor,Floor,Floor,Wall,Floor,Wall,Floor,Floor,Floor,Wall],
        2: [Wall,Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        3: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall,Wall],
        4: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        5: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall,Wall],
        6: [Wall,Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        7: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        8: [Wall,Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        9: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall,Wall],
        10: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        11: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall,Wall],
        12: [Wall,Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        13: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        14: [Wall,Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall],
        15: [Wall,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Wall,Wall],
        16: [Wall,Floor,Floor,Floor,Wall,Floor,Wall,Floor,Floor,Floor,Wall,Floor,Wall,Floor,Floor,Floor,Floor,Wall],
        17: [Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall,Wall]
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
    if(x == (Math.floor((numTiles-1)/2)) && (y == (numTiles-1)||y==0)){
        return true
    }
    else{
    if (area != "Spire" && area != "Circus") return x>0 && y>0 && x<numTiles-1 && y<numTiles-1
    else return x>-1 && y>-1 && x<numTiles && y<numTiles
    }
}


function getTile(x, y){
    if(inBounds(x,y)){
        return tiles[x][y];
    }else{
        if (level == 0) return new TermiWall(x,y);
        else if (area == "Edge") return new RealityWall(x,y);
        else if (area == "Spire") return new AbazonWall(x,y);
        else return new Wall(x,y);
    }
}
function randomExcluded(min, max, excluded) {
    var n = Math.floor(Math.random() * (max-min) + min);
    if (n >= excluded) n++;
    return n;
}
function randomPassableTile(){
    let tile;
    tryTo('get random passable tile', function(){
        let x = randomExcluded(0,numTiles-1,4);
        let y = randomExcluded(0,numTiles-1,1);
        tile = getTile(x, y);
        return tile.passable && !tile.monster;
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
    if (level < 6 && area != "Spire") numMonsters = level+1;
    else if (area == "Spire") numMonsters = 0;
    else if (level > 6 && level != 17) numMonsters = level;
    else if ((level % 5 == 1 && level > 5) || (level == 17 && area == "Faith")) numMonsters = 1;
    for(let i=0;i<numMonsters;i++){
        spawnMonster();
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

function spawnMonster(){
    if (area == "Spire"){
        let monsterType = shuffle([HostileFluffy])[0]; //
        let monster = new monsterType(randomPassableTile());
        monsters.push(monster);
    }
    else if (level == 17 && area == "Faith"){
        let monsterType = shuffle([Epsilon])[0];
        let monster = new monsterType(getTile(9,9));
        monsters.push(monster);
        let monsterTypee = shuffle([Box])[0];
        let monstere = new monsterTypee(getTile(4,4));
        monsters.push(monstere);
        for (let i = 1; i < 9; i++){
            let tail = new Tail(getTile(8,i+3));
            tail.order = i;
            monsters.push(tail);
        }
    }
    else if ((level % 5 != 1 || level == 1)&& level != 0){
        let monsterType = shuffle([Apis,Weaver, Second, Tinker,Oracle, Snail,Slug,Ragemaw, Felidol,Monk,Scion, Shrike, Apiarist,Shrike])[0]; //Rendfly
        let monster = new monsterType(randomPassableTile());
        monsters.push(monster);
    }
    else if (level != 0){
        let monsterType = shuffle([Harmonizer])[0];
        let tile = getTile(4,4);
        let monster = new monsterType(tile);
        monsters.push(monster);
        tiles[(numTiles-1)/2][numTiles-1] = new Exit((numTiles-1)/2,numTiles-1);
    }
    else if (level == 0){
        let monsterType = shuffle([Hologram])[0];
        let tile = getTile(4,6);
        let monster = new monsterType(tile);
        monsters.push(monster);
    }

}

function spawnCages(loot, tile){
    let cage;
    if (smod.includes(loot)) cage = new Modulorb(tile, loot);
    else cage = new Cage(tile, loot);
    if (cage.loot == "SERENE") cage.lore = description["FluffyCage"];
    monsters.push(cage);
}