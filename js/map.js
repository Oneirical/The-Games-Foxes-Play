function sameTile(tile1,tile2){
    return tile1.x == tile2.x && tile1.y == tile2.y;
}

function astair(start,dest){
    let graph = [];
    for (let i =0; i<numTiles; i++){
        graph[i] = [];
        for (let j = 0; j<numTiles; j++){
            if (tiles[i][j] == start || tiles[i][j] == dest || (tiles[i][j].tangibleCreature === false)) graph[i][j] = 1;
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

function manDist (pos0, pos1) {
    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
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

function getTile(x, y){
    //if (x > numTiles-1 ||x < 0 || y < 0 || y > numTiles-1) return new RoseWall(x,y);
    if (tiles[x] && tiles[x][y]) return tiles[x][y];
    else return false;
}

function getTileInUniverse(str){
    const tileIndex = str.split(';');
    if (!universe.worlds[tileIndex[0]]) throw new Error("Out of bounds tile in a Tile Axiom.");
    const depth = universe.worlds[tileIndex[0]].playSpace.tiles;
    const x = tileIndex[1];
    const y = tileIndex[2];
    if (!depth[x] || !depth[x][y]) throw new Error("Out of bounds tile in a Tile Axiom.");
    else return depth[x][y];
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

function closestTileToGoal(creature, start,end){
    let neighbors = start.getAdjacentPassableNeighbors();
    neighbors = neighbors.filter(t => creature.canMove(t) || t === end);
    if(neighbors.length){
        neighbors.sort((a,b) => a.dist(end) - b.dist(end));
        let newTile = neighbors[0];
        return newTile;
    }
    return false;
}