function setupCanvas(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    //canvas.width = tileSize*(numTiles+uiWidth);
    //canvas.height = tileSize*(numTiles+uiHeight);
    canvas.width = 960;
    canvas.height = 833;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    ctx.imageSmoothingEnabled = false;
    canvas.addEventListener('mousemove', function(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        mousepos = [x,y];
        if (cursormode){
            if (cursor.tile.monster && cursor.tile.monster.teleportCounter <= 0) currentspelldesc = cursor.tile.monster.loot;
            else if (!cursor.tile.monster) currentspelldesc = "nan";
        }
        
        //if(mouspos[0]>603&&mousepos[1]>115){
    }, false);
    canvas.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let clickpos = [x,y];
        if (gameState != "title"){
            if(inInventory){
                for (let i of legendaries.storecoords){
                    if (clickpos[0] > i[0] && clickpos[0] < (i[0]+64) && clickpos[1] > i[1] && clickpos[1] < (i[1]+64)){
                        legendaries.activateSoul(legendaries.storecoords.indexOf(i));
                    }
                }
                for (let i of legendaries.actcoords){
                    if (clickpos[0] > i[0] && clickpos[0] < (i[0]+64) && clickpos[1] > i[1] && clickpos[1] < (i[1]+64)){
                        legendaries.storeSoul(legendaries.actcoords.indexOf(i));
                    }
                }
            }
        }
        if(gameState != "dead" && gameState != "title"){
            let mousdes = Math.ceil((clickpos[1] - 130)/20);
            if ((clickpos[0] >= 590 && clickpos[0] <= 590+64 && clickpos[1] >= 130 && clickpos[1] <= 130+64 && !cursormode) || (clickpos[0] >= 590 && clickpos[0] <= 590+64 && clickpos[1] >= 500 && clickpos[1] <= 500+64 && cursormode)){
                cursormode = !cursormode;
                invmode = false;
                currentspelldesc = "nan";
                if (cursormode) cursor = new Cursor(playerTile());
                else cursor.die();
            }
            else if (clickpos[0] >= 880 && clickpos[0] <= 880+64 && clickpos[1] >= 490 && clickpos[1] <= 490+64 && inInventory) inInventory = false;
            else if (cursormode || inInventory || inModules) return;
            else if (clickpos[0] >= 880 && clickpos[0] <= 880+64 && clickpos[1] >= 320 && clickpos[1] <= 320+64 && !inInventory) inInventory = true;
            else if (clickpos[0] >= 880 && clickpos[0] <= 880+64 && clickpos[1] >= 130 && clickpos[1] <= 130+64 && !inInventory) log.addLog("WIP");//inModules = !inModules;
            else if (clickpos[0] >= 590 && clickpos[0] <= 590+64 && clickpos[1] >= 320 && clickpos[1] <= 320+64 && !inInventory) wheel.drawSoul();
            else if (inTriangle(clickpos,[0,577],[289,289],[577,577])) player.tryMove(0,1);
            else if (inTriangle(clickpos,[0,0],[289,289],[0,577])) player.tryMove(-1,0);
            else if (inTriangle(clickpos,[577,0],[289,289],[577,577])) player.tryMove(1,0);
            else if (inTriangle(clickpos,[0,0],[289,289],[577,0])) player.tryMove(0,-1);
            else{
                for (let x = 0; x <8 ; x++){
                    if (!inInventory && clickpos[0] >= wheel.wheelcoords[x][0] && clickpos[0] <= wheel.wheelcoords[x][0]+64 && clickpos[1] >= wheel.wheelcoords[x][1] && clickpos[1] <= wheel.wheelcoords[x][1]+64){
                        wheel.castSoul(x);
                    }
                }
                if(gameState == "vision"){
                    if(player.discarded > 0){
                        player.discardSpell(mousdes);
                        player.discarded--;
                    } 
                    else if(player.discarded == 0) player.stackSpell(mousdes);
                }
            }
        }
        else if (cursormode){
            let cread = getTile(Math.floor((clickpos[0]-shakeX)/tileSize),Math.floor((clickpos[1]-shakeY)/tileSize));
            cursor = new Cursor(cread);
            invmode = !invmode;
            
        }
    }, false);
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

