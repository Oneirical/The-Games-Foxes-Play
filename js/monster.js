class Creature{
    constructor(tile, species){
        this.sprite = speciesData[species]["sprite"];
        this.species = species;
        this.hp = speciesData[species]["hp"];
        this.numberID = creaturesCreated;
        creaturesCreated++;
        allCreatures.push(this);

        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.souls = {
            "SAINTLY" : false,
            "ORDERED" : false,
            "ARTISTIC" : false,
            "UNHINGED" : false,
            "FERAL" : false,
            "VILE" : false,
        };
        for (let i of Object.keys(speciesData[species]["souls"])){
            this.souls[i] = speciesData[species]["souls"][i];
        }
        if (creaturePresentation[this.species]) this.lore = creaturePresentation[this.species]["lore"];
        if (creaturePresentation[this.species]) this.name = creaturePresentation[this.species]["name"];
        this.lastMotion = [0, 0];
        this.move(tile);
        if (speciesData[species]["intangible"]) this.tangible = false;
        else this.tangible = true;
    }

    trigger(event,assi){
        for (let j of this.loopThroughSouls()){
            if (j instanceof Soul) j.trigger(event,assi);
        }
    }

    getSouls(){
        let souls = [];
        for (let i of Object.keys(this.souls)) souls.push(this.souls[i]);
        return souls;
    }

    hasTaggedSoul(tag){
        let souls = this.getSouls();
        for (let i of souls) if (i instanceof Soul && i.tags.has(tag)) return true;
        return false;
    }

    addSoulAtCaste(caste, soul){
        this.souls[caste] = soul;
        if (this === player) wheel.getMacros(); // TODO add a master "update soul stuff" function with getmacros, get new bindings, etc?
    }
    
    addSoul(soul){
        this.addSoulAtCaste(this.findFirstEmptySlot(), soul);
    }

    forceInjectAxiom(axiomType){
        let souls = this.getSouls();
        for (let i of souls) if (i && i.forceInjectAxiom(axiomType)) return true;
        return false;
    }

    setUpAnimation(){
        if (this.animationTick) this.animationTick.destroy();
        this.animationTick = new PIXI.Ticker;
        this.animationTick.start();
        animationTick.add(() => {
            if (this.offsetX != 0 || this.offsetY != 0){
                //this.anispeed = 0.01;
                if (player === this){
                    this.animating = true;
                    if (this.offsetX == this.originalOffsetX) this.offsetX = 0;
                    if (this.offsetY == this.originalOffsetY) this.offsetY = 0;
                    if (this.originalOffsetX >= 0) this.offsetX = Math.min(this.offsetX + this.anispeed,this.originalOffsetX);
                    else this.offsetX = Math.max(this.offsetX - this.anispeed,this.originalOffsetX);
                    if (this.originalOffsetY >= 0) this.offsetY = Math.min(this.offsetY + this.anispeed,this.originalOffsetY);
                    else this.offsetY = Math.max(this.offsetY - this.anispeed,this.originalOffsetY);
                    tilesDisplay.projectorDisplay.x = -448+(this.offsetX*tileSize);
                    tilesDisplay.projectorDisplay.y = -448+(this.offsetY*tileSize);
                    tilesDisplay.creatureDisplay.x = -448+(this.offsetX*tileSize);
                    tilesDisplay.creatureDisplay.y = -448+(this.offsetY*tileSize);
                    if (this.offsetX == this.originalOffsetX && this.offsetY == this.originalOffsetY){
                        this.animating = false;
                        this.offsetX = 0;
                        this.offsetY = 0;
                        this.originalOffsetX = 0;
                        this.originalOffsetY = 0;
                        tickProjectors();
                        tilesDisplay.projectorDisplay.x = -448;
                        tilesDisplay.projectorDisplay.y = -448;
                        tilesDisplay.creatureDisplay.x = -448;
                        tilesDisplay.creatureDisplay.y = -448;
                        if (!universe.zooming && this.tile instanceof CenterTeleport){
                            let targetWorld = universe.findWorldByID(this.tile.destination);
                            let destPad = targetWorld.findTelepadByDest(world.id);
                            universe.passDown(floors.indexOf(this.tile.destination), destPad.x, destPad.y);
                        } // if you hold down the key on top of a pad you can pass through it, fix to prevent abuse or funny?
                    }
                }
                else if (!player.animating || this.partOfPlayer){
                    if (this.offsetX >= 0) this.offsetX = Math.max(this.offsetX - this.anispeed,0);
                    else this.offsetX = Math.min(this.offsetX + this.anispeed,0);
                    if (this.offsetY >= 0) this.offsetY = Math.max(this.offsetY - this.anispeed,0);
                    else this.offsetY = Math.min(this.offsetY + this.anispeed,0);
                    this.creaturecon.x = this.creaturecon.originalX + this.offsetX*tileSize;
                    this.creaturecon.y = this.creaturecon.originalY + this.offsetY*tileSize;
                    if (this.partOfPlayer){
                        if (this.offsetX > 0) this.creaturecon.x -= 64;
                        else if (this.offsetX < 0) this.creaturecon.x += 64;
                        if (this.offsetY > 0) this.creaturecon.y -= 64;
                        else if (this.offsetY < 0) this.creaturecon.y += 64;
                    }
                    tickProjectors();
                }

            }
        });
    }

    setUpSprite(){
        this.creaturecon = new PIXI.Container();
        if (this === player){
            this.creaturecon.x = 8*tileSize;
            this.creaturecon.y = 8*tileSize;
        }
        let newSprite = new FoxSprite(allsprites.textures['sprite'+this.sprite]);
        newSprite.width = tileSize;
        newSprite.height = tileSize;
        
        this.creaturecon.addChild(newSprite);
        this.representativeSprite = newSprite;
        this.hpcon = new PIXI.Container();
        this.creaturecon.addChild(this.hpcon);
        for(let i=0; i<4; i++){
            const bai = new PIXI.Graphics();
            bai.beginFill("red");
            bai.drawRect(i*18, 60, 10, 4);
            bai.endFill();
            this.hpcon.addChild(bai);
        }
        if (!this.animationTick) this.setUpAnimation();
        this.updateHp();
        this.graphicsReady = true;
        //remember when you looked for 2 hours for that one bug that made you drop 1 FPS every time Terminal passed a door and it turned
        //out to be that one tiny line under here that caused literal thousands of StatusDisplay to stack on top of each other? Now that was funny
    }

    extraConfig(){};

    loopThroughSouls(){
        let arr = [];
        for (let i of soulSlotNames){
            arr.push(this.souls[i]);
        }
        return arr;
    }

    findFirstEmptySlot(){
        for (let i of soulSlotNames){
            if (this.souls[i] === false) return i;
        }
        return false;
    }

    updateHp(){
        let hp = this.hp;
        if (this.isInvincible || this.order >= 0) hp = 0;
        for (let i of this.hpcon.children){
            if (hp <= 0) i.visible = false;
            else i.visible = true;
            hp--;
        }

        if (soulTree.trackedEntity === this) soulTree.updateSlots(this);
    }

    heal(damage){
        if (damage <= 0) return;
        this.hp = Math.min(4, this.hp+damage);
        this.updateHp();
    }

    getDisplayX(){                     
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.tile.y + this.offsetY;
    }

    drawHp(){
        if (!this.isInvincible && this.order < 0){
            for(let i=0; i<this.hp; i++){
                drawSprite(
                    9,
                    this.getDisplayX() + (i%8)*(2.7/16),   
                    this.getDisplayY() - Math.floor(i/8)*(2/16)
                );
            }
        }
    }

    interactedBy(interactor){
        this.trigger("TAKE");

    }

    interactWith(target){
        this.trigger("GIVE");
        target.interactedBy(this);
    }

    canMove(tile){
        if (!tile) return false;
        else if (!this.tangible) return true;
        else if (!tile.tangibleCreature) return true;
        else return false;
    }

    tryMove(dx,dy){ // make teleport also pass through this but check what dx is and ignore dy
        let newTile = this.tile.getNeighbor(dx,dy);
        if(this.canMove(newTile)){
                this.move(newTile);
                return true;
            }
        else{
            this.interactWith(newTile.tangibleCreature);
            return false;
        }
    }

    changeSpecies(newSpecies){
        this.species = newSpecies;
        this.representativeSprite.texture = (allsprites.textures['sprite'+speciesData[newSpecies]["sprite"]]);
        soulTree.updateSlots(this);
    }

    hit(damage,origin){  
        if (damage <= 0) return;          
        this.lastDamageCulprit = origin;
        this.hp -= damage;
        if(this.hp <= 0) this.die();
        this.updateHp();
    }

    die(){
        this.trigger("OBLIVION");
        this.changeSpecies("EntropicHusk");
        this.toggleTangibility();
    }

    toggleTangibility(){
        if (this.tangible){
            this.tile.tangibleCreature = false;
            this.tile.intangibleCreatures.add(this);
        }
        else{
            this.tile.intangibleCreatures.delete(this);
            this.tile.tangibleCreature = this;
        }
        this.tangible = !this.tangible;
    }

    move(tile){
        let currentTileCoords = false;
        if(this.tile){
            currentTileCoords = [this.tile.x,this.tile.y];
            this.tile.monster = null;
            this.tile.stepOut(this);
            if (fastReload){ // kind of ugly
                tile.monster = this;                             
                tile.stepOn(this);
                if (this.tile instanceof CenterTeleport && this === player){
                    let targetWorld = universe.findWorldByID(this.tile.destination);
                    let destPad = targetWorld.findTelepadByDest(world.id);
                    universe.passDown(floors.indexOf(this.tile.destination), destPad.x, destPad.y);
                }
                return;
            }
            if (this.animating && this === player){
                tickProjectors();
                this.animating = false;
                tilesDisplay.projectorDisplay.x = -448;
                tilesDisplay.projectorDisplay.y = -448;
                tilesDisplay.creatureDisplay.x = -448;
                tilesDisplay.creatureDisplay.y = -448;
            }
            if (this === player) this.animating = true;
            this.offsetX = this.tile.x - tile.x;
            this.offsetY = this.tile.y - tile.y;
            this.originalOffsetX = this.offsetX;
            this.originalOffsetY = this.offsetY;
            this.anispeed = Math.min(1/6*(Math.abs(this.offsetX)+Math.abs(this.offsetY)),1);
        }
        tile.monster = this;                             
        tile.stepOn(this);
        let newTile = this.tile;
        if (currentTileCoords) this.lastMotion = [newTile.x - currentTileCoords[0], newTile.y - currentTileCoords[1]];

    }
}

