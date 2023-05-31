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
        this.trackedEntity;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*15;
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,5,this.displayCon);
        drawChainLine(4,110,15,"v",this.displayCon);
        drawChainLine(4,165,15,"v",this.displayCon);
        this.hpCon = new PIXI.Container();
        this.hpCon.x = 8;
        this.hpCon.y = 6;
        this.displayCon.addChild(this.hpCon);
        for (let i = 0; i<2;i++){
            for (let j = 0; j<3; j++){
                let newSprite = new FoxSprite(allsprites.textures['icon1']);
                newSprite.x = i*40;
                newSprite.y = j*40;
                newSprite.width = 32;
                newSprite.height = 32;
                this.hpCon.addChild(newSprite);
            }
        }
        this.soulCon = new PIXI.Container();
        this.soulCon.x = 111;
        this.soulCon.y = 6;
        this.displayCon.addChild(this.soulCon);
        let newSprite = new FoxSprite(allsprites.textures['icon49']);
        newSprite.x = 0;
        newSprite.y = 40;
        newSprite.width = 32;
        newSprite.height = 32;
        this.soulCon.addChild(newSprite);
    }

    updateDisplay(){
        this.trackedEntity = player;
        let i = this.trackedEntity;
        if (!i.isPlayer) this.displayCon.visible = false;
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
        printOutText(messages[message],0,0,style,this.textcon);
        const richText = new PIXI.Text(messages[message], style);
        richText.repetitions = 0;
        richText.originalText = richText.text;
        if (this.textcon.children.length > 1){
            this.textcon.children[this.textcon.children.length-2].ancient = true;
            for (let i = 0; i<this.textcon.children.length-1; i++){
                this.textcon.children[i].y += this.textcon.children[this.textcon.children.length-1].linesnum+5;
                for (let j = 0; j<this.textcon.children[i].children.length; j++){
                    if (this.textcon.children[i].y + this.textcon.children[i].children[j].y > 335) this.textcon.children[i].children[j].visible = false;
                }
                if (this.textcon.children[i].y > 700) this.textcon.removeChildAt(i);
            }
        }
    }
}

class SoulBreathing{
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

