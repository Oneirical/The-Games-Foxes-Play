function sameTile(tile1,tile2){
    return tile1.x == tile2.x && tile1.y == tile2.y;
}

function astair(start,dest){
    let graph = [];
    for (let i =0; i<numTiles; i++){
        graph[i] = [];
        for (let j = 0; j<numTiles; j++){
            if (tiles[i][j] == start || tiles[i][j] == dest || tiles[i][j] instanceof Airlock || (tiles[i][j].passable && tiles[i][j].monster == null)) graph[i][j] = 1;
            else graph[i][j] = 0;
        }
    }
    pathfind = new Graph(graph);
    let beg = pathfind.grid[start.x][start.y];
    let end = pathfind.grid[dest.x][dest.y];
    let result = astar.search(pathfind, beg, end);
    let foundTiles = [];
    for (let i of result){
        foundTiles.push(tiles[i.x][i.y]);
    }
    return foundTiles;
}

function line(p0, p1) {
    let points = [];
    let N = diagonal_distance(p0, p1);
    for (let step = 0; step <= N; step++) {
        let t = N === 0? 0.0 : step / N;
        points.push(round_point(lerp_point(p0, p1, t)));
    }
    return points;
}

function diagonal_distance(p0, p1) {
    let dx = p1.x - p0.x, dy = p1.y - p0.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
}

function round_point(p) {
    return tiles[Math.round(p[0])][Math.round(p[1])];
}

function lerp_point(p0, p1, t) {
    return [lerp(p0.x, p1.x, t), lerp(p0.y, p1.y, t)];
}

function lerp(start, end, t) {
    return start * (1.0 - t) + t * end;
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
                let add = rooms[id][g][i];
                if (["V","^","<",">"].includes(add)){
                    const eqs = {
                        "V" : ">",
                        "^" : "<",
                        ">" : "V",
                        "^" : "<",
                    }
                    add = eqs[add];
                }
                flippedroom[i] += add;
            }
        }
        for (let i = 0; i<size;i++){
            rooms[id][i] = flippedroom[i];
        }
        if (rooms[id]["vertical"] != null) rooms[id]["vertical"] = !rooms[id]["vertical"];
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

function getTile(x, y){
    //if (x > numTiles-1 ||x < 0 || y < 0 || y > numTiles-1) return new RoseWall(x,y);
    if (tiles[x] && tiles[x][y]) return tiles[x][y];
    else return new Floor(x,y);
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
        let x = randomRange(0,4);
        let y = randomRange(0,4);
        tile = worldgen[x][y];
        return (tile instanceof Floor);
    });
    return tile;
}

function saveGame(){
    let savedGame = {};
    savedGame["seed"] = rngSeed;
}