class Terminal extends Creature{
    constructor(tile){
        super(tile, 0, 3);
        this.isPlayer = true;
        this.teleportCounter = 0;
        this.name = "Terminal, the Reality Anchor";
        this.souls["SAINTLY"] = "Terminal";
        //this.souls["VILE"] = "EpsilonControl2";
        //this.souls["UNHINGED"] = "SoulSiphon";
        this.ability = "";
        this.noloot = true;
        this.fov = 0;
        this.souldropped = true;
    }
}

class Scion extends Creature{
    constructor(tile){
        super(tile, 4, 2);
        this.soul = "Animated by a Saintly (6) soul.";
        this.name = "Scion of the Old World";
        this.ability = monabi["Scion"];
    }
}

class Shrike extends Creature{
    constructor(tile){
        super(tile, 5, 1);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Starpaper Shrike";
        this.ability = monabi["Shrike"];
        this.speed = 2;
    }
}

class Apiarist extends Creature{
    constructor(tile){
        super(tile, 6, 3);
        this.souls["ORDERED"] = "ScarabHack";
        this.name = "Brass Apiarist";
        this.ability = monabi["Apiarist"];
    }
    extraConfig(playSpace){
        if (this.generationMark == "LinkHere") return;
        let linkStore = this.souls["ORDERED"].findAxioms(LinkForm);
        let epsilonStore = this.souls["ORDERED"].findAxioms(FormEntity);
        for (let i of playSpace.monsters){
            if (i.generationMark == "LinkHere" && i.room == this.room) linkStore[0].storage = i;
            else if (i instanceof EpsilonHead) epsilonStore[0].storage = i;
        }
    }
}

