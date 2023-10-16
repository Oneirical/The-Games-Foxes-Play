function teleport(target,destination,data){
    if (target.canMove(destination)) target.move(destination);
    return data;
    if (data["flags"].has("trailing")) { // no "flags" target
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

}

function summonCreature(x,y,type){ // can accept a species or clone a creature
    let tile = getTile(x,y);
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