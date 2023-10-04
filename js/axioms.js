class Axiom{
    constructor(){
        this.contingency = false;
        this.x;
        this.y;
        this.empty = false;
        this.soul;
        this.storage;
        this.nameID = this.constructor.name;
        this.dataType = false;
    }
    act(data){return data;};

    //message: string
    //axiom: string
    //creature: number
    //colour: string
    //boolean: boolean
    //species: string
    //caste: string
    //direction: NSWE
    //tile: number/string

    translate(){};
}

class EmptyAxiom extends Axiom{
    constructor(){
        super();
        this.empty = true;
    }
}

class RealityAnchor extends Axiom{
    constructor(){
        super();
    }
    act(data){
        data["break"] = true;
        return data;
    }
}

class ShowEffects extends Axiom{
    constructor(){
        super();
    }
    act(data){
        data["showEffects"] = true;
        return data;
    }
}

class RadioBroadcaster extends Axiom{
    constructor(message){
        super();
        this.storage = message;
        this.dataType = "Message";
    }
    act(data){
        trigger(this.storage);
        return data;
    }
}

class RadioReceiver extends Axiom{
    constructor(key){
        super();
        this.storage = key;
        this.contingency = true;
        this.dataType = "Message";
    }
    act(data){
        return data;
    }
}

class ContinKilled extends Axiom{
    constructor(){
        super();
        this.storage = "OBLIVION";
        this.contingency = true;
        this.dataType = "Message";
    }
    act(data){
        return data;
    }
}

class TriggerWatch extends Axiom{
    constructor(key){
        super();
        this.storage = key;
        this.contingency = true;
        this.dataType = "Axiom";
    }
    act(data){
        return data;
    }
}

class MomentumTarget extends Axiom{
    constructor(){
        super();
    }
    act(data){
        const motion = data["caster"].lastMotion;
        const startTile = data["caster"].tile;
        const endTile = getTile(startTile.x + motion[0], startTile.y + motion[1]);
        const trail = line(startTile,endTile);
        removeItemOnce(trail,startTile);
        for (let i of trail){
            data["targets"].push(i);
        }
        return data;
    }
}

class DirectionFromMotion extends Axiom{
    constructor(){
        super();
    }

    act(data){
        const motion = data["caster"].lastMotion;
        const difX = motion[0];
        const difY = motion[1];
        let finalChoice;

        if (difX > 0 && difX > Math.abs(difY)) finalChoice = "E";
        else if (difY > 0 && difY > Math.abs(difX)) finalChoice = "S";
        else if (difX < 0 && Math.abs(difX) > Math.abs(difY)) finalChoice = "W";
        else if (difY < 0 && Math.abs(difY) > Math.abs(difX)) finalChoice = "N";
        else finalChoice = shuffle(["N","S","W","E"])[0]; // kind of cringe, may rework
        
        const neigh = this.soul.getLogicNeighbours(this,true);
        for (let i of neigh){
            if (i.dataType == "Direction") i.storage = finalChoice;
        }
        return data;
    }
}

class DirectionExtractor extends Axiom{
    constructor(){
        super();
    }

    act(data){
        let difX = 0;
        let difY = 0;
        const casterTile = data["caster"].tile;
        let finalChoice;
        for (let i of data["targets"]){
            difX += i.x - casterTile.x;
            difY += i.y - casterTile.y;
        }
        if (difX > 0 && difX > Math.abs(difY)) finalChoice = "E";
        else if (difY > 0 && difY > Math.abs(difX)) finalChoice = "S";
        else if (difX < 0 && Math.abs(difX) > Math.abs(difY)) finalChoice = "W";
        else if (difY < 0 && Math.abs(difY) > Math.abs(difX)) finalChoice = "N";
        else finalChoice = shuffle(["N","S","W","E"])[0]; // kind of cringe, may rework
        
        const neigh = this.soul.getLogicNeighbours(this,true);
        for (let i of neigh){
            if (i.dataType == "Direction") i.storage = finalChoice;
        }
        return data;
    }
}

class WarpCloseAway extends Axiom{
    constructor(){
        super();
    }
    act(data){
        const targets = data["targets"];
        const origin = data["caster"].tile;
        let entities = [...targets].sort((a,b) => manDist(origin,a) - manDist(origin,b));
        let warp = [...entities];
        warp.reverse();
        entities = entities.filter((a) => a.monster);
        if (entities.length == 0) data["break"] = true;
        let teleported = false;
        for (let i of entities){
            for (let j of warp){
                if (j.isEmpty()){
                    teleport(i.monster,j,data);
                    teleported = true;
                    break;
                }
            }
        }
        if (!teleported) data["break"] = true;
        return data;
    }
}

class FurthestFilter extends Axiom{
    constructor(){
        super();
    }
    act(data){
        const targets = data["targets"];
        let entities = [...targets].sort((a,b) => manDist(origin,a) - manDist(origin,b));
        entities.reverse();
        let onlySurvivor = entities[0];
        data["targets"] = [onlySurvivor];
        return data;
    }
}

