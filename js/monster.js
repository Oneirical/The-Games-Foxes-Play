class Cursor{
    constructor(tile){
        this.move(tile);
        this.sprite = 18;
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.lastMove = [-1,0];
        this.isPlayer = false;
    }
    getDisplayX(){                     
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.tile.y + this.offsetY;
    }
    draw(){
        drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
        this.offsetX -= Math.sign(this.offsetX)*(1/8);     
        this.offsetY -= Math.sign(this.offsetY)*(1/8); 
    }
    tryMove(dx, dy){
        let newTile = this.tile.getNeighbor(dx,dy);
        if (newTile.x < numTiles && newTile.y < numTiles && newTile.x >= 0 && newTile.y >= 0){
            this.move(newTile);
        }
    }
    move(tile){
        if(this.tile){
            this.offsetX = this.tile.x - tile.x;    
            this.offsetY = this.tile.y - tile.y;
        }
        this.tile = tile;
        tile.cursor = this;                                             
    }
    die(){
        this.dead = true;
        this.tile.cursor = null;
        this.sprite = 99999;
    }
    info(){
        if (this.tile.monster){
            if (rosetoxin > 0){
                printAtWordWrap(description["Rose"], 18, 10, 600, "pink", 20, 940);
                printAtSidebar("Rose Rose Rose", 18, 590, 170, "pink", 20, 350);
                printAtSidebar("Rose", 18, 590, 130, "pink", 20, 350);
            }
            else if (this.tile.monster.teleportCounter > 0){
                printAtWordWrap(description["Warp"], 18, 10, 600, "white", 20, 940);
                printAtSidebar("The details of this soul are not clear to you yet.", 18, 590, 170, "white", 20, 350);
                printAtSidebar("Warp-wisp", 18, 590, 130, "white", 20, 350);
            }
            else{
            printAtWordWrap(this.tile.monster.lore, 18, 10, 600, "white", 20, 940);
            printAtSidebar(this.tile.monster.soul, 18, 590, 170, "white", 20, 350);
            printAtSidebar(this.tile.monster.name, 18, 590, 130, "white", 20, 350);
            printAtWordWrap(this.tile.monster.ability, 18, 10, 630+((this.tile.monster.lore.length/100)*20), "pink", 20, 940);
            }
        }
        else{
            let colour = "lightgray";
            if (this.tile.sprite == 61 || this.tile.sprite == 62) colour = "white";
            printAtWordWrap(this.tile.lore, 18, 10, 600, colour, 20, 950);
            printAtSidebar(this.tile.name, 18, 590, 130, colour, 20, 350);
        }
        

    }
    debug(){
        console.log(this.tile instanceof ReturnExit);
    }
}

class Monster{
    constructor(tile, sprite, hp, loot, lore){
        this.move(tile);
        this.sprite = sprite;
        this.spritesave = sprite;
        this.hp = hp;
        this.speed = 1;
        this.fp = 0; //it stands for fluffy points
        this.dmg = 1;
        this.loot = loot;
        this.loveless = false;
        this.teleportCounter = 3;
        this.offsetX = 0;                                                   
        this.offsetY = 0;      
        this.lastMove = [-1,0];    
        this.bonusAttack = 0;
        this.lore = lore;
        this.specialAttack = "";
        this.adjacentmon = this.tile.getAdjacentNeighbors().filter(t => t.monster && !t.monster.isPlayer).length;
        this.paralyzed = false;
        this.marked = false;
        this.charmed = false;
        this.isFluffy = false;
        this.noloot = false;
        this.canmove = true;
        this.permacharm = false;
        this.enraged = false;
        this.inhand = [];
        this.discard = [];
        this.falsehp = 0;
        this.deathdelay = 0;
        this.shield = 0;
        this.order = -1;
        this.infested = 0;
        this.previousdir;
        this.lootid = this.loot;
        if (legendaries.castes.includes(this.loot)) this.loot = commoneq[this.loot];
    }

    heal(damage){
        if (this instanceof Tail){
            for (let x of monsters){
                if (x instanceof Epsilon) x.hp = Math.min(33, x.hp+damage);
            }
        }
        else if (this.deathdelay == 0) this.hp = Math.min(maxHp, this.hp+damage);
        else if (this.deathdelay > 0) this.falsehp = Math.min(maxHp, this.falsehp+(damage*2));
    }

    update(){
        this.shield--;
        this.teleportCounter--;
        if (this.deathdelay > 0){
            this.deathdelay--;
            if (this.deathdelay == 0){
                if (this.falsehp <= 0){
                    this.hit(99);
                    //removeItemOnce(monsters,this);
                    //if (!this.noloot) wheel.addSoul(this.loot);
                    this.noloot = true;
                } 
            }
        }
        if(this.stunned|| this.teleportCounter > 0){ 
            this.stunned = false;
            return;
        }
        if(this.paralyzed) return;
        if(this.charmed && monsters.length < 2 && !this.permacharm) this.charmed = false;
        this.doStuff();
    }

    doStuff(){
       let neighbors = this.tile.getAdjacentPassableNeighbors();
       
       if (this.charmed == true && !this.name.includes("Rendfly")) neighbors = neighbors.filter(t => !t.monster || !t.monster.isPlayer || !t.monster.marked || !t.monster.charmed);
       else if (this.charmed == true) neighbors = neighbors.filter(t => !t.monster || !t.monster.isPlayer || !t.monster.marked || !t.monster.charmed);
       else neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer || t.monster.marked || t.monster instanceof Box);