function drawFilter(filter){
    ctx.drawImage(
        filter,
        0,
        0,
        577,
        577,
        0 + shakeX,
        0 + shakeX,
        577,
        577
    );
}

function drawSymbol(sprite, x, y, size){
    ctx.drawImage(
        invsheet,
        sprite*16,
        0,
        16,
        16,
        x,
        y,
        size,
        size
    );
}

function drawPixel(sprite, x, y){
    ctx.drawImage(
        mapsheet,
        sprite,
        0,
        1,
        1,
        x,
        y,
        7.11,
        7.11
    );
}

function draw(){
    if(gameState == "running" || gameState == "dead" || gameState == "contemplation" || gameState == "vision" || gameState == "discard"){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let wtfx = mousepos[0];
        let wtfy = mousepos[1];
        let fufflore = false;
        let selectation = 99;
        if(inInventory){
            let nohover = true;
            for (let i of legendaries.storecoords){
                if (mousepos[0] > i[0] && mousepos[0] < (i[0]+64) && mousepos[1] > i[1] && mousepos[1] < (i[1]+64)){
                    legendaries.storage[legendaries.storecoords.indexOf(i)].describe();
                    nohover = false;
                }
            }
            for (let i of legendaries.actcoords){
                if (mousepos[0] > i[0] && mousepos[0] < (i[0]+64) && mousepos[1] > i[1] && mousepos[1] < (i[1]+64)){
                    legendaries.active[legendaries.actcoords.indexOf(i)].describe();
                    nohover = false;
                }
            }
            if (nohover) printAtWordWrap(messages["InvTutorial"], 18, 10, 600, "white", 20, 940);
        }
        if(wtfx>603&&wtfy>115){
            let mousdes = Math.ceil((wtfy - 130)/20);
            if (mousdes+1 <= player.inhand.length || mousdes == 21 || mousdes == 22){
                //log.addLog("Empty");
                let spellName;
                if (mousdes != 21 && mousdes != 22) spellName = player.inhand[mousdes];
                else spellName = player.activemodule;
                selectation = mousdes;
                if (basic.includes(spellName) && area == "Spire") spellName = spellName+"S";
                if (rosetoxin > 1){
                    printAtWordWrap(souldesc["ROSEILLUSION"], 18, 10, 600, "pink", 20, 940);
                    printAtWordWrap(soulabi["ROSEILLUSION"], 18, 10, 725, "pink", 20, 940);
                }
                else if (player.fuffified > 0){
                    printAtWordWrap(souldesc["SERENE"], 18, 10, 600, "cyan", 20, 940);
                    printAtWordWrap(soulabi["SERENE"], 18, 10, 725, "white", 20, 940);
                }
                else{
                    printAtWordWrap(souldesc[spellName], 18, 10, 600, colours[spellName], 20, 940);
                    printAtWordWrap(soulabi[spellName], 18, 10, 600+(Math.ceil(souldesc[spellName].length/100)*25), "white", 20, 940);
                    if (spellName == player.activemodule){
                        //printAtSidebar(soulval[spellName], 18, 590, 195, "cyan", 20, 350);
                        //printAtSidebar(soulname[spellName], 18, 590, 130, colours[spellName], 20, 350);
                        fufflore = true;
                    }
                }
            }
        }
        else{
            let cread = getTile(Math.floor((mousepos[0]-shakeX)/tileSize),Math.floor((mousepos[1]-shakeY)/tileSize));
            if (cread.x <numTiles && cread.y < numTiles) cursor = new Cursor(cread);
        }
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
                getTileButNotCursed(i,j).draw();
                viewedTiles.push(getTileButNotCursed(i,j));
            }
        }
        player.draw();
        for(let i=0;i<monsters.length;i++){
            if (viewedTiles.includes(monsters[i].tile) || monsters[i].charmed)monsters[i].draw();
        }
        if (!inInventory && !cursormode && !wheel.hide) drawText(world.getRoom().name, 30, false, 40, "violet");

        //if (gameState == "dead" && !victory) drawText("SOUL SHATTERED", 20, false, 100, "red");
        //else if (gameState == "dead" && victory) drawText("VICTORY", 30, false, 100, "lime");
        let modulecol = "cyan";
        if (selectation == 21 || selectation == 22) modulecol = "white";
        //printAtSidebar("f) Harmonic Modulator: "+modulename[player.activemodule], 18, 590, 550, modulecol, 20, 350);
        //if ((gameState == "vision" && player.discarded > 0) || (gameState == "discard" && !naiamode)) drawText("Which soul to discard?", 20, false, 100, "deepskyblue");
        //if (gameState == "discard" && naiamode) drawText("Which soul to cast?", 20, false, 100, "fuchsia");
        //if (gameState == "vision" && player.discarded == 0) drawText("Which soul to stack?", 20, false, 100, "deepskyblue");

        world.getRoom().draw();

        if (!cursormode && gameState == "contemplation" && !contemhint){
            //printAtSidebar("Death in this world is only the beginning of another cycle. Press the number keys 1-9 to permanently forget Souls you do not wish to keep. You can only forget the Souls you summoned in this room.", 18, 590, 350, "lime", 20, 350);
            //printAtSidebar("Dying costs Ipseity. If your Ipseity reaches zero, you die a true death.", 18, 590, 500, "lime", 20, 350);
            contemhint = false;
        }
        if (cursormode && !invmode){
            cursor.draw();
            cursor.info();
            drawSymbol(9, 590, 500, 64);
        }
        else if (inInventory) legendaries.display();
        else if (inModules) cybernetics.display();
        else {
            if (invmode == true  && wtfx<603){
                cursor.draw();
                if (currentspelldesc == "nan"){
                    log.addLog("InvPrompt");
                }
                else if (currentspelldesc != "nan" && Number.isInteger(currentspelldesc)){
                    //log.addLog("Empty");
                    player.loreSpell(currentspelldesc);
                }
                else{
                    //log.addLog("Empty");
                    player.loreSpellMonster(currentspelldesc);
                }
            }
            if (!wheel.hide) wheel.display();
            if (currentspelldesc == "nan" && gameState != "vision" && !fufflore){
                for(let i=0; i<player.inhand.length; i++){
                    let spellText = (i+1) + ") " + (player.inhand[i] || "");
                    if (rosetoxin > 1) spellText = (i+1) + ") " + ("ROSE" || "");
                    if (player.fuffified > 0) spellText = (i+1) + ") " + ("SERENE" || "");
                    let colour = "lightskyblue";
                    if (selectation == i) colour = "cyan";     
                    drawText(spellText, 20, false, 130+i*20, colour);
                }
            }
            else if (gameState == "vision"  && !fufflore){
                for(let i=0; i<player.vision.length; i++){
                    let spellText = (i+1) + ") " + (player.vision[i] || "");                        
                    drawText(spellText, 20, false, 130+i*20, "lightskyblue");
                }
                log.addLog("Shiza");
            }
            if ((!cursormode && !invmode) || (cursormode && invmode)) log.display();//printAtWordWrap(messages[message], 18, 10, 600, coloring, 20, 940);
            if (rosetoxin > 1){
                ctx.globalAlpha = 0.5;
                drawFilter(rosefilter);
                ctx.globalAlpha = 1;
            }
            else if (player.fuffified > 0){
                ctx.globalAlpha = 0.5;
                drawFilter(cyanfilter);
                ctx.globalAlpha = 1;
            }
        }
        if (showboss){
            showBoss(1);
        }
        else if (level == 17){
            let hpdraw;
            for (let x of monsters) {
                if (x instanceof Epsilon) hpdraw = x.hp;
            }
            drawBossHp(1, Math.ceil((hpdraw/33)*36)) //the 6 is the maxhp, replace as needed
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 577);
        ctx.lineTo(960, 577);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(577, 577);
        ctx.lineTo(577, 0);
        ctx.stroke();
        if (inMap) world.displayTrue();
        //universe.display(); // break in case of sanity

        //mouseclick lines
        //ctx.beginPath();
        //ctx.moveTo(0, 0);
        //ctx.lineTo(577, 577);
        //ctx.stroke();
        //ctx.beginPath();
        //ctx.moveTo(577, 0);
        //ctx.lineTo(0, 577);
        //ctx.stroke();
    }
}
function manageExit(){
    truehp++;
    for (let j of legendaries.active){
        if (j instanceof Ezezza){
            truehp++;
        }
    }
    exitspawn = 1;
}

