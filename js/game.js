function setupCanvas(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    //canvas.width = tileSize*(numTiles+uiWidth);
    //canvas.height = tileSize*(numTiles+uiHeight);
    canvas.width = 960;
    canvas.height = 768;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    ctx.imageSmoothingEnabled = false;
}

function drawSprite(sprite, x, y){
    ctx.drawImage(
        spritesheet,
        sprite*16,
        0,
        16,
        16,
        x*tileSize + shakeX,
        y*tileSize + shakeY,
        tileSize,
        tileSize
    );
    //decommenter for speeeeen
    //if (gameState == "dead"){
    //    ctx.rotate(10);
    //}
}

function drawFilter(){
    ctx.drawImage(
        rosefilter,
        0,
        0,
        960,
        768,
        0,
        0,
        960,
        768
    );
}

function draw(){
    if(gameState == "running" || gameState == "dead" || gameState == "contemplation" || gameState == "fluffy" || gameState == "vision" || gameState == "discard"){  
        ctx.clearRect(0,0,canvas.width,canvas.height);

        screenshake();
        
        let posgenx = 0;
        let posgeny = 0;
        let maxx = numTiles;
        let maxy = numTiles;
        if (player.fov > 0){
            posgenx = player.tile.x-player.fov;
            posgeny = player.tile.y-player.fov;
            maxx = Math.min(player.tile.x+player.fov+1,numTiles);
            maxy = Math.min(player.tile.y+player.fov+1,numTiles);
        }
        let viewedTiles = [];

        for(let i=posgenx;i<maxx;i++){
            for(let j=posgeny;j<maxy;j++){
                getTile(i,j).draw();
                viewedTiles.push(getTile(i,j));
            }
        }
        
        for(let i=0;i<monsters.length;i++){
            if (viewedTiles.includes(monsters[i].tile) || monsters[i].charmed)monsters[i].draw();
        }
        
        if (level == 0) drawText("World Seed", 30, false, 40, "violet");
        else if (level % 5 == 1 && level > 5 && area == "Faith") drawText("Test of Unity", 30, false, 40, "violet");
        else if (level % 5 == 1 && level > 5 && area == "Spire") drawText("Fluffian Workshop", 30, false, 40, "violet");
        else if (area == "Spire") drawText("Serene Spire: floor "+level, 30, false, 40, "violet");
        else if (area == "Circus") drawText("Roseic Circus", 30, false, 40, "violet");
        else drawText("Faith's End: level "+level, 30, false, 40, "violet");
        drawText("Ipseity: "+truehp, 30, false, 70, "cyan");
        if (gameState == "running"){
            drawText("Resolve: "+resolve, 30, false, 100, "orange");
        }
        if (gameState == "contemplation"){
            drawText("Agony: "+agony, 30, false, 100, "red");
        }
        if (gameState == "dead"){
            drawText("SOUL SHATTERED", 20, false, 100, "red");
        }
        let basicc = player.inventory.filter(soul => basic.includes(soul)).length + player.inhand.filter(soul => basic.includes(soul)).length + player.discard.filter(soul => basic.includes(soul)).length + player.saved.filter(soul => basic.includes(soul)).length;
        let serc = player.inventory.filter(soul => soul == "SERENE").length + player.inhand.filter(soul => soul == "SERENE").length + player.discard.filter(soul => soul == "SERENE").length + player.saved.filter(soul => soul == "SERENE").length;
        let advc = player.inventory.length + player.inhand.length + player.discard.length + player.saved.length - basicc -serc;
        printAtSidebar("Common Souls: "+basicc, 18, 590, 475, "white", 20, 350);
        printAtSidebar("Legendary Souls: "+advc, 18, 590, 500, "yellow", 20, 350);
        printAtSidebar("Serene Souls: "+serc, 18, 590, 525, "cyan", 20, 350);
        printAtSidebar("f) Harmonic Modulator: "+modulename[player.activemodule], 18, 590, 550, "cyan", 20, 350);
        if ((gameState == "vision" && discarded > 0) || (gameState == "discard" && !naiamode)) drawText("Which soul to discard?", 20, false, 100, "deepskyblue");
        if (gameState == "discard" && naiamode) drawText("Which soul to cast?", 20, false, 100, "fuchsia");
        if (gameState == "vision" && discarded == 0) drawText("Which soul to stack?", 20, false, 100, "deepskyblue");
        player.draw();
        if (level % 5 == 1 && level > 5 && area == "Faith") drawChar(tiles[2][3].value, 30, 151, 235, "cyan");
        if (level % 5 == 1 && level > 5 && area == "Faith") drawChar(tiles[4][2].value, 30, 280, 171, "cyan");
        if (level % 5 == 1 && level > 5 && area == "Faith") drawChar(tiles[6][3].value, 30, 408, 235, "cyan");
        if (level % 5 == 1 && level > 5 && area == "Faith") drawChar(tiles[2][5].value, 30, 151, 363, "red");
        if (level % 5 == 1 && level > 5 && area == "Faith") drawChar(tiles[4][6].value, 30, 280, 427, "red");
        if (level % 5 == 1 && level > 5 && area == "Faith") drawChar(tiles[6][5].value, 30, 408, 363, "red");
        if (level % 5 == 1 && level > 5 && !player.betted && area == "Faith") drawChar(tiles[5][5].value, 30, 343, 363, "yellow");
        if (level % 5 == 1 && level > 5 && !player.betted && area == "Faith") drawChar(tiles[3][5].value, 30, 215, 363, "yellow");
        if (level % 5 == 1 && level > 5 && !player.betted && area == "Faith") drawChar(tiles[3][3].value, 30, 215, 235, "yellow");
        if (level % 5 == 1 && level > 5 && !player.betted && area == "Faith") drawChar(tiles[5][3].value, 30, 343, 235, "yellow");
        if (sacrifice == 6 && !cursormode) printAtSidebar("Your Fluffian Arithmetic Elegance Score is "+sacritotal+".", 18, 590, 130, "cyan", 20, 350);
        //if (sacrifice < 6 && gameState == "fluffy" && !cursormode) printAtWordWrap("Press the corresponding number while standing on a Relay to sacrifice a soul.", 18, 590, 320, "cyan", 20, 350);
        //if (sacrifice < 6 && gameState == "fluffy" && !cursormode) printAtWordWrap("Press \"q\" to bring forth souls to sacrifice.", 18, 590, 250, "cyan", 20, 350);
        //if (sacrifice < 6 && gameState == "fluffy" && !cursormode) printAtWordWrap("The red Relays are substracted from the blue Relays, forming a 3-digit number. Try to get as close to 0 as possible!", 18, 590, 390, "cyan", 20, 350);
        //if (sacrifice < 6 && gameState == "fluffy" && !cursormode) printAtWordWrap("Use Soul View mode (\"c\", then \"i\") if you forgot the value of a certain soul.", 18, 590, 490, "cyan", 20, 350);
        if (sacrifice == 6 && !cursormode) printAtSidebar("Press \"f\" to reroll unclaimed caged souls. Warning: The Harmony will sow a seed within your psyche should you take this action!", 18, 590, 200, "cyan", 20, 350);
        if (level == 0 && !cursormode) printAtSidebar("Use WASD to move around, interact, and attack.", 18, 590, 130, "lime", 20, 350);
        //if (level == 2 && !cursormode&& gameState == "running") printAtSidebar("Press \"q\" in combat to summon Souls. Summoning costs Resolve, or Ipseity if you have no more Resolve.", 18, 590, 400, "lime", 20, 350);
        //if (level == 2 && !cursormode&& gameState == "running") printAtSidebar("Press the number keys 1-9 to unleash Souls.", 18, 590, 500, "lime", 20, 350);
        if (!cursormode && gameState == "contemplation" && !contemhint){
            //printAtSidebar("Death in this world is only the beginning of another cycle. Press the number keys 1-9 to permanently forget Souls you do not wish to keep. You can only forget the Souls you summoned in this room.", 18, 590, 350, "lime", 20, 350);
            //printAtSidebar("Dying costs Ipseity. If your Ipseity reaches zero, you die a true death.", 18, 590, 500, "lime", 20, 350);
            contemhint = false;
        }
        //if (level == 1 && !cursormode&& gameState == "running") printAtSidebar("Slay enemies to collect their Soul.", 18, 590, 500, "lime", 20, 350);
        if (level == 0 && !cursormode) printAtSidebar("Press \"c\" to toggle Examine mode.", 18, 590, 210, "lime", 20, 350);
        if (cursormode && !invmode) printAtSidebar("Press \"i\" while in Examine mode to toggle Soul View mode.", 18, 590, 425, "lime", 20, 350);
        
        if (cursormode == true && invmode == false){
            cursor.draw();
            cursor.info();
        }
        
        else {
            if (invmode == true){
                cursor.draw();
                if (currentspelldesc == "nan"){
                    message = "InvPrompt";
                }
                else if (currentspelldesc != "nan" && Number.isInteger(currentspelldesc)){
                    message = "Empty";
                    player.loreSpell(currentspelldesc);
                }
                else{
                    message = "Empty";
                    player.loreSpellMonster(currentspelldesc);
                }
            }
            if (currentspelldesc == "nan" && gameState != "vision"){
                for(let i=0; i<player.inhand.length; i++){
                    let spellText = (i+1) + ") " + (player.inhand[i] || "");
                    if (rosetoxin > 1) spellText = (i+1) + ") " + ("ROSE" || "");              
                    drawText(spellText, 20, false, 130+i*20, "lightskyblue");
                }
                if (gameState == "discard" && !naiamode) message = "Discard";
                else if (gameState == "discard" && naiamode) message = "NaiaTime";
            }
            else if (gameState == "vision"){
                for(let i=0; i<player.vision.length; i++){
                    let spellText = (i+1) + ") " + (player.vision[i] || "");                        
                    drawText(spellText, 20, false, 130+i*20, "lightskyblue");
                }
                message = "Shiza";
            }
            let coloring = colours[message];
            if (message.includes("Fluffy")) coloring = "cyan";
            else if (message.includes("Rose")) coloring = "lavenderblush";
            if ((!cursormode && !invmode) || (cursormode && invmode)) printAtWordWrap(messages[message], 18, 10, 600, coloring, 20, 940);
            if (rosetoxin > 1){
                ctx.globalAlpha = 0.5;
                drawFilter();
            }
            else{
                ctx.globalAlpha = 1;
            }
        } 
    }
}
function manageExit(){
    truehp++;
    for (let elem of player.discard){
        if(elem == "EZEZZA") truehp++;
    }
    for (let elem of player.inhand){
        if(elem == "EZEZZA") truehp++;
    }
    for (let elem of player.inventory){
        if(elem == "EZEZZA") truehp++;
    }
    exitspawn = 1;
}