       if(neighbors.length){
            let markcheck = false;
            let enemy = player;
            monsters.forEach(function(entity){
               if (entity.marked){
                   markcheck = true;
                   enemy = entity;
               }
            });
            if (this.charmed){
                
                let testresult = [];
                monsters.forEach(function(entity){
                    let option = neighbors;
                    
                    option.sort((a,b) => a.dist(entity.tile) - b.dist(entity.tile));
                    testresult.push(option[0]);
                    let valid = false;
                    
                    testresult.forEach(function(t){
                        if (option[0].x <= t.x && option[0].y <= t.y) valid = true;
                    });
                    if (entity.charmed || entity instanceof Box) valid = false;
                    if (valid) enemy = entity;
                    
                });
            }
            if ((markcheck && !this.marked||this.charmed)){ //
                neighbors.sort((a,b) => a.dist(enemy.tile) - b.dist(enemy.tile));
            }
            else{
                neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
            }
           
           let newTile = neighbors[0];
           if (this.previousdir){
               if (newTile.x == this.previousdir.x && newTile.y == this.previousdir.y && this.speed > 1 && neighbors.length > 1) newTile = neighbors[1];
               else if (newTile.x == this.previousdir.x && newTile.y == this.previousdir.y && this.speed > 1 && neighbors.length <= 1) return; 
           }
           this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
           this.previousdir =this.tile;
       }
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

    knockback(power, direction, antisuicide){ //TODO something will have to be done to fix epsilon with this eventually
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
        let newTile = this.tile;
        let testTile = newTile;
        while(power > 0){
            testTile = newTile.getNeighbor(direction[0],direction[1]);
            if(testTile.passable && !testTile.monster){
                newTile.setEffect(this.sprite,30);
                newTile = testTile;
                power--;
            }else{
                break;
            }
        }
        if(true){
            if (!(testTile instanceof AbazonWall)) this.move(newTile);
            else if (!antisuicide){
                this.hit(99);
                this.sprite = 83;
            }
            else this.move(newTile);
            //playSound("explosion"); TODO put a cool ori-style sound here later
            //shakeAmount = 35;
        }
    }

    draw(){
        if(this.teleportCounter > 0){                  
            drawSprite(10, this.getDisplayX(),  this.getDisplayY());                 
        }else if (!(this.hp < 0 && area == "Spire")){
            drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
            this.drawHp();
            let chassis = 74;
            if (this.triggered) chassis = 80;
            if (this.installed && this.sprite != 61) drawSprite(chassis, this.getDisplayX(),  this.getDisplayY());
        }
        let speed = 1/8;
        if (this.isPlayer && (this.activemodule == "Thrusters" || this.entranced)) speed = 1;
        if (this.turbo) speed = 1;
        this.offsetX -= Math.sign(this.offsetX)*(speed);     
        this.offsetY -= Math.sign(this.offsetY)*(speed);
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
        if (!this.isInvincible && this.order < 0 && !this.dead){
            for(let i=0; i<Math.min(this.fp,6); i++){
                drawSprite(
                    82,
                    this.getDisplayX() + (i%8)*(2.7/16),   
                    this.getDisplayY() - Math.floor(i/8)*(2/16)
                );
            }
        }
        if (this.marked){
            drawSprite(
                35,
                this.getDisplayX(),
                this.getDisplayY()
            );
        }
        if (this.charmed && !this.name.includes("Rendfly")){
            drawSprite(
                36,
                this.getDisplayX(),
                this.getDisplayY()
            )
        }
        if ((this.shield > 1 && this.isPlayer)||(this.shield > 0 && !this.isPlayer)){
            drawSprite(
                48,
                this.getDisplayX(),
                this.getDisplayY()
            )
        }
        if (this.bonusAttack >= 1){
            drawSprite(
                47,
                this.getDisplayX(),
                this.getDisplayY()
            )
        }
        if (this.enraged){
            drawSprite(
                52,
                this.getDisplayX(),
                this.getDisplayY()
            )
        }
        if (this.deathdelay > 0){
            drawSprite(
                53,
                this.getDisplayX(),
                this.getDisplayY()
            )
        }

    }   

