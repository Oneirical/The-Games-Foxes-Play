//8ADJ - 4ADJ - RANDOM (up to power) - WALL - ALL - PAYLOAD (summon that unleashes targets on death)

class AxiomTemp{
    constructor(){
        this.contingency = false;
        this.x;
        this.y;
        this.empty = false;
        this.soul;
        this.storage = "NoStorage";
        this.nameID = this.constructor.name;
        this.dataType = [];
    }
    act(data){return data;};
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
        this.storage = key;
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
            }
        }
        locatePlayer();
        return data;
    }
}

class SoulInjector extends AxiomTemp{
    constructor(soul){
        super();
        this.storage = soul;
        this.dataType = ["Soul"];
    }
    act(data){
        if (!this.storage) return data;
        if (typeof this.storage === 'string') this.storage = new Soul(this.storage,data["caster"]);
        for (let i of data["targets"]){
            if (i.monster && i.monster.findFirstEmptySlot()){
                let loc = i.monster.findFirstEmptySlot();
                i.monster.souls[loc] = Object.create(this.storage);
                i.monster.souls[loc].owner = i.monster;
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
            i.paint = this.storage;
            drawPixel("red",0,0,tileSize,i.tilecon);
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
            if (r.paint != this.storage) removeItemAll(data["targets"],r);
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
    act(data){
        let newTargets = [];
        for (let i = data["targets"].length-1; i>=0; i--){
            let r = data["targets"][i];
            if (!r.monster) continue;
            else if (!(r.monster instanceof this.storage)) continue;
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

class IdentityCheck extends AxiomTemp{
    constructor(iden){
        super();
        this.storage = iden;
        this.dataType = ["Creature"];
    }
    act(data){
        let check = false;
        for (let i of this.storage){
            if (data["caster"] instanceof i) check = true;
        }
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
    constructor(boo){
        super();
    }
    act(data){
        let surr = this.soul.getLogicNeighbours(this,true);
        for (let i of surr) if (i instanceof BooleanGate) i.storage = !i.storage;
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
                for (let s of Object.keys(i.monster.souls)){
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
        data["targets"].push(getTile(data["caster"].tile.x+directions[this.storage][0],data["caster"].tile.y+directions[this.storage][1]));
        return data;
    }
}

class FormEntity extends AxiomTemp{
    constructor(entity){
        super();
        this.storage = entity;
        this.dataType = ["Creature","Tile"];
    }
    act(data){
        let dest;
        if (!this.storage) return data;
        if (this.storage == "Player") dest = player.tile;
        else if (this.storage instanceof Tile) dest = this.storage;
        else dest = this.storage.tile;
        data["targets"].push(dest);
        return data;
    }
}

class FormTile extends AxiomTemp{
    constructor(tile){
        super();
        this.storage = tile;
        this.dataType = ["Creature","Tile"];
    }
    act(data){
        if (this.storage == "ScarabWaypoint") this.storage = getTile(world.waypointLocation[0],world.waypointLocation[1]);
        if (this.storage instanceof Monster) this.storage = this.storage.tile;
        else if (!this.storage) return data;
        let dest = this.storage;
        data["targets"].push(dest);
        return data;
    }
}

class AxiomFunction extends AxiomTemp{
    constructor(type){
        super();
        this.type = type;
    }

    act(data){
        data = axiomEffects[this.type](data);
        return data;
    }
}

class StandardForm extends AxiomTemp{
    constructor(type){
        super();
        this.type = type;
    }

    act(data){
        data = axiomEffects[this.type](data);
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
        for (let i of surr) if (i instanceof NumberStorage) i.storage += this.storage;
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

class SummonCreature extends AxiomTemp{
    constructor(crea){
        super();
        this.storage = crea;
        this.dataType = ["Creature"];
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



axiomEffects = {

    MOVE: function(data){
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
        if(path.length == 0) return data;
        let dir = [path[0].x-data["caster"].tile.x,path[0].y-data["caster"].tile.y];
        if (!data["caster"].tryMove(dir[0],dir[1])) data["break"] = true;
        return data;
    },

    ///////////////
    //
    //   FORMS
    //
    ///////////////

    EGO: function(data){
        //data["caster"].tile.spellDirection = data["caster"].lastMove;
        data["targets"].push(data["caster"].tile);
        return data;
    },
    SMOOCH : function(data){
        let caster = data["caster"];
        let newTile = caster.tile;
        newTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        newTile.spellDirection = caster.lastMove;
        data["targets"].add(newTile);
        return data;
    },
    PLUS : function (data){
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
    },
    BEAM : function(data){
        let caster = data["caster"];
        for (let i of targetBoltTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), caster.tile)) data["targets"].add(i);
        return data;
    },
    XCROSS : function(data){
        const directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];
        let caster = data["caster"];
        for(let k=0;k<directions.length;k++){
            for (let i of targetBoltTravel(directions[k], 14, caster.tile)) data["targets"].add(i);
        }
        return data;
    },
    PLUSCROSS : function(data){
        const directions = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ];
        let caster = data["caster"];
        for(let k=0;k<directions.length;k++){
            for (let i of targetBoltTravel(directions[k], 14, caster.tile)) data["targets"].add(i);
        }
        return data;
    },

    ///////////////
    //
    //   MUTATORS
    //
    ///////////////

    DEATHCLICK : function(data){
        data["clickTrigger"] = "DEATH";
        return data;
    },

    RANDDIR : function(data){
        const directions = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ];
        for (let o of data["targets"]){
            o.spellDirection = directions[randomRange(0,3)];
        }
        return data;
    },

    SPREAD : function(data){
        let extraTar = new Set();
        let targets = data["targets"];
        for (let o of targets){
            let nei = o.getAdjacentNeighbors();
            for (let f of nei){
                extraTar.add(f);
            }
        }
        for (let o of extraTar) data["targets"].add(o);
        return data;
    },

    SACRIFICE: function(data){
        let bonus = 0;
        for (let i = 0; i<wheel.wheel.length;i++){
            if (!(wheel.wheel[i] instanceof Empty)){
                wheel.exhaustedSouls.push(wheel.wheel[i]);
                wheel.wheel[i] = new Empty();
                bonus++;
            }
        }
        data["power"] += bonus;
        return data;
    },
    JOLTZAZON: function(data){
        let targets = data["targets"];
        for (let o of targets){
            let nei = o.getAdjacentNeighbors();
            for (let f of nei){
                if (f.monster && !sameTile(f,data["caster"].tile)){
                    tiles[f.x][f.y].setEffect(32,45);
                    targets.add(f);
                }
            }
        }
        return data;
    },
    EPHEMERAL: function(data){
        data["flags"].add("ephemeral");
        return data;
    },
    BUFF: function(data){
        data["power"] += 1;
        return data;
    },
    NEUTER: function(data){
        data["power"] -= 1;
        return data;
    },
    DEVOUR: function(data){
        let targets = data["targets"];
        for (let target of targets){
            if (!target.passable && inBounds(target.x,target.y) && target.eat){
                target.replace(Floor);
                data["power"] += 1;
            }
        }
        return data;
    },

    TRAIL: function(data){
        data.flags.add("trailing");
        return data;
    },

    IGNORECASTER: function(data){
        data.flags.add("ignoreCaster");
        return data;
    },

    ///////////////
    //
    //   FUNCTIONS
    // TODO: Click, divide up aspha in "random blink" and "target casts next praxes", make gyvji react to motion instead of just doing it
    ///////////////

    ATKDELAY : function(target,power,data){
        let delayAtk = new DelayedAttack(data);
        if (target.monster){
            target.monster.storedAttack = delayAtk;
            target.monster.giveEffect("Infused",power*2,data);
        }
        return data;
    },

    CLICK : function(target,power,data){
        let trap = new ClickTrap(target,power*5,data);
        target.clickTrap = trap;
        return data;
    },

    SENET: function(target,power,data){ //if power > X, give frenzy, haste?
        if (target.monster){
            target.monster.giveEffect("Charmed",power*3,data);
        }
        return data;
    },
    ZENORIUM: function(target,power,data){
        //probably obsolete
        if (data && target.monster && target.monster.statusEff["Transformed"] == 0){
            let sample = data["targets"].slice();
            let poly = shuffle(sample).filter(t => t.monster && t.monster.name != target.monster.name)[0];
            if (!poly) return;
            let polykeys = Object.keys(poly.monster);
            let tarkeys = Object.keys(target.monster);
            let polydata = {};
            let tardata = {};
            let protection = ["spritesave","datasave", "isPlayer"];
            for (let i of polykeys)polydata[i] = poly.monster[i];
            poly.monster.datasave = polydata;
            for (let i of tarkeys) tardata[i] = target.monster[i];
            target.monster.datasave = tardata;
            for (let i of Object.keys(polydata)) if (!protection.includes(i)) target.monster[i] = polydata[i];
            for (let i of Object.keys(tardata)) if (!protection.includes(i)) poly.monster[i] = tardata[i];
            target.monster.soullink = poly.monster;
            poly.monster.soullink = target.monster;
            target.monster.giveEffect("Transformed",power*3,data);
            poly.monster.giveEffect("Transformed",power*3,data);
        }
        return data;
    },
    KASHIA: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Dissociated",power*2,data);
        }
        return data;
    },
    PARACEON: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Invincible",Math.floor(power/2),data);
        }
        return data;
    },
    STOP: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Paralyzed",power,data);
        }
        return data;
    },
    RASEL: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Puppeteered",power*2,data);
        }
        return data;
    },
    APIS: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Constricted",power,data);
        }
        return data;
    },
    HASTE: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Hasted",power,data);
        }
        return data;
    },
    HEAL: function(target,power,data){
        if (target.monster){
            target.monster.heal(power,data);
        }
        return data;
    },
    HARM: function(target,power,data){
        if (target.monster){
            target.monster.hit(power,data);
        }
        return data;
    },
    THRASH: function(target,power,data){
        if (target.monster){
            target.monster.giveEffect("Thrashing",power*2,data);
        }
        return data;
    },
    GYVJI: function(targeti,power,data){
        let newTile = targeti;
        //newTile.setEffect(14,30);
        let testTile = newTile;
        let target = testTile.monster;
        while(target){
            testTile = newTile.getNeighbor(targeti.spellDirection[0],targeti.spellDirection[0]);
            if(testTile.passable && !testTile.monster){
                newTile.setEffect(target.sprite,30);
                newTile = testTile;
            }else{
                break;
            }
        }
        if(target && target.tile != newTile){
            teleport(target,newTile,data);
            playSound("explosion");
            target.tile.setEffect(14,30);
            target.hit(power);
            if (power >= 4){
                newTile.getAllNeighbors().forEach(t => {
                    t.setEffect(14,30);
                    if(t.monster){
                        t.monster.stunned = true;
                        if (!t.monster.isPlayer) t.monster.hit(power);
                    }
                    else if(t.eat && !t.passable && inBounds(t.x, t.y)){
                        t.replace(Floor);
                    }
                });
            }
            shakeAmount = 20 + power*5;
        }
        return data;
    },
    ASPHA: function(target,power,data){ // make this random blink, then another function that casts the following praxis?
        let tper;
        if (target.monster && !target.monster.isPlayer) tper = monsters[monsters.indexOf(target.monster)];
        else if (target.monster && target.monster.isPlayer) tper = player;
        else return;
        for (let i = 0; i<power; i++){
            teleport(tper,randomPassableTile(),data);
            tper.tile.getAllNeighbors().forEach(function(t){
                t.setEffect(14, 30);
                if(t.monster){
                    t.monster.hit(1);
                }
            });
        }
        return data;
    },
    ABAZON : function(target,power,data){
        let t = target;
        let test = !t.passable && t.sprite != 17;
        if (test){
            let save = tiles[t.x][t.y];
            tiles[t.x][t.y] = new AbazonWall(t.x,t.y)
            let monster = new AbazonSummon(t,save,power*2);
            monsters.push(monster);
        }
        return data;
    },
    SUMMFELIDOL : function(target,power,data){ //scale power somehow, maybe get different felidol types (vinyl, jade...)
        let t = target;
        let test = t.passable;
        if (test){
            let monster = new Felidol(t);
            monsters.push(monster);
        }
        return data;
    },
    BLINK : function(target,power,data){
        if (!target.monster) return data;
        let newTile = target;
        let testTile = newTile;
        let affected = testTile.monster;
        let powCount = power*2;
        while(powCount > 0){
            testTile = newTile.getNeighbor(target.spellDirection[0],target.spellDirection[1]);
            powCount--;
            if(testTile.passable && !testTile.monster){
                //newTile.setEffect(affected.sprite); //this causes a strange bug where an after image stays forever
                newTile = testTile;
            }else{
                break;
            }
        }
        if(affected && affected.tile != newTile){
            teleport(affected,newTile,data);
            affected.lastMove = target.spellDirection;
        }
        return data;
    }

}

// ARTISTICMINE - LASTMOVE>RANDOMDIR - SACRIFICE (Dump wheel) - DAMPENER (reduce power, get something in exchange) - ALLOUT (lose all resolve, get power)
//

// SENET - LASHOL (status) - KILAMI (status) - GYVJI - DASH - RASEL (status) - ASPHA (tp and hit) - SUGCHA (lifesteal)
// ROSE (status) - JOLTZAZON (targets spread to adj) - HARBINGER (summon that will endlessly copy the first spell it is hit by)
// ABAZON (only wall targets affected)

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