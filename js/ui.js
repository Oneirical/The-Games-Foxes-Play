class Research{
    constructor(){
        this.tabs = [];
        this.page;
        this.currentpage = 0;
        this.knownnodes = [];
        this.knownspells = [];
        this.buildTabs();
        this.looking = false;

        this.exppage = new TutorialDisplay();
        this.monsterpool = [Apis, Second, Tinker, Slug, Scion, Shrike, Apiarist];
    }

    buildTabs(){
        for (let k=0; k<Object.keys(researchpage).length-1;k++){
            this.tabs[k] = [];
            for(let i=0;i<9;i++){
                this.tabs[k][i] = [];
                for(let j=0;j<9;j++){
                    let nodeType = keyresearch[researchpage["Page"+k][j][i]];
                    if ("TL)><I-+KY".includes(researchpage["Page"+k][j][i])) this.tabs[k][i][j] = new ResearchConnector(i,j,nodeType);
                    else if (nodeType == ".") this.tabs[k][i][j] = new Floor(i,j);
                    else this.tabs[k][i][j] = new ResearchNode(i,j,researchpage["Page"+k][j][i],k);
                }
            }
        }
        this.page = this.tabs[0];
    }

    changeTab(inc){
        if (this.tabs.length == this.currentpage + inc ||this.currentpage + inc < 0) return;
        this.currentpage+= inc;
        this.page = this.tabs[this.currentpage];
    }

    completeResearch(dis){
        if (this.knownnodes.includes(dis)) return;
        playSound("learn");
        this.knownnodes.push(dis);
        if (researchunlockdata[dis]) this.monsterpool.push(researchunlockdata[dis]);
        for (let k=0; k<this.tabs.length;k++){
            for(let i=0;i<9;i++){
                for(let j=0;j<9;j++){
                    if (this.tabs[k][i][j] instanceof ResearchNode && dis == this.tabs[k][i][j].id){
                        this.tabs[k][i][j].completed = true;
                        this.tabs[k][i][j].sprite = 120;
                        break;
                    }
                }
            }
        }
        for (let k=0; k<this.tabs.length;k++){ //change the 1 later to pagecount
            for(let i=0;i<9;i++){
                for(let j=0;j<9;j++){
                    if (this.tabs[k][i][j] instanceof ResearchNode && this.checkforLinks(researchpage["Page"+k]["links"][this.tabs[k][i][j].letter],k)) {
                        this.tabs[k][i][j].discovered = true;
                        if (!this.knownspells.includes(this.tabs[k][i][j].id) && (contingencies.includes(this.tabs[k][i][j].id) || forms.includes(this.tabs[k][i][j].id) || mutators.includes(this.tabs[k][i][j].id) || functions.includes(this.tabs[k][i][j].id))) this.knownspells.push(this.tabs[k][i][j].id);
                    }
                }
            }
        }
    }

    findletter(letter,k){
        let searchpage = k;
        if (letter[0] == "<"){
            searchpage--;
            letter = letter[1];
        }
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if (this.tabs[searchpage][i][j] instanceof ResearchNode && this.tabs[searchpage][i][j].letter == letter && this.tabs[searchpage][i][j].completed) return true;
            }
        }
        return false;
    }

    checkforLinks(candidate,k){
        let match = 0;
        for (let i of candidate){
            for (let j of i){
                if (this.findletter(j,k)){
                    match++;
                    break;
                }
            }
        }
        if (match == candidate.length) return true;
        else return false;
    }

    display(tab){
        ctx.beginPath();
        ctx.moveTo(canvas.height+32, canvas.height);
        ctx.lineTo(canvas.height+32, 0);
        ctx.stroke();  
        for (let i = 0; i<7;i++){
            ctx.beginPath();
            ctx.moveTo(canvas.height+128+32, 32+(135*i));
            ctx.lineTo(canvas.height+128+32, 32+(135*i)+112);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(canvas.height+32, 32+(135*i));
            ctx.lineTo(canvas.height+128+32, 32+(135*i));
            ctx.stroke();  
            ctx.beginPath();
            ctx.moveTo(canvas.height+32, 32+(135*i)+112);
            ctx.lineTo(canvas.height+128+32, 32+(135*i)+112);
            ctx.stroke();
            if (i == 0) drawSymbol(35,canvas.height+64,32+(135*i)+16,80);
            else drawSymbol(i-1,canvas.height+64,32+(135*i)+16,80);
        }
        drawFilter(blackfilter);
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                this.tabs[tab][i][j].draw();
            }
        }
        this.exppage.display();
        //drawSymbol(49, 590, 130, 64);
        //drawSymbol(0, 590, 230, 64);
        //drawSymbol(1, 590, 330, 64);
        //drawSymbol(2, 590, 430, 64);
        //drawSymbol(3, 880, 130, 64);
        //drawSymbol(4, 880, 230, 64);
        //drawSymbol(5, 880, 330, 64);
        //drawSymbol(21, 880, 430, 64);
        //printOutText("Ordered",18, 664, 368, "orangered",20,350);
        //printOutText("Shattered",18, 664, 168, "cornflowerblue",20,350);
        //printOutText("Saintly",18, 664, 268, "lime",20,350);
        //printOutText("Artistic",18, 664, 468, "orange",20,350);
        //printOutText("Serene",18, 810, 468, "cyan",20,350);
        //printOutText("Vile",18, 835, 368, "plum",20,350);
        //printOutText("Feral",18, 825, 268, "yellowgreen",20,350);
        //printOutText("Unhinged",18, 790, 168, "yellow",20,350);
    }

    displayNode(cx, cy){
        //let colour = "lightgray";
        if (research.page[cx][cy].discovered){
            printOutText(research.page[cx][cy].lore, 18, canvas.height+128+52, 600, "#cda4f2", 20, 560);
            printOutText(research.page[cx][cy].unlock, 18, canvas.height+128+52, 480, "white", 20, 390);
            printOutText(research.page[cx][cy].name, 18, canvas.height+128+52, 30, "white", 20, 350);
            if (research.page[cx][cy].unlockdata) drawSpriteFreeform(research.page[cx][cy].unlockdata.sprite,0,0,canvas.width-80,464,64);
            drawSymbol((research.page[cx][cy].contents), canvas.width-80, 20, 64);
            printOutText(research.page[cx][cy].flags, 18, canvas.height+128+52, 55, researchflagcolour[research.page[cx][cy].flags], 20, 6*64-35);
            let description = research.page[cx][cy].capsule;
            if (powerratings[research.page[cx][cy].id]){
                if (powerratings[research.page[cx][cy].id] > 0) description += "\n[g]Gain " + powerratings[research.page[cx][cy].id] + " Potency.[w]";
                else description += "\n[r]Lose " + Math.abs(powerratings[research.page[cx][cy].id]) + " Potency.[w]";
            }
            if (soulcosts[research.page[cx][cy].id]){
                description += "\n[p]Triggering this Contingency will consume "+soulcosts[research.page[cx][cy].id]+ " Ipseity Shards.";
            }
            printOutText(description, 18, canvas.height+128+52, 105, "white", 20, 500);
            if (!this.looking) this.exppage = new TutorialDisplay(research.page[cx][cy].id);
            this.looking = true;
        }
        else{
            printOutText(researchlore["Null"], 18, canvas.height+128+52, 720, "#cda4f2", 20, 560);
            printOutText(researchnames["Null"], 18, canvas.height+128+52, 30, "white", 20, 350);
            drawSymbol(7, canvas.width-80, 20, 64);
            printOutText(researchflags["Null"], 18, canvas.height+128+52, 55, researchflagcolour[researchflags["Null"]], 20, 6*64-35);
            printOutText(researchexpl["Null"], 18, canvas.height+128+52, 105, "white", 20, 6*64-35);
        }
    }
    
}

function showCatalogue(type){
    if (!type) return;
    let description = researchexpl[type];
    if (powerratings[type]){
        if (powerratings[type] > 0) description += "\n[g]Gain " + powerratings[type] + " Potency.[w]";
        else description += "\n[r]Lose " + Math.abs(powerratings[type]) + " Potency.[w]";
    }
    if (soulcosts[type]){
        description += "\n[p]Triggering this Contingency will consume "+soulcosts[type]+ " Ipseity Shards.";
    }
    printOutText(description, 18, 590, 105, "white", 20, 6*64-35);
    printOutText(researchnames[type], 18, 590, 50, "white", 20, 6*64-100);
    drawSymbol(inside[type], 890, 20, 64);
}