    tryMove(dx, dy){
        let movesave;
        if (dx == -this.lastMove[0] && dy == -this.lastMove[1] && (this instanceof Epsilon)){
            movesave = dx;
            dx = dy;
            dy = movesave;
        }
        let newTile = this.tile.getNeighbor(dx,dy);
        let stuck = newTile.getAdjacentPassableNeighbors();
        if (stuck.length <= 1 && this instanceof Epsilon){
            movesave = dx;
            dx = dy;
            dy = movesave;
            newTile = this.tile.getNeighbor(dx,dy);
        }
        if(newTile.passable){
            this.lastMove = [dx,dy];
            if(!newTile.monster || (newTile.monster && newTile.monster instanceof Harmonizer)){ //||(newTile.monster.charmed&&(this.isPlayer||this.charmed))||newTile.monster.isPassive
                let boxpull = false;
                if ((this.tile.getNeighbor(-dx,-dy).monster instanceof Box) && this.isPlayer) boxpull = this.tile;
                if (this.canmove) this.move(newTile);
                if (boxpull) boxpull.getNeighbor(-dx,-dy).monster.move(boxpull);
                if (this.inhand.includes("LASHOL")) {
                    for (let elem of this.inhand){
                        if(elem == "LASHOL") this.bonusAttack += (1/3);
                    }
                    if (this.bonusAttack >= 5 && this.isPlayer){
                        log.addLog("LASHOL");
                    }
                }
            }else{
                if(((this.isPlayer != newTile.monster.isPlayer)||newTile.monster.marked||(this.charmed && !newTile.monster.isPlayer && !newTile.monster.charmed))&&!this.isPassive && !newTile.monster.isGuide &&!newTile.monster.pushable && !(this.charmed&&newTile.monster.isPlayer)){
                    this.attackedThisTurn = true;
                    if (!this.isFluffy && !(this.isPlayer && area == "Spire")) newTile.monster.hit(this.dmg + Math.floor(this.bonusAttack));
                    else newTile.monster.fp++;
                    if (newTile.monster){
                        if (newTile.monster.fp > 0 && world.serene) newTile.monster.knockback(newTile.monster.fp, [dx, dy]);
                    }
                    if (this.specialAttack == "Charm" && newTile.monster){
                        newTile.monster.charmed = !newTile.monster.charmed;
                        this.specialAttack = "";
                    }
                    if (this.specialAttack == "Harmony" && newTile.monster &&!newTile.monster.isPlayer&&!newTile.monster.loveless){
                        removeItemOnce(monsters, newTile.monster);
                        let fluffy = new BattleFluffy(newTile);
                        monsters.push(fluffy);
                        this.specialAttack = "";
                    }
                    else if (this.specialAttack == "Harmony" && newTile.monster && newTile.monster.isPlayer){ //fluffification 
                        let fluffy = new BattleFluffy(newTile);
                        player = fluffy;
                        this.specialAttack = "";
                    }
                    if (this.specialAttack == "DDelay" && newTile.monster){
                        if (newTile.monster.deathdelay == 0) newTile.monster.falsehp = newTile.monster.hp;
                        newTile.monster.deathdelay = 2;
                        
                    }
                    if (this.specialAttack == "Constrict" && newTile.monster && newTile.monster.isPlayer){
                        newTile.monster.constrict =true;
                    }
                    if (this.specialAttack == "Tox" && newTile.monster && newTile.monster.isPlayer){
                        newTile.monster.rosetox++;
                        newTile.monster.toxified = true;
                    }
                    if (this.specialAttack == "Warp" && newTile.monster){
                        spells["WOOP"](this);
                        let around = this.tile.getAdjacentPassableNeighbors();
                        let empty = around.filter(t => !t.monster);
                        if (empty.length > 0) newTile.monster.move(empty[0]);
                    }
                    if (this.specialAttack == "Trample" && newTile.monster){
                        let lm = this.lastMove;
                        let pushTile = getTile(newTile.x+lm[0],newTile.y+lm[1]);
                        if (inBounds(pushTile.x,pushTile.y) && pushTile.passable){
                            if (pushTile.monster){
                                pushTile.monster.move(getTile(pushTile.x+lm[0],pushTile.y+lm[1]));
                            }
                            newTile.monster.move(pushTile);
                            this.move(newTile);
                        }
                    }
                    this.bonusAttack = 0; //if (this.isPlayer) this.bonusAttack = 99; //godmode

                    shakeAmount = 5;

                    this.offsetX = (newTile.x - this.tile.x)/2;         
                    this.offsetY = (newTile.y - this.tile.y)/2;   
                }
                else if(this.isPlayer && newTile.monster.isGuide && dialoguecount < newTile.monster.diamax){
                    log.addLog(newTile.monster.dialogue[dialoguecount]);
                    dialoguecount++;
                }else if (this.isPlayer && newTile.monster.isGuide && dialoguecount == newTile.monster.diamax){
                    log.addLog(newTile.monster.dialogue[dialoguecount]);//message = newTile.monster.dialogue[dialoguecount];
                    dialoguecount = newTile.monster.diareset;
                }else if (newTile.monster.pushable){
                    let lm = this.lastMove;
                    let corevore = false;
                    let abandon = false;
                    let pushTile = getTile(newTile.x+lm[0],newTile.y+lm[1]);
                    if (inBounds(pushTile.x,pushTile.y) && pushTile.passable){
                        if (pushTile.monster){
                            if (pushTile.monster instanceof Epsilon){
                                pushTile.monster.cores++;
                                for (let x of monsters){
                                    if (x.order == pushTile.monster.cores){
                                        //NYOM!
                                        x.sprite = newTile.monster.sprite;
                                        x.name = newTile.monster.name;
                                        x.ability = newTile.monster.ability;
                                        x.lore = newTile.monster.lore;
                                        x.spritesave = newTile.monster.spritesave;
                                        x.installed = true;
                                        pushTile.monster.corelist.push(newTile.monster.type);
                                    }
                                }
                                let corecount = 0;
                                for (let x of monsters){
                                    if (x instanceof Tail && ((x.sprite == 21) || (x.sprite == 20) || (x.sprite == 19) || (x.sprite == 73) || (x.sprite == 22))) corecount++;
                                }
                                if (corecount == 4){
                                    pushTile.monster.hastalavista = true;
                                    log.addLog("EpsilonAllForOne");
                                    for (let z of monsters){
                                        if (z.order > 0) z.triggered = true;
                                    }
                                    pushTile.monster.vulnerability = 99999;
                                }
                                corevore = true;
                                newTile.monster.hit(99);
                                removeItemOnce(monsters, newTile.monster);
                            }
                            else if (!(pushTile.monster instanceof Box)){
                                abandon = true;
                                let neighbors = this.tile.getAdjacentPassableEmptyNeighbors();
                                if(neighbors.length && !this.isPlayer){
                                    this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
                                }
                                else return false;
                            }
                            else return false; //sigh, you used to be able to push multiple objects. idk what happened
                            //else if (pushTile.monster instanceof Tail) return false;
                            //else pushTile.monster.tryMove(getTile(lm[0],lm[1]);
                        }
                        if (!corevore && !abandon) newTile.monster.move(pushTile);
                        if (!abandon) this.move(newTile);
                    }
                    else{
                        let neighbors = this.tile.getAdjacentPassableEmptyNeighbors();
                        if(neighbors.length && !this.isPlayer){
                            this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
                        }
                        else return false;
                    }
                }
                else{
                    let neighbors = this.tile.getAdjacentPassableEmptyNeighbors();
                    if(neighbors.length && !this.isPlayer){
                        this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
                    }
                    else return false;
                }
            }
            return true;
        }
    }

