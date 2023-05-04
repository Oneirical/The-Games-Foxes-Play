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
        if (this.tabs.length == this.currentpage + inc || this.currentpage + inc < 0) return;
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
            printOutText(research.page[cx][cy].lore, 18, 10, 720, "#cda4f2", 20, 560);
            printOutText(research.page[cx][cy].unlock, 18, 10, 600, "white", 20, 390);
            printOutText(research.page[cx][cy].name, 18, 590, 30, "white", 20, 350);
            if (research.page[cx][cy].unlockdata) drawSpriteFreeform(research.page[cx][cy].unlockdata.sprite,8,9,-10,40,64);
            drawSymbol((research.page[cx][cy].contents), 890, 20, 64);
            printOutText(research.page[cx][cy].flags, 18, 590, 55, researchflagcolour[research.page[cx][cy].flags], 20, 6*64-35);
            let description = research.page[cx][cy].capsule;
            if (powerratings[research.page[cx][cy].id]){
                if (powerratings[research.page[cx][cy].id] > 0) description += "\n[g]Gain " + powerratings[research.page[cx][cy].id] + " Potency.[w]";
                else description += "\n[r]Lose " + Math.abs(powerratings[research.page[cx][cy].id]) + " Potency.[w]";
            }
            if (soulcosts[research.page[cx][cy].id]){
                description += "\n[p]Triggering this Contingency will consume "+soulcosts[research.page[cx][cy].id]+ " Ipseity Shards.";
            }
            printOutText(description, 18, 590, 105, "white", 20, 6*64-35);
            if (!this.looking) this.exppage = new TutorialDisplay(research.page[cx][cy].id);
            this.looking = true;
        }
        else{
            printOutText(researchlore["Null"], 18, 10, 720, "#cda4f2", 20, 560);
            printOutText(researchnames["Null"], 18, 590, 30, "white", 20, 350);
            drawSymbol(7, 890, 20, 64);
            printOutText(researchflags["Null"], 18, 590, 55, researchflagcolour[researchflags["Null"]], 20, 6*64-35);
            printOutText(researchexpl["Null"], 18, 590, 105, "white", 20, 6*64-35);
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
                if((i == 0 && j == 0) || (i == spellpatterns[this.type][0].length+1 && j == spellpatterns[this.type][0].length+1) || (i == 0 && j == spellpatterns[this.type][0].length+1) || (j == 0 && i == spellpatterns[this.type][0].length+1)) this.cage[i][j] = new Floor(i,j);
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
                let size = 64;
                this.cage[i][j].drawFreeform(673-size/2*(this.cage.length-3),546-size/2*(this.cage.length-3),size);
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
        this.caste = caste
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
                if((i == 0 && j == 0) || (i == 5+1 && j == 4+1) || (i == 0 && j == 4+1) || (j == 0 && i == 5+1)) this.cage[i][j] = new Floor(i,j);
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
                            this.cage[i][j].value = new Component(inside[this.contin[k]]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.forms.length;k++){
                        if (j == 2 && i-1 == k){
                            this.cage[i][j].value = new Component(inside[this.forms[k]]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.functions.length;k++){
                        if(j == 4&& i-1 == k){
                            this.cage[i][j].value = new Component(inside[this.functions[k]]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.mutators.length;k++){
                        if(j == 3&& i-1 == k){
                            this.cage[i][j].value = new Component(inside[this.mutators[k]]);
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
        if (!this.power) return;
        for(let i=0;i<this.cage.length;i++){
            for(let j=0;j<this.cage.length-1;j++){
                let size = 64;
                if (this.cage[i][j].seq && this.cage[i][j].seq == legendaries.describepage+1){
                    this.cage[i][j].sprite = 126;
                    drawSymbol(this.cage[i][j].value.icon, 890, 20, 64);
                }
                else if (this.cage[i][j].seq != null) this.cage[i][j].sprite = this.cage[i][j].spritesave;
                this.cage[i][j].drawFreeform(673-size/2*(this.cage.length-3),64+546-size/2*(this.cage.length-3),size);
                drawSymbol(12, 673-size/2*(this.cage.length-3)+40, 46+546-size/2*(this.cage.length-3), 64);
                printOutText(this.power+"",40, 660, 508, "lightsteelblue",20,350); //
                drawSymbol(49, 673-size/2*(this.cage.length-3)+89+64*4, 46+546-size/2*(this.cage.length-3), 64);
                printOutText(this.cost+"",40, 855, 508, "plum",20,350); //add for shattered energy
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

class MessageLog{
    constructor(){
        this.history = [];
        this.writeheight = [];
        this.repeats = [];
        this.allgrey = false;
    }
    addLog(message){
        this.allgrey = false;
        this.repeats.push(1);
        if (message != this.history[this.history.length-1]){
            this.history.push(message);
            this.writeheight.push(600);
            if (this.writeheight.length > 1){
                for (let x = this.writeheight.length-2;x >= 0; x--){
                    let thehe = ctx.measureText(removeColorTags(messages[this.history[this.history.length-1]])).width;
                    this.writeheight[x] += 25 * Math.ceil(thehe/690);
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
            printOutText(print, 18, 10, this.writeheight[x], coloring, 20, 690);
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
    }
}

class DrawWheel{
    constructor(){
        this.wheel = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        let center = [736, 223];
        let dist = 100;
        let pi = Math.PI;
        this.wheelcoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        dist = 45;
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
        this.circlemotion = {centerX:762, centerY:245, radius:20};
        this.spinningsouls = [new SpinningSoul(47,0)];
        this.currentbrush = 8;
        this.turbstatus = true;
        this.castecoords = [first,[first[0]+hori,first[1]],[first[0],first[1]+vert],[first[0]+hori,first[1]+vert],[first[0],first[1]+vert*2],[first[0]+hori,first[1]+vert*2]];
        this.turbulentmarkers = [new Feral(),new Feral()];
        this.turbulentmarkers[0].turbulent = true;
    }

    display(){
        for (let i = 0; i<this.spinningsouls.length;i++){
            this.spinningsouls[i].x = this.circlemotion.centerX + Math.cos(this.spinningsouls[i].angle) * this.circlemotion.radius;
            this.spinningsouls[i].y = this.circlemotion.centerY + Math.sin(this.spinningsouls[i].angle) * this.circlemotion.radius;
            this.spinningsouls[i].angle += this.spinningsouls[i].speed;
            drawSymbol(this.spinningsouls[i].icon, this.spinningsouls[i].x, this.spinningsouls[i].y, 16);
        }

        drawSymbol(6, 880, 320, 64);
        drawSymbol(9, 590, 130, 64);
        drawSymbol(10, 880, 130, 64);
        drawSymbol(11, 590, 50, 64);
        printOutText("Q",18, 616, 398, "white",20,350);
        printOutText("C",18, 616, 208, "white",20,350);
        printOutText("F",18, 906, 208, "white",20,350);
        printOutText("L",18, 906, 400, "white",20,350);
        let icon = 33;
        if (player.infested > 0) icon = 34;
        else if (player.tile.souls.length > 0) icon = 48;
        drawSymbol(icon,590,320,64);
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
        printOutText(" "+this.ipseity, 23, 660, 90, "plum", 20, 350);

        let display;
        const greysouls = {
            0 : 57,
            1: 50,
            2: 51,
            3: 52,
            4: 53,
            5 : 54,
            6: 55,
            7: 56,
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
                if (k == this.currentbrush) display = lightsouls[k];
                else ctx.globalAlpha = 0.5;
            }
            
            else if (gameState == "contemplation") display = this.saved[k].icon;
            else display = this.wheel[k].icon;
            if (!this.wheel[k].turbulent && !(world.getRoom() instanceof SoulCage && this.turbstatus && k != 0 && k!=7)) drawSymbol(display, this.wheelcoords[k][0], this.wheelcoords[k][1], 64);
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
            this.turbulentmarkers[0].thrash(800,62,32);
            this.turbulentmarkers[1].thrash(880,62,32);
            printOutText(9+"",18, 850, 110, "white",20,350);
            drawSymbol(45, 840, 62, 32);
        }
        let j = 0;
        let k = 0;
        let length = 21;
        //84 is max capacity for each box
        for (let i = 0; i<84; i++){
            if(i < this.pile.length) this.pile[i].thrash(581  + i*18 - (length*18*Math.floor(j/length)),420 + Math.floor(j/length)*18,16);
            else this.saved[0].thrash(581  + i*18 - (length*18*Math.floor(j/length)),420 + Math.floor(j/length)*18,16);
            j++;
        }
        for (let i = 0; i<84; i++){
            if(i < this.discard.length) this.discard[i].thrash(581  + i*18 - (length*18*Math.floor(k/length)),501 + Math.floor(k/length)*18,16);
            else this.saved[0].thrash(581  + i*18 - (length*18*Math.floor(k/length)),501 + Math.floor(k/length)*18,16);
            k++;
        }
        ctx.beginPath();
        ctx.moveTo(577, 496);
        ctx.lineTo(960, 496);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(577, 415);
        ctx.lineTo(960, 415);
        ctx.stroke();
    }

    countPileSouls(){
        let counts = [0,0,0,0,0,0];
        for (let k of this.pile){
            for (let g of this.castes){
                if (k.caste == g.caste) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    countDiscardSouls(){
        let counts = [0,0,0,0,0,0];
        for (let k of this.discard){
            for (let g of this.castes){
                if (k.caste ==  g.caste) counts[this.castes.indexOf(g)]++;
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
        //for (let x of legendaries.active){
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

    discardSoul(index){
        let soul = this.wheel[index];
        if (soul instanceof Empty){
            shakeAmount = 5;
            log.addLog("EmptyCast");
            return;
        }
        else{
            this.discard.push(soul);
            if (naiamode){
                this.castSoulFree(index);
            }
            this.wheel[index] = new Empty();
            player.discarded++;
        }
    }

    endDiscard(){ // if more discardmode stuff gets added review the if statements
        gameState = "running";
        if (!naiamode){
            spells["ASPHAF"](player.discarded);
        }
        else if (naiamode){
            log.addLog("NAIA");
            naiamode = false;
        }
        player.discarded = 0;
    }

    breatheSoul(){
        if (player.tile instanceof BetAltar){
            let commoncheck = false;
            for (let x of commons){
                if (player.tile.value instanceof x) commoncheck = true;
            }
            if (!commoncheck){
                legendaries.addSoul(player.tile.value);
                tiles = world.getRoom().tiles;
                player.infested = 0;
                player.sprite = 0;
                player.tile.setEffect(26,35);
                log.addLog("FluffyThanks");
                world.getRoom().entrymessage = "UsedRelay";
                return;
            }
        }
        if (player.infested == 1){
            let wheelcount = 0;
            for (let i of this.wheel) if (!(i instanceof Empty)) wheelcount++;
            for (let i of this.saved) if (!(i instanceof Empty)) wheelcount++;
            if ((this.pile.length + this.discard.length + wheelcount) < 8){
                log.addLog("FluffyNotEnoughSoulsTaunt");
                return;
            }
            world.getRoom().tiles = tiles;
            generateRelay();
            player.sprite = 90;
            monsters.forEach(function(entity){
                if (entity.name == "Serene Harmonizer"){
                    removeItemOnce(monsters,entity);
                }
            });
            player.infested++;
            world.getRoom().fuffspawn = 0;
            for (let x of this.wheel){
                if (!(x instanceof Empty)) this.discard.push(x);
            }
            for (let x of this.saved){
                if (!(x instanceof Empty)) this.discard.push(x);
            }
            this.wheel = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
            this.discard = shuffle(this.discard);
            for(let i=0;i<this.discard.length;i++){
                this.pile.push(this.discard[i]);
            }
            this.discard = [];
            this.saved = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
            log.addLog("FluffyTrance");
            let sacrifices = randomRangeTwo(0,7);
            for (let o = 0; o < 8; o++){
                this.wheel[o] = this.pile[0];
                this.wheel.index = o;
                if (sacrifices.includes(o)) this.wheel[o].chosen = true;
                this.pile.shift();
            }
        }
        else if (player.infested > 1){
            let tutorial = "FluffyExplain" + (player.infested-1).toString();
            if (player.infested-1 == 9){
                player.infested = 3;
                tutorial = "FluffyRepeat";
            }
            log.addLog(tutorial);
            player.infested++;
        }
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
                if (basic.includes(world.cage.slots[override.x][override.y].id)) this.wheel[this.wheel.indexOf(k)] = world.cage.slots[override.x][override.y];
                else retrievesuccess = legendaries.addSoul(world.cage.slots[override.x][override.y]);
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
        if(true){
            if (space == 0){
                this.cycleSouls();
            }
            //log.addLog("Empty");
            if (this.pile.length <= 0){
                //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
                for(let i=0;i<this.discard.length;i++){
                    if(!this.discard[i].turbulent || world.tranquil){
                        this.pile.push(this.discard[i]);
                        this.discard[i] = "deleted";
                    }
                }
                this.pile = shuffle(this.pile);
                removeItemAll(this.discard,"deleted");
                //this.discard = [];
            }
            if (this.pile.length < 1){
                log.addLog("UnrulySouls");
                shakeAmount = 5;
                return;
            }
            for (let k of this.wheel){
                if (k instanceof Empty){
                    this.wheel[this.wheel.indexOf(k)] = this.pile[0];
                    research.completeResearch("Breath");
                    break;
                } 
            }
            if(this.pile[0] instanceof Feral){
                for (let j of legendaries.active){
                    if (j instanceof Ezezza){
                        player.para++;
                        log.addLog("EZEZZA");
                    }
                }
            }
            this.pile.shift();
            if (this.activemodule != "Alacrity") tick();
            else if (!player.consumeCommon(1,false)){
                log.addLog("FluffyInsufficientPower");
                playSound("off");
                tick();
                this.activemodule = "NONE";
            } 
        }
    }

    sacrificeSoul(slot){
        let soul = this.wheel[slot];
        if (soul instanceof Empty){
            shakeAmount = 5;
            log.addLog("FluffyNoSoulTaunt");
            return;
        }
        else if (!(player.tile instanceof PosAltar || player.tile instanceof NegAltar || player.tile instanceof BetAltar)){
            shakeAmount = 5;
            log.addLog("FluffyFloorTaunt");
            return; 
        }
        else if (!soul.chosen){
            shakeAmount = 5;
            log.addLog("FluffyNotChosenTaunt");
            return;
        }
        else if (!(player.tile.value instanceof Empty)){
            shakeAmount = 5;
            log.addLog("FluffyDoubleSacTaunt");
            return;
        }
        else {
            log.addLog(soul.id+"F");
            this.wheel[slot] = new Empty();
            player.tile.value = soul;
            let remain = false;
            let done = true;
            for (let g = 0;g<8;g++){
                if (!(this.wheel[g] instanceof Empty)) done = false;
                else this.wheel[g].chosen = false;
            }
            for (let g of this.wheel) if (g.chosen) remain = true;
            if (!remain && !done){
                while(true){
                    let sacrifices = randomRangeTwo(0,7);
                    let chosenum = 0;
                    for (let o = 0; o < 8; o++){
                        if (!(this.wheel[o] instanceof Empty) && sacrifices.includes(o)){
                            this.wheel[o].chosen = true;
                            chosenum++
                        } 
                    }
                    if (chosenum == 2) break;
                    else{
                        for (let k = 0; k <8; k++) this.wheel[k].chosen = false;
                    }
                }
            }
            else if (!remain && done){
                let paltars = [];
                let naltars = [];
                for (let x of tiles){
                    for (let y of x){
                        if (y instanceof PosAltar) paltars.push(y.getValue());
                        else if (y instanceof NegAltar) naltars.push(y.getValue());
                    }
                }
                for (let k = 0; k < 3; k++){
                    paltars[k] = parseInt(paltars[k])
                }
                for (let e = 0; e < 3; e++){
                    naltars[e] = parseInt(naltars[e])
                }
                let results = [0,0,0];
                for (let q = 0; q < 3; q++){
                    if (paltars[q] && naltars[q]){
                        results[q] = (paltars[q] - naltars[q]);
                    }
                }
                results = results[0]*100+results[1]*10+results[2];
                world.getRoom().summonLoot(results,tiles[3][4],tiles[5][4]);
            }
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
                return;
            }
            else if (slot == this.currentbrush) slot = 8;
            this.currentbrush = slot;
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
        else if (gameState == "discard"){
            this.discardSoul(slot);
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
            let num = legendaries.castes.indexOf(soul.id);
            let spellName = soul.id;
            if (legendaries.active[num].influence == "C" || legendaries.active[num].influence == "A"){
                spellName = legendaries.active[num].id;
            }
            research.completeResearch("Spellcast");
            if (player.fuffified > 0) spellName = "SERENE";
            if (spellName == "FLEXIBLE"){
                fail = legendaries.active[num].legendCast();
                if (!fail){
                    this.saved.push(this.wheel[slot]);
                    wheel.spinningsouls.push(new SpinningSoul(this.wheel[slot].icon,wheel.spinningsouls[wheel.spinningsouls.length-1].angle-1));
                    this.wheel[slot] = new Empty();
                    playSound("spell");
                    tick();
                }
                else if (fail && spellName != "SERENE") log.addLog("CastError");
                fail = false;
                return;
            }
            if (spellName){
                if (basic.includes(spellName) && area == "Spire") spellName = spellName+"S";
                if (legendaries.active[num].influence != "I") legendaries.active[num].talk();
                else log.addLog(spellName);
                spells[spellName](player, legendaries.active[num]);
                if (legendaries.active[num].influence == "C") spells[legendaries.active[num].caste](player);
                if (!fail && player.activemodule != "Focus"){
                    this.saved.push(this.wheel[slot]);
                    wheel.spinningsouls.push(new SpinningSoul(this.wheel[slot].icon,wheel.spinningsouls[wheel.spinningsouls.length-1].angle-1));
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
                if (!fail){
                    playSound("spell");
                    tick();
                }
                if (fail && spellName != "SERENE") log.addLog("CastError");
                fail = false;
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

class Modules{
    constructor(){
        this.active = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        this.storage = [new Empty(),new Empty()];
        this.actcoords = [[257, 40],[366+68, 76],[257, 257],[472, 257],[257, 474],[366+68, 438]];
        this.storecoords = [[112,185],[112,330]];
    }

    display(){
        drawFilter(blackfilter);
        drawSymbol(10, 0, 0, 577);
        for (let k of this.active){
            drawSymbol(k.icon, this.actcoords[this.active.indexOf(k)][0], this.actcoords[this.active.indexOf(k)][1], 64);
        }
        for (let k of this.storage){
            drawSymbol(k.icon, this.storecoords[this.storage.indexOf(k)][0], this.storecoords[this.storage.indexOf(k)][1], 64);
        }
    }
}

class Inventory{
    constructor(){
        this.active = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storage = [new Empty(),new Empty(),new Empty(),new Empty()];
        this.actcoords = [[148, 76],[366, 76],[76, 256],[438, 256],[148, 438],[366, 438]];
        this.actcoords.reverse();//don't feel like re-writing these in the correct order lmao
        this.castes = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY","SERENE"];
        this.castesclass = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storecoords = [[257, 154],[257, 154+68],[257, 154+138],[257, 154+138+68]];   
        this.exppage = new ComponentsDisplay();
        this.describepage = 0;
    }

    display(){
        drawFilter(blackfilter);
        this.exppage.display();
        drawSymbol(6, 0, 0, 577);
        //drawSymbol(6, 880, 490, 64);
        ctx.globalAlpha = 0.55;
        //intérieur
        for (let k of this.active){
            ctx.globalAlpha = k.alpha;
            drawSymbol(k.icon, this.actcoords[this.active.indexOf(k)][0], this.actcoords[this.active.indexOf(k)][1], 64);
        }
        //stockage
        for (let k of this.storage){
            ctx.globalAlpha = k.alpha;
            drawSymbol(k.icon, this.storecoords[this.storage.indexOf(k)][0], this.storecoords[this.storage.indexOf(k)][1], 64);
        }
        printOutText("1",22, 482, 478, "white",20,350);
        printOutText("2",22, 80, 478, "white",20,350);
        printOutText("3",22, 554, 297, "white",20,350);
        printOutText("4",22, 10, 297, "white",20,350);
        printOutText("5",22, 482, 116, "white",20,350);
        printOutText("6",22, 80, 116, "white",20,350);
        printOutText("7",22, 229, 194, "black",20,350);
        printOutText("8",22, 229, 194+68, "black",20,350);
        printOutText("9",22, 229, 194+138, "black",20,350);
        printOutText("0",22, 229, 194+138+68, "black",20,350);
        printOutText(messages["InvTutorial"], 18, 10, 600, "white", 20, 560);
        
    }

    castContin(word){
        for (let i of this.active){
            if (i.triggers && i.triggers.includes(word)){
                if (soulcosts[word]){
                    if (wheel.ipseity < soulcosts[word]){
                        shakeAmount = 5;
                        log.addLog("NoShards");
                        return;
                    }
                    wheel.ipseity-=soulcosts[word];
                }
                i.legendCast();
            }
        }
    }

    activateSoul(slot){
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

    addSoul(soul){
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
            let command = legendaries.active[index].id;
            if (basic.includes(command)) command = "Commanded by its own whims";
            else command = "Commanded by a Legend";
            printOutText(command, 18, 10, 620, "lightgrey", 20, 690);
            if (false && !basic.includes(legendaries.active[index].id) && legendaries.active[index].influence != "I") printOutText(legendaries.active[index].subdescript, 18, 10, 660, "white", 20, 690);
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

class LegendSpell extends LegendarySoul{
    constructor(trigger,targeter,modifier,effect,caste){
        super("FLEXIBLE");
        this.targeter = targeter;
        this.modifier = modifier;
        this.effect = effect;
        this.triggers = trigger;
        this.icon = inside[this.effect[0]];
        this.caste = caste;
        this.basepower = 99;
        this.basecost = 0;
        this.alllore = this.triggers.concat(this.targeter.concat(this.modifier.concat(this.effect)));
        for (let i of this.targeter){
            this.basepower = Math.min(powerratings[i],this.basepower);
        }
        for (let i of this.triggers){
            if (powerratings[i]) this.basepower+=powerratings[i];
            if (soulcosts[i]) this.basecost+=soulcosts[i];
        }
    }

    legendCast(){
        let targets = [];
        let power = 99;
        let bonuspower = 0;
        for (let i of this.targeter){
            targets.push(targeters[i](player));
            power = Math.min(powerratings[i],power)
        }
        for (let i of this.triggers){
            if (powerratings[i]) power+=powerratings[i];
        }
        for (let i of this.modifier){
            for (let y of targets){
                bonuspower += modifiers[i](y,this.effect,power);
                if (i == "CLICK") return false;
            }  
        }
        power += bonuspower;
        for (let i of this.effect){
            for (let y of targets){
                effects[i](y,power);
            }   
        }
        return false;
    }

    describe(){
        let description = researchexpl[this.alllore[legendaries.describepage]];
        if (powerratings[this.alllore[legendaries.describepage]]){
            if (powerratings[this.alllore[legendaries.describepage]] > 0) description += "\n[g]Gain " + powerratings[this.alllore[legendaries.describepage]] + " Potency.[w]";
            else description += "\n[r]Lose " + Math.abs(powerratings[this.alllore[legendaries.describepage]]) + " Potency.[w]";
        }
        if (soulcosts[this.alllore[legendaries.describepage]]){
            description += "\n[p]Triggering this Contingency will consume "+soulcosts[this.alllore[legendaries.describepage]]+ " Ipseity Shards.";
        }
        printOutText(description, 18, 590, 105, "white", 20, 6*64-35);
        printOutText(toTitleCase(this.caste) + " Caste", 18, 590, 30, colours[this.caste], 20, 6*64-35);
        printOutText(researchnames[this.alllore[legendaries.describepage]], 18, 590, 50, "white", 20, 6*64-100);
        legendaries.exppage = new ComponentsDisplay(this.triggers,this.targeter,this.modifier,this.effect,this.basepower,this.basecost, this.caste);
    }
}

class Component extends LegendarySoul{
    constructor(icon){
        super("SAINTLY");
        this.icon = icon;
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

class Senet extends LegendarySoul{
    constructor(){
        super("SENET");
        this.icon = 8;
        this.caste = "VILE";
    }
}

class Lashol extends LegendarySoul{
    constructor(){
        super("LASHOL");
        this.icon = 23;
        this.caste = "FERAL";
        this.influence = "I";
    }
}

class Serene extends LegendarySoul{
    constructor(){
        super("SERENE");
        this.icon = 21;
        this.caste = "SERENE";
    }
}

class Sugcha extends LegendarySoul{
    constructor(){
        super("SUGCHA");
        this.icon = 14;
        this.caste = "SAINTLY";
        this.uses = 0;
    }

    talk(){
        if (this.uses >= 8) log.addLog("SUGCHATIRED");
        else super.talk();
    }
}

class Joltzazon extends LegendarySoul{
    constructor(){
        super("JOLTZAZON");
        this.icon = 15;
        this.caste = "UNHINGED";
    }
}

class Purpizug extends LegendarySoul{
    constructor(){
        super("PURPIZUG");
        this.icon = 16;
        this.caste = "ARTISTIC";
        this.influence = "C";
    }
}

class Rose extends LegendarySoul{
    constructor(){
        super("ROSE");
        this.icon = 17;
        this.caste = "SAINTLY";
    }
}

class Aspha extends LegendarySoul{
    constructor(){
        super("ASPHA");
        this.icon = 18;
        this.caste = "ORDERED";
    }
    talk(){}
}

class Kilami extends LegendarySoul{
    constructor(){
        super("KILAMI");
        this.icon = 19;
        this.caste = "FERAL";
        this.influence = "I";
    }
}

class Shizapis extends LegendarySoul{
    constructor(){
        super("SHIZAPIS");
        this.icon = 20;
        this.caste = "UNHINGED";
    }
}

class Abazon extends LegendarySoul{
    constructor(){
        super("ABAZON");
        this.icon = 22;
        this.caste = "ORDERED";
    }
}

class Zaint extends LegendarySoul{
    constructor(){
        super("ZAINT");
        this.icon = 24;
        this.caste = "SAINTLY";
    }
}

class Rasel extends LegendarySoul{
    constructor(){
        super("RASEL");
        this.icon = 25;
        this.caste = "VILE";
    }
}

class Borerora extends LegendarySoul{
    constructor(){
        super("BORERORA");
        this.icon = 26;
        this.caste = "ARTISTIC";
    }
}

class Gyvji extends LegendarySoul{
    constructor(){
        super("GYVJI");
        this.icon = 27;
        this.caste = "ARTISTIC";
    }
}

class Naia extends LegendarySoul{
    constructor(){
        super("NAIA");
        this.icon = 28;
        this.caste = "ORDERED";
    }
    talk(){}
}

class Aster extends LegendarySoul{
    constructor(){
        super("ASTER");
        this.icon = 29;
        this.caste = "SAINTLY";
    }
}

class Ezezza extends LegendarySoul{
    constructor(){
        super("EZEZZA");
        this.icon = 30;
        this.caste = "FERAL";
        this.influence = "I";
    }
}

class Kashia extends LegendarySoul{
    constructor(){
        super("KASHIA");
        this.icon = 31;
        this.caste = "UNHINGED";
        this.influence = "I";
    }
}

function fishOutSoul(override){
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