        this.subduedSouls = [];
        this.turbulentSouls = []; //
        this.exhaustedSouls = [];
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
        this.paintcoords = [[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        this.paintcir = [];
        for (let i of this.paintcoords) this.paintcir.push({centerX:i[0]+24, centerY:i[1]+24, radius:15});
        this.currentbrush = 8;
        this.turbstatus = true;
        this.castecoords = [first,[first[0]+hori,first[1]],[first[0],first[1]+vert],[first[0]+hori,first[1]+vert],[first[0],first[1]+vert*2],[first[0]+hori,first[1]+vert*2]];
        this.turbulentmarkers = [new Feral(),new Feral()];
        this.turbulentmarkers[0].turbulent = true;
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
        this.wheelCon = new PIXI.Container();
        this.displayCon.addChild(this.wheelCon);
        let paintcans = [];
        for (let i = 0; i<8; i++){
            let newSprite = new FoxSprite(allsprites.textures['icon7']);
            newSprite.width = (resolutionSize-3)*16;
            newSprite.height = (resolutionSize-3)*16;
            newSprite.anchor.set(0.5,0.5);
            newSprite.x = wheelcoords[i][0];
            newSprite.y = wheelcoords[i][1];
            
            this.wheelCon.addChild(newSprite);
            this.wheelCon.children[i].eventMode = 'static';
            this.wheelCon.children[i].on('click', (event) => {
                this.selectCan(i);
            });
            newSprite.paintCan = new PIXI.Container();
            newSprite.paintCan.eventMode = 'none';
            newSprite.paintCan.x = newSprite.x-22;
            newSprite.paintCan.y = newSprite.y-22;
            paintcans.push(newSprite.paintCan);
        }
        for (let i of paintcans) this.wheelCon.addChild(i);
        this.bouncySouls = new PIXI.ParticleContainer();
        this.spinningPile = new PIXI.ParticleContainer();
        this.spinningPile.x = center[0]-8;
        this.spinningPile.y = center[1]-8;
        this.displayCon.addChild(this.bouncySouls);
        this.displayCon.addChild(this.spinningPile);
    }

    toPaintMode(){
        for (let i = 0; i< 8;  i++){
            let hai = (i-1+58);
            if (i == 0) hai = 7;
            this.wheelCon.children[i].texture = allsprites.textures['icon'+hai];
            if (i!=0) this.wheelCon.children[i].alpha = 0.25;
            else this.wheelCon.children[i].alpha = 0.5;
        }
        let initial =this.bouncySouls.children.length-1;
        for (let i = initial; i>=0; i--){
            let can = this.bouncySouls.children[i];
            can.bounceborder = 32;
            can.x = 16;
            can.y = 16;
            can.width = 16;
            can.height = 16;
            can.alpha = 0.5;
            can.trspeed = 2;
            this.wheelCon.children[6-can.caste].paintCan.addChild(can);
        }
    }

    selectCan(i){
        if (this.selectedCan != null || i == this.selectedCan) {
            for (let s of this.wheelCon.children[this.selectedCan].paintCan.children){
                s.trspeed = 2;
                s.alpha = 0.5;
            }
            if (this.selectedCan != 0) this.wheelCon.children[this.selectedCan].alpha = 0.25;
            else this.wheelCon.children[this.selectedCan].alpha = 0.5;
        }
        if (i == this.selectedCan){
            this.selectedCan = null;
            return;
        }
        this.selectedCan = i;
        if (this.selectedCan != 0) this.wheelCon.children[i].alpha = 0.5;
        else this.wheelCon.children[i].alpha = 1;
        for (let s of this.wheelCon.children[i].paintCan.children){
            s.trspeed = 5;
            s.alpha = 0.8;
        }
    }

    toNormalMode(){
        if (this.selectedCan != null) this.selectCan(this.selectedCan);
        this.selectedCan = null;
        for (let i = 0; i< 8;  i++){
            this.wheelCon.children[i].alpha = 1;
            this.wheelCon.children[i].texture = allsprites.textures['icon7'];
            let initial = this.wheelCon.children[i].paintCan.children.length-1;
            for (let k = initial; k>=0; k--){
                let j = this.wheelCon.children[i].paintCan.children[k];
                j.x = 194;
                j.y = 194;
                j.width = 32;
                j.height = 32;
                j.alpha = 0.15;
                j.trspeed = 5;
                j.bounceborder = 420;
                this.bouncySouls.addChild(j);
            }
        }
    }

    reshuffle(){
        for(let i=0;i<this.exhaustedSouls.length;i++){
            this.subduedSouls.push(this.exhaustedSouls[i]);
            this.exhaustedSouls[i] = "deleted";
        }
        this.subduedSouls = shuffle(this.subduedSouls);
        removeItemAll(this.exhaustedSouls,"deleted");
    }

    countsubduedSoulsSouls(turb){
        let counts = [0,0,0,0,0,0];
        for (let k of this.subduedSouls){
            for (let g of this.castes){
                if (k.caste == g.caste && k.turbulent == turb) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    countDiscardSouls(turb){
        let counts = [0,0,0,0,0,0];
        for (let k of this.turbulentSouls){
            for (let g of this.castes){
                if (k.caste ==  g.caste && k.turbulent == turb) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    countSavedSouls(){
        let counts = [0,0,0,0,0,0];
        for (let k of this.exhaustedSouls){
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

    addSoul(skey,noturb){
        const drops = {
            "Vile" : Vile,
            "Feral" : Feral,
            "Unhinged" : Unhinged,
            "Artistic" : Artistic,
            "Ordered" : Ordered,
            "Saintly" : Saintly,
        }
        let loot = new drops[skey.name]();
        let caste = Object.keys(drops).indexOf(skey.name);
        if (!noturb) loot.turbulent = true;
        this.turbulentSouls.push(loot);
        loot.displayIcon.width = 32;
        loot.displayIcon.height = 32;
        loot.displayIcon.x = 194;
        loot.displayIcon.y = 194;
        loot.displayIcon.alpha = 0.15;
        loot.displayIcon.bounceborder = 420;
        loot.displayIcon.trspeed = 5;
        loot.displayIcon.caste = caste;
        this.bouncySouls.addChild(loot.displayIcon);
        app.ticker.add(() => {
            if (loot.displayIcon.x > loot.displayIcon.bounceborder) loot.displayIcon.dirx = -Math.abs(loot.displayIcon.dirx);
            else if (loot.displayIcon.x < -6) loot.displayIcon.dirx = Math.abs(loot.displayIcon.dirx);
            else if (loot.displayIcon.y > loot.displayIcon.bounceborder) loot.displayIcon.diry = -Math.abs(loot.displayIcon.diry);
            else if (loot.displayIcon.y < -6) loot.displayIcon.diry = Math.abs(loot.displayIcon.diry);
            loot.displayIcon.x += loot.displayIcon.dirx*loot.displayIcon.trspeed;
            loot.displayIcon.y += loot.displayIcon.diry*loot.displayIcon.trspeed;
        });
        research.completeResearch("Herald");
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
        let retrievesuccess = true;
        if (!world.cage.slots[override.x][override.y].turbulent)research.completeResearch("Subdued");
        if (basic.includes(world.cage.slots[override.x][override.y].id)){
            if (world.cage.slots[override.x][override.y].turbulent){
                this.turbulentSouls.push(world.cage.slots[override.x][override.y]);
                this.wheelCon.children[7-basic.indexOf(world.cage.slots[override.x][override.y].id)].paintCan.addChild(world.cage.slots[override.x][override.y].displayIcon);
                let can = world.cage.slots[override.x][override.y].displayIcon; //oh so NOW you assign a variable to that. Fu!
                can.bounceborder = 32;
                can.x = 16;
                can.y = 16;
                can.width = 16;
                can.height = 16;
                can.alpha = 0.5;
                can.trspeed = 2;
                if (7-basic.indexOf(world.cage.slots[override.x][override.y].id) == this.selectedCan){
                    can.trspeed = 5;
                    can.alpha = 0.8;
                }
            }
            else{
                this.subduedSouls.push(world.cage.slots[override.x][override.y]);
                let newSoul = this.subduedSouls[this.subduedSouls.length-1].displayIcon;
                let startangle = 0;
                if (this.subduedSouls.length > 1) startangle = this.subduedSouls[this.subduedSouls.length-2].displayIcon.calAngle + 0.1;
                newSoul.calAngle = startangle;
                newSoul.width = 16;
                newSoul.height = 16;
                newSoul.spinSpeed = 0.01;
                newSoul.spinDist = 170;
                app.ticker.add((delta) => {
                    newSoul.calAngle+= newSoul.spinSpeed;
                    newSoul.x = newSoul.spinDist*Math.cos(newSoul.calAngle);
                    newSoul.y = newSoul.spinDist*Math.sin(newSoul.calAngle);
                });
                this.spinningPile.addChild(newSoul);
            } 
        }
        else retrievesuccess = player.axioms.addAxiom(world.cage.slots[override.x][override.y]);
        if (retrievesuccess) {
            world.cage.slots[override.x][override.y] = new Empty();
            tiles[override.x][override.y].tickTile(allsprites.textures['sprite110']);
            world.cage.size--;
        }
        if(world.cage.size > 0) world.cage.generateWorld();
        else world.cage.displayon = false;
    }

    cycleSouls(){
        this.exhaustedSouls.push(this.wheel[0]);
        this.spinningPile.addChild(this.wheel[0].displayIcon);
        this.wheel[0].displayIcon.spinDist = 30;
        this.wheel[0] = new Empty();
        for (let i =0; i<this.wheel.length-1;i++){
            this.wheel[i] = this.wheel[i+1];
        }
        this.wheel[7] = new Empty();
    }

    resetAngles(){
        for (let i = 0; i<this.subduedSouls.length; i++){
            if (i == 0) continue;
            else this.subduedSouls[i].angle = this.subduedSouls[i-1].angle+0.1;
        }
    }

    tickWheel(){
        if (world.getRoom() instanceof SoulCage) return;
        for (let k of this.wheelCon.children){
            if (k instanceof FoxSprite){
                k.texture = this.wheel[this.wheelCon.children.indexOf(k)].displayIcon.texture;
            }
        }
    }

    drawSoul(){
        if (world.getRoom() instanceof SoulCage) return;
        if (player.tile.souls.length > 0){
            for (let i of player.tile.souls){
                this.addSoul(i);
            }
            return;
        }
        if (gameState == "contemplation"){
            player.revivify();
            return;
        }
        if (this.subduedSouls.length <= 0){
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
        beginTurn();
        for (let k of this.wheel){
            if (k instanceof Empty){
                let slot = this.wheel.indexOf(k);
                this.wheel[slot] = this.subduedSouls[0];
                research.completeResearch("Breath");
                break;
            } 
        }
        this.spinningPile.removeChild(this.subduedSouls[0].displayIcon);
        for (let i = 1; i< this.spinningPile.children.length; i++){
            this.spinningPile.children[i].calAngle = this.spinningPile.children[i-1].calAngle+0.1;
        }
        this.subduedSouls.shift();
        tick();
    }

    cageSoul(slot, override){
        if (!override) override = player.tile;
        const choices = [Saintly, Ordered, Artistic, Unhinged, Feral, Vile, Serene];
        let soulType = choices[slot-1];
        let soul;
        if (!soulType){
            this.retrieveSoul(override);
            return;
        }
        for (let i of this.turbulentSouls) if (i instanceof soulType){ 
            soul = i; 
            break;
        }
        if (soul){
            if (!(world.cage.slots[override.x][override.y] instanceof Empty)){
                this.retrieveSoul(override);
            }
            removeItemOnce(this.turbulentSouls,soul);
            world.cage.slots[override.x][override.y] = soul;
            world.cage.size++;
            if(world.cage.size > 0) world.cage.generateWorld();
            research.completeResearch("Turbulent");
            research.completeResearch("Brush");
            if (this.wheelCon.children[slot].paintCan.children.length > 0) this.wheelCon.children[slot].paintCan.removeChildAt(0);
            tiles[override.x][override.y].tickTile(allsprites.textures['sprite110']);
        }
    }

    lookForSoul(type, turbulent){
        for (let i = 0; i < this.turbulentSouls.length; i++){
            if (this.turbulentSouls[i].id == type && this.turbulentSouls[i].turbulent == turbulent) return ["turbulentSouls",i];
        }
        for (let i = 0; i < this.subduedSouls.length; i++){
            if (this.subduedSouls[i].id == type && this.subduedSouls[i].turbulent == turbulent) return ["subduedSouls",i];
        }
        return false;
    }

    castSoul(slot){
        if (world.getRoom() instanceof SoulCage){
            if (slot == 8){
                this.turbstatus = !this.turbstatus;
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
                    player.axioms.active[num].legendCast(player);
                    this.exhaustedSouls.push(this.wheel[slot]);
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
                    this.exhaustedSouls.push(this.wheel[slot]);
                    this.wheel[slot] = new Empty();
                    playSound("spell");
                    tick();
                }
            }
        }
    }

    removeSoul(slot){
        let soul = this.exhaustedSouls[slot];
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
                    this.exhaustedSouls[slot] = new Empty();
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
        let newSprite = new FoxSprite(allsprites.textures['icon6']);
        newSprite.width = (resolutionSize+12)*16;
        newSprite.height = (resolutionSize+12)*16;
        
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
            let axiomslot = new FoxSprite(allsprites.textures['icon'+i]);
            axiomslot.width = 32;
            axiomslot.height = 32;
            axiomslot.x = xcoords[i];
            axiomslot.y = ycoords[i];
            this.axiomCon.addChild(axiomslot);
        }

        for (let i = 0; i<4; i++){
            let axiomslot = new FoxSprite(allsprites.textures['icon7']);
            axiomslot.width = 32;
            axiomslot.height = 32;
            axiomslot.x = (79+193)/2;
            axiomslot.y = 82+i*36;
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
        if (basic.includes(this.active[slot].id)) return;
        else{
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

class Soul{
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
        this.spinSpeed = 0.05;
        this.thrashcounter = 0;
        this.discpatt = [];
        this.x = 0;
        this.y = 0;
        this.speed = 0.01;
        this.angle = 0;
        if (basic.includes(name)) this.alpha = 0.55;
        this.setUpSprites();
    }

    setUpSprites(){
        if (basic.includes(this.id)) this.displayIcon = new FoxSprite(allsprites.textures['icon'+(6-basic.indexOf(this.id))]);
        else if (this.id == "EMPTY") this.displayIcon = new FoxSprite(allsprites.textures['icon7']);
        else return;
        this.displayIcon.dirx = Math.random();
        this.displayIcon.diry = 1 - this.displayIcon.dirx;
        if (Math.random > 0.5) this.displayIcon.dirx *= -1;
        if (Math.random > 0.5) this.displayIcon.diry *= -1;

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

class Axiom extends Soul{
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

class Component extends Soul{
    constructor(type){
        super("SAINTLY");
        this.type = type;
        this.icon = inside[type];
        this.caste = "SAINTLY";
    }
}

class Empty extends Soul{
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

class RealityAnchor extends Soul{
    constructor(type){
        super("SAINTLY");
        this.type = type;
        this.icon = inside[type];
        this.caste = "SAINTLY";
    }
} 

class Shattered extends Soul{
    constructor(){
        super("SHATTERED");
        this.icon = 49;
        this.caste = "SHATTERED";
    }
}

class Vile extends Soul{
    constructor(){
        super("VILE");
        this.icon = 5;
        this.gicon = 46;
        this.hicon = 40;
        this.caste = "VILE";
    }
}

class Feral extends Soul{
    constructor(){
        super("FERAL");
        this.icon = 4;
        this.gicon = 45;
        this.hicon = 39;
        this.caste = "FERAL";
    }
}

class Unhinged extends Soul{
    constructor(){
        super("UNHINGED");
        this.icon = 3;
        this.gicon = 44;
        this.hicon = 38;
        this.caste = "UNHINGED";
    }
}

class Artistic extends Soul{
    constructor(){
        super("ARTISTIC");
        this.icon = 2;
        this.gicon = 43;
        this.hicon = 37;
        this.caste = "ARTISTIC";
    }
}

class Ordered extends Soul{
    constructor(){
        super("ORDERED");
        this.icon = 1;
        this.gicon = 42;
        this.hicon = 36;
        this.caste = "ORDERED";
    }
}

class Saintly extends Soul{
    constructor(){
        super("SAINTLY");
        this.icon = 0;
        this.gicon = 41;
        this.hicon = 35;
        this.caste = "SAINTLY";
    }
}

class Serene extends Soul{
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
            replace = wheel.turbulentSouls[set[1]];
            wheel.wheel[wheel.currentbrush] = replace;
            removeItemOnce(wheel.turbulentSouls,wheel.turbulentSouls[set[1]]);
        }
        else if (set[0] == "pile"){
            replace = wheel.subduedSouls[set[1]];
            wheel.wheel[wheel.currentbrush] = replace;
            removeItemOnce(wheel.subduedSouls,wheel.subduedSouls[set[1]]);
        }
    }
    else if (wheel.wheel[wheel.currentbrush] instanceof Empty){
        if (wheel.currentbrush == 0){
            wheel.retrieveSoul(override);
            if (!(wheel.wheel[wheel.currentbrush] instanceof Empty)){
                wheel.subduedSouls.push(wheel.wheel[wheel.currentbrush]);
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
            wheel.subduedSouls.push(wheel.wheel[0]);
            wheel.wheel[0] = new Empty();
        }
    }
    wheel.cageSoul(wheel.currentbrush, override);
}