    hit(damage){            
        if(this.shield>0 || (this.isInvincible && this.order < 0)){           
            return;                                                             
        }
        else if (this.isInvincible && this.order >= 0){
            playSound("epsitink");
            return;
        }
        if (this.deathdelay > 0) this.falsehp -= damage;
        else if (this.deathdelay == 0 && !(this instanceof Tail)) this.hp -= damage;
        else if (this instanceof Tail){
            for (let x of monsters){
                if (x instanceof Epsilon) x.hp -= damage;
            }
        }
        if(this.hp <= 0){
            if (!this.noloot && !this.dead) wheel.addSoul(this.loot);
            this.die();
        }

        if(this.isPlayer){                                                     
            playSound("hit1");                                              
        }else{                                                       
            playSound("hit2");                                              
        }
    }

    die(){
        this.dead = true;
        this.tile.monster = null;
        if (player.reaping && !this.charmed && !this.tile.siphon){
            let husk = new Husk(this.tile);
            monsters.push(husk);
        }
        if (this.tile.siphon && !(this instanceof Felidol) && !(this instanceof Husk)){
            let felid = new Felidol(this.tile);
            let sun = this.lootid.charAt(0) + this.lootid.substring(1).toLowerCase();
            let n = " ";
            if (sun == "Ordered" || sun == "Artistic" || sun == "Unhinged") n = "n ";
            felid.soul = "Animated by a"+n+sun+" ("+basic.indexOf(this.lootid)+") soul.";
            felid.loot = this.loot;
            if (this.charmed && !this.name.includes("Vermin")) felid.charmed = true;
            monsters.push(felid);
            this.tile.siphon = false;
            this.noloot = true;
        }
        if (this instanceof Embalmer){
            monsters.forEach(function(entity){
                if (entity.name == "Rosewrapped Brute" && player.rosetox < 5){
                    entity.enraged = true;
                }
            });
        }
        if (area != "Spire") this.sprite = 1;
        else this.sprite = 83;
    }

    move(tile){
        if(this.tile){
            this.tile.monster = null;
            this.offsetX = this.tile.x - tile.x;    
            this.offsetY = this.tile.y - tile.y;
        }
        this.tile = tile;
        tile.monster = this;                             
        tile.stepOn(this);   
    }
}

class Player extends Monster{
    constructor(tile){
        super(tile, 0, 3, "SOULLESS", description["Terminal"]);
        this.isPlayer = true;
        this.teleportCounter = 0;
        this.inventory = [];
        this.inhand = [];
        this.discard = [];
        this.saved = [];
        this.resolve = 0;
        this.name = "Terminal, the Reality Anchor";
        this.soul = "Does not have a soul of its own -- is merely the combination of its many passengers.";
        this.activemodule = "NONE";
        this.specialAttack = "";
        this.vision = [];
        this.ability = "";
        this.noloot = true;
        this.betted = false;
        this.fov = 0;

        //status effects
        this.constrict = false;
        this.toxified = false;
        this.fuffified = 0;
        this.entranced = false;
        this.reaping = false;
        this.para = 0;
        this.fall = 0;
        this.rosetox = 0;
    }

    cycleModules(){
        let modid = modules.indexOf(this.activemodule);
        if (modid == modules.length-1) modid = 0;
        else modid++;
        this.activemodule = modules[modid];
        if (this.activemodule == "NONE"){
            log.addLog("FluffyModuleFarewell");
            playSound("off");
            
        }
        else{
            log.addLog("FluffyModuleOnline");
            playSound("on");
        }
    }

    update(){
        if (this.tile.name.includes("Toxin")){
            this.rosetox += 2;  
        }
        this.shield--;
        this.fuffified--;
        if (this.fuffified < 1 && this.infested < 1) this.sprite = 0;
        if (this.rosetox > 0){
            if (this.rosetox < 11)sounds["roseic"].volume = (1-(0.1*this.rosetox));
            if (sounds["toxic"].currentTime == 0) playSound("toxic");
            if (this.rosetox < 11) sounds["toxic"].volume = 0.1 * this.rosetox;
            if (!this.toxified) this.rosetox--;
            else {
                this.toxified = false;
            }
            if (this.rosetox > 3){
                for (let x of monsters){
                    x.sprite = 61;
                }
                rosetoxin = 1;
                if (this.rosetox > 4){
                    rosetoxin = 2;
                }
                    if (this.rosetox > 9){
                        this.hit(99);
                        this.sprite = 61;
                    }
            }
            else if (this.rosetox <= 0){
                pauseSound("toxic");
                sounds["roseic"].volume = 1;
                for (let x of monsters) x.sprite = x.spritesave;
                rosetoxin = 0;
            }
        } 
        if (this.deathdelay > 0){
            this.deathdelay--;
            if (this.deathdelay == 0){
                this.hp = this.falsehp;
                if (this.hp <= 0) this.hit(99);
                removeItemOnce(monsters,this);
                if (!this.noloot) wheel.addSoul(this.loot);
                this.noloot = true;
            }
        }                                                 
    }

