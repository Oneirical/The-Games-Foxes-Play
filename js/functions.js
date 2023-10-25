function teleport(target,destination,data){
    if (!target.canMove(destination)){
        severSynapse(data);
        return data;
    }
    planeShift = false;
    if (target.tile.z != destination.z) planeShift = true;
    if (planeShift){
        removeItemOnce(world.playSpace.monsters, target);
        removeItemOnce(monsters,target);
    }
    target.move(destination);
    if (planeShift) universe.worlds[destination.z].playSpace.monsters.push(target);
    return data;
}

function induceStep(creature, chosen, data){
    const currentTile = creature.tile;
    if (chosen === currentTile){
        data = severSynapse(data);
        return data;
    }
    else if (Math.abs(chosen.x-currentTile.x) <= 1 && Math.abs(chosen.y-currentTile.y) <= 1 && Math.abs(chosen.x-currentTile.x) + Math.abs(chosen.y-currentTile.y) != 2){
        if (!creature.tryMove(chosen.x-currentTile.x,chosen.y-currentTile.y)){
            data = severSynapse(data);
        }
        return data;
    }
    else if (!creature.tangible){
        let here = closestTileToGoal(creature, currentTile, chosen);
        if (!creature.tryMove(here.x-currentTile.x, here.y-currentTile.y)){
            data = severSynapse(data);
        }
        return data;
    }
    let path = astair(currentTile,chosen);
    if(path.length == 0){
        path = line(currentTile,chosen);
        path.shift();
    }
    let dir = [path[0].x-creature.tile.x,path[0].y-creature.tile.y];
    if (!creature.tryMove(dir[0],dir[1])) data = severSynapse(data);
    return data;
}

function summonCreature(x,y,type){ // can accept a species or clone a creature
    let tile = getTile(x,y, player.tile.z);
    let monster;
    if (type instanceof Creature) monster = new Creature(tile,type.species);
    else monster = new Creature(tile,type);
    monsters.push(monster);
    if (type instanceof Creature){
        for (let j of soulSlotNames){
            if (type.souls[j]) monster.souls[j] = type.souls[j].cloneSoul();
            if (monster.souls[j]) monster.souls[j].owner = monster;
        }
    }
    else for (let j of soulSlotNames){
        if (monster.souls[j]){
            monster.souls[j] = new Soul(monster.souls[j],monster);
        } 
    }
    if (monster.generationMark){
        monster.extraConfig(world.playSpace);
    }
    monster.setUpSprite();
}

function severSynapse(data){
    data["break"] = true;
    return data;
}

function target(data, tile){
    if (!tile) return data;
    for (let i of tile.getAllCreatures()){
        if (i.hasTag("Untargetable") && !data.caster.hasTag("RealityBreak")) return data;
    }
    data["targets"].push(tile);
    return data;
}

function nukeTargets(data){
    data["targets"] = [];
    return data;
}

function targetBetweenPoints(data, initialPoint, finalPoint){
    const trail = line(initialPoint,finalPoint);
    removeItemOnce(trail,initialPoint);
    removeItemOnce(trail,finalPoint);
    for (let i of trail){
        target(data, i);
    }
    return data;
}

function getAllTargetedCreatures(data){
    let creatures = [];
    const origin = data["caster"].tile;
    let warp = [...data["targets"]].sort((a,b) => manDist(origin,a) - manDist(origin,b)); 
    // This is extremely gory. In order to stop weird collisions with the feral starter, there might be instead a TargetSorter that reorders everything
    // from "as far away from the caster as possible" with a dir axiom?
    for (let i of warp){
        for (let j of i.getAllCreatures()){
            creatures.push(j);
        }
    }
    if (!data.caster.hasTag("RealityBreak")) creatures = creatures.filter((a) => !a.hasTag("Unaffected"));
    return creatures;
}