function tick(){
    player.update();
    deadcheck = 0;
    for(let k=monsters.length-1;k>=0;k--){
        if(!monsters[k].dead){
            monsters[k].update();
            if (!monsters[k].permacharm || monsters[k].name.includes("Vermin")) deadcheck++
        }else{
            monsters.splice(k,1);
            
        }
    }
    if (deadcheck == 0 && level != 0&& area == "Faith"){
        //gener8 sortie si every1 est ded
        if (exitspawn == 0 && level % 5 != 0){
            tiles[Math.floor((numTiles-1)/2)][numTiles-1] = new Exit(Math.floor((numTiles-1)/2),numTiles-1);
            manageExit();
        }
        else if (exitspawn == 0 && level % 5 == 0){
            tiles[Math.floor((numTiles-1)/2)][numTiles-1] = new FluffExit(Math.floor((numTiles-1)/2),numTiles-1);
            manageExit();
        }
    }

    if(player.dead){
        playSound("death");
        if(truehp < 1){
            gameState = "dead";
            pauseAllMusic();
            playSound("falsity");
        }
        else{
            gameState = "contemplation";
            player.inhand.push(...player.saved);
            player.saved.length = 0;
            truehp -= monsters.length;
            agony = monsters.length;
            if (area == "Faith") message = "Agony";
            else if (area == "Serene"){
                message = "Fallen";
                fallen = false;
            }
            for(let k=monsters.length-1;k>=0;k--){
                monsters.splice(k,1);
            }
            if (truehp <= 0){
                gameState = "dead";
                pauseAllMusic();
                playSound("falsity");
                message = "RoomDeath";
            }
        }
        
        //gener8 exit if u r ded
        if (level % 5 != 0 && area == "Faith"){
            tiles[Math.floor((numTiles-1)/2)][numTiles-1] = new Exit(Math.floor((numTiles-1)/2),numTiles-1)
        }
        else if (area == "Faith"){
            tiles[Math.floor((numTiles-1)/2)][numTiles-1] = new FluffExit(Math.floor((numTiles-1)/2),numTiles-1)
        }
        
    }

    spawnCounter--;
    if(spawnCounter <= 0){  
        spawnMonster();
        spawnCounter = spawnRate;
        spawnRate--;
    }
    if (doublecounter != 0) doublecounter--;
}