    tryMove(dx, dy){
        if(super.tryMove(dx,dy)){
            if (world.getRoom() instanceof HarmonyRelay){
                if (world.getRoom().fuffspawn && world.getRoom().fuffspawn.x == this.tile.x && world.getRoom().fuffspawn.y == this.tile.y) this.infested = 1;
                else if (player.infested == 1) this.infested = 0;
            }
            if (this.entranced){
                if (!spells["FERALNODMGS"](this,dx,dy)) this.entranced = false;
                //playSound("boost");
            }
            else if (this.activemodule == "Thrusters"){
                if (this.consumeCommon(1,false)){
                    spells["FERALNODMG"](this,dx,dy);
                    playSound("boost");
                }
                else{
                    log.addLog("FluffyInsufficientPower");
                    this.activemodule = "NONE";
                    playSound("off");
                }
            }
            tick();
        }
        if (area == "Spire" && this.activemodule != "Hover" && !(this.tile.getNeighbor(0,1) instanceof Platform || this.tile.getNeighbor(0,1) instanceof Ladder || this.tile instanceof Ladder || this.tile.getNeighbor(0,1).monster)){
            this.fall++;
        }
        if (this.activemodule == "Hover")
            if (this.consumeCommon(1,false)){
                for (let x of monsters){
                    if (x.teleportCounter > 0) x.teleportCounter++;
                }
            }
            else{
                log.addLog("FluffyInsufficientPower");
                this.activemodule = "NONE";
                playSound("off");
            }
        if (this.para > 0){
            log.addLog("Paralyzed");
        }
        if (this.constrict){
            if (!player.dead) log.addLog("Constricted");
        }
        if (this.fall > 1 && !this.dead){ //wtf why is it fluffexit and not ladder? whatever works I guess
            if (this.tile.name != "Harmonic Seal") log.addLog("Falling");
        }
    }

    consumeCommon(num, harmonize){
        while (num > 0){
            let indexx;
            if (this.inventory.length >= 0 && this.inventory.some(r=> basic.includes(r))){
                while (true){
                    indexx = randomRange(0,this.inventory.length-1);
                    if (basic.includes(this.inventory[indexx])){
                        dontremove.push(this.inventory[indexx]);
                        this.inventory.splice(indexx, 1);
                        if (harmonize) this.inventory.splice(indexx, 0, "SERENE");
                        num--;
                        break;
                    }
                }
            }
            else if (this.discard.length >= 0 && this.discard.some(r=> basic.includes(r))){
                while (true){
                    indexx = randomRange(0,this.discard.length-1);
                    if (basic.includes(this.discard[indexx])){
                        dontremove.push(this.discard[indexx]);
                        this.discard.splice(indexx, 1);
                        if (harmonize) this.discard.splice(indexx, 0, "SERENE");
                        num--;
                        break;
                    }
                }
            }
            else{
                return false;
            }
        }
        return true;
    }

    harmonizeAny(num){
        while (num > 0){
            let indexx;
            if (this.inventory.length >= 0 && this.inventory.some(r=> r!= "SERENE")){
                while (true){
                    indexx = randomRange(0,this.inventory.length-1);
                    if (this.inventory[indexx] != "SERENE"){
                        this.inventory.splice(indexx, 1);
                        this.inventory.splice(indexx, 0, "SERENE");
                        num--;
                        break;
                    }
                }
            }
            else if (this.discard.length >= 0 && this.discard.some(r=> r!= "SERENE")){
                while (true){
                    indexx = randomRange(0,this.discard.length-1);
                    if (this.discard[indexx] != "SERENE"){
                        this.discard.splice(indexx, 1);
                        this.discard.splice(indexx, 0, "SERENE");
                        num--;
                        break;
                    }
                }
            }
            else{
                return false;
            }
        }
        return true;
    }

    addSpell(skey){
        if (smod.includes(skey)) modules.push(skey);
        else{
            this.discard.push(skey);
            if (doublecounter!=0) spells[skey](this);
        }                                             
    }

    drawSpell(){
        if (this.discard.length <= 0 && this.inventory.length <= 0){
            log.addLog("NoSouls");
        }
        else if (this.inhand.length > 8){
            log.addLog("Oversoul");
        }
        else{
            //log.addLog("Empty");
            if (this.inventory.length <= 0){
                //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
    
                shuffle(this.discard)
                for(let i=0;i<this.discard.length;i++){
                    this.inventory.push(this.discard[i]);
                }
                this.discard = [];
            }
            this.inhand.push(this.inventory[0]);
            if(this.inventory[0] == "EZEZZA"){
                this.para = 2;
                log.addLog("EZEZZA");
            }
            this.inventory.shift();
            if (this.resolve > 0){
                this.resolve--
            }
            else{
                truehp--
                if (truehp <= 0){
                    gameState = "dead"
                    pauseAllMusic();
                    playSound("falsity");
                    log.addLog("DrawDeath");
                }
            }
            if (this.activemodule != "Alacrity") tick();
            else if (!this.consumeCommon(1,false)){
                log.addLog("FluffyInsufficientPower");
                playSound("off");
                tick();
                this.activemodule = "NONE";
            } 
        }
    }

