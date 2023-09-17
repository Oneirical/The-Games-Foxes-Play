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

function toResearchMode(){
    if (inInventory) toAxiomMode();
    if (inMap) toMapMode();
    inResearch = !inResearch;
    if (inResearch){
        tilesDisplay.eventMode = 'static';
        uiDisplayLeft.removeChildren();
        uiDisplayRight.removeChildren();
        tilesDisplay.notPlayerTiles.addChild(research.displayCon);
        uiDisplayLeft.addChild(research.tabContainer);
        uiDisplayRight.addChild(buttons.displayCon);
        uiDisplayRight.addChild(research.descriptionBox.displayCon);
    }
    else{
        tilesDisplay.eventMode = 'passive';
        tilesDisplay.removeChild(research.displayCon);
        uiDisplayLeft.removeChild(research.tabContainer);
        uiDisplayRight.removeChild(research.descriptionBox.displayCon);
        uiDisplayLeft.addChild(areaname.displayCon);
        uiDisplayLeft.addChild(statuses.displayCon);
        uiDisplayLeft.addChild(world.displayCon);
        uiDisplayRight.addChild(wheel.displayCon);
        uiDisplayRight.addChild(log.displayCon);
        if (world.getRoom() instanceof SoulCage) wheel.toPaintMode();
    }
}

function toMapMode(){

}

function toAxiomMode(){
    if (inResearch) toResearchMode();
    if (inMap) toMapMode();
    inInventory = !inInventory;
    if (inInventory){
        tilesDisplay.eventMode = 'static';
        uiDisplayLeft.removeChildren();
        uiDisplayRight.removeChildren();
        drawPixel("black",0,0,112*9,tilesDisplay);
        tilesDisplay.notPlayerTiles.addChild(player.axioms.displayCon);
        player.axioms.displayCon.x = 0;
        player.axioms.displayCon.y = 0;
        player.axioms.axiomCon.width = 112*9;
        player.axioms.axiomCon.height = 112*9;
        player.axioms.axiomCon.x = 8;
        for (let i of player.axioms.displayCon.children){
            if (i instanceof PIXI.ParticleContainer) player.axioms.displayCon.removeChild(i);
        }
        //uiDisplayRight.addChild(research.descriptionBox.displayCon);
        uiDisplayRight.addChild(buttons.displayCon);
        uiDisplayRight.addChild(player.axioms.axiomList.displayCon);
        player.axioms.axiomList.fillInRows(player);
    }
    else{
        tilesDisplay.eventMode = 'passive';
        drawChainBorder(10,11,player.axioms.displayCon);
        player.axioms.displayCon.y = 32*21;
        player.axioms.axiomCon.x = -8;
        player.axioms.axiomCon.y = 10;
        player.axioms.axiomCon.width = (resolutionSize+12)*16;
        player.axioms.axiomCon.height = (resolutionSize+12)*16;
        tilesDisplay.removeChild(player.axioms.displayCon);
        tilesDisplay.removeChildAt(tilesDisplay.children.length-1);
        uiDisplayLeft.addChild(areaname.displayCon);
        uiDisplayLeft.addChild(statuses.displayCon);
        uiDisplayLeft.addChild(world.displayCon);
        uiDisplayRight.addChild(wheel.displayCon);
        uiDisplayRight.addChild(log.displayCon);
        uiDisplayRight.removeChild(research.descriptionBox.displayCon);
        uiDisplayRight.removeChild(player.axioms.axiomList.displayCon);
        if (world.getRoom() instanceof SoulCage) wheel.toPaintMode();
    }
}

function isForm(str){
    if (axiomRepertoire["Forms"].includes(str)) return true;
    else return false;
}

function isFunction(str){
    if (axiomRepertoire["Functions"].includes(str)) return true;
    else return false;
}

function startGame(){   
    gameTurns = 0;                    
    level = 1;
    tileSize = 64;
    numTiles = 9;
    areaname = new LocationDisplay();
    statuses = new StatusDisplay();
    buttons = new ButtonsDisplay();
    research = new Research();
    wheel = new SoulBreathing(); //should belong to entity
    universe = new Universe();
    log = new MessageLog();
    soulTree = new SoulTree();
    sideTooltip = new NodeDescription();
    universe.start(startingHp);
    gameState = "running";
}

