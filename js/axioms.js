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
        this.tag = false;
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

    changeStorage(newStore){
        this.storage = newStore;
    }

    assimilateAdjacentAxioms(dataType, replacement){
        let neigh = this.soul.getLogicNeighbours(this,true);
        for (let i of neigh){
            if (i.dataType == dataType) i.changeStorage(replacement);
            else if (i instanceof AssimilationExtender) for (let j of this.soul.getLogicNeighbours(i,true)) neigh.push(j); // TODO danger: infinite loop risk if two extenders next to each other
        }
        this.soul.owner.editedData["Soul"] = true;
    }

    getAdjacentAxioms(){
        let neigh = this.soul.getLogicNeighbours(this,true);
        return neigh;
    }
}

class EmptyAxiom extends Axiom{
    constructor(){
        super();
        this.empty = true;
    }
}

class WarpEntity extends Axiom{
    constructor(){
        super();
    }
    act(data){
        let sourcePad = data.caster;
        if (!sourcePad.destination){
            data = severSynapse(data);
            return data;
        }
        let targetWorld = universe.findWorldByID(sourcePad.destination);
        let destPad = targetWorld.findTelepadByDest(world.id);
        let entities = getAllTargetedCreatures(data);
        for (let i of entities){
            if (i === player) universe.passDown(floors.indexOf(sourcePad.destination), destPad.tile.x, destPad.tile.y);
            //else i.move(getTileInUniverse(floors.indexOf(sourcePad.destination)+";"+destPad.tile.x+";"+destPad.tile.y)) // TODO currently needs work
        }
        return data;
    }
}

class AssimilationExtender extends Axiom{
    constructor(){
        super();
    }
    act(data){
        data = severSynapse(data);
        return data;
    }
}

class Connector extends Axiom{
    constructor(){
        super();
    }
    act(data){
        return data;
    }
}

class PercentChanceSever extends Axiom{
    constructor(num){
        super();
        this.storage = num;
        this.dataType = "Number";
    }
    act(data){
        if (randomRange(0, 99) <= this.storage) data = severSynapse(data);
        return data;
    }
}