function summonExits(){
    for (let x of tiles){
        for (let y of x){
            if (y instanceof BExit){
                let id = y.id;
                let px = y.x;
                let py = y.y;
                y.replace(ExpandExit)
                tiles[px][py].id = id;
            }
            else if (y instanceof BReturnExit){
                let id = y.id;
                let px = y.x;
                let py = y.y;
                y.replace(ReturnExit);
                tiles[px][py].id = id;
            } 
        }
    }
    manageExit();
    if (player.activemodule == "Hover"){
        player.activemodule = "NONE";
        log.addLog("FluffyModuleFarewell");
        playSound("off");
    }
}

function tick(){
    player.update();
    deadcheck = 0;
    if (level == 17 && !monsters[0].dead){
        monsters[0].update();
        monsters[1].update();
        monsters[2].update();
        monsters[3].update();
        monsters[4].update();
    }
    else if (level == 17 && monsters[0].dead){
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
        if(!monsters[k].dead && monsters[k].order < 0){
            monsters[k].update();
            if (!monsters[k].permacharm || monsters[k].name.includes("Vermin")) deadcheck++
        }else if (monsters[k].order < 0){
            monsters.splice(k,1);
        }
    }
    if (deadcheck == 0 && level != 0&& area == "Faith"){
        //gener8 sortie si every1 est ded
        if (exitspawn == 0 && world.fighting){
            summonExits();
            if (player.falsehp < 1 && legendaries.hasSoul(Kashia)){
                player.falsehp = 1;
                log.addLog("KASHIA");
            }
        }
    }

    if(player.dead){
        if (player.rosetox < 10) playSound("death");
        else playSound("toxicdeath");
        if(truehp < 1){
            gameState = "dead";
            pauseAllMusic();
            playSound("falsity");
        }
        else{
            if (level != 17) {
                gameState = "contemplation";
                for (let x of player.saved) player.inhand.push(x);
                player.saved.length = 0;
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
                if (truehp <= 0){
                    gameState = "dead";
                    pauseAllMusic();
                    playSound("falsity");
                    if (player.rosetox < 10) log.addLog("RoomDeath");
                    else  log.addLog("RoseDeath");
                }
            }
            else{
                for (let x of player.saved) player.discard.push(x);
                for (let x of player.inhand) player.discard.push(x);
                player.inhand.length = 0;
                player.saved.length = 0;
                truehp -= 1;
                if(truehp < 1){
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
                    if (truehp > 1) log.addLog("EpsilonTaunt");
                    else  log.addLog("EpsilonOneChance");
                    player.dead = false;
                    player.tile.setEffect(1, 30);
                    spells["WOOP"](player);
                    wheel.resolve = 3+Math.floor(resolvebonus/2);
                    player.sprite = 0;
                    player.fuffified = 0;
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
}

function showTitle(){                                          
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    pauseAllMusic();
    gameState = "title";
    playSound("title"); 
    drawText("THE GAMES", 40, true, canvas.height/2 - 110, "cyan");
    drawText("FOXES PLAY", 70, true, canvas.height/2 - 50, "cyan");
    drawText("by Oneirical", 30, true, canvas.height/2 - 20, "white");
    drawText("with music by Zennith", 30, true, canvas.height/2 + 10, "white");
    drawText("Press any letter key to begin.", 30, true, canvas.height/2 + 110, "white");
}

function showBoss(currentboss){                                          
    let bossname = ["ROSE","EPSILON","RONIN","FLUFFY"];
    let bosstitle = ["-Last of the Saints-","-Supreme Ordered General-","-the Unfaltering Wheel-","-Grand Harmonic Maestra-"];
    let bosscolour = ["pink","red","purple","cyan"];
    let scale = [0,-100,-50,-75];
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(canvas.width/2-200+scale[currentboss],canvas.height/2 - 120,canvas.width/4+160, canvas.height/5);
    drawText(bossname[currentboss], 70, true, canvas.height/2 - 50, bosscolour[currentboss]);
    drawText(bosstitle[currentboss], 40, true, canvas.height/2, "white");
}

function drawBossHp(currentboss, hp){
    let bossname = ["ROSE","EPSILON","RONIN","FLUFFY"];
    let bosscolour = ["pink","red","purple","cyan"];
    let bar = ["⚙⚙","Σ","❄❄","♡♡"];
    ctx.fillStyle = 'rgba(0,0,0,.85)';
    ctx.fillRect(0,577-32,577,32);
    printAtWordWrap(bossname[currentboss], 21, 10, 568, bosscolour[currentboss], 20, 940);
    printAtWordWrap(" - ", 21, 105, 566, "white", 20, 940);
    if (hp >= 0) printAtWordWrap(bar[currentboss].repeat(hp), 21, 125, 568, bosscolour[currentboss], 20, 940);
}

function startGame(){
    pauseSound("title");            
    playSound("cage");                         
    level = 0;
    resolvebonus = 0;
    rosetoxin = 0;
    truehp = 8;
    score = 0;
    numSpells = 0;
    aubecounter = 0;
    tileSize = 64;
    numTiles = 9;
    invsave = [];//[, ] //];
    modules = ["NONE"];
    modulators = ["Alacrity","Focus","Thrusters","Selective","Hover"];
    //let modtest = modulators[randomRange(0,4)]; //start with a modulator
    //modules.push(modtest);
    //removeItemOnce(modulators,modtest);
    shuffle(invsave);
    naiamode = false;
    dissave = [];
    legendaries = new Inventory();
    cybernetics = new Modules();
    wheel = new DrawWheel();
    log = new MessageLog();
    universe = new Universe();
    startWorld(startingHp);
    gameState = "running";
}

function startWorld(playerHp){
    //area = "Spire"; //temp (remove later)
    let inSpire = false;
    if (area == "Spire") inSpire = true;
    world = new World(inSpire);
    world.confirmWorld();
    world.playRoom(world.rooms[4][4],playerHp);
    //world.playRoom(world.addRoom("firstroom"), playerHp);
}

function drawText(text, size, centered, textY, color){
    ctx.fillStyle = color;
    ctx.font = size + "px Play";
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
    ctx.font = size + "px Play";
    ctx.fillText(text, textX, textY);
}

function drawMessage(text, size, textX, textY, color){
    var str = text;
    ctx.fillStyle = color;
    ctx.font = size + "px Play";
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
    ctx.font = size + "px Play";
    if (fitWidth <= 0)
    {
        ctx.fillText( text, x, sy );
        return;
    }
    let words = text.split(' ');
    let currentLine = 0;
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
    let sx = x || canvas.width-uiWidth*64+25;
    fitWidth = fitWidth || 0;
    ctx.fillStyle = color;
    ctx.font = size + "px Play";
    if (fitWidth <= 0)
    {
        ctx.fillText( text, x, y );
        return;
    }
    let words = text.split(' ');
    let currentLine = 0;
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
    };
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
    else if (level == 17&& area == "Faith"){
        pauseAllMusic();
        playSound("epsilon");
    }
    
}