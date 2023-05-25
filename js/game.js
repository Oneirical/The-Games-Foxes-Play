function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  

function setupPixi(){
    app = new PIXI.Application({
        view: document.getElementById("pixi-canvas"),
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        width: 1920,
        height: 1080
    });
    document.body.appendChild(app.view);
    tilesDisplay = new PIXI.Container();
    tilesDisplay.x = (1920-16*16*resolutionSize)/2+(resolutionSize+12)*16+8;
    tilesDisplay.y = (1080-16*9*resolutionSize)/2+8;
    app.stage.addChild(tilesDisplay);
    allsprites = new PIXI.Spritesheet(
        PIXI.BaseTexture.from(atlasData.meta.image),
        atlasData
    );
    allsprites.parse();
    startGame();
    drawTiles();
    setUpUI();
}

function drawChainBorder(w,h,source){
    let temp;
    temp = w;
    w = h;
    h = temp;
    let chaincon = new PIXI.ParticleContainer();
    source.addChild(chaincon);
    for (let i=0; i<w;i++){
        for (let j=0;j<h;j++){
            if (i == 0 || j == 0 || i == w-1 || j == h-1){
                let character = ".";
                if (i == 0 && j == 0) character = "Q";
                else if (i == 0 && j == h-1) character = "P";
                else if (i == w-1 && j == 0) character = "Z";
                else if (i == w-1 && j == h-1) character = "M";
                else if (i == 0) character = "-";
                else if (i == w-1) character = "=";
                else if (j == 0) character = "<";
                else if (j == h-1) character = ">";
                
                let hai = 139;
                if (["Q","P","Z","M"].includes(character)) hai = 140;
                else if (["B","E","L","T"].includes(character)) hai = 141;
                let newSprite = new PIXI.Sprite(allsprites.textures['sprite'+hai]);
                newSprite.width = 32;
                newSprite.height = 32;
                newSprite.anchor.set(0.5,0.5);
                newSprite.x = (j*32);
                newSprite.y = (i*32);
                const rotatea = {
                    "Q" : 0,
                    "P" : Math.PI/2,
                    "Z" : 3*Math.PI/2,
                    "M" : Math.PI,
                    "-" : Math.PI/2,
                    "=" : 3*Math.PI/2,
                    "<" : 0,
                    ">" : Math.PI,
                    "B" : 3*Math.PI/2,
                    "E" : Math.PI/2,
                    "L" : Math.PI,
                    "T" : 0,
                }
                newSprite.rotation = rotatea[character];
                newSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                chaincon.addChild(newSprite);
            }
        }
    }
}

function tickTiles(){
    for(let i=0;i<numTiles;i++){
        for(let j=0;j<numTiles;j++){
            let hai = tiles[i][j].sprite;
            let bai = allsprites.textures['sprite'+hai];
            tilesDisplay.children[j+(i*9)].children[0].texture = bai; //extend this to also place traps and caged souls
        }
    }
}

function setUpUI(){
    //drawChainBorder(376,44,32,32,app.stage); //main
    ////title
    // //map
    //drawChainBorder(34,44+32*13+64,10,5,app.stage); //status

    // //souls
    // //log
    //drawChainBorder(372+32*32+28,44+32*29,15,3,app.stage); //buttons
    uiDisplayLeft = new PIXI.Container();
    uiDisplayLeft.x = 34;
    uiDisplayLeft.y = 44;
    app.stage.addChild(uiDisplayLeft);
    //drawChainBorder(32,32,uiDisplayLeft);
    uiDisplayRight = new PIXI.Container();
    uiDisplayRight.x = 372+32*32+28;
    uiDisplayRight.y = 44;
    app.stage.addChild(uiDisplayRight);
    areaname.setUpSprites();
    statuses.setUpSprites();
    buttons.setUpSprites()
    wheel.setUpSprites();
    player.axioms.setUpSprites();
    world.setUpSprites();
    log.setUpLog();
}

function drawTiles(){
    for (let i = tilesDisplay.children.length - 1; i >= 0; i--) {	tilesDisplay.removeChild(tilesDisplay.children[i]);};
    tileSize = ((resolutionSize)*16)/(world.getRoom().size/9);
    for(let i=0;i<numTiles;i++){
        for(let j=0;j<numTiles;j++){
            tiles[i][j].setUpSprite();
        }
    }
    drawSprites();
    drawChainBorder(32,32,tilesDisplay);
}