function summonMonster(x,y,type){ // can accept a species or clone a creature
    let tile = getTile(x,y);
    let monster;
    if (type instanceof Monster) monster = new type.constructor(tile);
    else monster = new type(tile);
    monsters.push(monster);
    if (type instanceof Monster){
        for (let j of soulSlotNames){
            if (type.souls[j]) monster.souls[j] = Object.create(type.souls[j]);
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

function getSouls(noturb){
    let i = [Saintly,Ordered,Artistic,Unhinged,Feral,Vile];
    for (let r of i){
        for (let j = 0; j<10; j++){
            wheel.addSoul(r,noturb);
        }
    }
}

function reviver(_, value) {
    if(value instanceof Object && Object.prototype.hasOwnProperty.call(value, '__type')) {
        clazz = eval(`${value.__type}`);
        if(clazz) {
            let {__type:_, ...valueWithoutClassName} = value;
            return Object.assign(new clazz([1,1]), valueWithoutClassName)
        }
    }
    return value;
}

function reloadGame(){
    //let saveData = JSON.parse(localStorage["saves"],reviver);
    //let reloadData = {1 : monsters, 2 : tiles, 3 : player, 4 : world, 5 : wheel, 6 : log};
    //let reloader = function(player){
    //    Object.keys(player).forEach(function(key){
    //        player[key] = saveData[key] 
    //    });
    //    return player;
    //}
    wheel = JSON.parse(localStorage["wheel"],reviver);
    log = JSON.parse(localStorage["log"],reviver);
    world = JSON.parse(localStorage["world"],reviver);
     
}

function saveGame(){
    localStorage.clear();

    //1 : monsters, 2 : tiles, 3 : player, 
    //let saveFile = {4 : world, 5 : wheel, 6 : log};
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          value.__type = value.constructor.name
          return value;
        };
      };
    localStorage["wheel"] = JSON.stringify(wheel, getCircularReplacer());
    localStorage["log"] = JSON.stringify(log, getCircularReplacer());
    localStorage["world"] = JSON.stringify(world, getCircularReplacer());
}

function initSounds(){
    sounds = {
        hit1: new Audio('sounds/hit1.wav'),
        hit2: new Audio('sounds/hit2.wav'),
        treasure: new Audio('sounds/treasure.wav'),
        newLevel: new Audio('sounds/newLevel.wav'),
        spell: new Audio('sounds/soulcast.wav'),
        death: new Audio('sounds/death.wav'),
        title: new Audio('music/The_Game_Foxes_Play.m4a'),
        cage: new Audio('music/CageLoop.wav'),
        fail: new Audio('sounds/fail.wav'),
        max: new Audio('music/Max.m4a'),
        harmony2: new Audio('music/Harmony2.wav'),
        harmony4: new Audio('music/Harmony4.m4a'),
        harmony6: new Audio('music/Harmony6.m4a'),
        falsity: new Audio('music/falsity.mp3'),
        seal: new Audio('music/Seal.m4a'),
        quarry: new Audio('music/Quarry.wav'),
        explosion: new Audio('sounds/explosion.wav'),
        deathdelay: new Audio('sounds/deathdelay.wav'),
        on: new Audio('sounds/moduleon.wav'),
        off: new Audio('sounds/moduleoff.wav'),
        roseic: new Audio('music/A_Roseic_Problem.mp3'),
        toxic: new Audio('music/ROSEROSEROSE.wav'),
        toxicdeath : new Audio('sounds/toxicdeath.wav'),
        spire : new Audio('music/Fly_on_The_Wall.wav'),
        spireloop : new Audio('music/Buzzard.wav'),
        boost : new Audio('sounds/boost.wav'),
        epsilon: new Audio('music/Infracted.wav'),
        epsirepair : new Audio('sounds/EpsilonRepair.wav'),
        epsideath : new Audio('sounds/EpsilonDeath.wav'),
        epsitink : new Audio('sounds/EpsilonTink.wav'),
        epsivuln : new Audio('sounds/EpsilonVuln.wav'),
        malform : new Audio('music/Malform.wav'),
        learn : new Audio('sounds/learn.wav'),
    };
}

function nukeRoom(){
    for (let i of monsters){
        i.hit(99);
    } 
}

function playSound(soundName){      
    return;                 
    sounds[soundName].currentTime = 0;
    sounds[soundName].play();
    let loops = ["cage","max","roseic","title","harmony2","harmony4","harmony6","falsity","seal","quarry","toxic","spire","spireloop","epsilon","malform"];
    if (loops.includes(soundName)) sounds[soundName].loop = true; 
}
function pauseSound(soundName){  
    sounds[soundName].pause();                     
    sounds[soundName].currentTime = 0;  
}

function pauseAllMusic(){
    let loops = ["cage","roseic","max","title","harmony2","harmony4","harmony6","falsity","seal","quarry","toxic","spire","spireloop","epsilon","malform"];
    loops.forEach(function(sound){
        pauseSound(sound);
    });
}

function playMusic(){
    if (level % 5 == 1 && level > 5){
        pauseAllMusic();
        playSound("harmony2");
    }
    else if (area == "Circus"){
        pauseAllMusic();
        playSound("roseic");
         log.addLog("RoseWelcome1");
    }
    else if (area == "Spire" && areachange){
        pauseAllMusic();
        if (!spirevisited) playSound("spireloop");
        else playSound("spireloop");
    }
    else if (level == 0){
        pauseAllMusic();
        playSound("cage");
    }
    else if (level == 7&& area == "Faith"){
        pauseAllMusic();
        playSound("seal");
    }
    else if (level == 1&& area == "Faith"){
        pauseAllMusic();
        playSound("max");
    }
    else if (level == 12&& area == "Faith"){
        pauseAllMusic();
        playSound("quarry");
    }
    else if (world.getRoom() instanceof EpsilonArena && area == "Faith"){
        pauseAllMusic();
        playSound("epsilon");
    }
    
}