    viewSpell(){
        if (this.inventory.length <= 2){
            //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
            shuffle(this.discard)
            for(let i=0;i<this.discard.length;i++){
                this.inventory.push(this.discard[i]);
            }
            this.discard = [];
        }
        this.vision.push(this.inventory[0]);
        this.vision.push(this.inventory[1]);
        this.vision.push(this.inventory[2]);
        this.inventory.shift();
        this.inventory.shift();
        this.inventory.shift();
    }

    castSpell(index){                                 
        let spellName = this.inhand[index];
        if (this.fuffified > 0) spellName = "SERENE";
        if (basic.includes(spellName) && area == "Spire") spellName = spellName+"S";
        if(spellName && !soulabi[spellName].includes("Cannot be activated")){
            log.addLog(spellName);
            spells[spellName](this);
            if (basicspire.includes(spellName)) spellName = spellName.slice(0, -1);
            if (!fail && this.activemodule != "Focus"){
                this.saved.push(spellName);
                this.inhand.splice(index, 1); 
            } //
            else if (this.activemodule == "Focus"){
                if(!this.consumeCommon(3,false)){
                    log.addLog("FluffyInsufficientPower");
                    this.inhand.splice(index, 1);
                    player.activemodule = "NONE";
                    playSound("off");
                    this.saved.push(spellName);
                }
            }
            if (!fail) playSound("spell");
            if (!fail) tick();
            if (fail && spellName != "SERENE") log.addLog("CastError");
            fail = false;
        }
    }
    
    removeSpell(index){
        let removeName = this.inhand[index];
        if (removeName){
            if (agony > 0){
                if (removeName == "SERENE" && agony < 3){
                    log.addLog("FluffyNoRemoveTaunt");
                }
                else{
                    if (removeName == "SERENE") agony -= 3;
                    else agony--;
                    this.inhand.splice(index, 1);
                    resolvebonus++;
                    if (falseagony){
                        gameState = "running";
                        falseagony = false;
                    }
                }
            }
            else{
                log.addLog("AgonyWarning");
            }
        }
    }

    discardSpell(index){
        let discardName = this.vision[index];
        if (discardName){
            this.discard.push(discardName);
            this.vision.splice(index, 1); 
        }
    }

    discardPawSpell(index){
        let discardName = this.inhand[index];
        if (discardName){
            this.discard.push(discardName);
            this.inhand.splice(index, 1);
            discarded++;
            if (naiamode){
                spells[discardName](this);
            }
        }
    }

    undiscard(){
        gameState = "running";
        if (!naiamode){
            log.addLog("ASPHA");
            spells["ASPHAF"](discarded);
        }
        else if (naiamode){
            log.addLog("NAIA");
            naiamode = false;
        }
        discarded = 0;
    }

    stackSpell(index){
        let stackName = this.vision[index];
        if (stackName && stack < 2){
            this.inventory.unshift(stackName);
            this.vision.splice(index, 1);
            stack++;
            spells[stackName](this);
            if (stack == 2){
                stack = 0;
                discarded = 0;
                gameState = "running";
                log.addLog("SHIZAPIS");
            }
        }
    }

    fluffyReroll(){
        let replacecount = 0;
        let allfluffy = true;
        monsters.forEach(function(entity){
            if (entity.name == "Harmonic Cage"){
                replacecount++;
                if (entity.loot != "SERENE"){
                    allfluffy = false;
                }
            }
        });
        if (replacecount == 0) log.addLog("FluffyNoCageTaunt");
        else if (rerolled) log.addLog("FluffyDoubleRerollTaunt");
        else if (allfluffy) log.addLog("FluffySereneRerollTaunt");
        else{
            rerolled = true;
            if (sacritotal > 0) {
                sacritotal -= 10;
                if (sacritotal < 0){
                    sacritotal = 0;
                }
            }
            else if (sacritotal < 0){
                sacritotal += 10;
                if (sacritotal > 0){
                    sacritotal = 0;
                }
            }
            if (sacritotal == 0){
                let moddrop = modulators[randomRange(0,modulators.length-1)];
                if (!(getTile(4,5).monster instanceof Modulorb)) {
                    removeItemOnce(modulators,moddrop);
                    spawnCages(moddrop,getTile(4,5));
                }
                else{
                    let addback = getTile(4,5).monster.loot;
                    getTile(4,5).monster.loot = moddrop;
                    getTile(4,5).monster.soul = "Contains the "+modulename[moddrop];
                    modulators.push(addback);
                }
            }
            let polarity = [tiles[3][3].value,tiles[5][3].value,tiles[3][5].value,tiles[5][5].value];
            let lootdrop = this.cageDrop(polarity, sacritotal);
            let bets = [tiles[5][5],tiles[3][5],tiles[5][3],tiles[3][3]];
            let alreadythere = [];
            bets.forEach(function(entity){
                if (entity.monster && entity.monster.loot != "SERENE"){
                    alreadythere.push(entity.monster.loot);
                }
            });
            while (findCommonElement(alreadythere,lootdrop)){
                lootdrop = this.cageDrop(polarity, sacritotal);
            }
            log.addLog("FluffyAccept");
            replacecount = 3;
            bets.forEach(function(entity){
                if (entity.monster && entity.monster.name == "Harmonic Cage" && entity.monster.loot != "SERENE"){
                    entity.monster.loot = lootdrop[replacecount];
                    entity.monster.soul = "Contains "+soulname[lootdrop[replacecount]];
                    replacecount--;
                }
                else if (!entity.monster || entity.monster.loot != "SERENE"){
                    replacecount--;
                }
            });
            monsters.forEach(function(entity){
                if (entity.name == "Serene Harmonizer"){
                    player.tile.setEffect(26,40);
                    entity.die();
                }
            });
            this.discard.push("SERENE");
        }
    }

