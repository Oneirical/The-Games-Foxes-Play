class AxiomTemp{
    static storageEquivalences = {
        "Creature" : Monster,
        "Axiom" : AxiomTemp,
        "Soul" : Soul,
        "Colour" : Colour,
        "Direction" : Direction,
        "Tile" : Tile,
        "Caste" : Caste,
    };
    constructor(){
        this.contingency = false;
        this.x;
        this.y;
        this.empty = false;
        this.soul;
        this.storage;
        this.nameID = this.constructor.name;
        this.dataType = [];
    }
    act(data){return data;};

    build(){
        if ("NSWE".includes(this.storage) && this.dataType.includes("Direction")) this.storage = new Direction(this.storage);
        else if (Colour.colourTypes.includes(this.storage) && this.dataType.includes("Colour")) this.storage = new Colour(this.storage);
        else if (Caste.casteTypes.includes(this.storage) && this.dataType.includes("Caste")) this.storage = new Caste(this.storage);
    }

    translate(){};
}

class EmptyAxiom extends AxiomTemp{
    constructor(){
        super();
        this.empty = true;
    }
}

class RealityAnchor extends AxiomTemp{
    constructor(){
        super();
    }
    act(data){
        data["break"] = true;
        return data;
    }
}

class RadioBroadcaster extends AxiomTemp{
    constructor(message){
        super();
        this.storage = message;
        this.dataType = ["Message"];
    }
    act(data){
        trigger(this.storage);
        return data;
    }
}

class RadioReceiver extends AxiomTemp{
    constructor(key){
        super();
        this.storage = key;
        this.contingency = true;
        this.dataType = ["Message"];
    }
    act(data){
        return data;
    }
}

class ContinKilled extends AxiomTemp{
    constructor(){
        super();
        this.storage = "OBLIVION";
        this.contingency = true;
        this.dataType = ["Message"];
    }
    act(data){
        return data;
    }
}

class TriggerWatch extends AxiomTemp{
    constructor(key){
        super();
        this.storage = new key();
        this.contingency = true;
        this.dataType = ["Axiom"];
    }
    act(data){
        return data;
    }
}

class LastDamageSource extends AxiomTemp{
    constructor(entity){
        super();
        this.storage = entity;
        this.dataType = ["Creature"];
    }
    act(data){
        this.storage = data["caster"].lastDamageCulprit;
        return data;
    }
}

class VoidTargets extends AxiomTemp{
    constructor(){
        super();
    }
    act(data){
        data["targets"] = [];
        return data;
    }
}

class SoulAbsorber extends AxiomTemp{
    constructor(){
        super();
    }
    act(data){
        for (let i of data["targets"]){
            if (i.souls){
                while (i.souls.length > 0){
                    let j = i.souls[0];
                    if (!data["caster"].findFirstEmptySlot()) break;
                    j.absorbSoul(i,data["caster"]);
                    j.owner = data["caster"];
                    data["caster"].souls[data["caster"].findFirstEmptySlot()] = j;
                }
                locatePlayer();
                soulTree.updateSlots(data["caster"]);
            }
        }
        return data;
    }
}

class SoulInjector extends AxiomTemp{
    constructor(soul){
        super();
        this.storage = soul;
        this.dataType = ["Soul"];
    }

    translate(){
        if (typeof this.storage === 'string'){
            this.storage = new Soul(this.storage);
            for (let i of this.storage.loopThroughAxioms()){
                i.translate();
            }
        }

    }

    act(data){
        if (!this.storage) return data;
        if (this.storage.axioms === []) throw new Error("Axioms have been emptied.");
        for (let i of data["targets"]){
            if (i.monster && i.monster.findFirstEmptySlot()){
                let loc = i.monster.findFirstEmptySlot();
                i.monster.souls[loc] = Object.create(this.storage);
                i.monster.souls[loc].owner = i.monster;
                soulTree.updateSlots(i.monster);
            }
        }
        return data;
    }
}

class ClearPaint extends AxiomTemp{
    constructor(){
        super();
    }
    act(data){
        for (let i of data["targets"]){
            i.paint = false;
            i.tilecon.removeChild(i.paintDisplay);
        }
        return data;
    }
}

class PaintTile extends AxiomTemp{
    constructor(colour){
        super();
        this.storage = colour;
        this.dataType = ["Colour"];
    }
    act(data){
        for (let i of data["targets"]){
            i.paint = this.storage.colour;
            drawPixel(this.storage.colour,0,0,tileSize,i.tilecon);
            i.paintDisplay = i.tilecon.children[i.tilecon.children.length-1];
        }
        return data;
    }
}

class PaintFilter extends AxiomTemp{
    constructor(colour){
        super();
        this.storage = colour;
        this.dataType = ["Colour"];
    }
    act(data){
        for (let i = data["targets"].length-1; i>=0; i--){
            let r = data["targets"][i];
            if (r.paint != this.storage.colour) removeItemAll(data["targets"],r);
        }
        return data;
    }
}