function showTitle(){                                          
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    pauseAllMusic();
    gameState = "title";
    playSound("title"); 
    message = "Empty";
    drawText("THE GAMES", 40, true, canvas.height/2 - 110, "cyan");
    drawText("FOXES PLAY", 70, true, canvas.height/2 - 50, "cyan");
    drawText("by Oneirical", 30, true, canvas.height/2 - 20, "white");
    drawText("with music by Zennith", 30, true, canvas.height/2 + 10, "white");
}

function showBoss(){                                          
    pauseAllMusic();
    message = "Empty";
    let bossname = ["ROSE","EPSILON","RONIN","FLUFFY"];
    let bosstitle = ["-Last of the Saints-","-Supreme Ordered Admiral-","-the Unfaltering Wheel-","-Grand Harmonic Maestra-"];
    let bosscolour = ["pink","red","purple","cyan"];
    let currentboss = 1;
    let scale = [0,-100,-50,-75];
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(canvas.width/2-200+scale[currentboss],canvas.height/2 - 120,canvas.width/4+160, canvas.height/5);
    drawText(bossname[currentboss], 70, true, canvas.height/2 - 50, bosscolour[currentboss]);
    drawText(bosstitle[currentboss], 40, true, canvas.height/2, "white");
}

function startGame(){
    pauseSound("title");            
    playSound("cage");                         
    level = 0;
    truehp = 8;
    score = 0;
    numSpells = 0;
    aubecounter = 0;
    invsave = ["SERENE","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY","SAINTLY",];//[, ] //];
    modules = ["NONE"];
    modulators = ["Alacrity","Selective","Thrusters","Hover","Focus"];
    shuffle(invsave);
    dissave = [];
    startLevel(startingHp);
    gameState = "running";
}