class ExpandTargets extends Axiom{
    constructor(){
        super();
    }
    act(data){
        const originalTargets = [...data["targets"]];
        for (let i of originalTargets){
            const boom = i.getAllNeighbors();
            for (let j of boom){
                data["targets"].push(j);
            }
        }
        return data;
    }
}

class TargetsDirectionalBeam extends Axiom{
    constructor(dir){
        super();
        this.storage = dir;
        this.dataType = "Direction";
    }
    act(data){
        const originalTargets = [...data["targets"]];
        for (let i of originalTargets){
            const beam = targetBoltTravel(this.storage,i);
            for (let j of beam) {
                data["targets"].push(j);
            }
        }
        return data;
    }
}

class BeamFromCaster extends Axiom{
    constructor(dir){
        super();
        this.storage = dir;
        this.dataType = "Direction";
    }
    act(data){
        const beam = targetBoltTravel(this.storage,data["caster"].tile);
        for (let j of beam) {
            data["targets"].push(j);
        }
        return data;
    }
}

class LastDamageSource extends Axiom{
    constructor(entity){
        super();
        this.storage = entity;
        this.dataType = "Creature";
    }
    act(data){
        this.storage = data["caster"].lastDamageCulprit.numberID;
        return data;
    }
}

class VoidTargets extends Axiom{
    constructor(){
        super();
    }
    act(data){
        data["targets"] = [];
        return data;
    }
}

class EgoFilter extends Axiom{
    constructor(){
        super();
    }
    act(data){
        removeItemOnce(data["targets"], data["caster"].tile);
        return data;
    }
}

class ScreenShake extends Axiom{
    constructor(num){
        super();
        this.storage = num;
        this.dataType = "Number";
    }
    act(data){
        shakeAmount += this.storage;
        return data;
    }
}

class SoulAbsorber extends Axiom{
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
                if (soulTree.trackedEntity === data["caster"]) soulTree.updateSlots(data["caster"]);
            }
        }
        return data;
    }
}

class SoulInjector extends Axiom{
    constructor(soul){
        super();
        this.storage = soul;
        this.dataType = "Soul";
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
        if (this.storage.axioms == []) throw new Error("Axioms have been emptied.");
        for (let i of data["targets"]){
            if (i.monster && i.monster.findFirstEmptySlot()){
                let loc = i.monster.findFirstEmptySlot();
                i.monster.souls[loc] = Object.create(this.storage);
                i.monster.souls[loc].owner = i.monster;
                if (soulTree.trackedEntity === i.monster) soulTree.updateSlots(i.monster);
            }
        }
        return data;
    }
}

class ClearPaint extends Axiom{
    constructor(){
        super();
    }
    act(data){
        for (let i of data["targets"]){
            i.paint = false;
            i.tileCon.removeChild(i.paintDisplay);
        }
        return data;
    }
}

class PaintTile extends Axiom{
    constructor(colour){
        super();
        this.storage = colour;
        this.dataType = "Colour";
    }
    act(data){
        for (let i of data["targets"]){
            i.paint = this.storage;
            drawPixel(this.storage,0,0,tileSize,i.tileCon);
            i.paintDisplay = i.tileCon.children[i.tileCon.children.length-1];
        }
        return data;
    }
}

class PaintFilter extends Axiom{
    constructor(colour){
        super();
        this.storage = colour;
        this.dataType = "Colour";
    }
    act(data){
        for (let i = data["targets"].length-1; i>=0; i--){
            let r = data["targets"][i];
            if (r.paint != this.storage) removeItemAll(data["targets"],r);
        }
        return data;
    }
}

class SpeciesFilter extends Axiom{
    constructor(entity){
        super();
        this.storage = entity;
        this.dataType = "Species";
    }

    act(data){
        let newTargets = [];
        for (let i = data["targets"].length-1; i>=0; i--){
            let r = data["targets"][i];
            if (!r.monster) continue;
            else if (r.monster.species != this.storage) continue;
            else newTargets.push(r);
        }
        data["targets"] = newTargets;
        return data;
    }
}

class BooleanGate extends Axiom{
    constructor(boo){
        super();
        this.storage = boo;
        this.dataType = "Boolean";
    }
    act(data){
        if (!this.storage) data["break"] = true;
        return data;
    }
}

class SpeciesCheck extends Axiom{
    constructor(iden){
        super();
        this.storage = iden;
        this.dataType = "Species";
    }

    act(data){
        let check = false;
        if (data["caster"].species == this.storage) check = true;
        if (!check) data["break"] = true;
        return data;
    }
}

class NoTargetStop extends Axiom{
    constructor(){
        super();
    }
    act(data){
        if (data["targets"].length == 0) data["break"] = true;
        return data;
    }
}

class BooleanFlip extends Axiom{
    constructor(){
        super();
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        for (let i of surr) if (i.dataType == "Boolean") i.storage = !i.storage;
        return data;
    }
}