function drawSprites(){
    for(let k=monsters.length;k>=0;k--){
        let con;
        if (k == monsters.length) con = player;
        else con = monsters[k];
        con.setUpSprite();
    }
}

function getMouse(){
    console.log((app.renderer.events).rootPointerEvent.global.x);
    console.log((app.renderer.events).rootPointerEvent.global.y);
}

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
                    fallen = false;
                }
                else if (player.rosetox > 9){
                    log.addLog("Rosified");
                }
                //for(let k=monsters.length-1;k>=0;k--){
                //    monsters.splice(k,1);
                //}
            }
            else if (world.getRoom() instanceof WorldSeed){
                player.hp = maxHp;
                player.dead = false;
                player.tile.setEffect(1, 30);
                wheel.resolve = 3+Math.floor(resolvebonus/2);
                world.getRoom().progressTutorial(world.getRoom().stage);
                player.sprite = 0;
                log.addLog("BlehhFail");
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
                        wheel.spinningsouls = [new SpinningSoul(47,0)];
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
    if (doublecounter != 0) doublecounter--;
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
    statuses = new StatusDisplay();
    buttons = new ButtonsDisplay();
    research = new Research();
    wheel = new DrawWheel();
    universe = new Universe();
    log = new MessageLog();
    universe.start(startingHp);
    world.cage.equateWorld();
    gameState = "running";
}

function removeColorTags(text){
    return text.replace(/\[[\s\S]*?\]/g, '');
}

function printOutText(text, size, x, y, color, lineHeight, fitWidth, oldx)
{
    ctx.font = size + "px Play";
    let breaker = text.split('\n');
    if (text.includes('\n')){
        let yscale = y;
        for (let i = 0; i<breaker.length; i++){
            let sis = "";
            if (i != 0) sis = breaker[i-1];
            printOutText(breaker[i], size,  x, yscale + Math.min(1,i)*20 + (lineHeight*countLines(sis,fitWidth)),color,lineHeight,fitWidth);
            yscale = yscale + 20*Math.min(1,i) + (lineHeight*countLines(sis,fitWidth));
        }
        return;
    }
    let breaker2 = text.split('[');
    if (text.includes('[')){
        ctx.save();
        let xsave = 0;
        let oldx = [x,fitWidth];
        breaker2.forEach((text) => {
            let pickcolor = colourcodes[text.slice(0, 2)];
            if (pickcolor) text = text.slice(2);
            else if (!pickcolor) pickcolor = "white";
            if (color == "#b4b5b8") pickcolor = "#b4b5b8";
            if (fitWidth-xsave <= 0){
                xsave = xsave-fitWidth;
                y+= lineHeight;
            }
            printOutText(text, size, x, y, pickcolor, lineHeight, fitWidth-xsave, oldx);
            x += ctx.measureText(text).width;
            if (x >= (oldx[0] + oldx[1])) x = oldx[0] + nextlinesave;
            xsave += ctx.measureText(text).width;
        });
        ctx.restore();
        return;
    }
    let sx = x || canvas.width-uiWidth*64+25;
    fitWidth = fitWidth || 0;
    ctx.fillStyle = color;
    if (fitWidth <= 0)
    {
        ctx.fillText( text, x, y );
        return;
    }
    if (!text) return;
    let currentLine = 0;
    if (fitWidth < 20){
        if (text[0] == " ") text = text.slice(1);
        currentLine++;
        if (oldx) sx = oldx[0];
        fitWidth = oldx[1];
    }
    let words = text.split(' ');
    let idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        let str = words.slice(0,idx).join(' ');
        let w = ctx.measureText(str).width;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            ctx.fillText( words.slice(0,idx-1).join(' '), sx, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
            if(oldx){
                sx = oldx[0];
                fitWidth = oldx[1];
            }
        }
        else
        {idx++;}
    }
    if (idx > 0){
        ctx.fillText( words.join(' '), sx, y + (lineHeight*currentLine) );
        nextlinesave = ctx.measureText(words.join(' ')).width;
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

function screenshake(){ // SHAKE SHAKE SHAKE
    if(shakeAmount){
        shakeAmount--;
    }
    let shakeAngle = Math.random()*Math.PI*2;
    shakeX = Math.round(Math.cos(shakeAngle)*shakeAmount); 
    shakeY = Math.round(Math.sin(shakeAngle)*shakeAmount);
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