class DefineIcon extends Axiom{
    constructor(icID){
        super();
        this.storage = icID;
        this.dataType = "Icon";
    }
    act(data){
        data = severSynapse(data);
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

class OpenSelf extends Axiom{
    constructor(){
        super();
    }
    act(data){
        data["caster"].openSelf();
        return data;
    }
}

class CloseSelf extends Axiom{
    constructor(){
        super();
    }
    act(data){
        data["caster"].closeSelf();
        return data;
    }
}

class OpenOther extends Axiom{
    constructor(){
        super();
    }
    act(data){
        for (let i of getAllTargetedCreatures(data)){
            i.openSelf();
        }
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

class ContinSecond extends Axiom{
    constructor(){
        super();
        this.storage = "RHYTHM";
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

class TagInjector extends Axiom{
    constructor(tag){
        super();
        this.storage = tag;
        this.dataType = "Tag";
    }

    act(data){
        let crea = getAllTargetedCreatures(data);
        for (let i of crea) i.addTag(this.storage);
        return data;
    }
}

class SoulSwapper extends Axiom{
    constructor(caste){
        super();
        this.storage = caste;
        this.dataType = "Caste";
    }

    act(data){
        let crea = getAllTargetedCreatures(data);
        let soulPool = [];
        for (let i of crea){
            soulPool.push(i.souls[this.storage]);
            i.wipeSoulAtCaste(this.storage);
        }
        if (soulPool.length != crea.length) throw new Error("Soul pool and creature pool did not match in soul swap axiom.");
        else if (soulPool.length < 2) {
            severSynapse(data);
            return data;
        }
        let index = 1;
        for (let i of crea){
            i.addSoulAtCaste(this.storage, soulPool[index]);
            index++;
            if (index == soulPool.length) index = 0;
        }
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
            target(data, i);
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
        
        this.assimilateAdjacentAxioms("Direction", finalChoice);
        return data;
    }
}

class EgoType extends Axiom{
    constructor(){
        super();
    }

    act(data){
        const self = data["caster"].numberID;
        this.assimilateAdjacentAxioms("Creature",self);
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
        
        this.assimilateAdjacentAxioms("Direction", finalChoice);
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
        let warp = [...targets].sort((a,b) => manDist(origin,a) - manDist(origin,b)).reverse();
        let entities = getAllTargetedCreatures(data);
        if (entities.length == 0) data = severSynapse(data);
        let teleported = false;
        for (let i of entities){
            for (let j of warp){
                if (i.canMove(j)){
                    teleport(i,j,data);
                    teleported = true;
                    break;
                }
            }
        }
        if (!teleported) data = severSynapse(data);
        return data;
    }
}

class GrabRandomCreature extends Axiom{ // add these on a "setting", furthest, random, closest?
    constructor(){
        super();
    }
    act(data){
        let crea = getAllTargetedCreatures(data);
        if (crea.length == 0) {
            severSynapse(data);
            return data;
        }
        let theChosen = shuffle(crea)[0];
        this.assimilateAdjacentAxioms("Creature",theChosen.numberID);
        return data;
    }
}

class SpeciesGrabber extends Axiom{
    constructor(){
        super();
    }
    act(data){
        this.assimilateAdjacentAxioms("Species",data.caster.species);
        return data;
    }
}

class AssimilateCaste extends Axiom{
    constructor(caste){
        super();
        this.storage = caste;
        this.dataType = "Caste"
    }
    act(data){
        let payload = this.getAdjacentAxioms();
        let crea = getAllTargetedCreatures(data);
        for (let i of crea){
            i.assimilateCaste(this.storage,payload);
        }
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
        nukeTargets(data);
        target(data, onlySurvivor);
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
                target(data, j);
            }
        }
        return data;
    }
}

class TargetAllOfSpecies extends Axiom{
    constructor(species){
        super();
        this.storage = species;
        this.dataType = "Species";
    }

    act(data){
        for (let i of monsters){
            if (i.species == this.storage) target(data, i.tile);
        }
        return data;
    }
}

class TargetAllAffected extends Axiom{
    constructor(){
        super();
    }
    act(data){
        const tile = data.caster.tile;
        let additions = new Set([tile]);
        let scan = new Set([tile]);
        let antiLoop = 0;
        while(scan.size > 0){
            antiLoop++;
            if (antiLoop > 2025){
                throw new Error("Infinite loop in targetallempty");
            }
            let first = getFirstItemOfSet(scan);
            let candi = first.getAdjacentAffectedNeighbors();
            for (let i of candi) if (!additions.has(i)){
                scan.add(i);
                additions.add(i);
            }
            scan.delete(first);
        }
        for (let i of additions) target(data,i);
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
                target(data, j);
            }
        }
        return data;
    }
}

class BashDir extends Axiom{
    constructor(dir){
        super();
        this.storage = dir;
        this.dataType = "Direction";
    }
    act(data){
        const bash = getAllTargetedCreatures(data);
        let success = false;
        for (let i of bash){
            success = success || i.knockback(this.storage);
        }
        if (!success) severSynapse(data);
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
            target(data, j);
        }
        return data;
    }
}

class CrossBeamTarget extends Axiom{
    constructor(){
        super();
    }
    act(data){
        for (let i of ["N","S","W","E"]){
            const beam = targetBoltTravel(i,data["caster"].tile);
            for (let j of beam) {
                target(data, j);
            }
        }
        return data;
    }
}

class TargetAllCreatures extends Axiom{
    constructor(){
        super();
    }
    act(data){
        for (let j of monsters) {
            target(data, j.tile);
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
        this.changeStorage(data["caster"].lastDamageCulprit.numberID);
        return data;
    }
}

class VoidTargets extends Axiom{
    constructor(){
        super();
    }
    act(data){
        nukeTargets(data);
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

class TwinningAssimilation extends Axiom{
    constructor(crea){
        super();
        this.storage = crea;
        this.dataType = "Creature";
    }

    act(data){
        if (typeof this.storage != "number"){
            severSynapse(data);
            return data;
        }
        let model = allCreatures[this.storage];
        for (let i of getAllTargetedCreatures(data)){
            i.changeSpecies(model.species);
            for (let j of Object.keys(i.souls)){
                i.replaceSoul(j,model.souls[j]);
            }
            i.twinTags(model.tags);
        }
        return data;
    }
}

class BreakIfNobody extends Axiom{
    constructor(){
        super();
    }
    act(data){
        let creatures = getAllTargetedCreatures(data);
        if (creatures.length === 0) severSynapse(data);
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

class NoTagFilter extends Axiom{
    constructor(tag){
        super();
        this.storage = tag;
        this.dataType = "Tag";
    }
    act(data){
        let scan = getAllTargetedCreatures(data);
        for (let i of scan){
            if (i.hasTag(this.storage)) removeItemAll(data["targets"],i.tile);
        }
        return data;
    }
}

class HasTagFilter extends Axiom{
    constructor(tag){
        super();
        this.storage = tag;
        this.dataType = "Tag";
    }
    act(data){
        let scan = getAllTargetedCreatures(data);
        for (let i of scan){
            if (!i.hasTag(this.storage)) removeItemAll(data["targets"],i.tile);
        }
        return data;
    }
}

class SpeciesFilter extends Axiom{
    constructor(species){
        super();
        this.storage = species;
        this.dataType = "Species";
    }

    act(data){
        let all = getAllTargetedCreatures(data);
        for (let i of all){
            if (i.species != this.storage) removeItemOnce(data.targets, i.tile);
        }
        return data;
    }
}

class SoulInjector extends Axiom{
    constructor(caste){
        super();
        this.storage = caste;
        this.dataType = "Caste";
    }

    act(data){
        let all = getAllTargetedCreatures(data);
        for (let i of all){
            i.addSoul(data.caster.souls[this.storage].cloneSoul());
        }
        return data;
    }
}

class SoulWipe extends Axiom{
    constructor(caste){
        super();
        this.storage = caste;
        this.dataType = "Caste";
    }

    act(data){
        let all = getAllTargetedCreatures(data);
        for (let i of all){
            i.wipeSoulAtCaste(this.storage);
        }
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
        if (!this.storage) data = severSynapse(data);
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
        if (!check) data = severSynapse(data);
        return data;
    }
}

class NoTargetStop extends Axiom{
    constructor(){
        super();
    }
    act(data){
        if (data["targets"].length == 0) data = severSynapse(data);
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
        else if (i instanceof AssimilationExtender) for (let j of this.soul.getLogicNeighbours(i,true)) surr.push(j);
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
        target(data, getTile(data["caster"].tile.x+directions[this.storage][0],data["caster"].tile.y+directions[this.storage][1]));
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
        dest = allCreatures[this.storage].tile;
        target(data, dest);
        return data;
    }
}

class FormTile extends Axiom{
    constructor(tile){
        super();
        this.storage = tile;
        this.dataType = "Tile";
    }

    act(data){
        if (!this.storage) return data;
        let dest = getTileInUniverse(this.storage);
        target(data, dest);
        if (!dest) throw new Error("An undefined tile was pushed to targets.");
        return data;
    }
}

class MoveDir extends Axiom{
    constructor(){
        super();
        this.storage = dir;
        this.dataType = "Direction";
    }
    act(data){
        if (data["targets"].length == 0){
            data = severSynapse(data);
            return data;
        }
        const directions = {
            "N" : [0,-1],
            "W" : [-1,0],
            "E" : [1,0],
            "S" : [0,1],
        }
        let oneMoveSucceeded = false;
        for (let i of getAllTargetedCreatures(data)){
            if (i.tryMove(directions[this.storage][0],directions[this.storage][1])) oneMoveSucceeded = true;
        }
        if (!oneMoveSucceeded) data = severSynapse(data);
        return data;
    }
}

class MoveFunction extends Axiom{
    constructor(){
        super();
    }

    act(data){
        if (data["targets"].length == 0){
            data = severSynapse(data);
            return data;
        }
        let targets = data["targets"].slice(0);
        targets.sort((a,b) => a.dist(data["caster"].tile) - b.dist(data["caster"].tile));
        let chosen = targets[0];
        let currentTile = data["caster"].tile;
        if (chosen === currentTile){
            data = severSynapse(data);
            return data;
        }
        else if (Math.abs(chosen.x-currentTile.x) <= 1 && Math.abs(chosen.y-currentTile.y) <= 1 && Math.abs(chosen.x-currentTile.x) + Math.abs(chosen.y-currentTile.y) != 2){
            if (!data["caster"].tryMove(chosen.x-currentTile.x,chosen.y-currentTile.y)){
                data = severSynapse(data);
            }
            return data;
        }
        else if (!data.caster.tangible){
            let here = closestTileToGoal(data.caster, data.caster.tile, chosen);
            if (!data.caster.tryMove(here.x-currentTile.x, here.y-currentTile.y)){
                data = severSynapse(data);
            }
            return data;
        }
        let path = astair(currentTile,chosen);
        if(path.length == 0){
            path = line(currentTile,chosen);
            path.shift();
        }
        let dir = [path[0].x-data["caster"].tile.x,path[0].y-data["caster"].tile.y];
        if (!data["caster"].tryMove(dir[0],dir[1])) data = severSynapse(data);
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
            target(data, tarTile);
        }
        return data;
    }
}

class EgoForm extends Axiom{
    constructor(){
        super();
    }

    act(data){
        target(data, data["caster"].tile);
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
        for (let i of surr) if (i.dataType === "Number" && i.storage && i.storage%this.storage != 0){
            data = severSynapse(data);
        }
        
        return data;
    }
}

class DialoguePrinter extends Axiom{
    constructor(spe){
        super();
        this.storage = spe;
        this.dataType = "Species";
    }
    act(data){
        if (!this.storage){
            data = severSynapse(data);
            return data;
        }
        let num = 0;
        let surr = this.soul.getLogicNeighbours(this,true);
        for (let i of surr) if (i.dataType === "Number" && i.storage){
            num += i.storage;
        }
        log.addLog(this.storage,num);
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
            data = severSynapse(data);
            return data;
        }
        const initialPoint = data["caster"].tile;
        const finalPoint = allCreatures[this.storage.numberID].tile;
        targetBetweenPoints(data, initialPoint,finalPoint);
        return data;
    }
}

class LinkAllTargets extends Axiom{
    constructor(){
        super();
    }
    act(data){
        for (let i of data.targets){
            const initialPoint = data["caster"].tile;
            const finalPoint = i;
            targetBetweenPoints(data, initialPoint,finalPoint);
        }
        return data;
    }
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
        if(testTile){
            newTile = testTile;
            targets.push(testTile)
            if(newTile.tangibleCreature) break;
        }else{
            break;
        }
    }
    return targets;
}

class Soul{
    constructor(name,owner){
        this.caste;


        this.offsetX = 0;      
        this.shattered = false;                                             
        this.offsetY = 0;
        this.spinSpeed = 0.05;
        this.x = 0;
        this.y = 0;
        this.speed = 0.01;
        this.angle = 0;

        this.contingencies = [];
        this.commands = {};
        this.axioms = [];
        this.tags = new Set();
        this.owner = owner;
        if (!this.owner) this.owner = "None";
        if (["EMPTY","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"].includes(name)) return;
        this.setUpAxioms(name);
        this.findBindings();
    }