class AssimilateBroadcast extends Axiom{
    constructor(message){
        super();
        this.storage = message;
        this.dataType = "Message";
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

class OverwriteSlot extends Axiom{
    constructor(slot){
        super();
        this.storage = slot;
        this.dataType = "Caste";
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
                    if (s == this.storage && i.monster.souls[s]){
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

class FormDir extends Axiom{
    constructor(dir){
        super();
        this.storage = dir;
        this.dataType = "Direction";
    }

    act(data){
        const directions = {
            "N" : [0,-1],
            "W" : [-1,0],
            "E" : [1,0],
            "S" : [0,1],
        }
        data["targets"].push(getTile(data["caster"].tile.x+directions[this.storage][0],data["caster"].tile.y+directions[this.storage][1]));
        return data;
    }
}

class FormEntity extends Axiom{
    constructor(entity){
        super();
        this.storage = entity;
        this.dataType = "Creature";
    }

    act(data){
        let dest;
        if (!this.storage) return data;
        dest = allCreatures[this.storage.numberID].tile;
        data["targets"].push(dest);
        if (!dest) throw new Error("An undefined tile was pushed to targets.");
        return data;
    }
}

class FormTile extends Axiom{
    constructor(tile){
        super();
        this.storage = tile;
        this.dataType = "Tile";
    }

    translate(){
        if (this.storage == "ScarabWaypoint") this.storage = world.layer+";"+world.waypointLocation[0]+";"+world.waypointLocation[1];
    }

    act(data){
        if (!this.storage) return data;
        let dest = getTileInUniverse(this.storage);
        data["targets"].push(dest);
        if (!dest) throw new Error("An undefined tile was pushed to targets.");
        return data;
    }
}

class MoveFunction extends Axiom{
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

class PlusForm extends Axiom{
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
        }
        return data;
    }
}

class EgoForm extends Axiom{
    constructor(){
        super();
    }

    act(data){
        data["targets"].push(data["caster"].tile);
        return data;
    }
}

class FailCatcher extends Axiom{
    constructor(){
        super();
    }
}

class NumberIncrementer extends Axiom{
    constructor(number){
        super();
        this.storage = number;
        this.dataType = "Number";
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        for (let i of surr) if (i.dataType == "Number") i.storage += this.storage;
        return data;
    }
}

class NumberStorage extends Axiom{
    constructor(number){
        super();
        this.storage = number;
        this.dataType = "Number";
    }
}

class ModuloGate extends Axiom{
    constructor(number){
        super();
        this.storage = number;
        this.dataType = "Number";
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        for (let i of surr) if (i instanceof NumberStorage && i.storage%this.storage != 0){ //maybe change this to number type instead of specifically NumberStorage?
            data["break"] = true;
        }
        
        return data;
    }
}

class CloneCreature extends Axiom{ //unused for now
    constructor(crea){
        super();
        this.storage = crea;
        this.dataType = "Creature";
    }

    act(data){
        if (data["targets"].length == 0){
            data["break"] = true;
            return data;
        }
        let works = false;
        for (let i of data["targets"]){
            if (i.passable && !i.monster){
                summonCreature(i.x,i.y,this.storage);
                works = true;
            }
        }
        if (!works) data["break"] = true;
        return data;
    }
}


class SummonCreature extends Axiom{
    constructor(crea){
        super();
        this.storage = crea;
        this.dataType = "Species";
    }

    act(data){
        if (data["targets"].length == 0){
            data["break"] = true;
            return data;
        }
        let works = false;
        for (let i of data["targets"]){
            if (i.passable && !i.monster){
                summonCreature(i.x,i.y,this.storage);
                works = true;
            }
        }
        if (!works) data["break"] = true;
        return data;
    }
}

class DamageDealer extends Axiom{
    constructor(dam){
        super();
        this.storage = dam;
        this.dataType = "Number";
    }
    act(data){
        for (let i of data["targets"]){
            if (i.monster) i.monster.hit(this.storage, data["caster"]);
        }
        return data;
    }
}

class HealProvider extends Axiom{
    constructor(dam){
        super();
        this.storage = dam;
        this.dataType = "Number";
    }
    act(data){
        for (let i of data["targets"]){
            if (i.monster) i.monster.heal(this.storage, data["caster"]);
        }
        return data;
    }
}

class LinkForm extends Axiom{
    constructor(link){
        super();
        this.storage = link;
        this.dataType = "Creature";
    }
    act(data){
        if (!this.storage){
            data["break"] = true;
            return data;
        }
        const initialPoint = data["caster"].tile;
        const finalPoint = allCreatures[this.storage.numberID].tile;
        const trail = line(initialPoint,finalPoint);
        removeItemOnce(trail,initialPoint);
        removeItemOnce(trail,finalPoint);
        let allX = true;
        let allY = true;
        let currentX = trail[0].x;
        let currentY = trail[0].y;
        for (let i of trail){
            if (i.x != currentX) allX = false;
            if (i.y != currentY) allY = false;
            data["targets"].push(i);
        }
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

function targetBoltTravel(direction, location){
    let newTile = location;
    let targets = [];
    const eqs = {
        "N" : [0,-1],
        "W" : [-1,0],
        "E" : [1,0],
        "S" : [0,1],
    }
    direction = eqs[direction];
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        if(testTile && testTile.passable){
            newTile = testTile;
            if(newTile.monster) break;
            else targets.push(testTile);
        }else{
            break;
        }
    }
    return targets;
}