class Second extends Creature{
    constructor(tile){
        super(tile, 7, 1);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Second Emblem of Sin";
        this.ability = monabi["Second"];
    }
}

class Tinker extends Creature{
    constructor(tile){
        super(tile, 8, 2);
        this.soul = "Animated by an Artistic (4) soul.";
        this.name = "Frenzied Dream-Tinker";
        this.ability = monabi["Tinker"];
    }
}

class Harmonizer extends Creature{
    constructor(tile){
        super(tile, 26, 1);
        this.teleportCounter = 0;
        this.soul = "Animated by a Serene (?) soul.";
        this.name = "Serene Harmonizer";
        this.isPassive = true;
        this.isInvincible = true;
        this.isFluffy = true;
        this.isGuide = true;
        this.ability = "";
        this.paralyzed = true;
        if (area == "Spire"){
            this.dialogue = ["FluffyModule1","FluffyModule2","FluffyModule3","FluffyModule4","FluffyModule5","FluffyModule6","FluffyModule7","FluffyModuleRepeat"];
            this.diamax = 7;
            this.diareset = 3;
        }

        this.noloot = true;
    }
    
}

class Cage extends Creature{
    constructor(tile){
        super(tile, 25, 1);
        this.soul = "Soulless."
        this.name = "Herald's Cage";
        this.teleportCounter = 0;
        this.paralyzed = true;
        this.ability = "";
        this.noloot = true;
    }