function startLevel(playerHp){
    if (area == "Edge") {
        let numtest = numTiles;
        numTiles = 18;
        tileSize = (numtest/numTiles)*64;
        if (numtest != numTiles) setupCanvas();
    }
    else if (area == "Spire"){
        let numtest = numTiles;
        numTiles = 9;
        if (numtest != numTiles) setupCanvas();
    }
    else if (area == "Circus"){
        let numtest = numTiles;
        numTiles = 18;
        tileSize = (numtest/numTiles)*64;
        if (numtest != numTiles) setupCanvas();
    }
    else if (area == "Faith"){
        let numtest = numTiles;
        numTiles = 9;
        if (numtest != numTiles) setupCanvas();
    }
    spawnRate = 99999999999;
    spawnCounter = spawnRate;  
    exitspawn = 0;
    resolve = 3+ 2*Math.floor(level/6);
    if (level % 5 != 1 || level == 1 || area == "Spire") message = "Empty";
    playMusic();
    if (area == "Faith") generateLevel();
    else if (area == "Edge"){
        generateEdgeLevel();
        //generateMonsters();
    }
    else if (area == "Spire"){
        if (level % 5 == 1 && level > 5){
            generateModule();
            generateMonsters();
        }
        else{
            generateSpire();
            generateMonsters();
        }
    }
    else if (area == "Circus"){
        
        generateCircus();
        let montest = new Third(getTile(9,9));
        let montest2 = new Ashsoul(getTile(9,10));
        monsters.push(montest);
        monsters.push(montest2);
    } 
    if (level != 0 && area == "Faith") tile = getTile(Math.floor((numTiles-1)/2), 1);
    else if (area == "Spire" && level % 5 == 1 && level > 5) tile = getTile(1,8)
    else if (area == "Spire") tile = spirespawner;
    else if (area == "Circus") tile = getTile(1,8);
    else tile = getTile(Math.floor((numTiles-1)/2),Math.floor((numTiles-1)/2));
    player = new Player(tile);
    if (area == "Circus") player.fov = 2; //temp remove
    if (area == "Spire" && !(level % 5 == 1 && level > 5)) player.tile.replace(Ladder);
    player.discard = dissave;
    player.inventory = invsave;
    player.teleportCounter = 0;
    player.isPlayer = true;
    player.hp = playerHp;
    sacritotal = "nan";
    sacrifice = 0;
    rolled = 0;
}

function drawText(text, size, centered, textY, color){
    ctx.fillStyle = color;
    ctx.font = size + "px rockwell";
    let textX;
    if(centered){
        textX = (canvas.width-ctx.measureText(text).width)/2;
    }else{
        textX = canvas.width-uiWidth*64+25;
    }

    ctx.fillText(text, textX, textY);
}

function drawChar(text, size, textX, textY, color){
    ctx.fillStyle = color;
    ctx.font = size + "px rockwell";
    ctx.fillText(text, textX, textY);
}

function drawMessage(text, size, textX, textY, color){
    var str = text;
    ctx.fillStyle = color;
    ctx.font = size + "px rockwell";
    var a = textX;
    var b = textY;
    var lineheight = 10;
    var lines = str.split('\n');
    for (var j = 0; j<lines.length; j++)
    ctx.fillText(lines[j], a, b + (j*lineheight) );
}


