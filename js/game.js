function summonExits(){
    for (let x of tiles){
        for (let y of x){
            if (y instanceof BExit || y instanceof BAscendExit){
                let id = y.id;
                let px = y.x;
                let py = y.y;
                if (y instanceof BExit) tiles[px][py] = new MapExit(px,py,world.getRoom());
                if (y instanceof BAscendExit) tiles[px][py] = new AscendExit(px,py,world.getRoom());
                tiles[px][py].id = id;
            }
        }
    }
    world.fighting = false;
}

function beginTurn(){
    for(let k=monsters.length;k>=0;k--){
        let activeeffects = [];
        let con;
        if (k == monsters.length) con = player;
        else con = monsters[k];
        for (let i of Object.keys(con.statuseff)){
            if (con.statuseff[i] > 0) activeeffects.push(i);
            con.statuseff[i] = Math.max(0,con.statuseff[i]-1);
            if (con.statuseff[i] > 0 && activeeffects.includes(i)) removeItemOnce(activeeffects,i);
        }
        con.effectsExpire(activeeffects);
    }

    for(let k=monsters.length;k>=0;k--){
        let con;
        if (k == monsters.length) con = player;
        else con = monsters[k];
        if (con.soullink && con.soullink instanceof Tile){
            con.move(con.soullink);
            con.soullink = null;
        }
    }
}

function tick(){
    player.update();
    deadcheck = 0;
    if (world.getRoom() instanceof EpsilonArena && !monsters[0].dead){
        monsters[0].update();
        monsters[1].update();
        monsters[2].update();
        monsters[3].update();
        monsters[4].update();
    }
    else if (world.getRoom() instanceof EpsilonArena && monsters[0].dead){
        for (let x of monsters){
            if (x.order >= 0){
                x.tile.getAllNeighbors().forEach(function(t){
                    t.setEffect(1, 30);
                });
            }
            removeItemOnce(monsters,x);
        }
        shakeAmount = 40;
        gameState = "dead";
        playSound("epsideath");
        pauseAllMusic();
        playSound("roseic");
        log.addLog("EpsilonDefeat");
        victory = true;
    }
    for(let k=monsters.length-1;k>=0;k--){
        if (monsters[k].doomed && !monsters[k].isPlayer) monsters[k].hit(99);
        if(!monsters[k].dead && monsters[k].order < 0){
            monsters[k].update();
            if (k >= monsters.length) break;
            if (!monsters[k].permacharm || monsters[k].name.includes("Vermin")) deadcheck++
        }else if (monsters[k].order < 0){
            monsters.splice(k,1);
        }
    }
    for(let k=droppedsouls.length-1;k>=0;k--){
        droppedsouls[k].update();
    }
    if (deadcheck == 0 && area == "Faith"){
        //gener8 sortie si every1 est ded
        if (world.fighting){
            if(world.getRoom().hostile) universe.worlds[universe.currentworld-1].cage.slots[world.getRoom().index[0]][world.getRoom().index[1]].turbulent = false;
            summonExits();
            if (player.falsehp < 1){
                player.falsehp = 1;
                player.doomed = false;
            }
        }
    }
    else if (player.doomed) player.hit(99);

    if(player.dead){
        if (player.rosetox < 10) playSound("death");
        else playSound("toxicdeath");
        if(truehp < 1){
            gameState = "dead";
            pauseAllMusic();
            playSound("falsity");
        }
        else{
            if (!(world.getRoom() instanceof EpsilonArena) && !(world.getRoom() instanceof WorldSeed)) {
                gameState = "contemplation";
                truehp -= deadcheck;
                agony = deadcheck;
                if (area == "Faith" && player.rosetox < 10) log.addLog("Agony");
                else if (area == "Serene"){
                    log.addLog("Fallen");
                }
                else if (player.rosetox > 9){
                    log.addLog("Rosified");
                }
                //for(let k=monsters.length-1;k>=0;k--){
                //    monsters.splice(k,1);
                //}
            }
            else{
                wheel.ipseity = lose(wheel.ipseity,5);
                if(wheel.ipseity <= 0){
                    gameState = "dead";
                    pauseAllMusic();
                    playSound("falsity");
                    log.addLog("EpsilonDeath");
                }
                else{
                    player.hp = maxHp;
                    rosetoxin = 0;
                    player.rosetox = 0;
                    for (let x of monsters) x.sprite = x.spritesave;
                    if (wheel.ipseity > 5) log.addLog("EpsilonTaunt");
                    else  log.addLog("EpsilonOneChance");
                    player.dead = false;
                    player.tile.setEffect(1, 30);
                    spells["WOOP"](player);
                    player.sprite = 0;
                    player.fuffified = 0;
                    for (let k of wheel.saved){
                        if (!(k instanceof Empty))wheel.discard.push(k);
                    }
                    wheel.saved = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
                }
            }
        }
        
        //gener8 exit if u r ded
        //if (level % 5 != 0 && area == "Faith"){
        //    tiles[Math.floor((numTiles-1)/2)][numTiles-1] = new Exit(Math.floor((numTiles-1)/2),numTiles-1)
        //}
        //else if (area == "Faith"){
        //    tiles[Math.floor((numTiles-1)/2)][numTiles-1] = new FluffExit(Math.floor((numTiles-1)/2),numTiles-1)
        //}
        
    }
    tickTiles();
}

//let bosstitle = ["-Last of the Saints-","-Supreme Ordered General-","-the Unfaltering Wheel-","-Grand Harmonic Maestra-"];

//let bar = ["⚙⚙","Σ","❄❄","♡♡"];

function startGame(){                       
    level = 1;
    resolvebonus = 0;
    rosetoxin = 0;
    tileSize = 64;
    numTiles = 9;
    areaname = new LocationDisplay();
    buttons = new ButtonsDisplay();
    research = new Research();
    wheel = new SoulBreathing(); //should belong to entity
    universe = new Universe();
    log = new MessageLog();
    universe.start(startingHp);
    world.cage.equateWorld();
    gameState = "running";
}

function summonMonster(x,y,type){
    let tile = getTile(x,y);
    let monster = new type(tile);
    monster.teleportCounter = 0;
    monsters.push(monster);
    monster.setUpSprite();
}

function playerTransformTest(type){
    let tile = getTile(player.tile.x,player.tile.y);
    let monster = new type(tile);
    monster.teleportCounter = 0;
    player = monster;
    player.setUpSprite();
}

function unlockAllSpells(){
    for (let i of Object.keys(spellpatterns)){
        research.knownspells.push(i);
    }
}

function createSpell(contin,form,mod,func){
    return new Axiom([contin],[form],[mod],[func],"VILE","me");
}

function getSouls(){
    let i = [Saintly,Ordered,Artistic,Unhinged,Feral,Vile];
    for (let r of i){
        for (let j = 0; j<10; j++){
            wheel.addSoul(r);
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