    loreSpell(index){
        let spellName = this.inhand[index];
        if (basic.includes(spellName) && area == "Spire") spellName = spellName+"S";
        if(spellName){
            if (rosetoxin > 1){
                printAtWordWrap(souldesc["ROSEILLUSION"], 18, 10, 600, "pink", 20, 940);
                printAtWordWrap(soulabi["ROSEILLUSION"], 18, 10, 725, "pink", 20, 940);
                printAtSidebar(soulval["ROSE"], 18, 590, 195, "cyan", 20, 350);
                printAtSidebar(soulname["ROSE"], 18, 590, 130, "pink", 20, 350);
            }
            else{
                if (this.fuffified > 0) spellName = "SERENE";
                printAtWordWrap(souldesc[spellName], 18, 10, 600, colours[spellName], 20, 940);
                printAtWordWrap(soulabi[spellName], 18, 10, 600+(Math.ceil(souldesc[spellName].length/100)*25), "white", 20, 940);
                printAtSidebar(soulval[spellName], 18, 590, 195, "cyan", 20, 350);
                printAtSidebar(soulname[spellName], 18, 590, 130, colours[spellName], 20, 350);
            }
        }
    }

    loreSpellMonster(spellName){
        if(spellName && spellName != "NOTHING"){
            if (rosetoxin > 0){
                printAtWordWrap(souldesc["ROSEILLUSION"], 18, 10, 600, "pink", 20, 940);
                printAtWordWrap(soulabi["ROSEILLUSION"], 18, 10, 725, "pink", 20, 940);
                printAtSidebar(soulval["ROSE"], 18, 590, 195, "cyan", 20, 350);
                printAtSidebar(soulname["ROSE"], 18, 590, 130, "pink", 20, 350);
            }
            else{
                printAtWordWrap(souldesc[spellName], 18, 10, 600, colours[spellName], 20, 940);
                printAtWordWrap(soulabi[spellName], 18, 10, 600+(Math.ceil(souldesc[spellName].length/100)*25), "white", 20, 940);
                printAtSidebar(soulval[spellName], 18, 590, 195, "cyan", 20, 350);
                printAtSidebar(soulname[spellName], 18, 590, 130, colours[spellName], 20, 350);
            }
        }
        else{
            log.addLog("InvPrompt");
        }
    }

    revivify(){
        gameState = "running"; 
        playSound("newLevel");
        level++;
        let areas = ["Faith","Circus","Spire","Edge"]; // add Edge when it's not bugged "Spire"
        area = areas[randomRange(0,0)]
        for(let i=0;i<this.inhand.length;i++) this.discard.push(this.inhand[i]);
        for(let i=0;i<player.saved.length;i++) player.discard.push(this.saved[i]);
        invsave = this.inventory;
        dissave = this.discard;
        if (level % 5 == 1 && level > 5){
            if (area == "Faith"){
                log.addLog("FluffyWelcome");
                dialoguecount = 0;
            }
            else if (area == "Spire"){
                log.addLog("FluffyWorkshop");
                dialoguecount = 0;
            }
            else if (area == "Faith" && level == 17){
                log.addLog("EpsilonWelcome1");
            }
        }
        if (area == "Spire") spirevisited = true;
        this.hp = 0;
        areachange = false;
        rosetoxin = 0;
        startWorld(Math.min(maxHp, player.hp+6));
        world.fighting = true;
        contemhint = true;
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
        super(tile, 5, 1, "FERAL", description["Shrike"]);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Starpaper Shrike";
        this.ability = monabi["Shrike"];
        this.speed = 2;
    }

    doStuff(){
        this.attackedThisTurn = false;
        super.doStuff();

        if(!this.attackedThisTurn){
            super.doStuff();
        }
    }
}

class Apiarist extends Monster{
    constructor(tile){
        super(tile, 6, 3, "ORDERED", description["Apiarist"]);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Brass Apiarist";
        this.ability = monabi["Apiarist"];
    }

    update(){
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned){
            this.stunned = true;
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

    doStuff(){
        let neighbors = this.tile.getAdjacentNeighbors().filter(t => !t.passable && inBounds(t.x,t.y) && t.eat);
        if(neighbors.length){
            neighbors[0].replace(Floor);
            this.heal(0.5);
        }else{
            super.doStuff();
        }
    }
}

class Tinker extends Monster{
    constructor(tile){
        super(tile, 8, 2, "ARTISTIC", description["Tinker"]);
        this.soul = "Animated by an Artistic (4) soul.";
        this.name = "Frenzied Dream-Tinker";
        this.ability = monabi["Tinker"];
    }

