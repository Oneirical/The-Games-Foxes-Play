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
            else if (cursormode || inInventory || inResearch) return;
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
            if (cread) cursor = new Cursor(cread);
            invmode = !invmode;
            
        }
    }, false);
}

function drawSpriteFreeform(sprite, x, y, offX, offY, size){
    ctx.drawImage(
        spritesheet,
        sprite*16,
        0,
        16,
        16,
        x*size + offX,
        y*size + offY,
        size,
        size
    );
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
        8,
        8
    );
}

function draw(){
    if(gameState == "running" || gameState == "dead" || gameState == "contemplation" || gameState == "vision" || gameState == "discard"){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let fufflore = false;
        let loghide = false;
        let selectation = 99;
        if (!inInventory && !inMap && !inResearch) world.miniMap();
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(705-100,577-100,canvas.width/4+300, 100);
        ctx.fillRect(705-100,577,100, canvas.width/4+300);
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
            if (nohover){
                legendaries.exppage = new ComponentsDisplay();
                legendaries.describepage = 0;
            }
        }
        else if (cursormode){
            let cread = getTile(Math.floor((mousepos[0]-shakeX)/tileSize),Math.floor((mousepos[1]-shakeY)/tileSize));
            if (cread) cursor.tryMove(cread);
        }
        else{
            for (let i of wheel.wheelcoords){
                if (mousepos[0] > i[0] && mousepos[0] < (i[0]+64) && mousepos[1] > i[1] && mousepos[1] < (i[1]+64)){
                    wheel.wheel[wheel.wheelcoords.indexOf(i)].describeWheel();
                    loghide = true;
                }
            }
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
                getTile(i,j).draw();
                viewedTiles.push(getTile(i,j));
            }
        }
        for(let i=0;i<droppedsouls.length;i++){
            droppedsouls[i].draw();
        }
        if(!inResearch) player.draw();
        if (world.getRoom() instanceof WorldSeed && world.cage.displayon) world.cage.pocketworld.hypnoDisplay();
        for(let i=0;i<monsters.length;i++){
            if (viewedTiles.includes(monsters[i].tile) || monsters[i].statuseff["Charmed"] > 0)monsters[i].draw();
        }
        //if (!inInventory && !cursormode && !wheel.hide) drawText(world.getRoom().name, 30, false, 40, "violet");
        if (!inInventory && !cursormode && !wheel.hide) printOutText(universe.getDepth(), 25, 905 - ctx.measureText(universe.getDepth()).width, 35, "lightblue");
        if (!inInventory && !cursormode && !wheel.hide) printOutText(world.getRoom().name, 25, 595, 35, "violet");

        //if (gameState == "dead" && !victory) drawText("SOUL SHATTERED", 20, false, 100, "red");
        //else if (gameState == "dead" && victory) drawText("VICTORY", 30, false, 100, "lime");
        let modulecol = "cyan";
        if (selectation == 21 || selectation == 22) modulecol = "white";
        if (cursormode && !invmode){
            if (inResearch) research.display(research.currentpage);
            cursor.draw();
            cursor.info();
            if (!inResearch) drawSymbol(9, 590, 500, 64);
        }
        else if (inInventory) legendaries.display();
        else {
            if (!wheel.hide) wheel.display();
                    //if (rosetoxin > 1) spellText = (i+1) + ") " + ("ROSE" || "");
                    //if (player.fuffified > 0) spellText = (i+1) + ") " + ("SERENE" || "");
            else if (gameState == "vision"  && !fufflore){
                for(let i=0; i<player.vision.length; i++){
                    let spellText = (i+1) + ") " + (player.vision[i] || "");                        
                    drawText(spellText, 20, false, 130+i*20, "lightskyblue");
                }
                log.addLog("Shiza");
            }
            if (!loghide && (!cursormode && !invmode) || (cursormode && invmode)) log.display();//printOutText(messages[message], 18, 10, 600, coloring, 20, 690);
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
        else if (world.getRoom() instanceof EpsilonArena){
            let hpdraw;
            for (let x of monsters) {
                if (x instanceof Epsilon) hpdraw = x.hp;
            }
            drawBossHp(1, Math.ceil((hpdraw/33)*36)) //the 6 is the maxhp, replace as needed
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        if (!inResearch && !inInventory){
            ctx.beginPath();
            ctx.moveTo(0, 577);
            ctx.lineTo(960, 577);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(577, 577);
            ctx.lineTo(577, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(705, 577);
            ctx.lineTo(705, 833);
            ctx.stroke();
        }
        else{
            ctx.beginPath();
            ctx.moveTo(0, 577);
            ctx.lineTo(577, 577);
            ctx.stroke();
            if (!inInventory){
                ctx.beginPath();
                ctx.moveTo(0, 695);
                ctx.lineTo(577, 695);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(577, 833);
            ctx.lineTo(577, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(960, 450);
            ctx.lineTo(577, 450);
            ctx.stroke();
        }
        if (inMap) world.display();
        if (inBigMap) universe.display(); // break in case of sanity
        //drawSymbol(5, 300, 400, 16);
        //drawSymbol(7, 292, 392, 32);
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
    if (world.fighting){
        truehp++;
        for (let j of legendaries.active){
            if (j instanceof Ezezza){
                truehp++;
            }
        }
    }
    world.fighting = false;
    if (player.activemodule == "Hover"){
        player.activemodule = "NONE";
        log.addLog("FluffyModuleFarewell");
        playSound("off");
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
    ctx.fillRect(canvas.width/3-200+scale[currentboss],canvas.height/2 - 200,canvas.width/4+300, canvas.height/5);
    drawChar(bossname[currentboss], 70, 168, canvas.height/2-75 - 50, bosscolour[currentboss]);
    drawChar(bosstitle[currentboss], 40, 43, canvas.height/2-75, "white");
}

function drawBossHp(currentboss, hp){
    let bossname = ["ROSE","EPSILON","RONIN","FLUFFY"];
    let bosscolour = ["pink","red","purple","cyan"];
    let bar = ["⚙⚙","Σ","❄❄","♡♡"];
    ctx.fillStyle = 'rgba(0,0,0,.85)';
    ctx.fillRect(0,577-32,577,32);
    printOutText(bossname[currentboss], 21, 10, 568, bosscolour[currentboss], 20, 690);
    printOutText(" - ", 21, 105, 566, "white", 20, 690);
    if (hp >= 0) printOutText(bar[currentboss].repeat(hp), 21, 125, 568, bosscolour[currentboss], 20, 690);
}

function startGame(){
    pauseSound("title");            
    playSound("cage");                         
    level = 1;
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
    research = new Research();
    wheel = new DrawWheel();
    log = new MessageLog();
    universe = new Universe();
    universe.start(startingHp);
    world.cage.equateWorld();
    gameState = "running";
}

function startWorld(playerHp){
    //area = "Spire"; //temp (remove later)
    let inSpire = false;
    if (area == "Spire") inSpire = true;
    world = new World(inSpire);
    world.confirmWorld();
    let spawn = world.rooms[4][4];
    world.playRoom(spawn,playerHp);
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

function removeColorTags(text){
    return text.replace(/\[[\s\S]*?\]/g, '');
}

function countLines(text, fitWidth){
    if (text.length == 0) return 0;
    text = removeColorTags(text);
    let words = text.split(' ');
    let currentLine = 1;
    let idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        let str = words.slice(0,idx).join(' ');
        let w = ctx.measureText(str).width;
        if (str == words.slice(0,words.length).join(' ') && w-fitWidth < 10) return currentLine;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else
        {idx++;}
    }
    return currentLine;
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
            yscale = y + i*20 + (i*lineHeight*countLines(sis,fitWidth));
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
    let words = text.split(' ');
    let currentLine = 0;
    if (fitWidth < 30){
        currentLine++;
        if (oldx) sx = oldx[0];
        fitWidth = oldx[1];
    }
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

var nextlinesave = 0;

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
        learn : new Audio('sounds/Learn.ogg'),
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