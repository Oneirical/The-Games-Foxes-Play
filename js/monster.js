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
        return this.tile.x;
    }

    getDisplayY(){                                                                  
        return this.tile.y;
    }
    draw(){
        drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
        this.offsetX -= Math.sign(this.offsetX)*(1/8);     
        this.offsetY -= Math.sign(this.offsetY)*(1/8); 
    }
    tryMove(newTile){
        if (newTile.x < numTiles && newTile.y < numTiles && newTile.x >= 0 && newTile.y >= 0){
            if (inResearch && !(research.page[newTile.x][newTile.y] instanceof ResearchNode || research.page[newTile.x][newTile.y] instanceof ResearchConnector )) return;
            this.move(newTile);
        }
    }
    move(tile){
        if (tile == this.tile) return
        if(this.tile){
            this.offsetX = this.tile.x - tile.x;    
            this.offsetY = this.tile.y - tile.y;
        }
        this.tile = tile;
        tile.cursor = this;
        research.looking = false;
        if (!(this.tile instanceof ResearchNode)) research.exppage = new TutorialDisplay("Default");                     
    }
    die(){
        this.dead = true;
        this.tile.cursor = null;
        this.sprite = 99999;
    }
    info(){
        if (inResearch){
            if (research.page[this.tile.x][this.tile.y] instanceof ResearchNode){
                let cx = this.tile.x;
                let cy = this.tile.y;
                research.displayNode(cx, cy);
            }
            return;
        }
        if (this.tile.monster){
            if (rosetoxin > 0){
                printOutText(description["Rose"], 18, 10, 600, "pink", 20, 690);
                printOutText("Rose Rose Rose", 18, 590, 70, "pink", 20, 350);
                printOutText("Rose", 18, 590, 30, "pink", 20, 350);
            }
            else if (this.tile.monster.teleportCounter > 0){
                printOutText(description["Warp"], 18, 10, 600, "white", 20, 690);
                printOutText("The details of this soul are not clear to you yet.", 18, 590, 70, "white", 20, 350);
                printOutText("Warp-wisp", 18, 590, 30, "white", 20, 350);
            }
            else{
                printOutText(this.tile.monster.lore, 18, 10, 600, "white", 20, 690);
                printOutText(this.tile.monster.soul, 18, 590, 70, "white", 20, 350);
                printOutText(this.tile.monster.name, 18, 590, 30, "white", 20, 350);
                printOutText(this.tile.monster.ability, 18, 10, 630+((this.tile.monster.lore.length/100)*20), "pink", 20, 690);
                for (let i of Object.keys(this.tile.monster.statuseff)){
                    if (this.tile.monster.statuseff[i] > 0){
                        printOutText(i, 18, 590, 130+Object.keys(this.tile.monster.statuseff).indexOf(i)*10, "white", 20, 690);
                        printOutText(this.tile.monster.statuseff[i].toString(), 18, 750, 130+Object.keys(this.tile.monster.statuseff).indexOf(i)*10, "white", 20, 690);
                    }
                }
            }
        }
        else{
            let colour = "lightgray";
            if (this.tile.sprite == 61 || this.tile.sprite == 62) colour = "white";
            printOutText(this.tile.lore, 18, 10, 600, colour, 20, 690);
            printOutText(this.tile.name, 18, 590, 30, colour, 20, 350);
        }
        

    }
    debug(){
        console.log(this.tile.id);
    }
}

function summonMonster(x,y,type){
    let tile = getTile(x,y);
    let monster = new type(tile);
    monster.teleportCounter = 0;
    monsters.push(monster);
}

function unlockAllSpells(){
    for (let i of Object.keys(spellpatterns)){
        research.knownspells.push(i);
    }
}

function createSpell(contin,form,mod,func){
    return new LegendSpell([contin],[form],[mod],[func],"VILE");
}

class DroppedSoul{
    constructor(tile, type, attach){
        this.move(tile);
        const sprites = {
            "Saintly" : 0,
            "Ordered" : 1,
            "Artistic" : 2,
            "Unhinged" : 3,
            "Feral" : 4,
            "Vile" : 5, 
        }
        this.type = type;
        this.sprite = sprites[type];
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.attach = attach;
        this.speed = 1/8;
    }

    getDisplayX(){                     
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.tile.y + this.offsetY;
    }

    move(tile){
        if(this.tile){
            removeItemOnce(this.tile.souls,this);
            this.offsetX = this.tile.x - tile.x;    
            this.offsetY = this.tile.y - tile.y;
            this.speed = 1/8*(Math.abs(this.offsetX)+Math.abs(this.offsetY));
        }
        this.tile = tile;
        this.tile.souls.push(this);                       
    }

