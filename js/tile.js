class Tile{
    constructor(x, y, sprite, passable){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
        this.eat = true;
        this.cuff = false;
        this.trap = false;
        this.eviltrap = false;
        this.siphon = false;
        this.pin = false;
    }

    replace(newTileType){
        tiles[this.x][this.y] = new newTileType(this.x, this.y);
        return tiles[this.x][this.y];
    }

    //formule de distance merci discord
    dist(other){
        return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
    }

    getNeighbor(dx, dy){
        return getTile(this.x + dx, this.y + dy)
    }

    getAdjacentNeighbors(){
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ]);
    }

    getLateralNeighbors(){
        return shuffle([
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ]);
    }

    getAllNeighbors(){
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0),
            this.getNeighbor(1, 1),
            this.getNeighbor(-1, -1),
            this.getNeighbor(-1, 1),
            this.getNeighbor(1, -1),
        ]);
    }

    getAdjacentPassableNeighbors(){
        return this.getAdjacentNeighbors().filter(t => t.passable);
    }

    getAdjacentEmptyNeighbors(){
        return this.getAdjacentNeighbors().filter(t => !t.monster);
    }

    getAdjacentPassableEmptyNeighbors(){
        return (this.getAdjacentNeighbors().filter(t => !t.monster)).filter(t => t.passable);
    }

    getConnectedTiles(){
        let connectedTiles = [this];
        let frontier = [this];
        while(frontier.length){
            let neighbors = frontier.pop()
                                .getAdjacentPassableNeighbors()
                                .filter(t => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        return connectedTiles;
    }

    draw(){
        drawSprite(this.sprite, this.x, this.y);

        if(this.trap){                      
            drawSprite(12, this.x, this.y);
            this.lore = description["Mine"];
            this.name = "Regret-Powered Mine (friendly)";
        }
        if(this.cuff){
            drawSprite(42,this.x, this.y);
            this.lore = description["Bundle"];
            this.name = "Bundle-of-Paws";
        }
        if (this.eviltrap){
            drawSprite(46,this.x, this.y);
            this.lore = description["HMine"];
            this.name = "Regret-Powered Mine (hostile)";
        }
        if (this.siphon){
            drawSprite(50,this.x, this.y);
            this.lore = description["Siphon"];
            this.name = "Soul Siphon";
        }
        if (this.pin){
            drawSprite(51,this.x, this.y);
            this.lore = description["Pinwheel"];
            this.name = "Folded Pinwheel";
        }
        if (this.flufftrap){
            drawSprite(69,this.x,this.y);
            this.lore = description["FluffTrap"];
            this.name = "Harmonic Audioplate";
        }
        if (this instanceof Floor && !(this.trap || this.cuff || this.eviltrap || this.siphon || this.pin)){
            this.lore = description["Floor"];
            this.name = "Eroded Floortiles";
        }

        if(this.effectCounter){                    
            this.effectCounter--;
            ctx.globalAlpha = this.effectCounter/30;
            drawSprite(this.effect, this.x, this.y);
            ctx.globalAlpha = 1;
        }
    }

    setEffect(effectSprite, time){                                  
        this.effect = effectSprite;
        this.effectCounter = time;
    }
}

class Floor extends Tile{
    constructor(x,y){
        super(x, y, 2, true);
        this.lore = description["Floor"];
        this.name = "Eroded Floortiles";
    };

    stepOn(monster){
        let trapsafe = true;
        if (monster.isPlayer){
            trapsafe = player.activemodule != "Hover";
        }
        if (monster.isPlayer && (this.pin || this.eviltrap || this.cuff) && !trapsafe){
            if (!player.consumeCommon(1,false)) {
                message = "FluffyInsufficientPower";
                player.activemodule = "NONE";
                playSound("off");
                trapsafe = true;
            }
        }
        if((!monster.isPlayer&&!monster.charmed)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if((!monster.isPlayer&&!monster.charmed&&!monster.permacharm)&& this.flufftrap){
            this.flufftrap = false;
            let fluffy = new BattleFluffy(monster.tile);
            removeItemOnce(monsters, monster);
            monsters.push(fluffy);
            playSound("treasure");      
        }
        if (monster.isPlayer && this.cuff && trapsafe){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.charmed) && this.eviltrap && trapsafe){
            playSound("fail");
            spells["ARTTRIGGER"](monster.tile);
            this.eviltrap = false;
        }
        if ((monster.isPlayer) && this.pin && trapsafe){
            playSound("fail");
            for (let x of monsters){
                if (x instanceof Weaver){
                    x.enraged = true;
                    x.isPassive = false;
                }
            }
            this.pin = false;
        }
    }
}

class Platform extends Floor{
    constructor(x,y){
        super(x, y, 57, true);
        this.lore = description["Floor"]; //todo
        this.name = "Eroded Floortiles";
        this.sprite = 57;
    };
}

class Ladder extends Floor{
    constructor(x,y){
        super(x, y, 58, true);
        this.lore = description["Floor"]; //todo
        this.name = "Eroded Floortiles";
        this.sprite = 58;
    };
}

class Goop extends Tile{
    constructor(x,y){
        super(x, y, 60, true);
        this.lore = description["Glamour"];
        this.name = "Glamorous Toxin";
        this.sprite = 60;
    };
    stepOn(monster){
        if((!monster.isPlayer&&!monster.charmed)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.charmed) && this.eviltrap){
            playSound("fail");
            spells["ARTTRIGGER"](monster.tile);
            this.eviltrap = false;
        }
        if ((monster.isPlayer) && this.pin){
            playSound("fail");
            for (let x of monsters){
                if (x instanceof Weaver){
                    x.enraged = true;
                    x.isPassive = false;
                }
            }
            this.pin = false;
        }
    }
}