    setUpSprites(){
        const inside = {
            "NumberIncrementer" : 67,
            "ModuloGate" : 68,
            "NumberStorage" : 69,
            "HealProvider" : 70,
            "Contingency" : 72,
            "CloneCreature" : 71,
            "Structures" : 73,
            "LinkForm" : 75,
            "Song" : 76,
            "DamageDealer" : 35,
            "Herald" : 37,
            "FormDir" : 36,
            "Turbulent" : 28,
            "FormEntity" : 13,
            "BooleanGate" : 33,
            "SpeciesCheck" : 24,
            "FormTile" : 26,
            "Security" : 1,
            "AssimilateBroadcast" : 49,
            "OverwriteSlot" : 14,
            "BooleanFlip" : 39,
            "MoveFunction" : 74,
            "NoTargetStop" : 40,
            "RadioBroadcaster" : 27,
            "SENET" : 8,
            "SoulInjector" : 29,
            "EgoForm" : 66,
            "CrossForm" : 66, // this should not be the same
            "PARACEON" : 41,
            "SMOOCH" : 17,
            "LastDamageSource" : 18,
            "PaintTile" : 30,
            "FailCatcher" : 43,
            "TriggerWatch" : 42,
            "ClearPaint" : 32,
            "VoidTargets" : 38,
            "EPSILON" : 44,
            "Brush" : 65,
            "SoulAbsorber" : 20,
            "Saintly" : 0,
            "Ordered" : 1,
            "Unhinged" : 3,
            "Feral" : 4,
            "Vile" : 5,
            "Artistic" : 2,
            "ContinKilled" : 15,
            "RadioReceiver" : 16,
            "PaintFilter" : 25,
            "EntityFilter" : 22,
            "Axioms" : 6,
            
            
            "ZENORIUM" : 65,
        }
        this.displayCon = new PIXI.Container();
        let size = 80;
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                let icon = 7;
                if (!this.axioms[i][j].empty) icon = inside[this.axioms[i][j].constructor.name];
                this.axioms[i][j].icon = icon;
                let axiom = new FoxSprite(allsprites.textures['icon'+icon]);
                axiom.eventMode = 'static';
                axiom.x = i*size+24;
                axiom.y = j*size+24;
                axiom.width = size;
                axiom.height = size;
                axiom.on('pointerdown', (event) => {
                });
                axiom.on('pointerover', (event) => {
                    app.stage.addChild(sideTooltip.displayCon);
                    sideTooltip.getDescription(this.axioms[i][j]);
                    let wai = new PIXI.filters.GlowFilter();
                    wai.outerStrength = 1;
                    axiom.filters = [wai];
                });
                axiom.on('pointerout', (event) => {
                    app.stage.removeChild(sideTooltip.displayCon);
                    axiom.filters = [];
                });
                this.displayCon.addChild(axiom);
            }
        }
    }