    die(){
        super.die();
        summonCreature(this.tile.x,this.tile.y,Herald);
    }
}

class Herald extends Creature{
    constructor(tile){
        super(tile, 54, 1);
        this.soul = "Soulless."
        this.name = "Herald of the Old World";
        this.teleportCounter = 0;
        this.damage = 0;
    }
}

class Blehh extends Creature{
    constructor(tile){
        super(tile, 95, 1);
        this.soul = "Animated by a Saintly (6) soul.";
        this.name = "Zaint, First of the Saints";
        this.teleportCounter = 0;
        this.ability = monabi["Zaint"];
        this.stage = 0;
        this.noloot = true;
    }
}

class BattleFluffy extends Creature{
    constructor(tile){
        super(tile, 26, 5);
        this.teleportCounter = 0;
        this.soul = "Animated by a Serene (?) soul.";
        this.name = "Serene Peacemaker";
        this.statusEff["Charmed"] += 999;
        this.isFluffy = true;
        this.ability = "";
        this.noloot = true;
        this.permacharm = true;
        this.abitimer = 0;
    }
    doStuff(){
        this.attackedThisTurn = false;
        super.doStuff();

        if(!this.attackedThisTurn && player.activemodule == "Alacrity"){
            super.doStuff();
        }
        else if (!this.attackedThisTurn && player.activemodule == "Selective" && this.specialAttack != "Harmony"){
            if (player.consumeCommon(3,false)){
                this.specialAttack = "Harmony";
            }
            else{
                log.addLog("FluffyInsufficientPower");
                player.activemodule = "NONE";
                //playSound("off");
            }
        }
        else if (!this.attackedThisTurn && player.activemodule == "Thrusters"){
            if (player.consumeCommon(1,false)) spells["FERAL"](this);
            else{
                log.addLog("FluffyInsufficientPower");
                player.activemodule = "NONE";
                //playSound("off");
            }
        }
        else if (!this.attackedThisTurn && player.activemodule == "Hover"){
            this.abitimer++;
            if (this.abitimer == 3){
                this.abitimer = 0;
                if (player.consumeCommon(2,false)) this.tile.flufftrap = true;
                else{
                    log.addLog("FluffyInsufficientPower");
                    player.activemodule = "NONE";
                    //playSound("off");
                }
            }
            else{
                super.doStuff();
            }
        }
    }
}

class HostileFluffy extends Creature{
    constructor(tile){
        super(tile, 26, 6);
        this.soul = "Animated by a Serene (?) soul.";
        this.name = "Serene Peacemaker";
        this.isFluffy = true;
        this.ability = "";
        this.abitimer = 0;
        this.noloot = true;
    }
    doStuff(){
        this.abitimer++;
        if (this.abitimer == 3){
            this.abitimer = 0;
            let fuffyabi = ["FUFFYSTOMP","FUFFYORI"];
            spells[fuffyabi[randomRange(0,1)]](this);
        }
        else{
            super.doStuff();
        }
    }
}

class Hologram extends Creature{
    
    constructor(tile){
        super(tile, 39, 1);
        this.teleportCounter = 0;
        this.soul = "Soulless.";
        this.name = "Saints' Voice";
        this.isPassive = true;
        this.isInvincible = true;
        this.isGuide = true;
        this.ability = "";
        this.paralyzed = true;
        this.diamax = 11;
        this.dialogue = ["ESaint1","ESaint2","ESaint3","ESaint4","ESaint5","ESaint6","ESaint7","ESaint8","ESaint9","ESaint10","ESaint11","ESaintRepeat"]
        this.diareset = 0;
        this.noloot = true;
    }

    setUpSprite(){
        super.setUpSprite();
        new GlitchSprite(this.creaturecon,3);
    }
}

class AbazonSummon extends Creature{
    constructor(tile,savet,power){
        super(tile, 28, 5);
        this.teleportCounter = 0;
        this.noloot = true;
        this.statusEff["Charmed"] = 999;
        this.canmove = false;
        this.soul = "Animated by Abazon, the Immovable";
        this.name = "Terracotta Sentry";
        this.isInvincible = true;
        this.permacharm = true;
        this.savet = savet;
        this.statusEff["Decaying"] = power;
    }

    die(){
        super.die();
        removeItemOnce(monsters,this);
        tiles[this.savet.x][this.savet.y] = this.savet;
    }
}

