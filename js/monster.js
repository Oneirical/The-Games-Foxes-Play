class Monster{
    static species = "Plated"; //monsterNames[this.name]
    constructor(tile, sprite, hp, loot, lore){
        this.sprite = sprite;
        this.hp = hp;
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.lastMove = [-1,0]; 
        this.order = -1;
        this.infested = 0;
        this.soulstun = 0;
        this.doomed = false;
        this.previousdir;
        this.lootid = this.loot;
        this.souls = {
            "SAINTLY" : false,
            "ORDERED" : false,
            "ARTISTIC" : false,
            "UNHINGED" : false,
            "FERAL" : false,
            "VILE" : false,
        };
        if (tile == "disabled") return;
        this.move(tile);
        this.adjacentmon = this.tile.getAdjacentNeighbors().filter(t => t.monster && !t.monster.isPlayer).length;
        this.graphicsReady = false;

    }

    trigger(event,assi){
        for (let j of this.loopThroughSouls()){
            if (j instanceof Soul) j.trigger(event,assi);
        }
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
                        let destination = 1;
                        if (universe.currentworld == 1) destination = 0;
                        if (!universe.zooming && this.tile instanceof CageContainer &&  this.tile.x == world.cageCorner[0] + 4 && this.tile.y == world.cageCorner[1] + 4) universe.passDown(destination, world.cage.pocketworld.cageLocation[0], world.cage.pocketworld.cageLocation[1]);
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
        let hai = this.sprite;
        let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
        newSprite.width = tileSize;
        newSprite.height = tileSize;
        
        this.creaturecon.addChild(newSprite);
        this.hpcon = new PIXI.Container();
        this.creaturecon.addChild(this.hpcon);
        for(let i=0; i<6; i++){
            let bai = new FoxSprite(allsprites.textures['sprite9']);
            bai.x = i*11;
            bai.width = tileSize;
            bai.height = tileSize;
            this.hpcon.addChild(bai);
        }
        if (!this.animationTick) this.setUpAnimation();
        this.updateHp();
        if (false && universe.zooming && this instanceof Terminal){ //looks kind of cool but enough is enough
            new GlitchSprite(this.creaturecon,3,true);
        }
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
    }

    heal(damage){
        if (damage <= 0) return;
        if (this instanceof Tail){
            for (let x of monsters){
                if (x instanceof Epsilon) x.hp = Math.min(33, x.hp+damage);
            }
        }
        this.hp = Math.min(maxHp, this.hp+damage);
        this.updateHp();
    }

    useAbility(spellName){
        spells[spellName]();
    }

    getDisplayX(){                     
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.tile.y + this.offsetY;
    }

    knockback(power, direction, antisuicide){
        let recallcheck = false;
        for(let i=0;i<numTiles;i++){
            for(let j=0;j<numTiles;j++){
                if (getTile(i,j).recallpoint) recallcheck = getTile(i,j);
            }
        }
        if (recallcheck && this.isPlayer){
            this.move(recallcheck);
            recallcheck.recallpoint = false;
            spells["ARTTRIGGERS"](this);
            return;
        }
        let soulSpawn = this.tile;
        let newTile = this.tile;
        let testTile = newTile;
        let collision = false;
        this.soulstun += 3;
        while(power > 0){
            testTile = newTile.getNeighbor(direction[0],direction[1]);
            if(testTile.passable && !testTile.monster){
                newTile = testTile;
                power--;
            }else{
                if (!testTile.passable) collision = true;
                break;
            }
        }
        if (!this.souldropped){
            let testSoul = new DroppedSoul(soulSpawn,this.loot.name,this);
            droppedsouls.push(testSoul);
            this.souldropped = true;
        }
        if(true){
            if (!(testTile instanceof AbazonWall)) this.move(newTile);
            else if (!antisuicide){
                this.hit(99);
                this.sprite = 83;
            }
            else this.move(newTile);
            if (collision){
                this.soulstun += power*2;
                return true;
            }
        }
        return false;
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

    tryMove(dx,dy){
        let newTile = this.tile.getNeighbor(dx,dy);
        if(newTile.passable){
            this.lastMove = [dx,dy];
            if(!newTile.monster){
                this.move(newTile);
                return true;
            }
            else{
                //newTile.monster.interact(); do something here for dialogue pushing etc
                return false;
            }
        }
        else{
            newTile.interact();
            return false;
        }
    }

    hit(damage,origin){  
        if (damage <= 0) return;          
        this.lastDamageCulprit = origin;
        this.hp -= damage;
        if(this.hp <= 0 && !this.dead) this.die();
        if(this.isPlayer){                                                     
            playSound("hit1");                                              
        }else{                                                       
            playSound("hit2");                                              
        }
        this.updateHp();
    }

    die(){
        this.dead = true;
        this.trigger("OBLIVION");
        if (this.tile.monster == this){
            this.tile.monster = null;
            for (let i of this.loopThroughSouls()) if (i) this.tile.souls.push(i);
            this.tile.addSoulsOnFloor();
        }
        this.sprite = 1;
        tilesDisplay.removeChild(this.creaturecon);
        removeItemOnce(monsters,this);
    }

    move(tile){
        if (this.dead) return;
        if(this.tile){
            this.tile.stepOut(this);
            this.tile.monster = null;
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
            this.anispeed = 1/6*(Math.abs(this.offsetX)+Math.abs(this.offsetY));
        }
        this.tile = tile;
        tile.monster = this;                             
        tile.stepOn(this);   
    }
}

class Terminal extends Monster{
    constructor(tile){
        super(tile, 0, 3, "SOULLESS", description["Terminal"]);
        this.isPlayer = true;
        this.teleportCounter = 0;
        this.name = "Terminal, the Reality Anchor";
        this.souls["SAINTLY"] = "Terminal";
        //this.souls["VILE"] = "EpsilonControl2";
        //this.souls["UNHINGED"] = "SoulSiphon";
        this.ability = "";
        this.noloot = true;
        this.fov = 0;
        this.wheel = new SoulBreathing();
        this.souldropped = true;
    }
}

class Scion extends Monster{
    constructor(tile){
        super(tile, 4, 2, "SAINTLY", description["Scion"]);
        this.soul = "Animated by a Saintly (6) soul.";
        this.name = "Scion of the Old World";
        this.ability = monabi["Scion"];
    }
}

class Shrike extends Monster{
    constructor(tile){
        super(tile, 5, 1, "UNHINGED", description["Shrike"]);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Starpaper Shrike";
        this.ability = monabi["Shrike"];
        this.speed = 2;
    }
}

class Apiarist extends Monster{
    constructor(tile){
        super(tile, 6, 3, "ORDERED", description["Apiarist"]);
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

class Second extends Monster{
    constructor(tile){
        super(tile, 7, 1, "VILE", description["Second"]);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Second Emblem of Sin";
        this.ability = monabi["Second"];
    }
}

class Tinker extends Monster{
    constructor(tile){
        super(tile, 8, 2, "SAINTLY", description["Tinker"]);
        this.soul = "Animated by an Artistic (4) soul.";
        this.name = "Frenzied Dream-Tinker";
        this.ability = monabi["Tinker"];
    }
}

class Harmonizer extends Monster{
    constructor(tile){
        super(tile, 26, 1, "SERENE", description["Harmonizer"]);
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

class Cage extends Monster{
    constructor(tile){
        super(tile, 25, 1, "NOTHING", description["Cage"]);
        this.soul = "Soulless."
        this.name = "Herald's Cage";
        this.teleportCounter = 0;
        this.paralyzed = true;
        this.ability = "";
        this.noloot = true;
    }

    die(){
        super.die();
        summonMonster(this.tile.x,this.tile.y,Herald);
    }
}

class Herald extends Monster{
    constructor(tile){
        super(tile, 54, 1, "FERAL", description["Herald"]);
        this.soul = "Soulless."
        this.name = "Herald of the Old World";
        this.teleportCounter = 0;
        this.damage = 0;
    }
}

class Blehh extends Monster{
    constructor(tile){
        super(tile, 95, 1, "SAINTLY", description["Zaint"]);
        this.soul = "Animated by a Saintly (6) soul.";
        this.name = "Zaint, First of the Saints";
        this.teleportCounter = 0;
        this.ability = monabi["Zaint"];
        this.stage = 0;
        this.noloot = true;
    }

    update(){
        if (this.stage == 99){
            let startedStunned = this.stunned;
            super.update();
            if(!startedStunned){
                this.stunned = true;
            }
        }
        else if (this.stage == 6){
            spells["QUADBOLT"](this.tile);
            spells["UNHINGED"](this);
            super.update();
        }
        else super.update();
    }

    die(){
        super.die();
        if (world.getRoom() instanceof WorldSeed){
            world.getRoom().stage++;
            world.getRoom().progressTutorial(world.getRoom().stage);
        }
    }
}

class BattleFluffy extends Monster{
    constructor(tile){
        super(tile, 26, 5, "SERENE", description["Peacemaker"]);
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
                playSound("off");
            }
        }
        else if (!this.attackedThisTurn && player.activemodule == "Thrusters"){
            if (player.consumeCommon(1,false)) spells["FERAL"](this);
            else{
                log.addLog("FluffyInsufficientPower");
                player.activemodule = "NONE";
                playSound("off");
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
                    playSound("off");
                }
            }
            else{
                super.doStuff();
            }
        }
    }
}

class HostileFluffy extends Monster{
    constructor(tile){
        super(tile, 26, 6, "SERENE", description["Peacemaker"]);
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

class Hologram extends Monster{
    
    constructor(tile){
        super(tile, 39, 1, "NOTHING", description["Hologram"]);
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

class AbazonSummon extends Monster{
    constructor(tile,savet,power){
        super(tile, 28, 5, "ABAZON", description["Abazon"]);
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

class Oracle extends Monster{
    constructor(tile){
        super(tile, 40, 2, "UNHINGED", description["Oracle"]);
        this.soul = "Animated by an Unhinged (3) soul.";
        this.name = "Anisychic Oracle";
        this.ability = monabi["Oracle"];
    }
}

class Snail extends Monster{ // BATTLESNAIL, GET IN THERE!
    constructor(tile){
        super(tile, 41, 2, "ARTISTIC", description["Snail"]);
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

class Husk extends Monster{
    constructor(tile){
        super(tile, 24, 1, "NOTHING", description["Husk"]);
        this.soul = "Soulless.";
        this.name = "Crawling Husk";
        this.ability = monabi["Husk"];
        this.teleportCounter = 0;
        this.statusEff["Charmed"] = 999;
        this.permacharm = true;
        this.noloot = true;
    }
}

class Slug extends Monster{
    constructor(tile){
        super(tile, 29, 2, "ORDERED", description["Slug"]);
        this.souls["ORDERED"] = "Guard";
        this.name = "Shackle-Slug";
        this.ability = monabi["Slug"];
    }
}

class Ragemaw extends Monster{
    constructor(tile){
        super(tile, 44, 1, "FERAL", description["Ragemaw"]);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Midnight Ragemaw";
        this.ability = monabi["Ragemaw"];
        this.noloot = true;
        this.respawned = false;
    }
    die(){
        let moncount = monsters.filter(mon => mon.name != "Midnight Ragemaw" && !mon.statusEff["Charmed"] > 0);
        if (moncount.length >= 1 && !this.respawned){
            let respawn = new Ragemaw(randomPassableTile());
            monsters.push(respawn);
            this.respawned = true;
            super.die();
        }
        else{
            super.die();
            wheel.addSoul(this.loot);
        }
    }
}

//class Monk extends Monster{
//    constructor(tile){
//        super(tile, 45, 2, commoneq[[ "VILE", "FERAL", "UNHINGED", "ARTISTIC", "ORDERED", "SAINTLY"][randomRange(0,5)]], description["Monk"]);
//    }
//}

class Felidol extends Monster{
    constructor(tile){
        super(tile, 49, 2, "VILE", description["Felidol"]);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Greedswept Felidol";
        this.ability = monabi["Felidol"];
    }    
}

class Weaver extends Monster{
    constructor(tile){
        super(tile, 27, 2, "ARTISTIC", description["Weaver"]);
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

class Rendfly extends Monster{
    constructor(tile){
        super(tile, 54, 1, "FERAL", description["Rendfly"]);
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

class Modulorb extends Monster{
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

class Third extends Monster{
    constructor(tile){
        super(tile, 65, 2, "VILE", description["Third"]);
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

class WalkBot extends Monster{
    constructor(tile){
        super(tile, 65, 2, "VILE", description["Third"]);
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

class Ashsoul extends Monster{
    constructor(tile){
        super(tile, 66, 1, "UNHINGED", description["Ashsoul"]);
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

class KnockbackBot extends Monster{
    constructor(tile){
        super(tile, 66, 1, "UNHINGED", description["Ashsoul"]);
        this.soul = "Animated by an Unhiged (3) soul.";
        this.name = "Ashsoul Screecher";
        this.ability = monabi["KnockbackBot"];
        this.canmove = false;
        this.isInvincible = true;
        this.fphit = 10;
        this.teleportCounter = 0;
    }
}

class EpsilonHead extends Monster{
    constructor(tile){
        super(tile, 67, 3, "ORDERED", description["Epsilon"]);
        this.souls["ORDERED"] = "EpsilonStand";
        this.name = "Epsilon, Supreme Ordered General";
        this.ability = monabi["Epsilon"];
    }
}

class Programmer extends Monster{
    constructor(tile){
        super(tile, 49, 3, "VILE", description["Epsilon"]);
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

class EpsilonTail extends Monster{
    static number = 1;
    constructor(tile){
        super(tile, 68, 3, "ORDERED", description["Epsilon"]);
       
        //for (let i of monsters) if (i instanceof EpsilonTail) this.number++;
        this.souls["ORDERED"] = "Tail"+EpsilonTail.number;
        EpsilonTail.number++;
        if (EpsilonTail.number == 5) EpsilonTail.number = 1;
        this.name = "Epsilon, Supreme Ordered General";
        this.ability = monabi["Epsilon"];
    }
}

class Epsilon extends Monster{
    constructor(tile){
        super(tile, 67, 33, "ORDERED", description["Epsilon"]);
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
                    playSound("epsivuln");
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
            playSound("epsivuln");
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
            playSound("epsivuln");
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
                            playSound("epsivuln");
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
            playSound("epsirepair");
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
            else playSound("fail");
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

class Tail extends Monster{
    constructor(tile,order){
        super(tile, 68, 6, "ORDERED", description["Tail"]);
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

class Box extends Monster{
    constructor(tile, type){
        super(tile, core[type], 1, "ORDERED", description[type]);
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

class Apis extends Monster{
    constructor(tile){
        super(tile, 70, 2, "FERAL", description["Apis"]);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Messenger of Aculeo";
        this.ability = monabi["Apis"];
    }
}

class Embalmer extends Monster{
    constructor(tile){
        super(tile, 71, 1, "SAINTLY", description["Embalmer"]);
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

class Brute extends Monster{
    constructor(tile){
        super(tile, 72, 2, "ARTISTIC", description["Brute"]);
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

class Paradox extends Monster{
    constructor(tile){
        super(tile, 79, 1, "ORDERED", description["Paradox"]);
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

class Binary extends Monster{
    constructor(tile){
        super(tile, 78, 2, "ORDERED", description["Binary"]);
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

class Titanic extends Monster{
    constructor(tile){
        super(tile, 76, 1, "ORDERED", description["Titanic"]);
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

class Psydrone extends Monster{
    constructor(tile){
        super(tile, 77, 1, "ORDERED", description["Psydrone"]);
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

class Scarab extends Monster{
    constructor(tile){
        super(tile, 76, 1, "ORDERED", description["Scarab"]);
        this.name = "Plated Thought-Ferry";
        this.souls["ORDERED"] = "Scarab";
    }
}

class Exploder extends Monster{
    constructor(tile){
        super(tile, 77, 1, "NOTHING", description["Exploder"]);
        this.soul = "Soulless.";
        this.name = "Compacted Disdain";
        this.ability = monabi["Exploder"];
        this.noloot = true;
        this.direction = [];
        this.teleportCounter = 0;
    }
    doStuff(){
        let testTile = getTile(this.tile.x+this.direction[0],this.tile.y+this.direction[1]);
        if (testTile.monster || !inBounds(testTile.x,testTile.y)){
            spells["UNHINGEDSTRIGGER"](this);
            if (testTile.monster) {
                testTile.monster.fp++;
                testTile.monster.stunned = true;
                testTile.monster.knockback(testTile.monster.fp,this.direction,false);
            }
            player.move(this.tile);
            this.hit(99);
        }
        else this.tryMove(this.direction[0], this.direction[1]);
    }
}