function trigger(key,assi){
    if (key === "EON") world.tickMap();
    for (let i of monsters){
            i.trigger(key,assi);
    }
}

setInterval(trigger,1000,"RHYTHM");

function playerInput(key){
    if (key == "k") toggleFullScreen();
    else if (key == "o") saveGame();
    else if (key == "m") summonCreature(16,40,"Harmonizer");
    else if (key == "p") localStorage.clear();
    else if (!universe.zooming) {
        let action = key.toUpperCase();
        trigger(action);
        actionQueue.push(action);
    }
}

function saveEntityLocations(){
    let movedEntities = {};
    for (let i of allCreatures){
        if (i.editedData.Position) movedEntities[i.numberID] = i.tile.toSaveFormat();
    }
    return movedEntities;
}

function saveEntitySpecies(){
    let changedEntities = {};
    for (let i of allCreatures){
        if (i.editedData.Species) changedEntities[i.numberID] = i.species;
    }
    return changedEntities;
}

function saveEntityDoors(){
    let changedEntities = {};
    for (let i of allCreatures){
        if (i.editedData.Opened) changedEntities[i.numberID] = i.editedData.Opened;
    }
    return changedEntities;
}

function saveGame(){
    localStorage.clear();
    localStorage.setItem("seed",rngSeed);
    localStorage.setItem("queue",JSON.stringify(actionQueue));
    localStorage.setItem("positions",JSON.stringify(saveEntityLocations()));
    localStorage.setItem("species",JSON.stringify(saveEntitySpecies()));
    localStorage.setItem("opened",JSON.stringify(saveEntityDoors()));
    console.log(localStorage);
}

function loadGameStorage(){
    let positions = JSON.parse(localStorage.getItem("positions"));
    let species = JSON.parse(localStorage.getItem("species"));
    let doors = JSON.parse(localStorage.getItem("opened"));
    for (let i of allCreatures){
        let num = i.numberID;
        if (doors[num]){
            if (doors[num] === "Open") i.openSelf();
            if (doors[num] === "Closed") i.closeSelf();
        }
        if (positions[num]){
            let tile = getTileInUniverse(positions[num]);
            if (i === player) universe.handleDescent(tile.z,tile.x,tile.y);
            i.reloadMove(tile); // make sure no contingencies are triggered later by this
        }
        if (species[num]){
            i.changeSpecies(species[num]);
        }
    }
}

function loadGameQueue(){
    fastReload = true;
    rngSeed = localStorage.getItem("seed");
    let reloadQueue = JSON.parse(localStorage.getItem("queue"));
    for (let i = 0; i<reloadQueue.length; i++){ // WHY DOES EVERYTHING GET AN EXTRA MOVE AT THE END?? FIX IT
        playerInput(reloadQueue[i]);
    }
    actionQueue = reloadQueue;
    fastReload = false;
}

function reassignPlayer(oldPlayer){
    if (oldPlayer) tilesDisplay.removeChild(oldPlayer.creaturecon);
    tilesDisplay.addChild(player.creaturecon);
    player.creaturecon.x = 8*tileSize;
    player.creaturecon.y = 8*tileSize;
    return true;
}

function assignRotations(){
    for (let r of universe.worlds){
        for (let i of r.playSpace.monsters){
            if (i.species === "Airlock") rotateAirlock(i,r); // a little gory, may cause trouble if the changeSpecies of airlocks not connected makes weird properties
            if (i.species === "WellWall") rotateWellWall(i,r);
        }
    }
}

function assignSouls(){
    for (let r of universe.worlds){
        for (let i of r.playSpace.monsters){
            for (let j of soulSlotNames){
                if (i.souls[j]){
                    i.addSoulAtCaste(j,new Soul(i.souls[j],i));
                }
            }
            if (i.generationMark){
                i.extraConfig(r.playSpace);
            }
        }
    }
}

function getAllTiles(){
    let arr = [];
    for (let i of tiles){
        for (let j of i) arr.push(j);
    }
    return arr;
}

function startGame(){   
    level = 1;
    tileSize = 64;
    numTiles = 9;
    areaname = new LocationDisplay();
    buttons = new ButtonsDisplay();
    wheel = new InvokeWheel();
    universe = new Universe();
    log = new MessageLog();
    soulTree = new SoulTree();
    sideTooltip = new NodeDescription();
    universe.start();
}