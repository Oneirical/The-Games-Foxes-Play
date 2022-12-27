//TODO cool animation?
class Inventory{
    constructor(){
        this.active = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storage = [new Senet(),new Lashol(),new Rasel(),new Empty()];
        this.actcoords = [[148, 76],[366, 76],[76, 257],[438, 257],[148, 438],[366, 438]];
        this.actcoords.reverse();//don't feel like re-writing these in the correct order lmao
        this.castes = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
        this.castesclass = [new Vile(),new Feral(),new Unhinged(),new Artistic(),new Ordered(),new Saintly()];
        this.storecoords = [[257, 154],[257, 154+68],[257, 154+138],[257, 154+138+68]];
        
    }
    //this may need a bit more thought...
    activateSoul(slot,soul){
        let caste = this.castes.indexOf(soul.caste);
        this.storage[slot] = new Empty();
        this.storeSoul(caste, this.active[caste]);
        this.active[caste] = soul;
    }

    storeSoul(slot, soul){
        if (basic.includes(soul.id)) return;
        else{
            for (let i of this.storage){
                if (i instanceof Empty){
                    this.storage[this.storage.indexOf(i)] = soul;
                    break;
                }
            }
            this.active[slot] = this.castesclass[slot];
        } // TODO what if nothing empty in storage?
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
        this.danger;
        this.subdescript = soulabi[name];
        this.glamdescript;
        this.hardescript;
        this.alpha = 1;
        if (basic.includes(name)) this.alpha = 0.55;
    }

    describe(){

    }
}

class Empty extends LegendarySoul{
    constructor(){
        super("EMPTY");
        this.icon = 7;
        this.caste = "EMPTY";
        this.danger = false;
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