const powerratings = {
    "EGO" : 2,
    "BEAM" : 3,
    "SMOOCH" : 5,
    "XCROSS" : 2,
    "STEP" : -3,
    "TURNEND" : -4,
    "ATTACK" : -2,
    "PLUS" : 4,
}

const soulcosts = {
    "STEP" : 3,
    "TURNEND" : 4,
    "ATTACK" : 2,
}
// In the research menu, these should have "history book" descriptions.
// EGO - BEAM - PCROSS - XCROSS - 8ADJ - 4ADJ - RANDOM (up to power) - WALL - ALL - PAYLOAD (summon that unleashes targets on death)

//const baseAxioms = {
//    "Saintly" : new Axiom([],["PLUS"],[],["HEAL"],"SAINTLY",player),
//    "Ordered" : new Axiom([],["EGO"],[],["PARACEON"],"ORDERED",player),
//    "Artistic" : new Axiom([],["EGO"],["CLICK"],["???"],"ARTISTIC",player), // EGO, CLICK (should be function now) EGO, PLUSCROSS, PIERCE, HARM
//    "Unhinged" : new Axiom([],["XCROSS"],[],["HARM"],"UNHINGED",player), also add PIERCE here
//    "Feral" : new Axiom([],["EGO"],[],["DASH"],"FERAL",player), EGO, BLINK, TRAIL (new form), SPREAD (new mutator), IGNORECASTER, HARM
//    "Vile" : new Axiom([],["SMOOCH"],["ATKDELAY"],["HARM"],"VILE",player),
// TRAIL : for each target of previous praxis, draw trail between origin and current position
// SPREAD: for each target, expand to adjacent
// 
// 
//}

targeters = {
    EGO: function(caster){
        return [caster.tile];
    },
    BEAM : function(caster){
        return targetBoltTravel(caster.lastMove, 15 + Math.abs(caster.lastMove[1]), caster.tile);
    },
    XCROSS : function(caster){
        const directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];
        let targets = [];
        for(let k=0;k<directions.length;k++){
            for (let i of targetBoltTravel(directions[k], 14, caster.tile)) targets.push(i);
        }
        return targets;
    },
    SMOOCH : function(caster){
        let newTile = caster.tile;
        newTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        //newTile.setEffect(14,30);
        return [newTile];
    },
    EPSILON: function(caster){
    },
    PLUS: function(caster){
        let targets = [];
        targets.push(caster.tile);
        caster.tile.getAdjacentNeighbors().forEach(function(t){
            targets.push(t);
        });
        return targets;
    },
}

// ARTISTICMINE - LASTMOVE>RANDOMDIR - SACRIFICE (Dump wheel) - DAMPENER (reduce power, get something in exchange) - ALLOUT (lose all resolve, get power)
//

class DelayedAttack{
    constructor(entity,forms,mutators,functions,power){
        this.forms = forms.slice();
        this.mutators = mutators.slice();
        this.functions = functions.slice();
        this.power = power;
        removeItemOnce(this.mutators,"ATKDELAY");
    }
    trigger(caster){
        let blast = new Axiom([],this.forms,this.mutators,this.functions,"VILE");
        blast.legendCast(caster);
    }
}

modifiers = {
    CLICK: function(mods){
        let targets = mods["targets"];
        let functions = mods["functions"];
        let power = mods["power"];
        for (let i of targets){
            if (i.passable) {
                i.clicktrap = new ClickTrap(i,functions,power);
            }
        }
        mods["continue"] = false;
        return mods;
    },
    ATKDELAY: function(mods){
        let mutators = mods["mutators"];
        let functions = mods["functions"];
        let power = mods["power"];
        let forms = mods["forms"];
        let caster = mods["caster"];
        mods["continue"] = false;
        caster.storedattacks.push(new DelayedAttack(caster,forms,mutators,functions,power));
        return mods;
    },
    SACRIFICE: function(mods){
        let bonus = 0;
        for (let i = 0; i<wheel.wheel.length;i++){
            if (!(wheel.wheel[i] instanceof Empty)){
                wheel.exhaustedSouls.push(wheel.wheel[i]);
                wheel.wheel[i] = new Empty();
                bonus++;
            }
        }
        mods["power"] += bonus;
        return mods;
    },
    JOLTZAZON: function(mods){
        let targets = mods["targets"];
        for (let o of targets){
            let nei = o.getAdjacentNeighbors();
            for (let f of nei){
                if (f.monster && !targets.includes(f) && !sameTile(f,mods["caster"].tile)){
                    tiles[f.x][f.y].setEffect(32,45);
                    targets.push(f);
                }
            }
        }
        return mods;
    },
    EPHEMERAL: function(mods){
        mods["flags"].push("ephemeral");
        return mods;
    },
    BUFF: function(mods){
        mods["power"] += 1;
        return mods;
    },
    NEUTER: function(mods){
        mods["power"] -= 1;
        return mods;
    },
    CRIPPLE: function(mods){
        mods["power"] -= 3;
        return mods;
    },
    WEAKEN: function(mods){
        mods["power"] -= 4;
        return mods;
    },
    DEVOUR: function(mods){
        let targets = mods["targets"];
        for (let target of targets){
            if (!target.passable && inBounds(target.x,target.y) && target.eat){
                target.replace(Floor);
                mods["power"] += 1;
            }
        }
        return mods;
    },
}

