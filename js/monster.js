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
}

class Monster{
    constructor(tile, sprite, hp, loot, lore){
        this.move(tile);
        this.sprite = sprite;
        this.spritesave = sprite;
        this.hp = hp;
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
                    //if (!this.noloot) player.addSpell(this.loot);
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
           this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
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

    draw(){
        if(this.teleportCounter > 0){                  
            drawSprite(10, this.getDisplayX(),  this.getDisplayY());                 
        }else{
            drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
            this.drawHp();
            if (this.installed && this.sprite != 61) drawSprite(74, this.getDisplayX(),  this.getDisplayY());
        }
        let speed = 1/8;
        if (this.isPlayer && this.activemodule == "Thrusters") speed = 1;
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
            if(!newTile.monster){ //||(newTile.monster.charmed&&(this.isPlayer||this.charmed))||newTile.monster.isPassive
                //if(newTile.monster){
                //    newTile.monster.move(player.tile);
                //}
                let boxpull = false;
                if ((this.tile.getNeighbor(-dx,-dy).monster instanceof Box) && this.isPlayer) boxpull = this.tile;
                if (this.canmove) this.move(newTile);
                if (boxpull) boxpull.getNeighbor(-dx,-dy).monster.move(boxpull);
                if (this.inhand.includes("LASHOL")) {
                    for (let elem of this.inhand){
                        if(elem == "LASHOL") this.bonusAttack += (1/3);
                    }
                    if (this.bonusAttack >= 5 && this.isPlayer){
                        message = "LASHOL";
                    }
                }
            }else{
                if(((this.isPlayer != newTile.monster.isPlayer)||newTile.monster.marked||(this.charmed && !newTile.monster.isPlayer && !newTile.monster.charmed))&&!this.isPassive && !newTile.monster.isGuide &&!newTile.monster.pushable && !(this.charmed&&newTile.monster.isPlayer)){
                    this.attackedThisTurn = true;
                    newTile.monster.hit(this.dmg + Math.floor(this.bonusAttack));
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
                    this.bonusAttack = 0;

                    shakeAmount = 5;

                    this.offsetX = (newTile.x - this.tile.x)/2;         
                    this.offsetY = (newTile.y - this.tile.y)/2;   
                }
                else if(this.isPlayer && newTile.monster.isGuide && dialoguecount < newTile.monster.diamax){
                    message = newTile.monster.dialogue[dialoguecount];
                    dialoguecount++;
                }else if (this.isPlayer && newTile.monster.isGuide && dialoguecount == newTile.monster.diamax){
                    message = newTile.monster.dialogue[dialoguecount];
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
                                    message = "EpsilonAllForOne";
                                    pushTile.monster.vulnerability = 99999;
                                }
                                corevore = true;
                                newTile.monster.hit(99);
                                removeItemOnce(monsters, newTile.monster);
                            }
                            else if (!(pushTile.monster instanceof Box)){
                                abandon = true;
                                let neighbors = this.tile.getAdjacentPassableEmptyNeighbors();
                                if(neighbors.length){
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
                        if(neighbors.length){
                            this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
                        }
                        else return false;
                    }
                }
                else{
                    let neighbors = this.tile.getAdjacentPassableEmptyNeighbors();
                    if(neighbors.length){
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
            playSound("fail");
            tick();
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
            if (!this.noloot && !this.dead) player.addSpell(this.loot);
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
            let sun = this.loot.charAt(0) + this.loot.substring(1).toLowerCase();
            let n = " ";
            if (sun == "Ordered" || sun == "Artistic" || sun == "Unhinged") n = "n ";
            felid.soul = "Animated by a"+n+sun+" ("+basic.indexOf(this.loot)+") soul.";
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
        if (this.isFluffy) this.sprite = 2;
        else this.sprite = 1;
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
        this.name = "Terminal, the Reality Anchor";
        this.soul = "Does not have a soul of its own -- is merely the combination of its many passengers.";
        this.activemodule = "NONE";
        this.specialAttack = "";
        this.vision = [];
        this.ability = "";
        this.noloot = true;
        this.reaping = false;
        this.betted = false;
        this.para = 0;
        this.fall = 0;
        this.rosetox = 0;
        this.fov = 0;
        this.constrict = false;
        this.toxified = false;
        this.fuffified = 0;
    }

    cycleModules(){
        let modid = modules.indexOf(this.activemodule);
        if (modid == modules.length-1) modid = 0;
        else modid++;
        this.activemodule = modules[modid];
        if (this.activemodule == "NONE"){
            message = "FluffyModuleFarewell";
            playSound("off");
        }
        else{
            message = "FluffyModuleOnline";
            playSound("on");
        }
    }

    update(){
        if (this.tile.name.includes("Toxin")){
            this.rosetox += 2;  
        }
        this.shield--;
        this.fuffified--;
        if (this.fuffified < 1) this.sprite = 0;
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
                if (!this.noloot) player.addSpell(this.loot);
                this.noloot = true;
            }
        }                                                 
    }

    tryMove(dx, dy){
        if(super.tryMove(dx,dy)){
            if (this.activemodule == "Thrusters"){
                if (this.consumeCommon(1,false)){
                    spells["FERALNODMG"](this,dx,dy);
                    playSound("boost");
                }
                else{
                    message = "FluffyInsufficientPower";
                    this.activemodule = "NONE";
                    playSound("off");
                }
            }
            tick();
        }
        if (area == "Spire" && this.activemodule != "Hover" && !(this.tile.getNeighbor(0,1) instanceof Platform || this.tile.getNeighbor(0,1) instanceof Ladder || this.tile instanceof Ladder)){
            this.fall++;
        }
        if (this.activemodule == "Hover")
            if (this.consumeCommon(1,false)){
                for (let x of monsters){
                    console.log(x.teleportCounter);
                    if (x.teleportCounter > 0) x.teleportCounter++;
                }
            }
            else{
                message = "FluffyInsufficientPower";
                this.activemodule = "NONE";
                playSound("off");
            }
        if (this.para > 0){
            message = "Paralyzed";
        }
        if (this.constrict){
            if (!player.dead) message = "Constricted";
        }
        if (this.fall > 0 && !this.dead){ //wtf why is it fluffexit and not ladder? whatever works I guess
            if (this.tile.name != "Harmonic Seal") message = "Falling";
        }
        if (message == "Falling" && this.fall == 0) message = "Empty";
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
            message = "NoSouls";
        }
        else if (this.inhand.length > 8){
            message = "Oversoul";
        }
        else{
            message = "Empty";
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
                message = "EZEZZA";
            }
            this.inventory.shift();
            if (resolve > 0){
                resolve--
            }
            else{
                truehp--
                if (truehp <= 0){
                    gameState = "dead"
                    pauseAllMusic();
                    playSound("falsity");
                    message = "DrawDeath";
                }
            }
            if (this.activemodule != "Alacrity") tick();
            else if (!this.consumeCommon(1,false)){
                message = "FluffyInsufficientPower";
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

    evalSpell(){
        let simplicity = this.inventory.filter(soul => basic.includes(soul));
        let simplicit = this.discard.filter(soul => basic.includes(soul));
        let totallength = simplicit.length + simplicity.length;
        if (totallength < 7){
            //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
            shuffle(this.discard)
            for(let i=0;i<this.discard.length;i++){
                this.inventory.push(this.discard[i]);
            }
            this.discard = [];
        }
        if (totallength < 7){
            message = "FluffyNotEnoughSoulsTaunt";
            monsters.forEach(function(entity){
                if (entity.name == "Serene Harmonizer"){
                    player.tile.setEffect(26,40);
                    entity.die();
                }
            });
            let bets = [tiles[3][3].value,tiles[5][3].value,tiles[3][5].value,tiles[5][5].value];
            for (let i of bets){
                if (i >0 && i<7){
                    this.inhand.push(basic[i]);
                }
            }
            this.discard.push("SERENE");
            this.betted = true;
            rolled = 99;

        }
        else if (totallength >= 7){
            while(this.inhand.length<1){
                if (this.inventory.length < 1){
                    //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
                    shuffle(this.discard)
                    for(let i=0;i<this.discard.length;i++){
                        this.inventory.push(this.discard[i]);
                    }
                    this.discard = [];
                }
                this.inhand.push(this.inventory[0])
                let tester = this.inventory[0];
                this.inventory.shift();
                if (!basic.includes(tester)){
                    this.discard.push(tester);
                    removeItemOnce(this.inhand, tester);
                }
            }
            rolled = 1;
        }
    }

    betSpell(index){
        
        if (this.tile == tiles[3][3]||this.tile == tiles[3][5]||this.tile == tiles[5][5]||this.tile == tiles[5][3]){
            if (this.tile.value != 0){
                message = "FluffyDoubleBetTaunt";
            }
            else{
                let removeName = this.inhand[index];
                this.inhand.splice(index, 1);
                let worth = 0;
                if (removeName && removeName != "TAINTED"){
                    let r = /\d+/;
                    worth = parseInt(soulval[removeName].match(r));
                    this.tile.value = worth;
                    rolled--;
                    removeName +="F";
                    message = removeName;
                }
                else if(removeName == "TAINTED"){
                    message = "FluffyTaintedTaunt";
                    this.tile.value = "0";
                    rolled--;
                }
                else{
                    message = "FluffyNoSoulTaunt";
                }
            }
        }
        else{
            let removeName = this.inhand[index];
            if (removeName){
                message = "FluffyFloorTaunt";
            }
            else{
                message = "FluffyNoSoulTaunt";
            }
        }
    }

    acceptBet(){
        if (tiles[3][3].value == "" && tiles[3][5].value == "" && tiles[5][3].value == "" && tiles[5][5].value == ""){
            message = "FluffyNoBetsTaunt";
        }
        else{
            this.betted = true;
            tiles[3][3].sprite = 2;
            tiles[3][5].sprite = 2;
            tiles[5][5].sprite = 2;
            tiles[5][3].sprite = 2;
            tiles[4].forEach(function(entity){
                if(entity.name == "Negative Harmonic Relay"){
                    entity.sprite = 31
                }
                else if(entity.name == "Positive Harmonic Relay"){
                    entity.sprite = 30
                }
            });
            tiles[2].forEach(function(entity){
                if(entity.name == "Negative Harmonic Relay"){
                    entity.sprite = 31
                }
                else if(entity.name == "Positive Harmonic Relay"){
                    entity.sprite = 30
                }
            });
            tiles[6].forEach(function(entity){
                if(entity.name == "Negative Harmonic Relay"){
                    entity.sprite = 31
                }
                else if(entity.name == "Positive Harmonic Relay"){
                    entity.sprite = 30
                }
            });
            message = "FluffyAllBetsIn";
            playSound("newLevel");
            for(let i=0;i<this.inhand.length;i++){
                this.discard.push(player.inhand[i]);
                this.inhand.splice(i, 1);
            }
            rolled = 0;
            monsters.forEach(function(entity){
                if (entity.name == "Serene Harmonizer"){
                    entity.dialogue = ["FluffyExplain6", "FluffyExplain7", "FluffyExplain8", "FluffyExplain9", "FluffyExplain10", "FluffyExplain11", "FluffyExplain12","FluffyExplain13","Empty", "FluffyRepeat"];
                    entity.diamax = 9;
                    entity.diareset = 2;
                    dialoguecount = 0;
                } 
            });
        }
   
    }


    rollSpell(){
            //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
        shuffle(this.discard)
        for(let i=0;i<this.discard.length;i++){
            this.inventory.push(this.discard[i]);
        }
        this.discard = [];
        let simplicity = this.inventory.filter(soul => basic.includes(soul));
        let simplicit = this.discard.filter(soul => basic.includes(soul));
        let totallength = simplicit.length + simplicity.length;
        if (totallength < (6-sacrifice)){
            message = "FluffyNotEnoughSoulsTaunt";
            monsters.forEach(function(entity){
                if (entity.name == "Serene Harmonizer"){
                    player.tile.setEffect(26,40);
                    entity.die();
                }
            });
            let bets = [tiles[3][3].value,tiles[5][3].value,tiles[3][5].value,tiles[5][5].value,tiles[2][5].value,tiles[6][5].value,tiles[4][6].value,tiles[4][2].value,tiles[2][3].value,tiles[6][3].value];
            for (let i of bets){
                if (i >0 && i<7){
                    this.inhand.push(basic[i]);
                }
            }
            this.discard.push("SERENE");
            rolled = 99;
        }
        else{
            while(this.inhand.length<2){
                if (this.inventory.length < 2){
                    //this.discard.push("TAINTED") //remplacer avec curse, dash est un placeholder
                    shuffle(this.discard)
                    for(let i=0;i<this.discard.length;i++){
                        this.inventory.push(this.discard[i]);
                    }
                    this.discard = [];
                }
                this.inhand.push(this.inventory[0])
                let tester = this.inventory[0];
                this.inventory.shift();
                if (!basic.includes(tester)){
                    this.discard.push(tester);
                    removeItemOnce(this.inhand, tester);
                }
            }

            rolled = 2;
            tick();
        }
    }

    castSpell(index){                                 
        let spellName = this.inhand[index];
        if (this.fuffified > 0) spellName = "SERENE";
        if(spellName && !soulabi[spellName].includes("Cannot be activated")){
            message = spellName;
            spells[spellName](this);
            if (!fail && this.activemodule != "Focus"){
                this.saved.push(spellName);
                this.inhand.splice(index, 1); 
            } //
            else if (this.activemodule == "Focus"){
                if(!this.consumeCommon(3,false)){
                    message = "FluffyInsufficientPower";
                    this.inhand.splice(index, 1);
                    player.activemodule = "NONE";
                    playSound("off");
                    this.saved.push(spellName);
                }
            }
            if (!fail) playSound("spell");
            if (!fail) tick();
            if (fail && spellName != "SERENE") message = "CastError";
            fail = false;
        }
    }
    
    removeSpell(index){
        let removeName = this.inhand[index];
        if (removeName){
            if (agony > 0){
                if (removeName == "SERENE" && agony < 3){
                    message = "FluffyNoRemoveTaunt";
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
                message = "AgonyWarning";
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
            message = "ASPHA";
            spells["ASPHAF"](discarded);
        }
        else if (naiamode){
            message = "NAIA";
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
                message = "SHIZAPIS";
            }
        }
    }



    sacrificeSpell(index){
        if (this.tile == tiles[2][3]||this.tile == tiles[4][2]||this.tile == tiles[6][3]||this.tile == tiles[2][5]||this.tile == tiles[4][6] || this.tile == tiles[6][5]){
            if (this.tile.value != 0){
                message = "FluffyDoubleSacTaunt";
            } 
            else{
                let removeName = this.inhand[index];
                this.inhand.splice(index, 1);
                let worth = 0;
                if (removeName){
                    let r = /\d+/;
                    if (removeName == "TAINTED") worth = Math.floor(Math.random() * 6)+1;
                    else worth = parseInt(soulval[removeName].match(r));
                    this.tile.value = worth;
                    rolled--;
                    sacrifice++;
                    removeName +="F";
                    message = removeName;
                    if (sacrifice == 6){
                        sacritotal = parseInt(""+tiles[2][3].value+tiles[4][2].value+tiles[6][3].value) - parseInt(""+tiles[2][5].value+tiles[4][6].value+tiles[6][5].value);
                        //let polarity = mode([tiles[2][3].value,tiles[4][2].value,tiles[6][3].value,tiles[2][5].value,tiles[4][6].value,tiles[6][5].value]);
                        let polarity = [tiles[3][3].value,tiles[5][3].value,tiles[3][5].value,tiles[5][5].value];
                        this.cageDrop(polarity, sacritotal);
                    }
                }
                else{
                    message = "FluffyNoSoulTaunt";
                }
            }
        }
        else{
            let removeName = this.inhand[index];
            if (removeName){
                message = "FluffyFloorTaunt";
            }
            else{
                message = "FluffyNoSoulTaunt";
            }
            
        }
    }

    decideLoot(polarity){
        let lootdrop = ["NOTHING","NOTHING","NOTHING","NOTHING"];
        for (let i = 0;i<polarity.length;i++){
            if (polarity[i] == 1) lootdrop[i] = vile[randomRange(0,vile.length-1)];
            else if (polarity[i] == 2) lootdrop[i] = feral[randomRange(0,feral.length-1)];
            else if (polarity[i] == 3) lootdrop[i] = unhinged[randomRange(0,unhinged.length-1)];
            else if (polarity[i] == 4) lootdrop[i] = artistic[randomRange(0,artistic.length-1)];
            else if (polarity[i] == 5) lootdrop[i] = ordered[randomRange(0,ordered.length-1)];
            else if (polarity[i] == 6) lootdrop[i] = saintly[randomRange(0,saintly.length-1)];
            else if (polarity[i] == "0") lootdrop[i] = "SERENE";
            if (lootdrop[i]=="AUBE") removeItemOnce(artistic, "AUBE");
        }
        return lootdrop;
    }
            //cagedrop once used to be lootdrop[0] = bad[Math.abs(Math.floor((bad.length-1)/6 * polarity - randomRange(0, (bad.length-1)/6)))];
    cageDrop(polarity, quality){
        let fluffchance  = quality/4;
        if (rerolled) fluffchance = 0;
        let bonusartifact = false;
        let bets = [tiles[3][3],tiles[5][3],tiles[3][5],tiles[5][5]];
        let lootdrop = this.decideLoot(polarity);
        if (quality < 0){
            message = "FluffyAppalled";
            fluffchance = 100;
        }
        else if (quality >= 300){
            message = "FluffyMocking";
        }
        else if (quality > 99 && quality <= 299){
            message = "FluffyDisgusted";
        }
        else if (quality > 10 && quality <= 99){
            message = "FluffySatisfied";
        }
        else if (quality > 0 && quality <= 10){
            message = "FluffyImpressed";
            fluffchance = 0;
        }
        else if (quality == 0){
            message = "FluffyExalted";
            fluffchance = 0;
            bonusartifact = true;
        }
        else{
            message = "FluffyCheat";
            lootdrop[0] = lootdrop[1] = lootdrop[2] = lootdrop[3] = "SHIZAPIS";
            fluffchance = 0;
        }
            
        for (let i = 0;i<lootdrop.length;i++){
            if (lootdrop[i]!="NOTHING"){
                if (randomRange(0,100) < fluffchance){
                    lootdrop[i] = "SERENE";
                }
                if (!rerolled) spawnCages(lootdrop[i],bets[i]);
                else return lootdrop;
            }
        }
        if (bonusartifact){
            let moddrop = modulators[randomRange(0,modulators.length-1)];
            removeItemOnce(modulators,moddrop);
            spawnCages(moddrop,getTile(4,5));
        }
        
        
        monsters.forEach(function(entity){
            if (entity.name == "Serene Harmonizer"){
                entity.dialogue = ["FluffyReroll1", "FluffyReroll2", "FluffyReroll3", "FluffyReroll4", "FluffyReroll5", "FluffyReroll6", "Empty", "FluffyRepeat2"];
                entity.diamax = 7;
                entity.diareset = 2;
                dialoguecount = 0;
            } 
        });
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
        if (replacecount == 0) message = "FluffyNoCageTaunt";
        else if (rerolled) message = "FluffyDoubleRerollTaunt";
        else if (allfluffy) message = "FluffySereneRerollTaunt";
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
            message = "FluffyAccept";
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
            message = "InvPrompt";
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
                gameState = "fluffy";
                message = "FluffyWelcome";
                dialoguecount = 0;
            }
            else if (area == "Spire"){
                message = "FluffyWorkshop";
                dialoguecount = 0;
            }
            else if (area == "Faith" && level == 17){
                message = "EpsilonWelcome1";
            }
        }
        if (area == "Spire") spirevisited = true;
        this.hp = 0;
        areachange = true;
        rosetoxin = 0;
        startLevel(Math.min(maxHp, player.hp+6));
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
        if (area == "Faith"){
            this.dialogue = ["FluffyHmm","FluffyExplain1", "FluffyExplain2", "FluffyExplain3","FluffyExplain4","FluffyExplain5","Empty","FluffyRepeat"];
            this.diamax = 7;
            this.diareset = 3;
        }
        else if (area == "Spire"){
            this.dialogue = ["FluffyModule1","FluffyModule2","FluffyModule3","FluffyModule4","FluffyModule5","FluffyModule6","FluffyModule7","Empty","FluffyModuleRepeat"];
            this.diamax = 8;
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
                message = "FluffyInsufficientPower";
                player.activemodule = "NONE";
                playSound("off");
            }
        }
        else if (!this.attackedThisTurn && player.activemodule == "Thrusters"){
            if (player.consumeCommon(1,false)) spells["FERAL"](this);
            else{
                message = "FluffyInsufficientPower";
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
                    message = "FluffyInsufficientPower";
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
        super(tile, 26, 5, "SERENE", description["Peacemaker"]);
        this.teleportCounter = 0;
        this.soul = "Animated by a Serene (?) soul.";
        this.name = "Serene Peacemaker";
        this.isFluffy = true;
        this.ability = "";
        this.noloot = true;
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
        this.diamax = 10;
        this.dialogue = ["Saint1","Saint2","Saint3","Saint4","Saint5","Saint6","Saint7","Saint8","Saint9","SaintRepeat","Empty"]
        this.diareset = 0;
        this.noloot = true;
    }
}

class Abazon extends Monster{
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
            player.addSpell(this.loot);
            super.die();
        }
    }
}