    draw(){
        if (this.tile == this.attach.tile && this.offsetX == 0 && this.offsetY == 0) return;
        ctx.globalAlpha = 0.5;
        drawSymbol(this.sprite, this.getDisplayX()*tileSize + shakeX,  this.getDisplayY()*tileSize + shakeY,tileSize);
        ctx.globalAlpha = 1;
        if (false) speed = 1; // ???
        this.offsetX -= Math.sign(this.offsetX)*(this.speed);     
        this.offsetY -= Math.sign(this.offsetY)*(this.speed);
    }

    update(){
        if (this.attach.soulstun <= 3){
            this.move(this.attach.tile);
        }
        if (this.attach.soulstun < 1){
            removeItemOnce(this.tile.souls,this);
            removeItemOnce(droppedsouls,this);
            this.attach.souldropped = false;
        }
    }
}

class Monster{
    constructor(tile, sprite, hp, loot, lore){
        this.sprite = sprite;
        this.spritesave = sprite;
        this.hp = hp;
        this.speed = 1;
        this.fphit = 0;
        this.fp = 0; //it stands for fluffy points
        this.dmg = 1;
        this.loot = loot;
        this.anispeed = 1/8;
        this.step = false;
        this.nostun = false;
        this.loveless = false;
        this.teleportCounter = 3;
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.souldropped = false; 
        this.lastMove = [-1,0];
        this.targeted = false;   
        this.bonusAttack = 0;
        this.lore = lore;
        this.specialAttack = "";
        this.paralyzed = false;
        this.isFluffy = false;
        this.noloot = false;
        this.canmove = true;

        this.statuseff = {
            "Persuasive" : 0,
            "Charmed" : 0,
            "Marked" : 0,
            "Dissociated" : 0,
            "Invincible" : 0,
        }

        this.permacharm = false;
        this.enraged = false;
        this.inhand = [];
        this.falsehp = 0;
        this.statuseff["Dissociated"] = 0;
        this.soulless = false;
        this.order = -1;
        this.infested = 0;
        this.soulstun = 0;
        this.doomed = false;
        this.previousdir;
        this.lootid = this.loot;
        if (legendaries.castes.includes(this.loot)) this.loot = commoneq[this.loot];
        if (tile == "disabled") return;
        this.move(tile);
        this.adjacentmon = this.tile.getAdjacentNeighbors().filter(t => t.monster && !t.monster.isPlayer).length;
    }

    heal(damage){
        if (this instanceof Tail){
            for (let x of monsters){
                if (x instanceof Epsilon) x.hp = Math.min(33, x.hp+damage);
            }
        }
        else if (this.statuseff["Dissociated"] == 0) this.hp = Math.min(maxHp, this.hp+damage);
        else if (this.statuseff["Dissociated"] > 0) this.falsehp = Math.min(maxHp, this.falsehp+(damage*2));
    }

    update(){
        let kashcheck = false;
        if (this.statuseff["Dissociated"] > 0) kashcheck = true;
        for (let i of Object.keys(this.statuseff)){
            this.statuseff[i] = Math.max(0,this.statuseff[i]-1);
        }
        this.teleportCounter--;

        if (this.statuseff["Dissociated"] == 0 && kashcheck){
            if (this.falsehp <= 0){
                if (!this.isPlayer) this.hit(99);
                else this.doomed = true;
                this.noloot = true;
            }
            else this.hp = this.falsehp;
        }
        if (this.soulless) return;
        if (this.soulstun > 2){
            this.soulstun--;
            return;
        }
        if(this.stunned|| this.step ||this.teleportCounter > 0){
            this.stunned = false;
            if (this.step){
                this.step = false;
                return;
            }
            if (!this.nostun) return;
        }
        if(this.paralyzed) return;
        if(this.statuseff["Charmed"] > 0 && monsters.length < 2 && !this.permacharm) this.statuseff["Charmed"] = 0;
        this.doStuff();
    }

    doStuff(){
       let neighbors = this.tile.getAdjacentPassableNeighbors();
       
       if (this.statuseff["Charmed"] > 0 && !this.name.includes("Rendfly")) neighbors = neighbors.filter(t => !t.monster || !t.monster.isPlayer || !t.monster.statuseff["Marked"] > 0 || !(t.monster.statuseff["Charmed"] > 0));
       else if (this.statuseff["Charmed"] > 0) neighbors = neighbors.filter(t => !t.monster || !t.monster.isPlayer || !t.monster.statuseff["Marked"] > 0 || !(t.monster.statuseff["Charmed"] > 0));
       else neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer || t.monster.statuseff["Marked"] > 0 || t.monster instanceof Box);