// SENET - LASHOL (status) - KILAMI (status) - GYVJI - DASH - RASEL (status) - ASPHA (tp and hit) - SUGCHA (lifesteal)
// ROSE (status) - JOLTZAZON (targets spread to adj) - HARBINGER (summon that will endlessly copy the first spell it is hit by)
// ABAZON (only wall targets affected)

effects = {
    ZENORIUM: function(target,power,mods){
        if (mods && target.monster && target.monster.statuseff["Transformed"] == 0){
            let sample = mods["targets"].slice();
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
            target.monster.giveEffect("Transformed",power*3,mods);
            poly.monster.giveEffect("Transformed",power*3,mods);
        }
    },
    SENET: function(target,power,mods){ //if power > X, give frenzy, haste?
        if (target.monster){
            target.monster.giveEffect("Charm",power*3,mods);
        }
    },
    DEBUG: function(target,power,mods){ //if power > X, give frenzy, haste?
        if (target.monster){
        }
    },
    KASHIA: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Dissociated",power*2,mods);
        }
    },
    PARACEON: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Invincible",Math.floor(power/2),mods);
        }
    },
    STOP: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Paralyzed",power,mods);
        }
    },
    RASEL: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Puppeteered",power*2,mods);
        }
    },
    APIS: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Constricted",power,mods);
        }
    },
    HASTE: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Hasted",power*2,mods);
        }
    },
    HEAL: function(target,power,mods){
        if (target.monster){
            target.monster.heal(Math.floor(power/2));
        }
    },
    HARM: function(target,power,mods){
        if (target.monster){
            target.monster.hit(power);
        }
    },
    THRASH: function(target,power,mods){
        if (target.monster){
            target.monster.giveEffect("Thrashing",power*2,mods);
        }
    },
    GYVJI: function(targeti,power,mods){
        let newTile = targeti;
        //newTile.setEffect(14,30);
        let testTile = newTile;
        let target = testTile.monster;
        while(target){
            testTile = newTile.getNeighbor(player.lastMove[0],player.lastMove[1]);
            if(testTile.passable && !testTile.monster){
                newTile.setEffect(target.sprite,30);
                newTile = testTile;
            }else{
                break;
            }
        }
        if(target && target.tile != newTile){
            target.move(newTile);
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
    },
    ASPHA: function(target,power,mods){
        let tper;
        if (target.monster && !target.monster.isPlayer) tper = monsters[monsters.indexOf(target.monster)];
        else if (target.monster && target.monster.isPlayer) tper = player;
        else return;
        for (let i = 0; i<power; i++){
            tper.move(randomPassableTile());
            tper.tile.getAllNeighbors().forEach(function(t){
                t.setEffect(14, 30);
                if(t.monster){
                    t.monster.hit(1);
                }
            });
        }
    },
    ABAZON : function(target,power,mods){
        let t = target;
        let test = !t.passable && t.sprite != 17;
        if (test){
            let save = tiles[t.x][t.y];
            tiles[t.x][t.y] = new AbazonWall(t.x,t.y)
            let monster = new AbazonSummon(t,save,power*2);
            monsters.push(monster);
        }
    }
}

const axiomRepertoire = {
    "Forms" : Object.keys(targeters),
    "Functions" : Object.keys(effects),
    "Contingencies" : ["STEP","TURNEND","ATTACK"],
    "Mutators" : Object.keys(modifiers),
}

function targetBoltTravel(direction, effect, location){
    let newTile = location;
    let targets = [];
    while(true){
        let testTile = newTile.getNeighbor(direction[0], direction[1]);
        targets.push(testTile);
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