class Monk extends Monster{
    constructor(tile){
        super(tile, 45, 2, "NOTHING", description["Monk"]);
        let index = randomRange(1,6);
        this.loot = basic[index];
        let sun = this.loot.charAt(0) + this.loot.substring(1).toLowerCase();
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
            spells[this.loot](this);
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
                    playSound("fail");
                    message = "EpsilonRedWeak";
                    removeItemOnce(this.corelist,"Red");
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
            playSound("fail");
            message = "EpsilonWhiteWeak";
            this.vulnerability = 25;
            removeItemOnce(this.corelist,"White");
        }
        //Pink vuln test
        if (player.rosetox >= 4 && this.corelist.includes("Pink") && !this.hastalavista){
            playSound("fail");
            message = "EpsilonPinkWeak";
            this.vulnerability = 10;
            removeItemOnce(this.corelist,"Pink");
        }
        //Cyan vuln test
        for (let x of monsters){
            if (x.order >= 0){
                let fuffcheck = x.tile.getAdjacentNeighbors()
                for (let y of fuffcheck){
                    if (y.monster && this.corelist.includes("Cyan") && !this.hastalavista){
                        if (y.monster instanceof BattleFluffy){
                            message = "EpsilonCyanWeak";
                            this.vulnerability = 5;
                            removeItemOnce(this.corelist,"Cyan");
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
            message = "EpsilonRestored";
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
        //TODO: update lore to reflect changes
        //TODO: let the player attack any time, remove epsilon's invincibility to avoid softlock
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
        this.soul = "Animated by a Ordered (5) soul.";
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