class Cursor{
    constructor(tile){
        this.move(tile);
        this.sprite = 18;
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.lastMove = [-1,0];
        this.isPlayer = false;
    }
    getDisplayX(){                     
        return this.tile.x;
    }

    getDisplayY(){                                                                  
        return this.tile.y;
    }
    draw(){
        drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
        this.offsetX -= Math.sign(this.offsetX)*(1/8);     
        this.offsetY -= Math.sign(this.offsetY)*(1/8); 
    }
    tryMove(newTile){
        if (newTile.x < numTiles && newTile.y < numTiles && newTile.x >= 0 && newTile.y >= 0){
            if (inResearch && !(research.page[newTile.x][newTile.y] instanceof ResearchNode ||research.page[newTile.x][newTile.y] instanceof ResearchConnector )) return;
            this.move(newTile);
        }
    }
    move(tile){
        if (tile == this.tile) return
        if(this.tile){
            this.offsetX = this.tile.x - tile.x;    
            this.offsetY = this.tile.y - tile.y;
        }
        this.tile = tile;
        tile.cursor = this;
        research.looking = false;
        if (!(this.tile instanceof ResearchNode)) research.exppage = new TutorialDisplay("Default");                     
    }
    die(){
        this.dead = true;
        this.tile.cursor = null;
        this.sprite = 99999;
    }
    info(){
        if (inResearch){
            if (research.page[this.tile.x][this.tile.y] instanceof ResearchNode){
                let cx = this.tile.x;
                let cy = this.tile.y;
                research.displayNode(cx, cy);
            }
            else printOutText(researchlore["Awaiting"], 18, canvas.height+128+52, 30, "#cda4f2", 20, 560);
            return;
        }
        if (this.tile.monster){
            if (rosetoxin > 0){
                printOutText(description["Rose"], 18, 10, 600, "pink", 20, 690);
                printOutText("Rose Rose Rose", 18, 590, 70, "pink", 20, 350);
                printOutText("Rose", 18, 590, 30, "pink", 20, 350);
            }
            else if (this.tile.monster.teleportCounter > 0){
                printOutText(description["Warp"], 18, 10, 600, "white", 20, 690);
                printOutText("The details of this soul are not clear to you yet.", 18, 590, 70, "white", 20, 350);
                printOutText("Warp-wisp", 18, 590, 30, "white", 20, 350);
            }
            else{
                printOutText(this.tile.monster.lore, 18, 10, 600, "white", 20, 690);
                printOutText(this.tile.monster.soul, 18, 590, 70, "white", 20, 350);
                printOutText(this.tile.monster.name, 18, 590, 30, "white", 20, 350);
                printOutText(this.tile.monster.ability, 18, 10, 630+((this.tile.monster.lore.length/100)*20), "pink", 20, 690);
                for (let i of Object.keys(this.tile.monster.statuseff)){
                    if (this.tile.monster.statuseff[i] > 0){
                        printOutText(i, 18, 590, 130+Object.keys(this.tile.monster.statuseff).indexOf(i)*10, "white", 20, 690);
                        printOutText(this.tile.monster.statuseff[i].toString(), 18, 750, 130+Object.keys(this.tile.monster.statuseff).indexOf(i)*10, "white", 20, 690);
                    }
                }
            }
        }
        else{
            let colour = "lightgray";
            if (this.tile.sprite == 61 || this.tile.sprite == 62) colour = "white";
            printOutText(this.tile.lore, 18, 10, 600, colour, 20, 690);
            printOutText(this.tile.name, 18, 590, 30, colour, 20, 350);
        }
        

    }
    debug(){
        console.log(this.tile.id);
    }
}

class LocationDisplay{
    constructor(){
        this.displayCon;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,3,this.displayCon);
        const style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 40,
            fill: "plum",
        });
        const richText = new PIXI.Text(world.getRoom().name, style);
        richText.anchor.set(0.5,0.5);
        richText.x = (335+22)/4+54;
        richText.y = (121+31)/4-8;
        this.displayCon.addChild(richText);
    }

    update(){
        this.displayCon.children[1].text = world.getRoom().name;
    }
}

class StatusDisplay{
    constructor(){
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*15;
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,5,this.displayCon);
        this.hpCon = new PIXI.Container();
        this.hpCon.x = 8;
        this.hpCon.y = 6;
        this.displayCon.addChild(this.hpCon);
        for (let i = 0; i<2;i++){
            for (let j = 0; j<3; j++){
                let newSprite = new PIXI.Sprite(allsprites.textures['icon1']);
                newSprite.x = i*40
                newSprite.y = j*40
                newSprite.width = 32;
                newSprite.height = 32;
                this.hpCon.addChild(newSprite);
            }
        }
    }

    update(i){
        for (let b of this.hpCon.children) b.visible = true;
        let count = 0;
        for (let j = 0; j < i.hp; j++){
            count++;
        }
        for (let r = count; r<6;r++){
            this.hpCon.children[r].visible = false;
        }
    }
}

class TutorialDisplay{
    constructor(type){
        //this.timer = 0;
        this.type = type;
        this.cage = [];
        this.build();
    }

    build(){
        if (!spellpatterns[this.type]) return;
        for(let i=0;i<spellpatterns[this.type][0].length+2;i++){
            this.cage[i] = [];
            for(let j=0;j<spellpatterns[this.type][0].length+2;j++){
                if((i == 0 && j == 0) || (i == spellpatterns[this.type][0].length+1 && j == spellpatterns[this.type][0].length+1) ||(i == 0 && j == spellpatterns[this.type][0].length+1) ||(j == 0 && i == spellpatterns[this.type][0].length+1)) this.cage[i][j] = new Floor(i,j);
                else if (i == 0) this.cage[i][j] = new CageWall(i,j,"w");
                else if (j == 0) this.cage[i][j] = new CageWall(i,j,"n");
                else if (i == spellpatterns[this.type][0].length+1) this.cage[i][j] = new CageWall(i,j,"e");
                else if (j == spellpatterns[this.type][0].length+1) this.cage[i][j] = new CageWall(i,j,"s");
                else{
                    this.cage[i][j] = new CageContainer(i,j);
                    this.cage[i][j].value = new keyspells[spellpatterns[this.type][j-1][i-1]];
                    if (!(this.cage[i][j].value instanceof Empty)) this.cage[i][j].value.turbulent = true;
                }
            }
        }
    }

    display(){
        for(let i=0;i<this.cage.length;i++){
            for(let j=0;j<this.cage.length;j++){
                let size = 48;
                if (!(this.cage[i][j].sprite == 2)) this.cage[i][j].drawFreeform(canvas.width-208-size/2*(this.cage.length-3),canvas.height-208-size/2*(this.cage.length-3),size);
            }
        }
    }
}

var maxseq = 0;

class ComponentsDisplay{
    constructor(contin,forms,mutators,functions,power,cost,caste){
        //this.timer = 0;
        this.forms = [];
        this.functions = [];
        this.mutators = [];
        this.contin = [];
        this.caste = caste;
        this.power = power;
        this.cost = cost;
        if (functions) for (let i of functions) this.functions.push(i);
        if (mutators) for (let i of mutators) this.mutators.push(i);
        if (forms) for (let i of forms) this.forms.push(i);
        if (contin) for (let i of contin) this.contin.push(i);
        this.cage = [];
        this.build();
    }