class Oracle extends Creature{
    constructor(tile){
        super(tile, 40, 2);
        this.soul = "Animated by an Unhinged (3) soul.";
        this.name = "Anisychic Oracle";
        this.ability = monabi["Oracle"];
    }
}

class Snail extends Creature{ // BATTLESNAIL, GET IN THERE!
    constructor(tile){
        super(tile, 41, 2);
        this.souls["ORDERED"] = "ElectroCoil";
        this.name = "Shelled Electromedic";
        this.ability = monabi["Snail"];
        this.canmove = false;
        this.isPassive = true;
    }
    extraConfig(playSpace){
        if (!(this.generationMark instanceof Array)) return;
        const delay = this.generationMark[0];
        const link = this.generationMark[1];
        let numberStore = this.souls["ORDERED"].findAxioms(NumberStorage);
        let linkStore = this.souls["ORDERED"].findAxioms(LinkForm);
        numberStore[0].storage = delay;
        for (let i of playSpace.monsters){
            if (i.generationMark == link && i.room == this.room) linkStore[0].storage = i;
        }
    }
}

class Husk extends Creature{
    constructor(tile){
        super(tile, 24, 1);
        this.soul = "Soulless.";
        this.name = "Crawling Husk";
        this.ability = monabi["Husk"];
        this.teleportCounter = 0;
        this.statusEff["Charmed"] = 999;
        this.permacharm = true;
        this.noloot = true;
    }
}

class Slug extends Creature{
    constructor(tile){
        super(tile, 29, 2);
        this.souls["ORDERED"] = "Guard";
        this.name = "Shackle-Slug";
        this.ability = monabi["Slug"];
    }
}

class Ragemaw extends Creature{
    constructor(tile){
        super(tile, 44, 1);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Midnight Ragemaw";
        this.ability = monabi["Ragemaw"];
        this.noloot = true;
        this.respawned = false;
    }
}

//class Monk extends Creature{
//    constructor(tile){
//        super(tile, 45, 2, commoneq[[ "VILE", "FERAL", "UNHINGED", "ARTISTIC", "ORDERED", "SAINTLY"][randomRange(0,5)]], description["Monk"]);
//    }
//}

class Felidol extends Creature{
    constructor(tile){
        super(tile, 49, 2);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Greedswept Felidol";
        this.ability = monabi["Felidol"];
    }    
}

class Weaver extends Creature{
    constructor(tile){
        super(tile, 27, 2);
        this.souls["ORDERED"] = "ScarabSpawner";
        this.name = "Humming Paperweaver";
        this.ability = monabi["Weaver"];
        this.isPassive = true;
        this.enraged = false;
    }
    doStuff(){
        if (this.enraged){
            this.speed = 2;
            this.attackedThisTurn = false;
            super.doStuff();
    
            if(!this.attackedThisTurn){
                super.doStuff();
            }
            spells["GYVJI"](this);
        }
        else{
            let neighbors = this.tile.getAdjacentPassableNeighbors();
            if(neighbors.length){
                this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
            }
        }
    }
    update(){
        if (!this.enraged){
            let startedStunned = this.stunned;
            super.update();
            if(!startedStunned){
                this.stunned = true;
                this.tile.pin = true;
            }
        }
        else{
            super.update();
        }
    }
}

class Rendfly extends Creature{
    constructor(tile){
        super(tile, 54, 1);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Rendfly Vermin";
        this.ability = monabi["Rendfly"];
        this.permacharm = true;
        this.statusEff["Charmed"] = 999;
        this.dmg = 0;
        this.abitimer = 0;
    }
    doStuff(){
        this.specialAttack = "DDelay";
        this.attackedThisTurn = false;
        super.doStuff();

        if(!this.attackedThisTurn){
            super.doStuff();
        }
    }
    update(){
        
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned){
            this.abitimer++;
            if (this.abitimer == 3) {
                this.move(randomPassableTile());
                this.abitimer = 0;
            }
        }
    }
}

class Modulorb extends Creature{
    constructor(tile, contents){
        super(tile, 64, 1, contents, description["ModuleOrb"]);
        this.soul = "Contains the "+modulename[contents];
        this.name = "Modulator Orbkeeper";
        this.teleportCounter = 0;
        this.ability = "";
    }
    update(){
        this.stunned = true;
        super.update();
    }
}

class Third extends Creature{
    constructor(tile){
        super(tile, 65, 2);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Third Emblem of Sin";
        this.ability = monabi["Third"];
        this.abitimer = 0;
    }
    doStuff(){
        this.abitimer++;
        if (this.abitimer == 12){
            this.abitimer = 0;
            spells["WOOP"](this);
        }
        else{
            super.doStuff();
        }
    }
}