function printAtWordWrap(text, size, x, y, color, lineHeight, fitWidth)
{
    let jy = y - (768-3*64+25)
    let sy = (jy + (canvas.height-uiHeight*64+25));
    fitWidth = fitWidth || 0;
    ctx.fillStyle = color;
    ctx.font = size + "px rockwell";
    if (fitWidth <= 0)
    {
        ctx.fillText( text, x, sy );
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        var str = words.slice(0,idx).join(' ');
        var w = ctx.measureText(str).width;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            ctx.fillText( words.slice(0,idx-1).join(' '), x, sy + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else
        {idx++;}
    }
    if  (idx > 0)
        ctx.fillText( words.join(' '), x, sy + (lineHeight*currentLine) );
}

function printAtSidebar(text, size, x, y, color, lineHeight, fitWidth)
{
    let sx = canvas.width-uiWidth*64+25;;
    fitWidth = fitWidth || 0;
    ctx.fillStyle = color;
    ctx.font = size + "px rockwell";
    if (fitWidth <= 0)
    {
        ctx.fillText( text, x, y );
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        var str = words.slice(0,idx).join(' ');
        var w = ctx.measureText(str).width;
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
        }
        else
        {idx++;}
    }
    if  (idx > 0)
        ctx.fillText( words.join(' '), sx, y + (lineHeight*currentLine) );
}

function getScores(){
    if(localStorage["scores"]){
        return JSON.parse(localStorage["scores"]);
    }else{
        return [];
    }
}

function addScore(score, won){
    localStorage.clear()
    let scores = getScores();
    let scoreObject = {score: score, run: 1, totalScore: score, active: won};
    let lastScore = scores.pop();

    if(lastScore){
        if(lastScore.active){
            scoreObject.run = lastScore.run+1;
            scoreObject.totalScore += lastScore.totalScore;
        }else{
            scores.push(lastScore);
        }
    }
    scores.push(scoreObject);

    localStorage["scores"] = JSON.stringify(scores);
}

function drawScores(){
    let scores = getScores();
    if(scores.length){
        drawText(
            rightPad(["RUN","SCORE","TOTAL"]), //ancienne fonction, probablement à abandonner
            18,
            true,
            canvas.height/2,
            "white"
        );

        let newestScore = scores.pop();
        scores.sort(function(a,b){
            return b.totalScore - a.totalScore;
        });
        scores.unshift(newestScore);

        for(let i=0;i<Math.min(10,scores.length);i++){
            let scoreText = rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
            drawText(
                scoreText,
                18,
                true,
                canvas.height/2 + 24+i*24,
                i == 0 ? "aqua" : "violet"
            );
        }
    }
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
        music: new Audio('sounds/music.wav'),
        title: new Audio('sounds/The_Game_Foxes_Play.m4a'),
        cage: new Audio('sounds/CageLoop.wav'),
        fail: new Audio('sounds/fail.wav'),
        max: new Audio('sounds/Max.m4a'),
        harmony2: new Audio('sounds/Harmony2.wav'),
        harmony4: new Audio('sounds/Harmony4.m4a'),
        harmony6: new Audio('sounds/Harmony6.m4a'),
        falsity: new Audio('sounds/falsity.mp3'),
        seal: new Audio('sounds/SealTest.m4a'),
        quarry: new Audio('sounds/Quarry.wav'),
        explosion: new Audio('sounds/explosion.wav'),
        deathdelay: new Audio('sounds/deathdelay.wav'),
        on: new Audio('sounds/moduleon.wav'),
        off: new Audio('sounds/moduleoff.wav'),
        roseic: new Audio('sounds/A_Roseic_Problem.mp3')
    };
}

function playSound(soundName){                       
    sounds[soundName].currentTime = 0;  
    sounds[soundName].play();
    let loops = ["cage","max","roseic","title","harmony2","harmony4","harmony6","falsity","seal","quarry"];
    if (loops.includes(soundName)) sounds[soundName].loop = true; 
}
function pauseSound(soundName){  
    sounds[soundName].pause();                     
    sounds[soundName].currentTime = 0;  
}

function pauseAllMusic(){
    let loops = ["cage","roseic","max","title","harmony2","harmony4","harmony6","falsity","seal","quarry"];
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
        message = "RoseWelcome";
    }
    else if (level == 0){
        pauseAllMusic();
        playSound("cage");
    }
    else if (level == 7){
        pauseAllMusic();
        playSound("seal");
    }
    else if (level == 1){
        pauseAllMusic();
        playSound("max");
    }
    else if (level == 12){
        pauseAllMusic();
        playSound("quarry");
    }
    
}