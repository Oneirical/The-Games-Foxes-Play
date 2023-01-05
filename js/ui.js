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
                    this.writeheight[x] += 25 * Math.ceil((ctx.measureText(messages[this.history[this.history.length-1]]).width/940));
                }
            }
            if (this.history.length > 7){
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
            if (x != this.history.length-1 || this.allgrey) coloring = "lightgray";
            else if (this.history[x].includes("Fluffy")) coloring = "cyan";
            else if (this.history[x].includes("Rose")) coloring = "lightpink";
            else if (this.history[x].includes("Epsilon")) coloring = "red";
            let print = messages[this.history[x]];
            if (this.repeats[x] > 1) print += " x"+this.repeats[x];
            printAtWordWrap(print, 18, 10, this.writeheight[x], coloring, 20, 940);
            //for (let y = 0; y < this.writeheight.length-1; y++){
                //let margin = 26;
                //let wtf = Math.ceil(ctx.measureText(messages[this.history[y+1]]+"x00").width/940);
                //let wtf2 = Math.ceil(ctx.measureText(messages[this.history[y]]+"x00").width/940)
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
        this.discard = [new Artistic(), new Feral()]; //
        this.saved = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        this.resolve = 3; //update this later with the bonus
        this.castes = [new Saintly(),new Ordered(),new Artistic(),new Unhinged(),new Feral(),new Vile()];
        this.hide = false;
        let first = [587, 420];
        let vert = 52;
        let hori = 64*5-5;
        this.castecoords = [first,[first[0]+hori,first[1]],[first[0],first[1]+vert],[first[0]+hori,first[1]+vert],[first[0],first[1]+vert*2],[first[0]+hori,first[1]+vert*2]]
    }

    display(){ //TODO these should stay in cursormode, and you should be able to inspect them
        drawSymbol(6, 880, 320, 64);
        drawSymbol(9, 590, 130, 64);
        drawSymbol(10, 880, 130, 64);
        drawSymbol(11, 590, 50, 64);
        printAtWordWrap("Q",18, 614, 398, "white",20,350);
        printAtWordWrap("C",18, 614, 208, "white",20,350);
        printAtWordWrap("F",18, 906, 208, "white",20,350);
        printAtWordWrap("L",18, 906, 400, "white",20,350);
        let icon = 33;
        if (player.infested > 0) icon = 34;
        drawSymbol(icon,590,320,64);
        if (gameState == "contemplation"){
            drawSymbol(13, 880, 50, 64);
            printAtSidebar(agony+" ", 23, 835, 90, "red", 20, 350);
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
            printAtSidebar(paltars[0]+paltars[1]+paltars[2], 23, 780, 75, "cyan", 20, 350);
            printAtSidebar("-", 23, 825, 75, "white", 20, 350);
            printAtSidebar(naltars[0]+naltars[1]+naltars[2], 23, 839, 75, "red", 20, 350);
            printAtSidebar("=", 23, 805, 105, "white", 20, 350);
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
            printAtSidebar(results.toString(), 23, 825, 102, "white", 20, 350);
        }
        else{
            drawSymbol(12, 880, 50, 64);
            printAtSidebar(wheel.resolve+"/"+(3+Math.floor(resolvebonus/2))+" ", 23, 835, 90, "lightskyblue", 20, 350);
        }
        printAtSidebar(" "+truehp, 23, 660, 90, "plum", 20, 350);

        let display;
        for (let k = 0;k<8;k++){
            if (player.infested > 1 && this.wheel[k].chosen) display = this.wheel[k].hicon;
            else if (player.infested > 1 && !this.wheel[k].chosen) display = this.wheel[k].gicon;
            else if (gameState == "contemplation") display = this.saved[k].icon;
            else  display = this.wheel[k].icon;
            drawSymbol(display, this.wheelcoords[k][0], this.wheelcoords[k][1], 64);
            printAtWordWrap(k+1+"",18, this.hotkeycoords[k][0], this.hotkeycoords[k][1], "white",20,350);
        }
        for (let k of this.castes){
            drawSymbol(k.icon, this.castecoords[this.castes.indexOf(k)][0], this.castecoords[this.castes.indexOf(k)][1], 48);
        }
        for (let k of this.castes){
            if (this.castes.indexOf(k) % 2 == 0){
                printAtSidebar(" - " + this.countPileSouls()[this.castes.indexOf(k)], 18, this.castecoords[5-this.castes.indexOf(k)][0]-265, this.castecoords[this.castes.indexOf(k)][1]+32, "white", 20, 350);
                printAtSidebar("(" + this.countDiscardSouls()[(this.castes.indexOf(k))] + ")", 18, this.castecoords[5-this.castes.indexOf(k)][0]-265+ctx.measureText(" - " + this.countPileSouls()[this.castes.indexOf(k)]).width+10, this.castecoords[this.castes.indexOf(k)][1]+32, "pink", 20, 350);
                if (player.infested > 1) printAtSidebar("= " + (6-this.castes.indexOf(k)), 18, 720, this.castecoords[this.castes.indexOf(k)][1]+32, "cyan", 20, 350);
                else printAtSidebar("(" + this.countSavedSouls()[(this.castes.indexOf(k))] + ")", 18, 720, this.castecoords[this.castes.indexOf(k)][1]+32, "yellow", 20, 350); 
            }
            else if (this.castes.indexOf(k) % 2 == 1){
                printAtSidebar(this.countPileSouls()[this.castes.indexOf(k)] + " - ", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285, this.castecoords[this.castes.indexOf(k)][1]+32, "white", 20, 350);
                printAtSidebar("(" + this.countDiscardSouls()[(this.castes.indexOf(k))] + ")", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285-ctx.measureText(" - " + this.countPileSouls()[this.castes.indexOf(k)]).width-10, this.castecoords[this.castes.indexOf(k)][1]+32, "pink", 20, 350);
                if (player.infested > 1) printAtSidebar((6-this.castes.indexOf(k))+ " =", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285-ctx.measureText(" - " + this.countPileSouls()[this.castes.indexOf(k)]).width-60, this.castecoords[this.castes.indexOf(k)][1]+32, "cyan", 20, 350);
                else printAtSidebar("(" + this.countSavedSouls()[(this.castes.indexOf(k))] + ")", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285-ctx.measureText(" - " + this.countPileSouls()[this.castes.indexOf(k)]).width-60, this.castecoords[this.castes.indexOf(k)][1]+32, "yellow", 20, 350);
            }
        }
        ctx.beginPath();
        ctx.moveTo(768, 577);
        ctx.lineTo(768, 415);
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

    addSoul(skey){
        let loot = new skey();
        if (smod.includes(skey)) modules.push(loot);
        else{
            this.discard.push(loot);
            for (let x of legendaries.active){
                if (x instanceof Kilami) spells[loot.id](player);
            }
        }  
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
            world.getRoom().fuffspawn = null;
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

    drawSoulFree(){
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
            log.addLog("Oversoul");
            shakeAmount = 5; 
            return;
        }
        else{
            //log.addLog("Empty");
            if (this.pile.length <= 0){
                //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
    
                this.discard = shuffle(this.discard);
                for(let i=0;i<this.discard.length;i++){
                    this.pile.push(this.discard[i]);
                }
                this.discard = [];
            }
            for (let k of this.wheel){
                if (k instanceof Empty){
                    this.wheel[this.wheel.indexOf(k)] = this.pile[0];
                    break;
                } 
            }
            this.pile.shift();
        }
    }

    drawSoul(){
        if (player.infested > 0){
            this.breatheSoul();
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
            log.addLog("Oversoul");
            shakeAmount = 5; 
            return;
        }
        else{
            //log.addLog("Empty");
            if (this.pile.length <= 0){
                //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
    
                this.discard = shuffle(this.discard);
                for(let i=0;i<this.discard.length;i++){
                    this.pile.push(this.discard[i]);
                }
                this.discard = [];
            }
            for (let k of this.wheel){
                if (k instanceof Empty){
                    this.wheel[this.wheel.indexOf(k)] = this.pile[0];
                    break;
                } 
            }
            //if(this.inventory[0] == "EZEZZA"){
            //    this.para = 2;
            //    log.addLog("EZEZZA";
            //}
            this.pile.shift();
            if (this.resolve > 0){
                this.resolve--
            }
            else{
                truehp--
                if (truehp <= 0){
                    gameState = "dead"
                    pauseAllMusic();
                    playSound("falsity");
                    log.addLog("DrawDeath");
                }
            }
            if (this.activemodule != "Alacrity") tick();
            else if (!player.consumeCommon(1,false)){ //TODO this is broken and must be fixed
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

    castSoul(slot){
        if (player.infested > 1){
            this.sacrificeSoul(slot);
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
        else{
            //if (soul.id == "SERENE") TODO make this
            let num = legendaries.castes.indexOf(soul.id);
            let spellName = soul.id;
            if (legendaries.active[num].influence == "C" || legendaries.active[num].influence == "A"){
                spellName = legendaries.active[num].id;
            }
            if (player.fuffified > 0) spellName = "SERENE";
            if (spellName){
                if (basic.includes(spellName) && area == "Spire") spellName = spellName+"S";
                if (legendaries.active[num].influence != "I") legendaries.active[num].talk();
                else log.addLog(spellName);
                spells[spellName](player, legendaries.active[num]);
                if (legendaries.active[num].influence == "C") spells[legendaries.active[num].caste](player);
                if (!fail && player.activemodule != "Focus"){
                    let lookingfor = 0;
                    for (let k of this.saved){
                        if (k instanceof Empty){
                            this.saved[this.saved.indexOf(k)] = this.wheel[slot];
                            break;
                        } 
                        else lookingfor++;
                    }
                    if (lookingfor == 8){
                        let exile = shuffle(this.saved)[0];
                        this.saved[this.saved.indexOf(exile)] = new Empty();
                        this.discard.push(exile);
                        for (let k of this.saved){
                            if (k instanceof Empty){
                                this.saved[this.saved.indexOf(k)] = this.wheel[slot];
                                break;
                            } 
                        }
                    }
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
                if (!fail) playSound("spell");
                if (!fail) tick();
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

//TODO cool sliding animation?
class Inventory{
    constructor(){
        this.active = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storage = [new Sugcha(),new Empty(),new Empty(),new Empty()];
        this.actcoords = [[148, 76],[366, 76],[76, 257],[438, 257],[148, 438],[366, 438]];
        this.actcoords.reverse();//don't feel like re-writing these in the correct order lmao
        this.castes = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
        this.castesclass = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storecoords = [[257, 154],[257, 154+68],[257, 154+138],[257, 154+138+68]];   
    }

    display(){
        drawFilter(blackfilter);
        drawSymbol(6, 0, 0, 577);
        drawSymbol(6, 880, 490, 64);
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
        //message = "InvTutorial"; TODO
    }
    activateSoul(slot){
        let soul = this.storage[slot];
        if (soul instanceof Empty) return;
        let caste = this.castes.indexOf(this.storage[slot].caste);
        this.storage[slot] = new Empty();
        this.storeSoul(caste, this.active[caste]);
        this.active[caste] = soul;
    }

    addSoul(soul){
        let noroom = 0;
        for (let i of this.storage){
            if (noroom == this.storage.length) return;
            else if (i instanceof Empty){
                this.storage[this.storage.indexOf(i)] = soul;
                break;
            }
            else noroom++;
        }
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
        this.index = 0;
        this.chosen = false;
        if (basic.includes(name)) this.alpha = 0.55;
    }

    describe(){
        let bump = 0;
        if ((5*64-32-ctx.measureText(this.name).width) < 0) bump = 20; 
        printAtSidebar(toTitleCase(this.caste) + " Caste", 18, 590, 50 + bump, colours[this.caste], 20, 6*64-35);
        //printAtSidebar(inventorytext[this.command], 18, 590, 170, colours[this.command], 20, 6*64-35); for future use, or maybe just place this thing in its own screen
        if (basic.includes(this.id)) printAtSidebar("Empty Slot", 18, 590, 30, "white", 20, 6*64-35);
        else printAtSidebar(this.name, 18, 590, 30, colours[this.id], 20, 6*64-100);
        printAtSidebar(this.subdescript, 18, 590, 110, "white", 20, 6*64-35);
        printAtWordWrap(this.lore, 18, 10, 600, colours[this.id], 20, 940);
        drawSymbol(this.icon, 890, 20, 64);
    }

    describeAbridged(){
        let bump = 0;
        if ((5*64-32-ctx.measureText(this.name).width) < 0) bump = 20; 
        printAtSidebar(toTitleCase(this.caste) + " Caste", 18, 590, 50 + bump, colours[this.caste], 20, 6*64-35);
        if (basic.includes(this.id)) printAtSidebar("Empty Slot", 18, 590, 30, "white", 20, 6*64-35);
        else printAtSidebar(this.name, 18, 590, 30, colours[this.id], 20, 6*64-100);
        printAtSidebar(this.subdescript, 18, 590, 110, "white", 20, 6*64-35);
        drawSymbol(this.icon, 890, 20, 64);
        drawSymbol(34, 590, 500, 64);
        printAtSidebar("Breathe this Soul (Q) to choose it and exit the Relay.", 18, 660, 528, "white", 20, 6*64-105);
    }

    talk(){
        log.addLog(this.id);
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
    }
}

class Kashia extends LegendarySoul{
    constructor(){
        super("KASHIA");
        this.icon = 31;
        this.caste = "UNHINGED";
    }
}