class WalkBot extends Creature{
    constructor(tile){
        super(tile, 65, 2);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Third Emblem of Sin";
        this.ability = monabi["WalkBot"];
        this.abitimer = 0;
        this.isInvincible = true;
        this.isPassive = true;
    }

    update(){
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned){
            this.stunned = true;
        }
    }
}

class Ashsoul extends Creature{
    constructor(tile){
        super(tile, 66, 1);
        this.soul = "Animated by an Unhiged (3) soul.";
        this.name = "Ashsoul Screecher";
        this.ability = monabi["Ashsoul"];
        this.abitimer = 0;
    }
    doStuff(){
        this.abitimer++;
        if (this.abitimer == 12){
            this.abitimer = 0;
            spells["WOOP"](this);
        }
        else if (this.abitimer % 3 == 1){
            spells["GYVJINODMG"](this);
        }
        else{
            super.doStuff();
        }
    }
}

class KnockbackBot extends Creature{
    constructor(tile){
        super(tile, 66, 1);
        this.soul = "Animated by an Unhiged (3) soul.";
        this.name = "Ashsoul Screecher";
        this.ability = monabi["KnockbackBot"];
        this.canmove = false;
        this.isInvincible = true;
        this.fphit = 10;
        this.teleportCounter = 0;
    }
}

class EpsilonHead extends Creature{
    constructor(tile){
        super(tile, 67, 3);
        this.souls["ORDERED"] = "EpsilonStand";
        this.name = "Epsilon, Adorned in Gold";
        this.ability = monabi["Epsilon"];
    }
}

class Programmer extends Creature{
    constructor(tile){
        super(tile, 49, 3);
        this.souls["VILE"] = "Programmer";
        this.name = "Epsilon, Supreme Ordered General";
        this.ability = monabi["Epsilon"];
    }
    extraConfig(playSpace){
        let targetStore = this.souls["VILE"].findAxioms(FormEntity);
        for (let i of playSpace.monsters){
            if (i.generationMark == "ProgramThis") targetStore[0].storage = i;
        }
    }
}