       if(neighbors.length){
            let markcheck = false;
            let enemy = player;
            monsters.forEach(function(entity){
               if (entity.statuseff["Marked"] > 0){
                   markcheck = true;
                   enemy = entity;
               }
            });
            if (this.statuseff["Charmed"] > 0){
                
                let testresult = [];
                monsters.forEach(function(entity){
                    let option = neighbors;
                    
                    option.sort((a,b) => a.dist(entity.tile) - b.dist(entity.tile));
                    testresult.push(option[0]);
                    let valid = false;
                    
                    testresult.forEach(function(t){
                        if (option[0].x <= t.x && option[0].y <= t.y) valid = true;
                    });
                    if (entity.statuseff["Charmed"] > 0 || entity instanceof Box) valid = false;
                    if (valid) enemy = entity;
                    
                });
            }
            if ((markcheck && !this.statuseff["Marked"] > 0||this.statuseff["Charmed"] > 0)){ //
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

    draw(){
        if(this.teleportCounter > 0){                  
            drawSprite(10, this.getDisplayX(),  this.getDisplayY());                 
        }else if (!(this.hp < 0 && area == "Spire")){
            if (this.isFluffy) ctx.globalAlpha = 0.5;
            drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
            ctx.globalAlpha = 1;
            this.drawHp();
            let chassis = 74;
            if (this.triggered) chassis = 80;
            if (this.installed && this.sprite != 61) drawSprite(chassis, this.getDisplayX(),  this.getDisplayY());
        }
        //let speed = 1/8;
        //if (this.isPlayer && (this.activemodule == "Thrusters" || this.entranced)) speed = 1;
        //if (this.turbo) speed = 1;
        if (this.offsetX >= 0) this.offsetX = Math.max(this.offsetX - Math.sign(this.offsetX)*(this.anispeed),0);
        else this.offsetX = Math.min(this.offsetX - Math.sign(this.offsetX)*(this.anispeed),0);
        if (this.offsetY >= 0) this.offsetY = Math.max(this.offsetY - Math.sign(this.offsetY)*(this.anispeed),0);
        else this.offsetY = Math.min(this.offsetY - Math.sign(this.offsetY)*(this.anispeed),0);
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
        if (!this.isInvincible && this.order < 0 && !this.dead && !(world.getRoom() instanceof WorldSeed)){
            for(let i=0; i<Math.min(this.fp,6); i++){
                drawSprite(
                    82,
                    this.getDisplayX() + (i%8)*(2.7/16),   
                    this.getDisplayY() - Math.floor(i/8)*(2/16)
                );
            }
        }
        if (this.statuseff["Marked"] > 0){
            drawSprite(
                35,
                this.getDisplayX(),
                this.getDisplayY()
            );
        }
        if (this.statuseff["Persuasive"] > 0||this.statuseff["Charmed"] > 0 && !this.name.includes("Rendfly")){
            drawSprite(
                36,
                this.getDisplayX(),
                this.getDisplayY()
            )
        }
        if ((this.statuseff["Invincible"] > 1 && this.isPlayer)||(this.statuseff["Invincible"] > 0 && !this.isPlayer)){
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
        if (this.statuseff["Dissociated"] > 0){
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
            if(!newTile.monster || (newTile.monster && newTile.monster instanceof Harmonizer)){ //||(newTile.monster.statuseff["Charmed"] > 0&&(this.isPlayer||this.statuseff["Charmed"] > 0))||newTile.monster.isPassive
                let boxpull = false;
                if (this.tile.getNeighbor(-dx,-dy).monster && this.tile.getNeighbor(-dx,-dy).monster.pushable && this.isPlayer) boxpull = this.tile;
                if (this.canmove) this.move(newTile);
                if (boxpull) boxpull.getNeighbor(-dx,-dy).monster.move(boxpull);
                for (let x of legendaries.active){
                    if (x instanceof Lashol) player.bonusAttack += (1/3);
                }
                if (this instanceof Oracle) this.bonusAttack += (1/3);
                if (this.bonusAttack == 3 && this.isPlayer){
                    log.addLog("LASHOL");
                }
            }else{
                let crit;
                research.completeResearch("Intro");
                if(((this.isPlayer != newTile.monster.isPlayer)||newTile.monster.statuseff["Marked"] > 0||(this.statuseff["Charmed"] > 0 && !newTile.monster.isPlayer && !newTile.monster.statuseff["Charmed"] > 0))&&!this.isPassive && !newTile.monster.isGuide &&!newTile.monster.pushable && !(this.statuseff["Charmed"] > 0&&newTile.monster.isPlayer)){
                    this.attackedThisTurn = true;
                    let bonusAttack = this.bonusAttack;
                    this.bonusAttack = 0;
                    if (!this.fphit) newTile.monster.hit(this.dmg + Math.floor(bonusAttack));
                    else newTile.monster.fp+=this.fphit;
                    if (newTile.monster){
                        if (newTile.monster.fp > 0) {
                            crit = newTile.monster.knockback(newTile.monster.fp, [dx, dy]);
                            if (world.getRoom() instanceof WorldSeed){
                                player.fp = 0;
                                player.hit(1);
                            }
                        }
                    }
                    if ((this.statuseff["Persuasive"] > 0) && newTile.monster){
                        newTile.monster.statuseff["Charmed"] += 25;
                        this.statuseff["Persuasive"] = lose(this.statuseff["Persuasive"],5);
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
                        if (newTile.monster.statuseff["Dissociated"] == 0) newTile.monster.falsehp = newTile.monster.hp;
                        newTile.monster.statuseff["Dissociated"] = 2;
                        
                    }
                    if (this.specialAttack == "Constrict" && newTile.monster && newTile.monster.isPlayer){
                        if (!newTile.monster.constrict) log.addLog("Constricted");
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
                    //this.bonusAttack = 0; //if (this.isPlayer) this.bonusAttack = 99; //godmode

                    shakeAmount = 5;
                    if (crit) shakeAmount = 15;

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
        if(this.statuseff["Invincible"]>0 || (this.isInvincible && this.order < 0)){           
            return;                                                             
        }
        else if (this.isInvincible && this.order >= 0){
            playSound("epsitink");
            return;
        }
        if (this.statuseff["Dissociated"] > 0) this.falsehp -= damage;
        else if (this.statuseff["Dissociated"] == 0 && !(this instanceof Tail)) this.hp -= damage;
        else if (this instanceof Tail){
            for (let x of monsters){
                if (x instanceof Epsilon) x.hp -= damage;
            }
        }
        //if (this.isPlayer) this.hp += damage; //godmode
        if(this.hp <= 0 && !this.dead){
            this.die();
            if (!this.noloot) wheel.addSoul(this.loot);
        }

        if(this.isPlayer){                                                     
            playSound("hit1");                                              
        }else{                                                       
            playSound("hit2");                                              
        }
    }

    die(){
        this.dead = true;
        this.tile.monster = 0;
        if (player.reaping && !this.statuseff["Charmed"] > 0 && !this.tile.siphon && !this.respawned){
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
            if (this.statuseff["Charmed"] > 0 && !this.name.includes("Vermin")) felid.statuseff["Charmed"] += this.statuseff["Charmed"];
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
            this.tile.monster = 0;
            this.offsetX = this.tile.x - tile.x;    
            this.offsetY = this.tile.y - tile.y;
            this.anispeed = 1/7*(Math.abs(this.offsetX)+Math.abs(this.offsetY));
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
        this.discarded = 0;
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
        this.souldropped = true;

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
        for (let i of Object.keys(this.statuseff)){
            this.statuseff[i] = Math.max(0,this.statuseff[i]-1);
        }
        this.fuffified--;
        if (this.fuffified < 1 && this.infested < 1 && !this.dead) this.sprite = 0;
        if (this.rosetox <= 0) rosetoxin = 0;
        else if (this.rosetox > 0){
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
        if (legendaries.hasSoul(Kashia) && this.statuseff["Dissociated"] < 1){
            this.statuseff["Dissociated"] = 5;
            this.falsehp = this.hp;
        }
        if (this.statuseff["Dissociated"] > 0){
            if (this.falsehp < 1){
                log.addLog("KashiaLethal");
                playSound("deathdelay");
            }
            if (this.statuseff["Dissociated"] == 0){
                if (this.isPlayer){
                    for (let g of legendaries.active){
                        if (g instanceof Kashia) this.statuseff["Dissociated"] = 5;
                    }
                }
                this.hp = this.falsehp;
                if (this.hp <= 0) this.hit(99);
                removeItemOnce(monsters,this);
                if (!this.noloot) wheel.addSoul(this.loot);
                this.noloot = true;
            }
        }                                                 
    }

    tryMove(dx, dy){
        if (gameState != "running") return;
        let neighbours = player.tile.getAdjacentNeighbors();
        let check = true;
        let constrictatk = false;
        if (getTile(this.tile.x + dx,this.tile.y+dy).monster) constrictatk = true;
        if (naiamode && !constrictatk) wheel.endDiscard();
        else if (gameState == "discard" && !constrictatk) return;
        for (let i of neighbours){
            if(i.monster instanceof Apis){
                check = false;
            }
        }
        if (check) this.constrict = false;
        if (this.constrict){
            if (!player.dead) {
                if (!constrictatk){
                    log.addLog("Constricted");
                    return;
                }
            }
        }
        if (this.para > 0){
            player.para--;
            tick();
            return;
        }
        if(super.tryMove(dx,dy)){
            legendaries.castContin("STEP");
            if (world.getRoom() instanceof SoulCage && false){
                const soultypes = {
                    0: "EMPTY",
                    1 : "SAINTLY",
                    2: "ORDERED",
                    3: "ARTISTIC",
                    4: "UNHINGED",
                    5: "FERAL",
                    6: "VILE",
                    7: "SERENE",
                }
                let set = wheel.lookForSoul(soultypes[wheel.currentbrush],wheel.turbstatus);
                if (set && wheel.wheel[wheel.currentbrush] instanceof Empty){
                    let replace;
                    if (set[0] == "discard"){
                        replace = wheel.discard[set[1]];
                        wheel.wheel[wheel.currentbrush] = replace;
                        removeItemOnce(wheel.discard,wheel.discard[set[1]]);
                    }
                    else if (set[0] == "pile"){
                        replace = wheel.pile[set[1]];
                        wheel.wheel[wheel.currentbrush] = replace;
                        removeItemOnce(wheel.pile,wheel.pile[set[1]]);
                    }
                }
                else if (wheel.wheel[wheel.currentbrush] instanceof Empty){
                    if (wheel.currentbrush == 0){
                        wheel.retrieveSoul();
                        return;
                    }
                    shakeAmount = 5;
                    log.addLog("BrushError");
                    return;
                }
                wheel.cageSoul(wheel.currentbrush);
            }
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
            if (!naiamode) tick();
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
            //legacy modulator code in castSpell()
            //else if (this.activemodule == "Focus"){
                //if(!this.consumeCommon(3,false)){
                    //log.addLog("FluffyInsufficientPower");
                    //this.inhand.splice(index, 1);
                    //player.activemodule = "NONE";
                    //playSound("off");
                    //this.saved.push(spellName);

    discardSpell(index){
        let discardName = this.vision[index];
        if (discardName){
            this.discard.push(discardName);
            this.vision.splice(index, 1); 
        }
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
                this.discarded = 0;
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

    revivify(){
        gameState = "running"; 
        playSound("newLevel");
        level++;
        let areas = ["Faith","Circus","Spire","Edge"]; // add Edge when it's not bugged "Spire"
        area = areas[randomRange(0,0)]
        if (area == "Spire") spirevisited = true;
        areachange = false;
        rosetoxin = 0;
        player.lastMove = [0,0];
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if (universe.worlds[universe.currentworld-1].cage.slots[i][j].id != "EMPTY") universe.worlds[universe.currentworld-1].cage.slots[i][j].shattered = true;
            }
        }
        player.hp = maxHp;
        world.getRoom().visited = false;
        universe.passUp(universe.currentworld-1,"N");
        world.cage.displayon = false;
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
        this.statuseff["Charmed"] += 999;
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
}

class AbazonSummon extends Monster{
    constructor(tile){
        super(tile, 28, 5, "ABAZON", description["Abazon"]);
        this.teleportCounter = 0;
        this.noloot = true;
        this.statuseff["Charmed"] = 999;
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
        this.statuseff["Charmed"] = 999;
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
        let moncount = monsters.filter(mon => mon.name != "Midnight Ragemaw" && !mon.statuseff["Charmed"] > 0);
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

class Monk extends Monster{
    constructor(tile){
        super(tile, 45, 2, commoneq[legendaries.castes[randomRange(0,5)]], description["Monk"]);
        this.lootid = new this.loot().id;
        let sun = this.lootid.charAt(0) + this.lootid.substring(1).toLowerCase();
        let n = " ";
        if (sun == "Ordered" || sun == "Artistic" || sun == "Unhinged") n = "n ";
        this.soul = "Animated by a"+n+sun+" ("+basic.indexOf(this.lootid)+") soul.";
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
        this.statuseff["Charmed"] = 999;
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