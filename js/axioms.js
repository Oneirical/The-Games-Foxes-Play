const powerRatings = {
    // "STEP" : -3,
    // "TURNEND" : -4,
    // "ATTACK" : -2,
    // "IGNORECASTER" : -2,
}

//8ADJ - 4ADJ - RANDOM (up to power) - WALL - ALL - PAYLOAD (summon that unleashes targets on death)

axiomEffects = {

    ///////////////
    //
    //   FORMS
    //
    ///////////////

    EGO: function(data){
        data["caster"].tile.spellDirection = data["caster"].lastMove;
        data["targets"].add(data["caster"].tile);
        return data;
    },
    SMOOCH : function(data){
        let caster = data["caster"];
        let newTile = caster.tile;
        newTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        newTile.spellDirection = [caster.lastMove];
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
            tarTile.spellDirection = i;
            data["targets"].add(tarTile);
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
        //console.log(power);
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