class EntityFilter extends AxiomTemp{
    constructor(entity){
        super();
        this.storage = entity;
        this.dataType = ["Creature"];
    }

    translate(){
        if (!(this.storage instanceof Monster)){
            for (let i of monsters){
                if (i instanceof this.storage){
                    this.storage = i;
                    break;
                }
            }
        }
    }

    act(data){
        let newTargets = [];
        for (let i = data["targets"].length-1; i>=0; i--){
            let r = data["targets"][i];
            if (!r.monster) continue;
            else if (!(r.monster instanceof this.storage.constructor)) continue;
            else newTargets.push(r);
        }
        data["targets"] = newTargets;
        return data;
    }
}

class BooleanGate extends AxiomTemp{
    constructor(boo){
        super();
        this.storage = boo;
        this.dataType = ["Boolean"];
    }
    act(data){
        if (!this.storage) data["break"] = true;
        return data;
    }
}

class SpeciesCheck extends AxiomTemp{
    constructor(iden){
        super();
        this.storage = iden;
        this.dataType = ["Species"];
    }

    act(data){
        let check = false;
        if (data["caster"] instanceof this.storage) check = true;
        if (!check) data["break"] = true;
        return data;
    }
}

class NoTargetStop extends AxiomTemp{
    constructor(){
        super();
    }
    act(data){
        if (data["targets"].length == 0) data["break"] = true;
        return data;
    }
}

class BooleanFlip extends AxiomTemp{
    constructor(){
        super();
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        for (let i of surr) if (i.dataType.includes("Boolean")) i.storage = !i.storage;
        return data;
    }
}

class AssimilateBroadcast extends AxiomTemp{
    constructor(message){
        super();
        this.storage = message;
        this.dataType = ["Message"];
        this.surr;
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        let assi = [];
        for (let i of surr){
            i.relativeDir = [i.x-this.x, i.y-this.y];
            assi.push(i);
        }
        trigger(this.storage,assi);
        return data;
    }
}

class OverwriteSlot extends AxiomTemp{
    constructor(slot){
        super();
        this.storage = slot;
        this.dataType = ["Caste"];
        this.surr;
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        let assi = [];
        for (let i of surr){
            assi.push(i);
        }
        for (let i of data["targets"]){
            if (i.monster){
                for (let s of soulSlotNames){
                    if (s == this.storage.caste && i.monster.souls[s]){
                        for (let a of assi){
                            i.monster.souls[s].axioms[a.x][a.y] = a;
                        }
                    }
                }
            }
        }
        return data;
    }
}

class FormDir extends AxiomTemp{
    constructor(dir){
        super();
        this.storage = dir;
        this.dataType = ["Direction"];
    }

    act(data){
        const directions = {
            "N" : [0,-1],
            "W" : [-1,0],
            "E" : [1,0],
            "S" : [0,1],
        }
        data["targets"].push(getTile(data["caster"].tile.x+directions[this.storage.direction][0],data["caster"].tile.y+directions[this.storage.direction][1]));
        return data;
    }
}

class FormEntity extends AxiomTemp{
    constructor(entity){
        super();
        this.storage = entity;
        this.dataType = ["Creature","Tile"];
    }

    translate(){
        if (this.storage == "Player") this.storage = player;
    }

    act(data){
        let dest;
        if (!this.storage) return data;
        if (this.storage instanceof Tile) dest = this.storage;
        else dest = this.storage.tile;
        data["targets"].push(dest);
        if (!dest) throw new Error("An undefined tile was pushed to targets.");
        return data;
    }
}

class FormTile extends AxiomTemp{
    constructor(tile){
        super();
        this.storage = tile;
        this.dataType = ["Creature","Tile"];
    }

    translate(){
        if (this.storage == "ScarabWaypoint") this.storage = getTile(world.waypointLocation[0],world.waypointLocation[1]);
        if (this.storage instanceof Monster) this.storage = this.storage.tile;
    }

    act(data){
        if (!this.storage) return data;
        let dest = this.storage;
        data["targets"].push(dest);
        if (!dest) throw new Error("An undefined tile was pushed to targets.");
        return data;
    }
}

class MoveFunction extends AxiomTemp{
    constructor(){
        super();
    }

    act(data){
        if (data["targets"].length == 0){
            data["break"] = true;
            return data;
        }
        let targets = data["targets"].slice(0);
        targets.sort((a,b) => a.dist(data["caster"].tile) - b.dist(data["caster"].tile));
        let chosen = targets[0];
        let currentTile = data["caster"].tile;
        if (chosen === currentTile){
            data["break"] = true;
            return data;
        }
        if (Math.abs(chosen.x-currentTile.x) <= 1 && Math.abs(chosen.y-currentTile.y) <= 1 && Math.abs(chosen.x-currentTile.x) + Math.abs(chosen.y-currentTile.y) != 2){
            if (!data["caster"].tryMove(chosen.x-currentTile.x,chosen.y-currentTile.y)){
                data["break"] = true;
            }
            return data;
        }
        let path = astair(currentTile,chosen);
        if(path.length == 0){
            path = line(currentTile,chosen);
            path.shift();
        }
        let dir = [path[0].x-data["caster"].tile.x,path[0].y-data["caster"].tile.y];
        if (!data["caster"].tryMove(dir[0],dir[1])) data["break"] = true;
        return data;
    }
}

