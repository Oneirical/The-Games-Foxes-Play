class DrawWheel{
    constructor(){
        this.wheel = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        let center = [736, 223];
        let dist = 100;
        let pi = Math.PI;
        this.wheelcoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];

        this.pile = [new Saintly(), new Feral(), new Vile(), new Ordered()];
        this.discard = [new Artistic()];
        this.resolve = 3; //update this later with the bonus
        this.castes = [new Saintly(),new Ordered(),new Artistic(),new Unhinged(),new Feral(),new Vile()];
        let first = [587, 420];
        let vert = 52;
        let hori = 64*5-5;
        this.castecoords = [first,[first[0]+hori,first[1]],[first[0],first[1]+vert],[first[0]+hori,first[1]+vert],[first[0],first[1]+vert*2],[first[0]+hori,first[1]+vert*2]]
    }

    display(){
        for (let k of this.wheel){
            drawSymbol(k.icon, this.wheelcoords[this.wheel.indexOf(k)][0], this.wheelcoords[this.wheel.indexOf(k)][1], 64);
        }
        for (let k of this.castes){
            drawSymbol(k.icon, this.castecoords[this.castes.indexOf(k)][0], this.castecoords[this.castes.indexOf(k)][1], 48);
        }
        for (let k of this.castes){
            if (this.castes.indexOf(k) % 2 == 0){
            printAtSidebar(" - " + this.countPileSouls()[this.castes.indexOf(k)], 18, this.castecoords[5-this.castes.indexOf(k)][0]-265, this.castecoords[this.castes.indexOf(k)][1]+32, "white", 20, 350);
            printAtSidebar("(" + this.countDiscardSouls()[(this.castes.indexOf(k))] + ")", 18, this.castecoords[5-this.castes.indexOf(k)][0]-265+ctx.measureText(" - " + this.countPileSouls()[this.castes.indexOf(k)]).width+10, this.castecoords[this.castes.indexOf(k)][1]+32, "pink", 20, 350); 
            }
            else if (this.castes.indexOf(k) % 2 == 1){
                printAtSidebar(this.countPileSouls()[this.castes.indexOf(k)] + " - ", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285, this.castecoords[this.castes.indexOf(k)][1]+32, "white", 20, 350);
                printAtSidebar("(" + this.countDiscardSouls()[(this.castes.indexOf(k))] + ")", 18, this.castecoords[5-this.castes.indexOf(k)][0]+285-ctx.measureText(" - " + this.countPileSouls()[this.castes.indexOf(k)]).width-10, this.castecoords[this.castes.indexOf(k)][1]+32, "pink", 20, 350); 
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
            else if (!this.consumeCommon(1,false)){
                message = "FluffyInsufficientPower";
                playSound("off");
                tick();
                this.activemodule = "NONE";
            } 
        }
    }
}

//TODO cool sliding animation?
class Inventory{
    constructor(){
        this.active = [new Senet(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storage = [new Senet(),new Lashol(),new Rasel(),new Empty()];
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
        this.danger;
        this.subdescript = soulabi[name];
        this.glamdescript;
        this.hardescript;
        this.alpha = 1;
        if (basic.includes(name)) this.alpha = 0.55;
    }

    describe(){
        printAtSidebar(toTitleCase(this.caste) + " Caste", 18, 590, 150, colours[this.caste], 20, 6*64-35);
        printAtSidebar(inventorytext[this.command], 18, 590, 170, colours[this.command], 20, 6*64-35);
        if (basic.includes(this.id)) printAtSidebar("Empty Slot", 18, 590, 130, "white", 20, 6*64-35);
        else printAtSidebar(this.name, 18, 590, 130, colours[this.id], 20, 6*64-35);
        printAtSidebar(this.subdescript, 18, 590, 210, "white", 20, 6*64-35);
        printAtWordWrap(this.lore, 18, 10, 600, colours[this.id], 20, 940);
        drawSymbol(this.icon, 890, 110, 64);
    }
}

class Empty extends LegendarySoul{
    constructor(){
        super("EMPTY");
        this.icon = 7;
        this.caste = "EMPTY";
        this.danger = false;
        this.lore = "TODO";//remove
        this.subdescript = "TODO"; //remove
        this.name = "TODO";
    }
}

class Vile extends LegendarySoul{
    constructor(){
        super("VILE");
        this.icon = 5;
        this.caste = "VILE";
        this.danger = false;
    }
}

class Feral extends LegendarySoul{
    constructor(){
        super("FERAL");
        this.icon = 4;
        this.caste = "FERAL";
        this.danger = false;
    }
}

class Unhinged extends LegendarySoul{
    constructor(){
        super("UNHINGED");
        this.icon = 3;
        this.caste = "UNHINGED";
        this.danger = false;
    }
}

class Artistic extends LegendarySoul{
    constructor(){
        super("ARTISTIC");
        this.icon = 2;
        this.caste = "ARTISTIC";
        this.danger = false;
    }
}

class Ordered extends LegendarySoul{
    constructor(){
        super("ORDERED");
        this.icon = 1;
        this.caste = "ORDERED";
        this.danger = false;
    }
}

class Saintly extends LegendarySoul{
    constructor(){
        super("SAINTLY");
        this.icon = 0;
        this.caste = "SAINTLY";
        this.danger = false;
    }
}

class Senet extends LegendarySoul{
    constructor(){
        super("SENET");
        this.icon = 8;
        this.caste = "VILE";
        this.danger = false;
    }
}

class Lashol extends LegendarySoul{
    constructor(){
        super("LASHOL");
        this.icon = 6;
        this.caste = "FERAL";
        this.danger = false;
    }
}

class Rasel extends LegendarySoul{
    constructor(){
        super("RASEL");
        this.icon = 2;
        this.caste = "VILE";
        this.danger = false;
    }
}