    build(){
        //if (!spellpatterns[this.type]) return;
        let seq = 1;
        for(let i=0;i<5+2;i++){
            this.cage[i] = [];
            for(let j=0;j<4+2;j++){
                if((i == 0 && j == 0) || (i == 5+1 && j == 4+1) ||(i == 0 && j == 4+1) ||(j == 0 && i == 5+1)) this.cage[i][j] = new Floor(i,j);
                else if (i == 0) this.cage[i][j] = new CageWall(i,j,"w");
                else if (j == 0) this.cage[i][j] = new CageWall(i,j,"n");
                else if (i == 5+1) this.cage[i][j] = new CageWall(i,j,"e");
                else if (j == 4+1) this.cage[i][j] = new CageWall(i,j,"s");
                else{
                    this.cage[i][j] = new CageContainer(i,j);
                    this.cage[i][j].sprite = 121+j;
                    this.cage[i][j].spritesave = 121+j;
                    //this.cage[i][j].value = new keyspells[spellpatterns[this.type][j-1][i-1]];
                    //if (!(this.cage[i][j].value instanceof Empty)) this.cage[i][j].value.turbulent = true;
                }
            }
        }

        for(let j=0;j<4+2;j++){
            for(let i=0;i<5+2;i++){
                if (this.cage[i][j] instanceof CageContainer){
                    for (let k=0;k<this.contin.length;k++){
                        if(j == 1&& i-1 == k){
                            this.cage[i][j].value = new Component(this.contin[k]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.forms.length;k++){
                        if (j == 2 && i-1 == k){
                            this.cage[i][j].value = new Component(this.forms[k]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.functions.length;k++){
                        if(j == 4&& i-1 == k){
                            this.cage[i][j].value = new Component(this.functions[k]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.mutators.length;k++){
                        if(j == 3&& i-1 == k){
                            this.cage[i][j].value = new Component(this.mutators[k]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    if(!this.cage[i][j].value) this.cage[i][j].value = new Empty();
                }
            }
        }
        maxseq = seq-1;
    }

    display(){
        if (!this.power) this.power = 0;
        if (!this.cost) this.cost = 0;
        for(let i=0;i<this.cage.length;i++){
            for(let j=0;j<this.cage.length-1;j++){
                let size = 80;
                if (this.cage[i][j].seq && this.cage[i][j].seq == player.axioms.describepage+1 && (inInventory)){
                    this.cage[i][j].sprite = 126;
                    drawSymbol(this.cage[i][j].value.icon, 890, 20, 64);
                }
                else if (this.cage[i][j].seq != null) this.cage[i][j].sprite = this.cage[i][j].spritesave;
                if (!(this.cage[i][j].sprite == 2)) this.cage[i][j].drawFreeform(canvas.height-16,canvas.height-256-224+32,size);
                drawSymbol(12, canvas.height+64, canvas.height-256-210, 64);
                printOutText(this.power+"",40, canvas.height+150, canvas.height-256-166, "lightsteelblue",20,350); //
                drawSymbol(49, canvas.height+64+80*4+(80-64), canvas.height-256-210, 64);
                printOutText(this.cost+"",40, canvas.height+256+96, canvas.height-256-166, "plum",20,350); //add for shattered energy
                const hijack = {
                    "VILE" : 5,
                    "FERAL" : 4,
                    "UNHINGED" : 3,
                    "ARTISTIC" : 2,
                    "ORDERED" : 1,
                    "SAINTLY" : 0
                }
                const index = hijack[this.caste];
                drawSymbol(index, ((673-size/2*(this.cage.length-3)+89+64*4)+673-size/2*(this.cage.length-3)+40)/2, 46+546-size/2*(this.cage.length-3), 64);
            }
        }
    }
}

class ButtonsDisplay{
    constructor(){

    }
    
    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*29;
        drawChainBorder(15,3,this.displayCon);
        uiDisplayRight.addChild(this.displayCon);
    }
}

class MessageLog{
    constructor(){
        this.history = [];
        this.writeheight = [];
        this.repeats = [];
        this.allgrey = false;
    }

    setUpLog(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*16;
        uiDisplayRight.addChild(this.displayCon);
        this.textcon = new PIXI.Container();
        this.displayCon.addChild(this.textcon);
        drawChainBorder(15,12,this.displayCon);
        PIXI.Assets.addBundle('fonts', {
            Play: 'Play-Regular.ttf',
        });
        PIXI.Assets.loadBundle('fonts');

        //log.addLog("MapDebug"); //remove later
    }

    addLog(message){
        if (this.textcon.children.length > 0 && messages[message] == this.textcon.children[this.textcon.children.length-1].originalText){
            this.textcon.children[this.textcon.children.length-1].repetitions += 1;
            this.textcon.children[this.textcon.children.length-1].text = this.textcon.children[this.textcon.children.length-1].originalText +  " x" + this.textcon.children[this.textcon.children.length-1].repetitions;
            return;
        }
        let coloring = colours[message];
        if (message.includes("Fluffy")) coloring = "cyan";
        else if (message.includes("Rose")) coloring = "lightpink";
        else if (message.includes("Epsilon")) coloring = "orangered";
        else if (message.includes("Saint")) coloring = "lime";
        else if (message.includes("Error")) coloring = "yellow";
        const style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 18,
            fill: coloring,
            wordWrap: true,
            wordWrapWidth: resolutionSize*16*16-(resolutionSize*9*16+(resolutionSize+12)*16+10)-20,
            lineJoin: 'round',
        });
        printOutTextO(messages[message],0,0,style,this.textcon);
        const richText = new PIXI.Text(messages[message], style);
        richText.repetitions = 0;
        richText.originalText = richText.text;
        //this.textcon.addChild(richText);
        //let beeeg = PIXI.TextMetrics.measureText(richText.text,richText.style).height+5;
        if (this.textcon.children.length > 1){
            this.textcon.children[this.textcon.children.length-2].ancient = true;
            for (let i = 0; i<this.textcon.children.length; i++){
                if (i === this.textcon.children.length-1)continue;
                this.textcon.children[i].y += this.textcon.children[this.textcon.children.length-1].linesnum+5;
                //if ((44+29*16+8)+i.y+PIXI.TextMetrics.measureText(i.text,i.style).height > resolutionSize*8*16-30) i.visible = false;
                //this is better for now, but consider a rectangle that reshapes itself to only show the last possible line
            }
        }
    }

    addLogOld(message){
        this.allgrey = false;
        this.repeats.push(1);
        if (message != this.history[this.history.length-1]){
            this.history.push(message);
            this.writeheight.push(canvas.height-(230/(canvas.width/canvas.width)));
            if (this.writeheight.length > 1){
                for (let x = this.writeheight.length-2;x >= 0; x--){
                    let thehe = countLines(messages[this.history[this.history.length-1]],canvas.width-canvas.height-20);
                    //let thehe = ctx.measureText(removeColorTags(messages[this.history[this.history.length-1]])).width;
                    this.writeheight[x] += 20 * thehe + 5;
                }
            }
            if (this.history.length > 8){
                this.history.shift();
                this.writeheight.shift();
                this.repeats.shift();
            } 
        }
        else this.repeats[this.history.length-1]++;
    }

    display(){
        for (let x = 0; x<this.history.length; x++){
            let coloring = colours[this.history[x]];
            if (x != this.history.length-1 || this.allgrey) coloring = "#b4b5b8";
            else if (this.history[x].includes("Fluffy")) coloring = "cyan";
            else if (this.history[x].includes("Rose")) coloring = "lightpink";
            else if (this.history[x].includes("Epsilon")) coloring = "orangered";
            else if (this.history[x].includes("Saint")) coloring = "lime";
            else if (this.history[x].includes("Error")) coloring = "yellow";
            let print = messages[this.history[x]];
            if (this.repeats[x] > 1) print += " x"+this.repeats[x];
            printOutText(print, 18, 10+canvas.height, this.writeheight[x], coloring, 20, canvas.width-canvas.height-20);
            //for (let y = 0; y < this.writeheight.length-1; y++){
                //let margin = 26;
                //let wtf = Math.ceil(ctx.measureText(messages[this.history[y+1]]+"x00").width/690);
                //let wtf2 = Math.ceil(ctx.measureText(messages[this.history[y]]+"x00").width/690)
                //if(wtf == 1 ||wtf2 == 1){
                //    margin = 20;
                //}
                //ctx.strokeStyle = 'white';
                //ctx.lineWidth = 1.5;
                //ctx.beginPath();
                //ctx.moveTo(0, this.writeheight[y]-margin);
                //ctx.lineTo(960, this.writeheight[y]-margin);
                //ctx.stroke();
            //}
        }
    }
}

class SpinningSoul{
    constructor(icon,startangle){
        this.icon = icon;
        this.x = 0;
        this.y = 0;
        this.speed = 0.01;
        this.angle = startangle;
        this.offsetX = 0;
        this.offsetY = 0;
        this.thrashcounter = 0;
    }
}

class DrawWheel{
    constructor(){
        this.wheel = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        let center = [(canvas.height+canvas.width-256)/2-40, 195*canvas.height/900]; //256: minimap height
        this.dist = 100*(resolutionSize/7);
        let dist = this.dist;
        let pi = Math.PI;
        this.wheelcoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        dist = 45*(resolutionSize/7);
        center = [center[0]+28,center[1]+38];
        this.hotkeycoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];

        this.pile = [];
        this.discard = []; //
        this.saved = [];
        this.resolve = 3; //update this later with the bonus
        this.castes = [new Saintly(),new Ordered(),new Artistic(),new Unhinged(),new Feral(),new Vile()];
        this.hide = false;
        this.ipseity = 0;
        let first = [587, 420];
        let vert = 52;
        let hori = 64*5-5;
        center = [(canvas.height+canvas.width-256)/2-40, 195*canvas.height/900];
        dist = 100*(resolutionSize/7);
        this.circlemotion = {centerX:(canvas.height+canvas.width-256)/2-16, centerY:195*canvas.height/900+24, radius:170};
        this.spinningsouls = [new SpinningSoul(47,0)];
        this.paintcans = [[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)]];
        this.paintcoords = [[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        this.paintcir = [];
        for (let i of this.paintcoords) this.paintcir.push({centerX:i[0]+24, centerY:i[1]+24, radius:15});
        this.currentbrush = 8;
        this.turbstatus = true;
        this.castecoords = [first,[first[0]+hori,first[1]],[first[0],first[1]+vert],[first[0]+hori,first[1]+vert],[first[0],first[1]+vert*2],[first[0]+hori,first[1]+vert*2]];
        this.turbulentmarkers = [new Feral(),new Feral()];
        this.turbulentmarkers[0].turbulent = true;

        //for (let o = 0; o<7;o++) this.paintcans[o].push(new SpinningSoul(o,0));
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        uiDisplayRight.addChild(this.displayCon);
        drawChainBorder(15,15,this.displayCon);
        let center = [(1885-1410)/2-16,(505-30)/2-16];
        let dist = 100*(resolutionSize/7);
        let pi = Math.PI;
        let wheelcoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        dist = 45*(resolutionSize/7);
        for (let i = 0; i<8; i++){
            let newSprite = new PIXI.Sprite(allsprites.textures['icon7']);
            newSprite.width = (resolutionSize-3)*16;
            newSprite.height = (resolutionSize-3)*16;
            newSprite.anchor.set(0.5,0.5);
            newSprite.x = wheelcoords[i][0];
            newSprite.y = wheelcoords[i][1];
            newSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.displayCon.addChild(newSprite);
        }
    }

    display(){
        //if (!inInventory && !cursormode && !(world.getRoom() instanceof SoulCage)) printOutText(universe.getDepth(), 25, 905 - ctx.measureText(universe.getDepth()).width, 35, "lightblue");
        if (!inInventory && !cursormode) printOutText(world.getRoom().name, 25, canvas.width-246, 28, "violet");
        if (!(world.getRoom() instanceof SoulCage)){
            for (let i = 0; i<this.pile.length;i++){
                this.pile[i].x = this.circlemotion.centerX + Math.cos(this.pile[i].angle) * this.circlemotion.radius;
                this.pile[i].y = this.circlemotion.centerY + Math.sin(this.pile[i].angle) * this.circlemotion.radius;
                this.pile[i].angle += this.pile[i].speed;
                drawSymbol(this.pile[i].icon, this.pile[i].x, this.pile[i].y, 16);
            }
            for (let i = 0; i<this.saved.length;i++){
                this.saved[i].x = this.circlemotion.centerX + Math.cos(this.saved[i].angle) * 20;
                this.saved[i].y = this.circlemotion.centerY + Math.sin(this.saved[i].angle) * 20;
                this.saved[i].angle += this.saved[i].speed;
                if (!(this.saved[i] instanceof Empty)) drawSymbol(this.saved[i].icon, this.saved[i].x, this.saved[i].y, 16);
            }
        }
        else{
            for (let p = 0; p<this.paintcans.length; p++){
                for (let i = 0; i<this.paintcans[p].length;i++){
                    this.paintcans[p][i].x = this.paintcir[p].centerX + Math.cos(this.paintcans[p][i].angle) * this.paintcir[p].radius;
                    this.paintcans[p][i].y = this.paintcir[p].centerY + Math.sin(this.paintcans[p][i].angle) * this.paintcir[p].radius;
                    this.paintcans[p][i].angle += this.paintcans[p][i].speed;
                    if (this.currentbrush-1 != p) ctx.globalAlpha = 0.8;
                    if (!this.turbstatus) drawSymbol(this.paintcans[p][i].icon, this.paintcans[p][i].x, this.paintcans[p][i].y, 16);
                    else {
                        this.paintcans[p][i].thrashcounter++;
                        if (this.paintcans[p][i].thrashcounter > 10){ // is this effect too annoying? the alternative is setting all offsets to 2/3 and removing the *64 below
                            let rt = randomRange(1,4);
                            if (rt == 1) this.paintcans[p][i].offsetX+= 0.1;
                            else if (rt == 2) this.paintcans[p][i].offsetX-= 0.1;
                            else if (rt == 3)this.paintcans[p][i].offsetY+= 0.1;
                            else if (rt == 4)this.paintcans[p][i].offsetY-= 0.1;
                            this.paintcans[p][i].thrashcounter = 0;
                        }
                        drawSymbol(this.paintcans[p][i].icon, (this.paintcans[p][i].x + this.paintcans[p][i].offsetX*32),  (this.paintcans[p][i].y + this.paintcans[p][i].offsetY*32),16);
                        this.paintcans[p][i].offsetX -= Math.sign(this.paintcans[p][i].offsetX)*(0.05);     
                        this.paintcans[p][i].offsetY -= Math.sign(this.paintcans[p][i].offsetY)*(0.05);
                    }
                    ctx.globalAlpha = 1;
                }
            }
        }

        if (!(world.getRoom() instanceof SoulCage)) drawSymbol(6, canvas.width-256, 296, 256);
        drawSymbol(6, canvas.width-87, canvas.height-334, 64);
        printOutText("L",18, canvas.width-102, canvas.height-295, "white",20,350);
        //drawSymbol(9, 590, 130, 64);
        drawSymbol(10, canvas.width-232, canvas.height-334, 64);
        printOutText("F",18, canvas.width-172, canvas.height-295, "white",20,350);
        //drawSymbol(11, canvas.height+10, 10, 64);
        //printOutText("Q",18, (canvas.height+canvas.width-256)/2-12, 235, "white",20,350);
        //printOutText("C",18, 616, 208, "white",20,350);
        
        let icon = 33;
        if (player.infested > 0) icon = 34;
        else if (player.tile.souls.length > 0) icon = 48;
        //drawSymbol(icon,(canvas.height+canvas.width-256)/2-22,184,32);
        if (gameState == "contemplation"){
            drawSymbol(13, 880, 50, 64);
            printOutText(agony+" ", 23, 835, 90, "orangered", 20, 350);
        }

        else if (player.infested > 1){
            drawSymbol(32, 880, 50, 64);
            let paltars = [];
            let naltars = [];
            for (let x of tiles){
                for (let y of x){
                    if (y instanceof PosAltar) paltars.push(y.getValue());
                    else if (y instanceof NegAltar) naltars.push(y.getValue());
                }
            }
            printOutText(paltars[0]+paltars[1]+paltars[2], 23, 780, 75, "cyan", 20, 350);
            printOutText("-", 23, 825, 75, "white", 20, 350);
            printOutText(naltars[0]+naltars[1]+naltars[2], 23, 839, 75, "orangered", 20, 350);
            printOutText("=", 23, 805, 105, "white", 20, 350);
            for (let k = 0; k < 3; k++){
                paltars[k] = parseInt(paltars[k])
            }
            for (let e = 0; e < 3; e++){
                naltars[e] = parseInt(naltars[e])
            }
            let results = ["?","?","?"];
            for (let q = 0; q < 3; q++){
                if (paltars[q] && naltars[q]){
                    results[q] = (paltars[q] - naltars[q]);
                }
            }
            if (results.includes("?")) results = "???";
            else results = results[0]*100+results[1]*10+results[2];
            printOutText(results.toString(), 23, 825, 102, "white", 20, 350);
        }
        else{
            //drawSymbol(12, 880, 50, 64);
            //let colour = "lightskyblue";
            //if (this.resolve < 1) colour = "orangered";
            //printOutText(this.resolve+"/"+(3+Math.floor(resolvebonus/2))+" ", 23, 835, 90, colour, 20, 350);
        }
        //printOutText(" "+this.ipseity, 23, canvas.height+80, 50, "plum", 20, 350);

        let display;
        const greysouls = {
            0 : 7,
            1: 50+8,
            2: 51+8,
            3: 52+8,
            4: 53+8,
            5 : 54+8,
            6: 55+8,
            7: 56+8,
        }
        const lightsouls = {
            0:7,
            1:0,
            2:1,
            3:2,
            4:3,
            5:4,
            6:5,
            7:21,
        }
        for (let k = 0;k<8;k++){
            if (world.getRoom() instanceof SoulCage){
                display = greysouls[k];
                if (k == this.currentbrush){
                    ctx.globalAlpha = 0.6;
                    if (this.currentbrush == 0) ctx.globalAlpha = 1;
                }
                else ctx.globalAlpha = 0.2;
            }
            
            else if (gameState == "contemplation") display = this.saved[k].icon;
            else display = this.wheel[k].icon;
            if (!this.wheel[k].turbulent) drawSymbol(display, this.wheelcoords[k][0], this.wheelcoords[k][1], 64);
            else{
                this.wheel[k].thrashcounter++;
                if (this.wheel[k].thrashcounter > 10){ // is this effect too annoying? the alternative is setting all offsets to 2/3 and removing the *64 below
                    let rt = randomRange(1,4);
                    if (rt == 1) this.wheel[k].offsetX+= 0.1;
                    else if (rt == 2) this.wheel[k].offsetX-= 0.1;
                    else if (rt == 3)this.wheel[k].offsetY+= 0.1;
                    else if (rt == 4)this.wheel[k].offsetY-= 0.1;
                    this.wheel[k].thrashcounter = 0;
                }
                drawSymbol(display, (this.wheelcoords[k][0] + this.wheel[k].offsetX*64),  (this.wheelcoords[k][1] + this.wheel[k].offsetY*64),64);
                this.wheel[k].offsetX -= Math.sign(this.wheel[k].offsetX)*(0.05);     
                this.wheel[k].offsetY -= Math.sign(this.wheel[k].offsetY)*(0.05);
            }
            ctx.globalAlpha = 1;
            printOutText(k+1+"",18, this.hotkeycoords[k][0], this.hotkeycoords[k][1], "white",20,350);
        }
        if (world.getRoom() instanceof SoulCage){//
            this.turbulentmarkers[0].thrash(717,392,32);
            this.turbulentmarkers[1].thrash(787,392,32);
            printOutText(9+"",18, 764, 439, "white",20,350);
            drawSymbol(45, 752, 392, 32);
        }
        let j = 0;
        let k = 0;
        let length = 29;
        if (!(world.getRoom() instanceof SoulCage)){
            //84 is max capacity for each box
            for (let i = 0; i<348; i++){
                let thrasher = this.saved[0];
                if (i < this.discard.length)thrasher = this.discard[i];
                thrasher.thrash(canvas.height+4  + i*18 - (length*18*Math.floor(k/length)),canvas.width-canvas.height-251 + Math.floor(k/length)*18,16);
                k++;
            }
            player.axioms.displaySmall();
        }
    }

    reshuffle(){
        for(let i=0;i<this.pile.length;i++){
            if(!this.pile[i].turbulent ||world.tranquil){
                this.discard.push(this.pile[i]);
                this.pile[i] = "deleted";
            }
        }
        for(let i=0;i<this.discard.length;i++){
            if(!this.discard[i].turbulent ||world.tranquil){
                if (this.pile[this.pile.length-1]) this.discard[i].angle = this.pile[this.pile.length-1].angle-0.5;
                this.pile.push(this.discard[i]);
                this.discard[i] = "deleted";
            }
        }
        this.pile = shuffle(this.pile);
        removeItemAll(this.discard,"deleted");
        removeItemAll(this.pile,"deleted");
    }

    countPileSouls(turb){
        let counts = [0,0,0,0,0,0];
        for (let k of this.pile){
            for (let g of this.castes){
                if (k.caste == g.caste && k.turbulent == turb) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    countDiscardSouls(turb){
        let counts = [0,0,0,0,0,0];
        for (let k of this.discard){
            for (let g of this.castes){
                if (k.caste ==  g.caste && k.turbulent == turb) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    countSavedSouls(){
        let counts = [0,0,0,0,0,0];
        for (let k of this.saved){
            for (let g of this.castes){
                if (k.caste ==  g.caste) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    getWheelSpace(){
        let space = 0;
        for (let i of this.wheel){
            if (i instanceof Empty) space++;
        }
        return space;
    }

    addSoul(skey){
        const drops = {
            "Vile" : Vile,
            "Feral" : Feral,
            "Unhinged" : Unhinged,
            "Artistic" : Artistic,
            "Ordered" : Ordered,
            "Saintly" : Saintly,
        }
        let loot = new drops[skey.name]();
        loot.turbulent = true;
        this.discard.push(loot);
        research.completeResearch("Herald");
        //for (let x of player.axioms.active){
        //    if (x instanceof Kilami) spells[loot.id](player);
        //}
        //if (this.getWheelSpace() == 0){
        
       // }
        //else {
          //  for (let i = 0; i < 8; i++){
         //       if (this.wheel[i] instanceof Empty){
        //            this.wheel[i] = loot;
        //            break;
        //        }
        //    }
        //}
 
        //smash combat stuff
        //removeItemOnce(player.tile.souls,skey);
        //removeItemOnce(droppedsouls,skey);
        //skey.attach.soulless = true;
        //skey.attach.pushable = true;
    }

    retrieveSoul(override){
        if (world.cage.slots[override.x][override.y] instanceof Empty) return;
        if (world.cage.slots[override.x][override.y] instanceof Shattered){
            this.ipseity+= 10;
            world.cage.slots[override.x][override.y] = new Empty();
            world.cage.size--;
            if(world.cage.size > 0) world.cage.generateWorld();
            else world.cage.displayon = false;
            research.completeResearch("Shattered");
            return;
        }
        let space = 8;
        for (let k of this.wheel){
            if (!(k instanceof Empty)) space--;
        }
        if (space == 0){
            this.cycleSouls();
        }
        for (let k of this.wheel){
            if (k instanceof Empty){
                let retrievesuccess = true;
                if (!world.cage.slots[override.x][override.y].turbulent)research.completeResearch("Subdued");
                if (basic.includes(world.cage.slots[override.x][override.y].id)){
                    this.wheel[this.wheel.indexOf(k)] = world.cage.slots[override.x][override.y];
                    const types = ["SAINTLY","ORDERED","ARTISTIC","UNHINGED","FERAL","VILE","SERENE"];
                    if (world.cage.slots[override.x][override.y].turbulent == this.turbstatus) this.paintcans[types.indexOf(world.cage.slots[override.x][override.y].id)].push(new SpinningSoul(world.cage.slots[override.x][override.y].icon,this.paintcans[types.indexOf(world.cage.slots[override.x][override.y].id)][this.paintcans[types.indexOf(world.cage.slots[override.x][override.y].id)].length-1].angle-0.1));
                }
                else retrievesuccess = player.axioms.addAxiom(world.cage.slots[override.x][override.y]);
                if (retrievesuccess) {
                    world.cage.slots[override.x][override.y] = new Empty();
                    world.cage.size--;
                }
                if(world.cage.size > 0) world.cage.generateWorld();
                else world.cage.displayon = false;
                break;
            } 
        }
    }

    cycleSouls(){
        this.discard.push(this.wheel[0]);
        this.wheel[0] = new Empty();
        for (let i =0; i<this.wheel.length-1;i++){
            this.wheel[i] = this.wheel[i+1];
        }
        this.wheel[7] = new Empty();
    }

    resetAngles(){
        for (let i = 0; i<this.pile.length; i++){
            if (i == 0) continue;
            else this.pile[i].angle = this.pile[i-1].angle+0.1;
        }
    }

    drawSoul(){
        if (player.infested > 0){
            this.breatheSoul();
            return;
        }
        else if (false && player.tile instanceof CageContainer && world.cage.slots[player.tile.x][player.tile.y].id != "EMPTY"){ //made obsolete by brush system for now
            this.retrieveSoul();
            return;
        }
        if (world.getRoom() instanceof SoulCage) return;
        if (player.tile.souls.length > 0){
            for (let i of player.tile.souls){
                this.addSoul(i);
            }
            return;
        }
        if (gameState == "discard"){
            wheel.endDiscard();
            return;
        }
        if (gameState == "contemplation"){
            player.revivify();
            return;
        }
        if (this.discard.length <= 0 && this.pile.length <= 0){
            log.addLog("NoSouls");
            shakeAmount = 5;
            return;
        }
        let space = 8;
        for (let k of this.wheel){
            if (!(k instanceof Empty)) space--;
        }
        if (space == 0){
            this.cycleSouls();
        }
        //log.addLog("Empty");
        if (this.pile.length <= 0){
            this.reshuffle();
        }
        if (this.pile.length < 1){
            log.addLog("UnrulySouls");
            shakeAmount = 5;
            return;
        }
        beginTurn();
        for (let k of this.wheel){
            if (k instanceof Empty){
                this.wheel[this.wheel.indexOf(k)] = this.pile[0];
                research.completeResearch("Breath");
                break;
            } 
        }
        if(this.pile[0] instanceof Feral){
            for (let j of player.axioms.active){
                if (j instanceof Ezezza){
                    player.para++;
                    log.addLog("EZEZZA");
                }
            }
        }
        this.pile.shift();
        this.resetAngles();
        if (this.activemodule != "Alacrity") tick();
        else if (!player.consumeCommon(1,false)){
            log.addLog("FluffyInsufficientPower");
            playSound("off");
            tick();
            this.activemodule = "NONE";
        } 
    }

    cageSoul(slot, override){
        if (!override) override = player.tile;
        let soul = this.wheel[slot];
        if (soul instanceof Empty){
            shakeAmount = 5;
            //log.addLog("FluffyNoSoulTaunt");
            return;
        }
        else if (!(world.cage.slots[override.x][override.y] instanceof Empty)){
            shakeAmount = 5;
            //log.addLog("FluffyDoubleSacTaunt");
            return;
        }
        else {
            this.wheel[slot] = new Empty();
            world.cage.slots[override.x][override.y] = soul;
            world.cage.size++;
            if(world.cage.size > 0) world.cage.generateWorld();
            research.completeResearch("Turbulent");
            research.completeResearch("Brush");
            this.paintcans[slot-1].pop();
        }
    }

    lookForSoul(type, turbulent){
        for (let i = 0; i < this.discard.length; i++){
            if (this.discard[i].id == type && this.discard[i].turbulent == turbulent) return ["discard",i];
        }
        for (let i = 0; i < this.pile.length; i++){
            if (this.pile[i].id == type && this.pile[i].turbulent == turbulent) return ["pile",i];
        }
        return false;
    }

    castSoul(slot){
        if (world.getRoom() instanceof SoulCage){
            if (slot == 8){
                this.turbstatus = !this.turbstatus;
                this.paintcans = [[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)],[new SpinningSoul(47,0)]];
                for (let j = 0; j<7; j++){
                    for (let i = 0; i < (wheel.countPileSouls(wheel.turbstatus)[j] + wheel.countDiscardSouls(wheel.turbstatus)[j]); i++){
                        wheel.paintcans[j].push(new SpinningSoul(j,wheel.paintcans[j][wheel.paintcans[j].length-1].angle-0.5));
                    }
                }
                return;
            }
            else if (slot == this.currentbrush) slot = 8;
            if (this.currentbrush != 8 && this.currentbrush != 0){
                for (let o of this.paintcans[this.currentbrush-1]){
                    o.speed = 0.01;
                }
            }
            this.currentbrush = slot;
            if (slot != 0 && slot != 8){
                for (let o of this.paintcans[slot-1]){
                    o.speed = 0.1;
                }
            }
            return;
        }
        if (slot > 7){
            return;
        }
        else if (player.tile instanceof CageContainer){
            this.cageSoul(slot);
            return;
        }
        else if (gameState == "contemplation"){
            this.removeSoul(slot);
            return;
        }
        let soul = this.wheel[slot];
        if (soul instanceof Empty){
            shakeAmount = 5;
            log.addLog("EmptyCast");
            return;
        }
        if (soul.turbulent){
            shakeAmount = 5;
            log.addLog("TurbulentCast");
            return;
        }                    
        else{
            //if (soul.id == "SERENE") make this
            let num = player.axioms.castes.indexOf(soul.id);
            let spellName = soul.id;
            if (player.axioms.active[num].influence == "C" || player.axioms.active[num].influence == "A"){
                spellName = player.axioms.active[num].id;
            }
            research.completeResearch("Spellcast");
            if (player.fuffified > 0) spellName = "SERENE";
            if (spellName){
                beginTurn();
                if (spellName == "FLEXIBLE"){
                    fail = player.axioms.active[num].legendCast(player);
                    this.saved.push(this.wheel[slot]);
                    wheel.spinningsouls.push(new SpinningSoul(this.wheel[slot].icon,wheel.spinningsouls[wheel.spinningsouls.length-1].angle-0.5));
                    this.wheel[slot] = new Empty();
                    playSound("spell");
                    tick();
                }
                else{
                    if (basic.includes(spellName) && area == "Spire") spellName = spellName+"S";
                    if (player.axioms.active[num].influence != "I") player.axioms.active[num].talk();
                    else log.addLog(spellName);
                    spells[spellName](player, player.axioms.active[num]);
                    if (player.axioms.active[num].influence == "C") spells[player.axioms.active[num].caste](player);
                    if (!fail && player.activemodule != "Focus"){
                        this.saved.push(this.wheel[slot]);
                        wheel.spinningsouls.push(new SpinningSoul(this.wheel[slot].icon,wheel.spinningsouls[wheel.spinningsouls.length-1].angle-0.5));
                        this.wheel[slot] = new Empty();
                    }
                    else if (this.activemodule == "Focus"){
                        if(!player.consumeCommon(3,false)){
                            log.addLog("FluffyInsufficientPower");
                            this.saved.push(this.wheel[slot]);
                            this.wheel[slot] = new Empty(); 
                            player.activemodule = "NONE";
                            playSound("off");
                        }
                    }
                    playSound("spell");
                    tick();
                }
            }
        }
    }

    removeSoul(slot){
        let soul = this.saved[slot];
        if (soul instanceof Empty){
            shakeAmount = 5;
            log.addLog("EmptyRemove");
            return;
        }
        else{
            if (agony > 0){
                if (soul instanceof Serene && agony < 3){
                    log.addLog("FluffyNoRemoveTaunt");
                }
                else{
                    if (soul instanceof Serene) agony -= 3;
                    else agony--;
                    this.saved[slot] = new Empty();
                    resolvebonus++;
                    if (falseagony){
                        gameState = "running";
                        falseagony = false;
                    }
                }
            }
            else{
                log.addLog("AgonyWarning");
            }
        }
    }
}

class Inventory{
    constructor(){
        this.active = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storage = [new Empty(),new Empty(),new Empty(),new Empty()];
        this.actcoords = [[148, 76],[366, 76],[76, 256],[437, 256],[148, 438],[366, 438]];
        this.actcoords.reverse();//don't feel like re-writing these in the correct order lmao
        this.castes = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY","SERENE"];
        this.castesclass = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storecoords = [[257, 154],[257, 154+68],[257, 154+138],[257, 154+138+68]];
        this.mactcoords = [[1504,488],[1408,488],[1536,408],[1376,408],[1504,328],[1408,328]];
        let push = 192;
        for (let i of this.mactcoords){
            i[0]+=push;
        }
        //this.mactcoords = [[]];
        let store1 = [1456,360];
        let store2 = 32;
        this.mstorecoords = [];
        for (let i = 0; i<4;i++){
            this.mstorecoords.push([store1[0],store1[1]+store2*i]);
        }
        for (let i of this.mstorecoords){
            i[0]+=push;
        }
        this.exppage = new ComponentsDisplay();
        this.describepage = 0;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*21;
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,11,this.displayCon); 
        this.axiomCon = new PIXI.Container();
        this.axiomCon.x = -8;
        this.axiomCon.y = 10;
        this.displayCon.addChild(this.axiomCon);
        let newSprite = new PIXI.Sprite(allsprites.textures['icon6']);
        newSprite.width = (resolutionSize+12)*16;
        newSprite.height = (resolutionSize+12)*16;
        newSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.axiomCon.addChild(newSprite);

        const xcoords = {
            0: 79,
            1: 193,
            2: 41,
            3: 231,
            4: 79,
            5: 193,
        }

        const ycoords = {
            0: 41,
            1: 41,
            2: 136,
            3: 136,
            4: 231,
            5: 231,
        }

        for (let i = 0; i<6; i++){
            let axiomslot = new PIXI.Sprite(allsprites.textures['icon'+i]);
            axiomslot.width = 32;
            axiomslot.height = 32;
            axiomslot.x = xcoords[i];
            axiomslot.y = ycoords[i];
            axiomslot.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.axiomCon.addChild(axiomslot);
        }

        for (let i = 0; i<4; i++){
            let axiomslot = new PIXI.Sprite(allsprites.textures['icon7']);
            axiomslot.width = 32;
            axiomslot.height = 32;
            axiomslot.x = (79+193)/2;
            axiomslot.y = 82+i*36;
            axiomslot.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.axiomCon.addChild(axiomslot);
        }
    }

    queueContin(word,caster){
        caster.queuedcontin.push(word);
    }

    castContin(word, caster){
        for (let i of this.active){
            if (i.contingencies && i.contingencies.includes(word)){
                if (soulcosts[word] && caster.isPlayer && caster.statuseff["Transformed"] == 0){
                    if (wheel.ipseity < soulcosts[word]){
                        shakeAmount = 5;
                        log.addLog("NoShards");
                        return;
                    }
                    wheel.ipseity-=soulcosts[word];
                }
                i.legendCast(caster);
            }
        }
    }

    activateAxiom(slot){
        let soul = this.storage[slot];
        if (soul instanceof Empty) return;
        if (soul instanceof Ezezza && world.fighting) return;
        let caste;
        caste = this.castes.indexOf(this.storage[slot].caste);
        this.storage[slot] = new Empty();
        if (caste == 6){
            while (true){ //this will cause an infinite loop when all 6 slots are filled, rework serenes
                caste = randomRange(0,5);
                if (basic.includes(this.active[caste].id)) break;
            }
        }
        this.storeSoul(caste, this.active[caste]);
        this.active[caste] = soul;
        if (soul instanceof Kashia){
            player.statuseff["Dissociated"] = 5;
            player.falsehp = player.hp;
        }
    }

    hasSoul(type){
        for (let x of this.active){
            if (x instanceof type) return true;
        }
        return false;
    }

    addAxiom(soul){
        let noroom = 0;
        for (let i of this.storage){
            if (noroom == this.storage.length){
                shakeAmount = 5;
                return false;
            }
            else if (i instanceof Empty){
                this.storage[this.storage.indexOf(i)] = soul;
                break;
            }
            else noroom++;
        }
        return true;
    }

    storeSoul(slot){
        let soul = this.active[slot];
        if (soul instanceof Ezezza && world.fighting) return;
        if (basic.includes(this.active[slot].id)) return;
        else{
            if (soul instanceof Kashia){
                player.statuseff["Dissociated"] = 0;
                player.hp = player.falsehp;
                if (player.hp <= 0) player.hit(99);
            }
            let noroom = 0;
            for (let i of this.storage){
                if (noroom == this.storage.length) return;
                else if (i instanceof Empty){
                    this.storage[this.storage.indexOf(i)] = soul;
                    break;
                }
                else noroom++;
            }
            if (noroom != this.storage.length) this.active[slot] = this.castesclass[slot];
        }
    }
}

//maybe make it so clicking inside actcoords triggers the swap. the boundary is just actcoords stretched to a square to pass which one is clicked

class LegendarySoul{
    constructor(name){
        this.id = name;
        this.name = soulname[name];
        this.icon;
        this.lore = souldesc[name];
        this.caste;
        this.command = "S";
        this.influence = "A";
        this.subdescript = soulabi[name];
        this.glamdescript;
        this.hardescript;
        this.alpha = 1;
        this.turbulent = false;
        this.index = 0;
        this.triggers = false;
        this.chosen = false;
        this.offsetX = 0;      
        this.shattered = false;                                             
        this.offsetY = 0;
        this.speed = 0.05;
        this.thrashcounter = 0;
        this.discpatt = [];
        this.x = 0;
        this.y = 0;
        this.speed = 0.01;
        this.angle = 0;
        if (basic.includes(name)) this.alpha = 0.55;
    }

    describe(){
        let bump = 0;
        if ((5*64-32-ctx.measureText(this.name).width) < 0) bump = 20; 
        printOutText(toTitleCase(this.caste) + " Caste", 18, 590, 50 + bump, colours[this.caste], 20, 6*64-35);
        //printOutText(inventorytext[this.command], 18, 590, 170, colours[this.command], 20, 6*64-35); for future use, or maybe just place this thing in its own screen
        if (basic.includes(this.id)) printOutText("Empty Slot", 18, 590, 30, "white", 20, 6*64-35);
        else printOutText(this.name, 18, 590, 30, colours[this.id], 20, 6*64-100);
        printOutText(this.subdescript, 18, 590, 110, "white", 20, 6*64-35);
        //printOutText(this.lore, 18, 10, 600, colours[this.id], 20, 690);
        drawSymbol(this.icon, 890, 20, 64);
    }

    thrash(x, y, size){
        if (!this.turbulent) drawSymbol(this.icon, x, y,size);
        else{
            this.thrashcounter++;
            if (this.thrashcounter > 10){
                let rt = randomRange(1,4);
                if (rt == 1) this.offsetX+= 0.1;
                else if (rt == 2) this.offsetX-= 0.1;
                else if (rt == 3)this.offsetY+= 0.1;
                else if (rt == 4)this.offsetY-= 0.1;
                this.thrashcounter = 0;
            }
            drawSymbol(this.icon, x+this.offsetX*size,  y + this.offsetY*size,size);
            this.offsetX -= Math.sign(this.offsetX)*(this.speed);     
            this.offsetY -= Math.sign(this.offsetY)*(this.speed);
        }
    }

    describeWheel(){
        if (world.getRoom() instanceof SoulCage) return;
        const hijack = {
            "VILE" : 0,
            "FERAL" : 1,
            "UNHINGED" : 2,
            "ARTISTIC" : 3,
            "ORDERED" : 4,
            "SAINTLY" : 5
        }
        const index = hijack[this.caste];
        printOutText(toTitleCase(this.caste) + " Soul", 18, 10, 600, colours[this.id], 20, 690);
        if (this instanceof Empty) printOutText(soulabi["EMPTY"], 18, 10, 640, "white", 20, 690);
        else {
            let command = player.axioms.active[index].id;
            if (basic.includes(command)) command = "Commanded by its own whims";
            else command = "Commanded by a Legend";
            printOutText(command, 18, 10, 620, "lightgrey", 20, 690);
            if (false && !basic.includes(player.axioms.active[index].id) && player.axioms.active[index].influence != "I") printOutText(player.axioms.active[index].subdescript, 18, 10, 660, "white", 20, 690);
            else printOutText("\n[g]Base Effect[w]\n"+this.subdescript, 18, 10, 660, "white", 20, 690);
        }
        
    }

    describeAbridged(){
        if (!cursormode){
            let bump = 0;
            if ((5*64-32-ctx.measureText(this.name).width) < 0) bump = 20; 
            printOutText(toTitleCase(this.caste) + " Caste", 18, 590, 50 + bump, colours[this.caste], 20, 6*64-35);
            if (basic.includes(this.id)) printOutText("Empty Slot", 18, 590, 30, "white", 20, 6*64-35);
            else printOutText(this.name, 18, 590, 30, colours[this.id], 20, 6*64-100);
            printOutText(this.subdescript, 18, 590, 110, "white", 20, 6*64-35);
            drawSymbol(this.icon, 890, 20, 64);
            drawSymbol(34, 590, 500, 64);
            printOutText("Inhale this Soul (Q) to choose it and exit the Relay.", 18, 660, 528, "white", 20, 6*64-105);
        }
    }

    talk(){
        log.addLog(this.id);
    }
}

function calculatePower(triggers,targeter,modifier,effect){
    let basecost = 0;
    let basepower = 99;
    for (let i of targeter){
        basepower = Math.min(powerratings[i],basepower);
    }
    for (let i of triggers){
        if (powerratings[i]) basepower+=powerratings[i];
        if (soulcosts[i]) basecost+=soulcosts[i];
    }
    if (basepower == 99) basepower = 0;
    return [basepower,basecost];
}

class Axiom extends LegendarySoul{
    constructor(contingencies,forms,mutators,functions,caste,owner){
        super("FLEXIBLE");
        this.forms = forms;
        this.mutators = mutators;
        this.functions = functions;
        this.contingencies = contingencies;
        this.icon = inside[this.functions[0]];
        this.caste = caste;
        this.basepower = 99;
        this.basecost = 0;
        this.caster = owner;
        this.alllore = this.contingencies.concat(this.forms.concat(this.mutators.concat(this.functions)));
        calculatePower(this.contingencies,this.forms)
    }

    legendCast(caster){
        let targets = [];
        let power = 99;
        this.caster = caster;
        for (let i of this.forms){
            let obtainta = targeters[i](this.caster);
            for (let g of obtainta) targets.push(g);
            power = Math.min(powerratings[i],power)
        }
        for (let i of this.contingencies){
            if (powerratings[i]) power+=powerratings[i];
        }
        let mods = {
            "targets" : targets,
            "power" : power,
            "functions" : this.functions,
            "caster" : this.caster,
            "continue" : true,
            "mutators" : this.mutators,
            "forms" : this.forms,
        }
        for (let i of this.mutators){
            let edit = modifiers[i](mods);
            mods = edit;
            if (!edit["continue"]) return false;
        }
        for (let i of this.functions){
            for (let y of mods["targets"]){
                y.setEffect(14,30);
                effects[i](y,mods["power"],mods);
            }   
        }
        return false;
    }

    describe(){
        let description = researchexpl[this.alllore[player.axioms.describepage]];
        if (powerratings[this.alllore[player.axioms.describepage]]){
            if (powerratings[this.alllore[player.axioms.describepage]] > 0) description += "\n[g]Gain " + powerratings[this.alllore[player.axioms.describepage]] + " Potency.[w]";
            else description += "\n[r]Lose " + Math.abs(powerratings[this.alllore[player.axioms.describepage]]) + " Potency.[w]";
        }
        if (soulcosts[this.alllore[player.axioms.describepage]]){
            description += "\n[p]Triggering this Contingency will consume "+soulcosts[this.alllore[player.axioms.describepage]]+ " Ipseity Shards.";
        }
        printOutText(description, 18, 590, 105, "white", 20, 6*64-35);
        printOutText(toTitleCase(this.caste) + " Caste", 18, 590, 30, colours[this.caste], 20, 6*64-35);
        printOutText(researchnames[this.alllore[player.axioms.describepage]], 18, 590, 50, "white", 20, 6*64-100);
        player.axioms.exppage = new ComponentsDisplay(this.contingencies,this.forms,this.mutators,this.functions,this.basepower,this.basecost, this.caste);
    }
}

class Component extends LegendarySoul{
    constructor(type){
        super("SAINTLY");
        this.type = type;
        this.icon = inside[type];
        this.caste = "SAINTLY";
    }
}

class Empty extends LegendarySoul{
    constructor(){
        super("EMPTY");
        this.icon = 7;
        this.gicon = 7;
        this.hicon = 7;
        this.caste = "NO";
        this.lore = "The Annihilationists seared their flesh, insulted each other for hours on end while sitting in a circle, and refused all companionship all in the name of expunging their own soul. The most radical of them all would even try their luck with a home-made lobotomy. For Terminal, these cultists' reason to be is simply the natural state of things.";
        this.subdescript = "This central chamber can store up to four inactive Legendary Souls for future use.";
        this.name = "Empty Slot";
    }
}

class Shattered extends LegendarySoul{
    constructor(){
        super("SHATTERED");
        this.icon = 49;
        this.caste = "SHATTERED";
    }
}

class Vile extends LegendarySoul{
    constructor(){
        super("VILE");
        this.icon = 5;
        this.gicon = 46;
        this.hicon = 40;
        this.caste = "VILE";
    }
}

class Feral extends LegendarySoul{
    constructor(){
        super("FERAL");
        this.icon = 4;
        this.gicon = 45;
        this.hicon = 39;
        this.caste = "FERAL";
    }
}

class Unhinged extends LegendarySoul{
    constructor(){
        super("UNHINGED");
        this.icon = 3;
        this.gicon = 44;
        this.hicon = 38;
        this.caste = "UNHINGED";
    }
}

class Artistic extends LegendarySoul{
    constructor(){
        super("ARTISTIC");
        this.icon = 2;
        this.gicon = 43;
        this.hicon = 37;
        this.caste = "ARTISTIC";
    }
}

class Ordered extends LegendarySoul{
    constructor(){
        super("ORDERED");
        this.icon = 1;
        this.gicon = 42;
        this.hicon = 36;
        this.caste = "ORDERED";
    }
}

class Saintly extends LegendarySoul{
    constructor(){
        super("SAINTLY");
        this.icon = 0;
        this.gicon = 41;
        this.hicon = 35;
        this.caste = "SAINTLY";
    }
}

class Serene extends LegendarySoul{
    constructor(){
        super("SERENE");
        this.icon = 21;
        this.caste = "SERENE";
    }
}

function fishOutSoul(override){
    if (wheel.currentbrush == 8) return;
    if (!override) override = player.tile;
    const soultypes = {
        0: "EMPTY",
        1 : "SAINTLY",
        2: "ORDERED",
        3: "ARTISTIC",
        4: "UNHINGED",
        5: "FERAL",
        6: "VILE",
        7: "SERENE",
    }
    let set = wheel.lookForSoul(soultypes[wheel.currentbrush],wheel.turbstatus);
    if (set && wheel.wheel[wheel.currentbrush] instanceof Empty){
        let replace;
        if (set[0] == "discard"){
            replace = wheel.discard[set[1]];
            wheel.wheel[wheel.currentbrush] = replace;
            removeItemOnce(wheel.discard,wheel.discard[set[1]]);
        }
        else if (set[0] == "pile"){
            replace = wheel.pile[set[1]];
            wheel.wheel[wheel.currentbrush] = replace;
            removeItemOnce(wheel.pile,wheel.pile[set[1]]);
        }
    }
    else if (wheel.wheel[wheel.currentbrush] instanceof Empty){
        if (wheel.currentbrush == 0){
            wheel.retrieveSoul(override);
            if (!(wheel.wheel[wheel.currentbrush] instanceof Empty)){
                wheel.pile.push(wheel.wheel[wheel.currentbrush]);
                wheel.wheel[wheel.currentbrush] = new Empty();
            }
            return;
        }
        //if (log.history[log.history.length-1] != "BrushError") log.addLog("BrushError");
        return;
    }
    if (!(world.cage.slots[override.x][override.y] instanceof Empty)) {
        wheel.retrieveSoul(override);
        if (!(wheel.wheel[0] instanceof Empty)){
            wheel.pile.push(wheel.wheel[0]);
            wheel.wheel[0] = new Empty();
        }
    }
    wheel.cageSoul(wheel.currentbrush, override);
}