class Epsilon extends Creature{
    constructor(tile){
        super(tile, 67, 33);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Epsilon, Supreme Ordered General";
        this.ability = monabi["Epsilon"];
        this.abitimer = 0;
        this.isInvincible = true;
        this.lastpos = [9,9];
        this.order = 0;
        this.teleportCounter = 0;
        this.cores = 0;
        this.corelist = [];
        this.turbo = false;
        this.nostun = true;
        this.loveless = true;
        this.abitimer = 0;
        this.vulnerability = 0;
        this.antidash = 0;
        this.nospell = false;
        this.hastalavista = false;
        this.step = true;
    }
    doStuff(){
        this.abitimer++;
        let restorecheck = this.vulnerability;
        this.vulnerability--;
        let stuck = this.tile.getAdjacentPassableNeighbors();
        let beepbeepbeep = false;
        //Red vuln test
        if (stuck.length <= 1 && this.corelist.includes("Red")){
            this.antidash = 2;
            beepbeepbeep = true;
            let dest = getTile(this.tile.x-this.lastMove[0],this.tile.y-this.lastMove[1]);
            for (let x of monsters){
                if (x.order >= 0){
                    if (x.order > 0) x.beepbeepbeep = true;
                    if (!dest.monster && x.order == 0){
                        x.move(dest);
                    }
                    else if (dest.monster && x.order == 0){
                        //dest.monster.hit(99);
                        x.move(dest);
                    }
                }
                if (!this.hastalavista){
                    //playSound("epsivuln");
                    log.addLog("EpsilonRedWeak");
                    removeItemOnce(this.corelist,"Red");
                    for (let z of monsters){
                        if (z.name.includes("Turbo")) z.triggered = true;
                    }
                    this.sprite = 81;
                    this.vulnerability = 15;
                }
                this.nospell = 2;
            }
        }
        //White vuln test
        let dronecount = 0;
        for (let p of monsters){
            if (p.name.includes("drone")){
                dronecount++;
            }
        }
        if (dronecount >= 20 && this.corelist.includes("White") && !this.hastalavista){
            //playSound("epsivuln");
            log.addLog("EpsilonWhiteWeak");
            this.vulnerability = 25;
            removeItemOnce(this.corelist,"White");
            for (let z of monsters){
                if (z.name.includes("Entropic")) z.triggered = true;
            }
            this.sprite = 81;
        }
        //Pink vuln test
        if (player.rosetox >= 4 && this.corelist.includes("Pink") && !this.hastalavista){
            //playSound("epsivuln");
            log.addLog("EpsilonPinkWeak");
            this.vulnerability = 10;
            removeItemOnce(this.corelist,"Pink");
            for (let z of monsters){
                if (z.name.includes("Roseic")) z.triggered = true;
            }
            this.sprite = 81;
        }
        //Cyan vuln test
        for (let x of monsters){
            if (x.order >= 0){
                let fuffcheck = x.tile.getAdjacentNeighbors()
                for (let y of fuffcheck){
                    if (y.monster && this.corelist.includes("Cyan") && !this.hastalavista){
                        if (y.monster instanceof BattleFluffy){
                            log.addLog("EpsilonCyanWeak");
                            //playSound("epsivuln");
                            this.vulnerability = 5;
                            removeItemOnce(this.corelist,"Cyan");
                            for (let z of monsters){
                                if (z.name.includes("Subwoofer")) z.triggered = true;
                            }
                            this.sprite = 81;
                        } 
                    }
                }
            }
        }
        if (this.vulnerability > 0){
            this.isInvincible = false;
            for (let x of monsters){
                if (x instanceof Tail){
                    x.isInvincible = false;
                }
            }
        }
        else if (restorecheck == 1){
            this.isInvincible = true;
            log.addLog("EpsilonRestored");
            //playSound("epsirepair");
            this.sprite = 67;
            for (let x of monsters){
                if (x instanceof Tail){
                    x.isInvincible = true;
                }
            }
        }
        if (this.abitimer == 6){
            this.abitimer = 0;
            let spawners = [];
            for (let x of tiles){
                for (let y of x){
                    if (y instanceof Mobilizer) spawners.push(y);
                }
            }
            let dest = spawners[randomRange(0,3)];
            if (!dest.monster){
                let type = shuffle([Psydrone,Titanic,Paradox,Binary])[0];
                monsters.push(new type(dest));
            }
            //else //playSound("fail");
        }
        this.attackedThisTurn = false;
        this.lastpos = [this.tile.x,this.tile.y];
        this.turbo = false;
        //test if surrounded by 3 walls, become vulnerable if so
        //dashing into a core causes vulnerability and installation?
        //because epsilon is slowing down not wanting to damage the core
        //don't actually remove hp but make a tink sound
        if (!beepbeepbeep) super.doStuff();
    }
    update(){
        let startedStunned = this.step;
        super.update();
        if(!startedStunned){
            this.step = true;
        }
        else if (this.corelist.length > 0){
            if (this.antidash > 0 || (this.corelist.includes("Red") && (this.tile.x < 2 || this.tile.x > 15 || this.tile.y < 2 || this.tile.y > 15))){
                removeItemOnce(this.corelist,"Red");
                if (this.antidash <= 0) this.antidash = 1;
            }
            let corecast = this.corelist[randomRange(0,this.corelist.length-1)];
            if (this.corelist.length > 0 && this.nospell <= 0) spells[corecast](this);
            if (this.corelist.length > 1 && this.nospell <= 0 && this.hastalavista){
                removeItemOnce(this.corelist, corecast);
                spells[this.corelist[randomRange(0,this.corelist.length-1)]](this);
                this.corelist.push(corecast);
            }
            if (this.antidash > 0) this.corelist.push("Red");
            this.antidash--;
            this.nospell--;
            if (corecast == "Red") this.antidash = 3;
        }
    }
}

class Tail extends Creature{
    constructor(tile,order){
        super(tile, 68, 6);
        this.soul = "Soulless.";
        this.name = "Rubberized Mecha-Segment";
        this.ability = monabi["Tail"];
        this.abitimer = 0;
        this.teleportCounter = 1;
        this.order = order;
        this.isInvincible = true;
        this.bosscard = 0;
        this.turbo = false;
        this.installed = false;
        this.nostun = true;
        this.loveless = true;
        this.beepbeepbeep = false;
        this.triggered = false;
        this.step = true;
    }
    doStuff(){
        this.turbo = false;
        this.bosscard++;
        this.lastpos = [this.tile.x,this.tile.y];
        if (this.bosscard == 2) showboss = false;
        let move;
        let lmove;
        let stop;
        for (let x of monsters){
            if (x.order == this.order-1){
                move = x.lastpos;
                stop = x.attackedThisTurn;
                this.attackedThisTurn = stop;
            }
        }
        for (let x of monsters){
            if (x instanceof Epsilon) lmove = x.lastMove;
        }
        if (this.beepbeepbeep && this.order > 1) {
            move[0] += (-lmove[0]*2);
            move[1] += (-lmove[1]*2);
        }
        else if (this.beepbeepbeep && this.order == 1) {
            move[0] += (-lmove[0]);
            move[1] += (-lmove[1]);
        }
        if(move && !stop){
            this.move(getTile(move[0],move[1]));
            this.lastMove = lmove;
        }
        if (this.beepbeepbeep) this.beepbeepbeep = false;
    }
    update(){
        let startedStunned = this.step;
        super.update();
        if(!startedStunned){
            this.step = true;
        }
    }
}

