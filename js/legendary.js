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
        this.discard = [new Artistic(), new Ordered(),new Vile(), new Artistic(),new Saintly(), new Feral(),new Unhinged(),new Vile(),new Ordered(),new Vile()];
        this.saved = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        this.resolve = 3; //update this later with the bonus
        this.castes = [new Saintly(),new Ordered(),new Artistic(),new Unhinged(),new Feral(),new Vile()];
        let first = [587, 420];
        let vert = 52;
        let hori = 64*5-5;
        this.castecoords = [first,[first[0]+hori,first[1]],[first[0],first[1]+vert],[first[0]+hori,first[1]+vert],[first[0],first[1]+vert*2],[first[0]+hori,first[1]+vert*2]]
    }

    display(){ //TODO these should stay in cursormode, and you should be able to inspect them
        drawSymbol(9, 590, 130, 64);
        drawSymbol(10, 880, 130, 64);
        drawSymbol(11, 590, 50, 64);
        if (gameState != "contemplation"){
            drawSymbol(12, 880, 50, 64);
            printAtSidebar(wheel.resolve+"/"+(3+Math.floor(resolvebonus/2))+" ", 23, 835, 90, "lightskyblue", 20, 350);
        } 
        else{
            drawSymbol(13, 880, 50, 64);
            printAtSidebar(agony+" ", 23, 835, 90, "red", 20, 350);
        }
        printAtSidebar(" "+truehp, 23, 660, 90, "plum", 20, 350);

        let display;
        for (let k = 0;k<8;k++){
            if (gameState != "contemplation") display = this.wheel[k].icon;
            else display = this.saved[k].icon;
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
            printAtSidebar("(" + this.countSavedSouls()[(this.castes.indexOf(k))] + ")", 18, 720, this.castecoords[this.castes.indexOf(k)][1]+32, "yellow", 20, 350); 
            }
            else if (this.castes.indexOf(k) % 2 == 1){
                printAtSidebar(this.countPileSouls()[this.castes.indexOf(k)] + " - ", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285, this.castecoords[this.castes.indexOf(k)][1]+32, "white", 20, 350);
                printAtSidebar("(" + this.countDiscardSouls()[(this.castes.indexOf(k))] + ")", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285-ctx.measureText(" - " + this.countPileSouls()[this.castes.indexOf(k)]).width-10, this.castecoords[this.castes.indexOf(k)][1]+32, "pink", 20, 350);
                printAtSidebar("(" + this.countSavedSouls()[(this.castes.indexOf(k))] + ")", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285-ctx.measureText(" - " + this.countPileSouls()[this.castes.indexOf(k)]).width-60, this.castecoords[this.castes.indexOf(k)][1]+32, "yellow", 20, 350);
            }
        }
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
        if (smod.includes(skey)) modules.push(skey);
        else{
            this.discard.push(skey);
            //if (doublecounter!=0) spells[skey](this);
        }  
    }

    drawSoul(){
        if (this.discard.length <= 0 && this.pile.length <= 0){
            message = "NoSouls";
            shakeAmount = 5;
            return;
        }
        let space = 8;
        for (let k of this.wheel){
            if (!(k instanceof Empty)) space--;
        }
        if (space == 0){
            message = "Oversoul";
            shakeAmount = 5; 
            return;
        }
        else{
            message = "Empty";
            if (this.pile.length <= 0){
                //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
    
                shuffle(this.discard)
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
            //    message = "EZEZZA";
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
                    message = "DrawDeath";
                }
            }
            if (this.activemodule != "Alacrity") tick();
            else if (!player.consumeCommon(1,false)){ //TODO this is broken and must be fixed
                message = "FluffyInsufficientPower";
                playSound("off");
                tick();
                this.activemodule = "NONE";
            } 
        }
    }

    castSoul(slot){
        let soul = this.wheel[slot];
        if (soul instanceof Empty){
            shakeAmount = 5;
            message = "EmptyCast";
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
                message = spellName;
                spells[spellName](player, legendaries.active[num]);
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
                        message = "FluffyInsufficientPower";
                        this.saved.push(this.wheel[slot]);
                        this.wheel[slot] = new Empty(); 
                        player.activemodule = "NONE";
                        playSound("off");
                    }
                }
                if (!fail) playSound("spell");
                if (!fail) tick();
                if (fail && spellName != "SERENE") message = "CastError";
                fail = false;
            }
        }
    }

    removeSoul(slot){
        let soul = this.saved[slot];
        if (soul instanceof Empty){
            shakeAmount = 5;
            message = "EmptyRemove";
            return;
        }
        else{
            if (agony > 0){
                if (soul instanceof Serene && agony < 3){
                    message = "FluffyNoRemoveTaunt";
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
                message = "AgonyWarning";
            }
        }
    }
}

//TODO cool sliding animation?
class Inventory{
    constructor(){
        this.active = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storage = [new Naia(),new Sugcha(),new Rose(),new Empty()];
        this.actcoords = [[148, 76],[366, 76],[76, 257],[438, 257],[148, 438],[366, 438]];
        this.actcoords.reverse();//don't feel like re-writing these in the correct order lmao
        this.castes = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
        this.castesclass = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storecoords = [[257, 154],[257, 154+68],[257, 154+138],[257, 154+138+68]];   
    }
    activateSoul(slot){
        let soul = this.storage[slot];
        if (soul instanceof Empty) return;
        let caste = this.castes.indexOf(this.storage[slot].caste);
        this.storage[slot] = new Empty();
        this.storeSoul(caste, this.active[caste]);
        this.active[caste] = soul;
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
}

class Empty extends LegendarySoul{
    constructor(){
        super("EMPTY");
        this.icon = 7;
        this.caste = "NO";
        this.lore = "The Annihilationists seared their flesh, insulted each other for hours on end while sitting in a circle, and refused all companionship all in the name of expunging their own soul. The most radical of them all would even try their luck with a home-made lobotomy. For Terminal, these cultists' reason to be is simply the natural state of things.";//remove
        this.subdescript = "This central chamber can store up to four inactive Legendary Souls for future use."; //remove
        this.name = "Empty Slot";
    }
}

class Vile extends LegendarySoul{
    constructor(){
        super("VILE");
        this.icon = 5;
        this.caste = "VILE";
    }
}

class Feral extends LegendarySoul{
    constructor(){
        super("FERAL");
        this.icon = 4;
        this.caste = "FERAL";
    }
}

class Unhinged extends LegendarySoul{
    constructor(){
        super("UNHINGED");
        this.icon = 3;
        this.caste = "UNHINGED";
    }
}

class Artistic extends LegendarySoul{
    constructor(){
        super("ARTISTIC");
        this.icon = 2;
        this.caste = "ARTISTIC";
    }
}

class Ordered extends LegendarySoul{
    constructor(){
        super("ORDERED");
        this.icon = 1;
        this.caste = "ORDERED";
    }
}

class Saintly extends LegendarySoul{
    constructor(){
        super("SAINTLY");
        this.icon = 0;
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
}

class Joltzazon extends LegendarySoul{
    constructor(){
        super("SUGCHA");
        this.icon = 15;
        this.caste = "UNHINGED";
    }
}

class Purpizug extends LegendarySoul{
    constructor(){
        super("PURPIZUG");
        this.icon = 16;
        this.caste = "ARTISTIC";
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