class Wall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
        this.lore = description["Barrier"];
        this.name = "Apocalypse Barrier";
    };

    stepOn(monster){
    }
}

class AbazonWall extends Tile{
    constructor(x,y){
        super(x, y, 2, false);
        this.lore = description["Abazon"];
        this.name = "Terracotta Sentry";
        this.eat = false;
    };

    stepOn(monster){
    }
}

class RoseWall extends Wall{
    constructor(x,y){
        super(x, y, 55, false);
        this.lore = description["Roseic"];
        this.name = "Roseic Blowglass";
        this.eat = false;
        this.sprite = 55;
    };

    stepOn(monster){
    }
}

class BExit extends Tile{
    constructor(x,y){
        super(x, y, 17, false);
        this.lore = description["Seal"];
        this.name = "Soulsteel Seal";
        this.eat = false;
    }
}

class TermiWall extends Wall{
    constructor(x, y){
        super(x, y, 37, false);
        this.lore = description["Circuit"];
        this.name = "Tangled Circuits";
        this.sprite = 37;
    }
}

class RealityWall extends Wall{
    constructor(x, y){
        super(x, y, 56, false);
        this.lore = description["Reality"];
        this.name = "Nonexistent Nullspace";
        this.sprite = 56;
    }
}

class Exit extends Tile{
    constructor(x, y){
        super(x, y, 11, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
    }

    stepOn(monster){
        if(monster.isPlayer){

            playSound("newLevel"); 
            if(level == numLevels){
                player.inventory = [];
                addScore(score, true); 
                showTitle();
            }else{
                level++;
                for(let i=0;i<player.inhand.length;i++){
                    player.discard.push(player.inhand[i]);
                }
                for(let i=0;i<player.saved.length;i++){
                    player.discard.push(player.saved[i]);
                }
                invsave = player.inventory;
                dissave = player.discard;
                pauseSound("harmony2");
                startLevel(Math.min(maxHp, player.hp+2));
                sacritotal = "nan";
                rerolled = false;
                gameState = "running";
                sacrifice = 0;
                rolled = 0;
                rosetoxin = 0;
                if (level == 17 && area == "Faith"){
                    message = "EpsilonWelcome1";
                }
            }
        }
    }
}

class TermiExit extends Exit{
    constructor(x, y){
        super(x, y, 38, true);
        this.lore = description["TermiSeal"];
        this.name = "Hydraulic Gate";
        this.sprite = 38;
    }