class PlusForm extends AxiomTemp{
    constructor(){
        super();
    }

    act(data){
        let caster = data["caster"];
        let newTile = caster.tile;
        const directions = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ];
        for (let i of directions){
            let tarTile = newTile.getNeighbor(i[0],i[1]);
            //tarTile.spellDirection = i;
            data["targets"].push(tarTile);
            tarTile.setEffect(14);
        }
        return data;
    }
}

class EgoForm extends AxiomTemp{
    constructor(){
        super();
    }

    act(data){
        data["targets"].push(data["caster"].tile);
        return data;
    }
}

class FailCatcher extends AxiomTemp{
    constructor(){
        super();
    }
}

class NumberIncrementer extends AxiomTemp{
    constructor(number){
        super();
        this.storage = number;
        this.dataType = ["Number"];
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        for (let i of surr) if (i.dataType.includes("Number")) i.storage += this.storage;
        return data;
    }
}

class NumberStorage extends AxiomTemp{
    constructor(number){
        super();
        this.storage = number;
        this.dataType = ["Number"];
    }
}

class ModuloGate extends AxiomTemp{
    constructor(number){
        super();
        this.storage = number;
        this.dataType = ["Number"];
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        for (let i of surr) if (i instanceof NumberStorage && i.storage%this.storage != 0){ //maybe change this to number type instead of specifically NumberStorage?
            data["break"] = true;
        }
        
        return data;
    }
}

class CloneCreature extends AxiomTemp{
    constructor(crea){
        super();
        this.storage = crea;
        this.dataType = ["Creature"];
    }

    translate(){
        if (!(this.storage instanceof Monster)){
            for (let i of monsters){
                if (i instanceof this.storage){
                    this.storage = i;
                    break;
                }
            }
        }
    }

    act(data){
        if (data["targets"].length == 0){
            data["break"] = true;
            return data;
        }
        let works = false;
        for (let i of data["targets"]){
            if (i.passable && !i.monster){
                summonMonster(i.x,i.y,this.storage);
                works = true;
            }
        }
        if (!works) data["break"] = true;
        return data;
    }
}

class DamageDealer extends AxiomTemp{
    constructor(dam){
        super();
        this.storage = dam;
        this.dataType = ["Number"];
    }
    act(data){
        for (let i of data["targets"]){
            if (i.monster) i.monster.hit(this.storage, data["caster"]);
        }
        return data;
    }
}

class HealProvider extends AxiomTemp{
    constructor(dam){
        super();
        this.storage = dam;
        this.dataType = ["Number"];
    }
    act(data){
        for (let i of data["targets"]){
            if (i.monster) i.monster.heal(this.storage, data["caster"]);
        }
        return data;
    }
}

class LinkForm extends AxiomTemp{
    constructor(link){
        super();
        this.storage = link;
        this.dataType = ["Creature"];
    }
    act(data){
        if (!this.storage){
            data["break"] = true;
            return data;
        }
        const initialPoint = data["caster"].tile;
        const finalPoint = this.storage.tile;
        const trail = line(initialPoint,finalPoint);
        removeItemAll(trail,initialPoint);
        removeItemAll(trail,finalPoint);
        let allX = true;
        let allY = true;
        let currentX = trail[0].x;
        let currentY = trail[0].y;
        for (let i of trail){
            if (i.x != currentX) allX = false;
            if (i.y != currentY) allY = false;
            data["targets"].push(i);
        }
        if (allX) for (let i of trail) i.setEffect(16);
        else if (allY) for (let i of trail) i.setEffect(15);
        else for (let i of trail) i.setEffect(14);
        return data;
    }
}





const axiomRepertoire = {
    "Forms" : [],
    "Functions" : [],
    "Contingencies" : [],
    "Mutators" : [],
}

for (let i of Object.keys(researchflags)){
    let scan = researchflags[i];
    if (scan.includes("Form")) axiomRepertoire["Forms"].push(i);
    else if (scan.includes("Contingency")) axiomRepertoire["Contingencies"].push(i);
    else if (scan.includes("Function")) axiomRepertoire["Functions"].push(i);
    else if (scan.includes("Mutator")) axiomRepertoire["Mutators"].push(i);
}

function targetBoltTravel(direction, effect, location){
    let newTile = location;
    let targets = new Set();
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        testTile.spellDirection = direction;
        targets.add(testTile);
        if(testTile.passable){
            newTile = testTile;
            if(newTile.monster) break;
            //newTile.setEffect(effect,30);
        }else{
            break;
        }
    }
    return targets;
}