class Box extends Creature{
    constructor(tile, type){
        super(tile, core[type], 1);
        this.soul = "Soulless.";
        this.name = core[core[type]];
        this.ability = monabi[type];
        this.abitimer = 0;
        this.type = type;
        this.teleportCounter = 0;
        this.pushable = true;
        this.isInvincible = true;
        this.noloot = true;
        this.loveless = true;
    }
    update(){
        this.stunned = true;
        super.update();
    }
}

class Apis extends Creature{
    constructor(tile){
        super(tile, 70, 2);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Messenger of Aculeo";
        this.ability = monabi["Apis"];
    }
}

class Embalmer extends Creature{
    constructor(tile){
        super(tile, 71, 1);
        this.soul = "Animated by a Saintly (6) soul.";
        this.name = "Roseic Bioembalmer";
        this.ability = monabi["Embalmer"];
        this.dmg = 0;
    }
    doStuff(){
        this.specialAttack = "Tox";
        this.attackedThisTurn = false;
        super.doStuff();

        if(!this.attackedThisTurn){
            super.doStuff();
        }
    }
}

class Brute extends Creature{
    constructor(tile){
        super(tile, 72, 2);
        this.soul = "Animated by an Artistic (4) soul.";
        this.name = "Rosewrapped Brute";
        this.ability = monabi["Brute"];
        this.enraged = false;
        this.dmg = 2;
    }
    doStuff(){
        if (this.enraged){
            this.speed = 2;
            this.attackedThisTurn = false;
            super.doStuff();
    
            if(!this.attackedThisTurn){
                super.doStuff();
            }
        }
        else{
            super.doStuff();
        }
    }
    update(){
        if (!this.enraged){
            let startedStunned = this.stunned;
            super.update();
            if(!startedStunned){
                this.stunned = true;
            }
        }
        else{
            super.update();
        }
    }
}

class Paradox extends Creature{
    constructor(tile){
        super(tile, 79, 1);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Paradox Teledrone";
        this.ability = monabi["Paradox"];
        this.abitimer = 0;
        this.noloot = true;
    }
    doStuff(){
        this.specialAttack = "Warp";
        this.abitimer++;
        if (this.abitimer == 8){
            this.abitimer = 0;
            spells["WOOP"](this);
        }
        else{
            super.doStuff();
        }
    }
}

class Binary extends Creature{
    constructor(tile){
        super(tile, 78, 2);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Binary Duodrone";
        this.ability = monabi["Binary"];
        this.abitimer = 0;
        this.noloot = true;
    }
    doStuff(){
        this.abitimer++;
        if (this.abitimer == 2){
            this.abitimer = 0;
            spells["BINARY"](this);
        }
        else{
            super.doStuff();
        }
    }
}

class Titanic extends Creature{
    constructor(tile){
        super(tile, 76, 1);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Titanic Gravidrone";
        this.ability = monabi["Titanic"];
        this.noloot = true;
    }
    doStuff(){
        this.specialAttack = "Trample";
        super.doStuff();
    }
    update(){
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned){
            this.stunned = true;
        }
    }
}

class Psydrone extends Creature{
    constructor(tile){
        super(tile, 77, 1);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Pulsating Psydrone";
        this.ability = monabi["Psydrone"];
        this.abitimer = 0;
        this.noloot = true;
    }
    doStuff(){
        this.abitimer++;
        if (this.abitimer == 3){
            this.abitimer = 0;
            spells["PSYDRONE"](this);
        }
        else{
            super.doStuff();
        }
    }
}

class Scarab extends Creature{
    constructor(tile){
        super(tile, 76, 1, "ORDERED");
        this.name = "Plated Thought-Ferry";
        this.souls["ORDERED"] = "Scarab";
    }
}

class Exploder extends Creature{
    constructor(tile){
        super(tile, 77, 1);
        this.soul = "Soulless.";
        this.name = "Compacted Disdain";
        this.ability = monabi["Exploder"];
        this.noloot = true;
        this.direction = [];
        this.teleportCounter = 0;
    }
}