    stepOn(monster){
        pauseAllMusic();
        super.stepOn(monster);
    }

}

class FluffExit extends Exit{
    constructor(x, y){
        super(x, y, 23, true);
        this.lore = description["HarmonicSeal"];
        this.name = "Harmonic Seal";
        this.sprite = 23;
    }

    stepOn(monster){
        super.stepOn(monster);
        message = "FluffyWelcome";
        gameState = "fluffy";

    }
}

class Booster extends Exit{
    constructor(x, y){
        super(x, y, 59, true);
        this.lore = description["HarmonicSeal"];
        this.name = "Harmonic Seal";
        this.sprite = 59;
    }
    stepOn(monster){
        areachange = false;
        super.stepOn(monster);
        if (level % 5 == 1 && level > 5) message= "FluffyWorkshop";
    }
}


class PosAltar extends Tile{
    constructor(x,y){
        super(x, y, 2, true); //30
        this.value = "";
        this.name = "Positive Harmonic Relay";
        this.lore = description["PosRelay"];
    }
    stepOn(monster){

    }
}

class NegAltar extends Tile{
    constructor(x,y){
        super(x, y, 2, true); //31
        this.name = "Negative Harmonic Relay";
        this.lore = description["NegRelay"];
        this.value = "";
    }
    stepOn(monster){
    }
}

class BetAltar extends Tile{
    constructor(x,y){
        super(x, y, 43, true); 
        this.name = "Soulscribe";
        this.lore = description["Soulscribe"];
        this.value = "";
    }
    stepOn(monster){
    }
}

class RoseThrone extends Wall{
    constructor(x, y){
        super(x, y, 61, false);
        this.lore = description["Rose"];
        this.name = "Rose, Last of the Saints";
        this.sprite = 61;
    }
}

class SereneThrone extends Wall{
    constructor(x, y){
        super(x, y, 26, false);
        this.lore = description["Harmonizer"];
        this.name = "Serene Harmonizer";
        this.sprite = 26;
    }
}

class RoseServant extends Wall{
    constructor(x, y){
        super(x, y, 62, false);
        this.lore = description["RoseS"];
        this.name = "Tangled Servitor";
        this.sprite = 62;
    }
}

class RoseSpawner extends Tile{
    constructor(x, y){
        super(x, y, 63, true);
        this.lore = description["RoseSpawn"];
        this.name = "Aleatory Teleconstructor";
        this.sprite = 63;
    }
    stepOn(monster){
        if((!monster.isPlayer&&!monster.charmed)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.charmed) && this.eviltrap){
            playSound("fail");
            spells["ARTTRIGGER"](monster.tile);
            this.eviltrap = false;
        }
        if ((monster.isPlayer) && this.pin){
            playSound("fail");
            for (let x of monsters){
                if (x instanceof Weaver){
                    x.enraged = true;
                    x.isPassive = false;
                }
            }
            this.pin = false;
        }
    }
}

class Mobilizer extends Tile{
    constructor(x, y){
        super(x, y, 75, true);
        this.lore = description["Mobilizer"];
        this.name = "Automaton Mobilizer";
        this.sprite = 75;
    }
    stepOn(monster){
        if((!monster.isPlayer&&!monster.charmed)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.charmed) && this.eviltrap){
            playSound("fail");
            spells["ARTTRIGGER"](monster.tile);
            this.eviltrap = false;
        }
        if ((monster.isPlayer) && this.pin){
            playSound("fail");
            for (let x of monsters){
                if (x instanceof Weaver){
                    x.enraged = true;
                    x.isPassive = false;
                }
            }
            this.pin = false;
        }
    }
}