    setUpAxioms(name){
        let id = name;
        for (let i = 0; i<5; i++){
            this.axioms[i] = [];
            for (let j = 0; j<5; j++){
                const hai = logicMaps[id]["keys"];
                if (logicMaps[id][i][j] == ".") this.axioms[i][j] = new EmptyAxiom();
                else{
                    if (!hai[logicMaps[id][i][j]]) throw new Error("Component " + logicMaps[id][i][j] +" was not specified in rooms.js");
                    this.axioms[i][j] = Object.create(hai[logicMaps[id][i][j]]);
                }
                this.axioms[i][j].x = i;
                this.axioms[i][j].y = j;
                this.axioms[i][j].soul = this;
            }
        }
        this.setUpSprites();
    }

    cloneSoul(){
        let newSoul = new Soul("Empty",this.owner);
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                newSoul.axioms[i][j] = this.cloneAxiom(this.axioms[i][j]);
                newSoul.axioms[i][j].soul = newSoul;
            }
        }
        newSoul.setUpSprites();
        newSoul.findBindings();
        return newSoul;
    }

    loopThroughAxioms(){
        let ax = [];
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                ax.push(this.axioms[i][j]);
            }
        }
        return ax;
    }

    forceInjectAxiom(axiomType){ //modifies soul
        let emptySpace = this.findAxioms(EmptyAxiom);
        if (emptySpace.length === 0) return false;
        else{
            this.owner.editedData["Soul"] = true;
            this.axioms[emptySpace[0].x][emptySpace[0].y] = new axiomType();
            this.findBindings();
            return true;
        }
    }

    cloneAxiom(axiom){
        let clone = new axiom.constructor();
        clone.storage = axiom.storage;
        clone.x = axiom.x;
        clone.y = axiom.y;
        return clone;
    }

    swapOutAxiom(newAxiom){
        this.axioms[newAxiom.x][newAxiom.y] = this.cloneAxiom(newAxiom);
    }

    dropPayload(payload){
        for (let i of payload){
            this.swapOutAxiom(i);
        }
    }

    findAxioms(type){
        let found = [];
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                if (this.axioms[i][j] instanceof type) found.push(this.axioms[i][j]);
            }
        }
        return found;
    }

    getIconOfCommand(axiom){
        const neigh = this.getLogicNeighbours(axiom,true);
        for (let i of neigh){
            if (i instanceof DefineIcon && i.storage) return i.storage;
        }
    }

    findBindings(){
        this.contingencies = [];
        this.commands = {};
        this.tags.clear();
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                if(this.axioms[i][j].contingency) this.contingencies.push(this.axioms[i][j]);
                if(this.axioms[i][j] instanceof RadioReceiver && this.axioms[i][j].storage && this.axioms[i][j].storage.length === 1){
                    this.commands[this.axioms[i][j].storage] = this.getIconOfCommand(this.axioms[i][j]);
                }
                if (this.axioms[i][j].tag) this.tags.add(this.axioms[i][j].tag);
            }
        }
    }

    getLogicNeighbours(axiom, includeSource){
        if (!includeSource) includeSource = false;
        let results = [];
        const neig = [[0,1],[1,0],[0,-1],[-1,0]];
        for (let i of neig){
            let fou;
            if (between(axiom.x+i[0],-1,5) && between(axiom.y+i[1],-1,5)) fou = this.axioms[axiom.x+i[0]][axiom.y+i[1]];
            else continue;
            if (!fou.empty && (includeSource || !(axiom.sourceX == fou.x && axiom.sourceY == fou.y))){
                if (!includeSource){
                    fou.sourceX = axiom.x;
                    fou.sourceY = axiom.y;
                }
                results.push(fou);
            }
        }
        return results;
    }

    absorbSoul(start,destination){ // probably outdated
        this.owner.creaturecon.x = tileSize*(8+(start.x-player.tile.x));
        this.owner.creaturecon.y = tileSize*(8+(start.y-player.tile.y));
        tilesDisplay.addChild(this.owner.creaturecon);
        const destinationX = tileSize*(8+(destination.tile.x-player.tile.x));
        const destinationY = tileSize*(8+(destination.tile.y-player.tile.y));
        const oriX = this.owner.creaturecon.x;
        const oriY = this.owner.creaturecon.y;
        let source = this.owner.creaturecon;
        let wao = new PIXI.Ticker;
        wao.start();
        wao.add(() => {
            if (!approxEqual(source.x,destinationX,3) && !approxEqual(source.y,destinationY,3)){
                source.x += (destinationX - oriX)/10;
                source.y += (destinationY - oriY)/10;
            }
            else{
                tilesDisplay.removeChild(source);
                wao.destroy();
            }
        });
        removeItemOnce(start.souls,this);
    }

    checkCompatibility(sourceAxiom, destAxiom){
        let foundType;
        if (typeof sourceAxiom.storage === "boolean") foundType = "Boolean";
        else if (typeof sourceAxiom.storage === "number") foundType = "Number";
        else if (typeof sourceAxiom.storage === "string") foundType = "Message";
        else {
            let storageEquivalences = {
                "Creature" : Creature,
                "Axiom" : Axiom,
                "Soul" : Soul,
                "Colour" : Colour,
                "Direction" : Direction,
                "Tile" : Tile,
                "Caste" : Caste,
            };
            for (let i of Object.keys(storageEquivalences)){
                if (sourceAxiom.storage instanceof storageEquivalences[i]){
                    foundType = i;
                    break;
                }
            }
        }
        if (destAxiom.dataType.includes(foundType)) return true;
        else return false;
    }

    trigger(event,assi){
        let data;
        for (let i of this.contingencies) if (i.storage == event || (i.dataType.includes("Axiom") && i.storage.constructor.name == event)){
            if (assi){
                if (assi[0]["caster"]){
                    data = assi;
                }
                else for (let j of assi){
                    let studying = this.axioms[i.x+j.relativeDir[0]][i.y+j.relativeDir[1]];
                    if (this.checkCompatibility(j,studying)) studying.storage = j.storage;
                }
            }
            this.pulse(i,data);
        }
    }

    pulse(source,dataOverwrite){
        let data = [{
            "synapses" : [source],
            "targets" : [],
            "caster" : this.owner,
            "break" : false,
            "showEffects" : false,
        }];
        if (dataOverwrite){
            data = dataOverwrite;
            for (let i of data) i["synapses"] = [source];
        }
        let loopNum = 0;
        while(data.length != 0){
            loopNum++;
            if (loopNum >= 1000){
                throw new Error("Infinite loop in "+this.owner.id+".");
                break;
            }
            let currentSynapse = data[0];
            let i = currentSynapse["synapses"][0];
            currentSynapse = i.act(currentSynapse);
            currentSynapse["targets"] = [...new Set(currentSynapse["targets"])]; // remove duplicates
            //if (currentSynapse["showEffects"]) for (let i of currentSynapse["targets"]) i.setEffect(14); //TODO maybe change the effect depending on soul caste
            if (currentSynapse["showEffects"]) for (let i of currentSynapse["targets"]) queueUpEffect(i,14);
            this.owner.trigger(i.constructor.name); // for triggerwatch contingency
            let additions = [];
            let synapseEnded = false;
            for (let r of this.getLogicNeighbours(i)) if (!(r instanceof FailCatcher)) additions.push(r);
            if (additions.length == 0) synapseEnded = true;
            if (additions.length >= 1 && !currentSynapse["break"]) currentSynapse["synapses"].push(additions[0]);
            if (additions.length > 1 && !currentSynapse["break"]){
                for (let o = 1; o<additions.length; o++){
                    data.push({
                        "synapses" : [additions[o]],
                        "targets" : currentSynapse["targets"].slice(),
                        "caster" : currentSynapse["caster"],
                        "break" : currentSynapse["break"],
                    });
                }
            }
            removeItemOnce(currentSynapse["synapses"],i);
            if (currentSynapse["break"]){
                currentSynapse["synapses"] = [];
                let additionsFail = [];
                for (let r of this.getLogicNeighbours(i)) {
                    if (r instanceof FailCatcher) additionsFail.push(r);
                }
                if (additionsFail.length == 0) removeItemOnce(data,currentSynapse);
                else{
                    currentSynapse["break"] = false;
                    synapseEnded = false;
                }
                if (additionsFail.length >= 1) currentSynapse["synapses"].push(additionsFail[0]);
                if (additionsFail.length > 1){
                    for (let o = 1; o<additionsFail.length; o++){
                        data.push({
                            "synapses" : [additionsFail[o]],
                            "targets" : currentSynapse["targets"].slice(),
                            "caster" : currentSynapse["caster"],
                            "break" : currentSynapse["break"],
                        });
                    }
                }
            }
            if (synapseEnded) removeItemOnce(data,currentSynapse);
        }
    }
}