    doStuff(){
        let neighbors = this.tile.getAdjacentPassableNeighbors();
        if(neighbors.length){
            this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
        }
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
    constructor(tile, contents){
        super(tile, 25, 1, contents, description["Cage"]);
        this.soul = "Contains "+soulname[contents];
        this.name = "Harmonic Cage";
        this.teleportCounter = 0;
        this.paralyzed = true;
        this.ability = "";
    }
}

class BattleFluffy extends Monster{
    constructor(tile){
        super(tile, 26, 5, "SERENE", description["Peacemaker"]);
        this.teleportCounter = 0;
        this.soul = "Animated by a Serene (?) soul.";
        this.name = "Serene Peacemaker";
        this.charmed = true;
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
        this.diamax = 9;
        this.dialogue = ["Saint1","Saint2","Saint3","Saint4","Saint5","Saint6","Saint7","Saint8","Saint9","SaintRepeat"]
        this.diareset = 0;
        this.noloot = true;
    }
}

class AbazonSummon extends Monster{
    constructor(tile){
        super(tile, 28, 5, "ABAZON", description["Abazon"]);
        this.teleportCounter = 0;
        this.noloot = true;
        this.charmed = true;
        this.canmove = false;
        this.soul = "Animated by Abazon, the Immovable";
        this.name = "Terracotta Sentry";
        this.isInvincible = true;
        this.permacharm = true;
    }
}

class Oracle extends Monster{
    constructor(tile){
        super(tile, 40, 2, "UNHINGED", description["Oracle"]);
        this.soul = "Animated by an Unhinged (3) soul.";
        this.name = "Anisychic Oracle";
        this.ability = monabi["Oracle"];
        this.inhand = ["LASHOL"];
    }
}

class Snail extends Monster{ // BATTLESNAIL, GET IN THERE!
    constructor(tile){
        super(tile, 41, 2, "ORDERED", description["Snail"]);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Shelled Electromedic";
        this.ability = monabi["Snail"];
        this.canmove = false;
        this.isPassive = true;
    }
    doStuff(){
        let directions = [[-1,0],[1,0],[0,-1],[0,1]];
        let indexx = randomRange(0,3);
        this.lastMove = directions[indexx]
        spells["SNAILLASER"](this);
        super.doStuff();
    }
}

class Husk extends Monster{
    constructor(tile){
        super(tile, 24, 1, "NOTHING", description["Husk"]);
        this.soul = "Soulless.";
        this.name = "Crawling Husk";
        this.ability = monabi["Husk"];
        this.teleportCounter = 0;
        this.charmed = true;
        this.permacharm = true;
        this.noloot = true;
    }
}

class Slug extends Monster{
    constructor(tile){
        super(tile, 29, 2, "ORDERED", description["Slug"]);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Shackle-Slug";
        this.ability = monabi["Slug"];
    }
    update(){
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned && this.teleportCounter != 0){
            this.stunned = true;
            this.tile.cuff = true;
        }
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
        let moncount = monsters.filter(mon => mon.name != "Midnight Ragemaw" && !mon.charmed);
        if (moncount.length >= 1 && !this.respawned){
            let respawn = new Ragemaw(randomPassableTile());
            monsters.push(respawn);
            this.respawned = true;
            super.die();
        }
        else{
            wheel.addSoul(this.loot);
            super.die();
        }
    }
}

class Monk extends Monster{
    constructor(tile){
        super(tile, 45, 2, commoneq[legendaries.castes[randomRange(1,6)]], description["Monk"]);
        let sun = this.lootid.charAt(0) + this.lootid.substring(1).toLowerCase();
        let n = " ";
        if (sun == "Ordered" || sun == "Artistic" || sun == "Unhinged") n = "n ";
        this.soul = "Animated by a"+n+sun+" ("+index+") soul.";
        this.name = "Self-Erased Monk";
        this.ability = monabi["Monk"];
        this.abitimer = 0;
    }
    doStuff(){
        this.abitimer++;
        if (this.abitimer == 3){
            this.abitimer = 0;
            spells[this.lootid](this);
        }
        else{
            super.doStuff();
        }
    }
}

class Felidol extends Monster{
    constructor(tile){
        super(tile, 49, 2, "VILE", description["Felidol"]);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Greedswept Felidol";
        this.ability = monabi["Felidol"];
    }
    die(){
        
        super.die();
        this.tile.siphon = true;
    }
    
}

class Weaver extends Monster{
    constructor(tile){
        super(tile, 27, 2, "ARTISTIC", description["Weaver"]);
        this.soul = "Animated by an Artistic (4) soul.";
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
        this.charmed = true;
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
        this.loveless = true;
        this.abitimer = 0;
        this.vulnerability = 0;
        this.antidash = 0;
        this.nospell = false;
        this.hastalavista = false;
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
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned){
            this.stunned = true;
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
        this.loveless = true;
        this.beepbeepbeep = false;
        this.triggered = false;
    }
    doStuff(){
        this.turbo = false;
        this.bosscard++
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
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned){
            this.stunned = true;
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
        super(tile, 70, 2, "UNHINGED", description["Apis"]);
        this.soul = "Animated by an Unhinged (3) soul.";
        this.name = "Messenger of Aculeo";
        this.ability = monabi["Apis"];
    }
    doStuff(){
        this.specialAttack = "Constrict";
        super.doStuff();
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