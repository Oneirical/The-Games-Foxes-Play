function trigger(key,assi){
    for (let i of monsters){
            i.trigger(key,assi);
    }
}

function locatePlayer(over){
    if (!over) over = monsters;
    for (let i of over){
        let s = i.loopThroughSouls();
        for (let t of s){
            let y;
            if(t instanceof Soul) y = t.findAxioms(RealityAnchor);
            else y = [];
            if (y.length > 0){
                const playerChanged = player !== i;
                if (playerChanged) tilesDisplay.removeChild(player.creaturecon);
                player = i;
                if (playerChanged){
                    tilesDisplay.addChild(player.creaturecon);
                    player.creaturecon.x = 8*tileSize; //when soul swapping, the victim's sprite will go in weird places
                    player.creaturecon.y = 8*tileSize;
                    tickProjectors();
                    if (player instanceof EpsilonHead){
                        for (let m of monsters) if (m instanceof EpsilonTail) m.partOfPlayer = true;
                    }
                }
                return true;
            }
        }
    }
    return false;
}

function assignSouls(){
    for (let r of universe.worlds){
        for (let i of r.playSpace.monsters){
            for (let j of soulSlotNames){
                if (i.souls[j]) i.souls[j] = new Soul(i.souls[j],i);
            }
            if (i.generationMark){
                i.extraConfig(r.playSpace);
            }
        }
    }
}

function teleport(target,destination,data){
    let initialPoint = target.tile;
    target.move(destination);
    let finalPoint = target.tile;
    if (data["flags"].has("trailing")) {
        let dx = finalPoint.x - initialPoint.x;
        let dy = finalPoint.y - initialPoint.y;
        let direction;
        let trail = line(initialPoint,finalPoint);
        for (let r = 1; r<trail.length-1; r++){
            let i = trail[r];
            if (Math.abs(dx) >= Math.abs(dy)) direction = [0,shuffle([-1,1])[0]];
            else direction = [shuffle([-1,1])[0],0];
            i.spellDirection = direction;
            data.targets.add(i);
        }
    }
    return data;
}

function startGame(){   
    gameTurns = 0;                    
    level = 1;
    tileSize = 64;
    numTiles = 9;
    areaname = new LocationDisplay();
    statuses = new StatusDisplay();
    buttons = new ButtonsDisplay();
    wheel = new SoulBreathing(); //should belong to entity
    universe = new Universe();
    log = new MessageLog();
    soulTree = new SoulTree();
    sideTooltip = new NodeDescription();
    universe.start();
}

function summonMonster(x,y,type){ // can accept a species or clone a creature
    let tile = getTile(x,y);
    let monster;
    if (type instanceof Monster) monster = new type.constructor(tile);
    else monster = new type(tile);
    monsters.push(monster);
    if (type instanceof Monster){
        for (let j of soulSlotNames){
            if (type.souls[j]) monster.souls[j] = type.souls[j].cloneSoul();
            if (monster.souls[j]) monster.souls[j].owner = monster;
        }
    }
    else for (let j of soulSlotNames){
        if (monster.souls[j]){
            monster.souls[j] = new Soul(monster.souls[j],monster);
            for (let r of monster.souls[j].axioms){
                for (let p of r) p.translate();
            }
        } 
    }
    if (monster.generationMark){
        monster.extraConfig(world.playSpace);
    }
    monster.setUpSprite();
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