function trigger(key,assi){
    for (let i of monsters){
            i.trigger(key,assi);
    }
}

setInterval(trigger,1000,"RHYTHM");

function playerInput(key){
    if (key == "k") toggleFullScreen();
    else if (key == "o") saveGame();
    else if (key == "m") summonCreature(16,40,"Harmonizer");
    else if (key == "p") loadGame();
    else if (!universe.zooming) {
        let action = key.toUpperCase();
        trigger(action);
        actionQueue.push(action);
    }
}

function saveGame(){
    localStorage.setItem("seed",rngSeed);
    localStorage.setItem("queue",JSON.stringify(actionQueue));
}

function loadGame(){
    fastReload = true;
    rngSeed = localStorage.getItem("seed");
    let reloadQueue = JSON.parse(localStorage.getItem("queue"));
    for (let i = 0; i<reloadQueue.length; i++){ // WHY DOES EVERYTHING GET AN EXTRA MOVE AT THE END?? FIX IT
        playerInput(reloadQueue[i]);
    }
    actionQueue = reloadQueue;
    fastReload = false;
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