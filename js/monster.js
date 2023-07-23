class Monster{
    constructor(tile, sprite, hp, loot, lore){
        this.sprite = sprite;
        this.spritesave = sprite;
        this.hp = hp;
        this.speed = 1;
        this.datasave = {};
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
        this.hastedthisturn = false;
        this.lastMove = [-1,0];
        this.targeted = false;   
        this.bonusAttack = 0;
        this.lore = lore;
        this.isPlayer = false;
        this.paralyzed = false;
        this.isFluffy = false;
        this.noloot = false;
        this.canmove = true;
        this.axioms = new Inventory();
        this.wheel = false;
        this.soullink;
        this.storedAttack = false;
        this.dialoguecount = 0;
        this.statusEff = {
            "Transformed" : 0,
            "Charmed" : 0,
            "Constricted" : 0,
            "Marked" : 0,
            "Dissociated" : 0,
            "Invincible" : 0,
            "Puppeteered" : 0,
            "Decaying" : 0,
            "Paralyzed" : 0,
            "Hasted" : 0,
            "Thrashing" : 0,
            "Infused" : 0,
        }

        this.permacharm = false;
        this.enraged = false;
        this.inhand = [];
        this.falsehp = 0;
        this.soulless = false;
        this.order = -1;
        this.infested = 0;
        this.soulstun = 0;
        this.doomed = false;
        this.previousdir;
        this.lootid = this.loot;
        if (this.axioms.castes.includes(this.loot)) this.loot = commoneq[this.loot];
        if (tile == "disabled") return;
        this.move(tile);
        this.adjacentmon = this.tile.getAdjacentNeighbors().filter(t => t.monster && !t.monster.isPlayer).length;
    }

    endTurn(){
        let activeeffects = [];
        for (let i of Object.keys(this.statusEff)){
            if (this.statusEff[i] > 0) activeeffects.push(i);
            this.statusEff[i] = Math.max(0,this.statusEff[i]-1);
            if (this.statusEff[i] > 0 && activeeffects.includes(i)) removeItemOnce(activeeffects,i);
        }
        this.effectsExpire(activeeffects);
    }

    playerMove(dx, dy){
        if (gameState != "running") return;
        if (this.statusEff["Paralyzed"] > 0){
            //lose(this.statusEff["Paralyzed"],1);
            beginTurn();
            tick();
            return;
        }
        if(this.tryMove(dx,dy,true)){
            beginTurn();
            player.axioms.castContin("STEP",this);
            tick();
        }
        if (area == "Spire" && this.activemodule != "Hover" && !(this.tile.getNeighbor(0,1) instanceof Platform || this.tile.getNeighbor(0,1) instanceof Ladder || this.tile instanceof Ladder || this.tile.getNeighbor(0,1).monster)){
            this.fall++;
        }
        if (this.para > 0){
            log.addLog("Paralyzed");
        }
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
        animationTick.add((delta) => {
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
                        if (!universe.zooming && this.tile instanceof CageContainer && world.cage.slots[this.tile.x-world.cageCorner[0]][this.tile.y-world.cageCorner[1]].id != "EMPTY") universe.passDown(destination, world.cage.pocketworld.cageLocation[0], world.cage.pocketworld.cageLocation[1]);
                    }
                }
                else if (!player.animating){
                    if (this.offsetX >= 0) this.offsetX = Math.max(this.offsetX - this.anispeed,0);
                    else this.offsetX = Math.min(this.offsetX + this.anispeed,0);
                    if (this.offsetY >= 0) this.offsetY = Math.max(this.offsetY - this.anispeed,0);
                    else this.offsetY = Math.min(this.offsetY + this.anispeed,0);
                    this.creaturecon.x = this.creaturecon.originalX + this.offsetX*tileSize;
                    this.creaturecon.y = this.creaturecon.originalY +  this.offsetY*tileSize;
                }

            }
        });
        this.updateHp();
        if (universe.zooming && this instanceof Terminal){
            new GlitchSprite(this.creaturecon,3,true);
        } 
        //remember when you looked for 2 hours for that one bug that made you drop 1 FPS every time Terminal passed a door and it turned
        //out to be that one tiny line under here that caused literal thousands of StatusDisplay to stack on top of each other? Now that was funny
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
        else if (this.statusEff["Dissociated"] == 0) this.hp = Math.min(maxHp, this.hp+damage);
        else if (this.statusEff["Dissociated"] > 0) this.falsehp = Math.min(maxHp, this.falsehp+(damage*2));
        this.axioms.castContin("ONHEAL",this);
        this.updateHp();
    }

    assignAxiom(seq,caste,pow){
        let axiom = new Axiom(seq,caste,pow);
        this.axioms.addAxiom(axiom);
        this.axioms.activateAxiom(0);
    }

    giveEffect(effect, duration,mods){
        if (mods["flags"].has("ephemeral")) duration = 1;
        this.statusEff[effect] += duration;
        if (effect == "Dissociated") this.falsehp = this.hp;
    }

    endTransformation(){
        let protection = ["spritesave","datasave", "isPlayer","tile"];
        for (let i of Object.keys(this.datasave)) if (!protection.includes(i)) this[i] = this.datasave[i];
        if (this.soullink) this.soullink = this.soullink.tile;
    }

    effectsExpire(expired){
        if (expired.includes("Decaying")) this.die();
        if (expired.includes("Dissociated")){
            if (this.falsehp <= 0){
                if (!this.isPlayer) this.hit(99);
                else this.doomed = true;
                this.noloot = true;
            }
            else this.hp = this.falsehp;
        }
        if (expired.includes("Transformed")){
            this.endTransformation();
        }
        if (expired.includes("Infused")){
            this.storedAttack = false;
        }
    }

    update(){
        if (this.statusEff["Paralyzed"] > 0){
            this.stunned = true;
        }
        this.teleportCounter--;
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
        if(this.statusEff["Charmed"] > 0 && monsters.length < 2 && !this.permacharm) this.statusEff["Charmed"] = 0;
        if (!this.isPlayer) this.doStuff();
        this.axioms.castContin("TURNEND",this);    
    }

    doStuff(){
       let neighbors = this.tile.getAdjacentPassableNeighbors();
       
       if (this.statusEff["Charmed"] > 0 && !this.name.includes("Rendfly")) neighbors = neighbors.filter(t => !t.monster || !t.monster.isPlayer || !t.monster.statusEff["Marked"] > 0 || !(t.monster.statusEff["Charmed"] > 0));
       else if (this.statusEff["Charmed"] > 0) neighbors = neighbors.filter(t => !t.monster || !t.monster.isPlayer || !t.monster.statusEff["Marked"] > 0 || !(t.monster.statusEff["Charmed"] > 0));
       else neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer || t.monster.statusEff["Marked"] > 0 || t.monster instanceof Box);

       if(neighbors.length){
            let markcheck = false;
            let enemy = player;
            monsters.forEach(function(entity){
               if (entity.statusEff["Marked"] > 0){
                   markcheck = true;
                   enemy = entity;
               }
            });
            if (this.statusEff["Charmed"] > 0){
                
                let testresult = [];
                monsters.forEach(function(entity){
                    let option = neighbors;
                    
                    option.sort((a,b) => a.dist(entity.tile) - b.dist(entity.tile));
                    testresult.push(option[0]);
                    let valid = false;
                    
                    testresult.forEach(function(t){
                        if (option[0].x <= t.x && option[0].y <= t.y) valid = true;
                    });
                    if (entity.statusEff["Charmed"] > 0 || entity instanceof Box) valid = false;
                    if (valid) enemy = entity;
                    
                });
            }
            if ((markcheck && !this.statusEff["Marked"] > 0||this.statusEff["Charmed"] > 0)){ //
                neighbors.sort((a,b) => a.dist(enemy.tile) - b.dist(enemy.tile));
            }
            else{
                neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
            }
           
           let newTile = neighbors[0];
           if (this.previousdir){ // this doesn't seem to work...
               if (newTile.x == this.previousdir.x && newTile.y == this.previousdir.y && this.speed > 1 && neighbors.length > 1) newTile = neighbors[1];
               else if (newTile.x == this.previousdir.x && newTile.y == this.previousdir.y && this.speed > 1 && neighbors.length <= 1) return; 
           }
           this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
           this.previousdir =this.tile;
       }
       if (this.statusEff["Hasted"] > 0 && !this.hastedthisturn){
            this.hastedthisturn = true;
            this.doStuff();
            return;
       }
       this.hastedthisturn = false;
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
        if (this.statusEff["Marked"] > 0){
            drawSprite(
                35,
                this.getDisplayX(),
                this.getDisplayY()
            );
        }
        if (this.statusEff["Persuasive"] > 0||this.statusEff["Charmed"] > 0 && !this.name.includes("Rendfly")){
            drawSprite(
                36,
                this.getDisplayX(),
                this.getDisplayY()
            )
        }
        if ((this.statusEff["Invincible"] > 1 && this.isPlayer)||(this.statusEff["Invincible"] > 0 && !this.isPlayer)){
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
        if (this.statusEff["Dissociated"] > 0){
            drawSprite(
                53,
                this.getDisplayX(),
                this.getDisplayY()
            )
        }

    }   

    tryMove(dx, dy, antiloop){
        if (this.isPlayer && !antiloop){
            this.playerMove(dx,dy);
            return;
        } 
        if (this.statusEff["Thrashing"] > 0){
            let neighbors = this.tile.getAdjacentPassableNeighbors();
            if(neighbors.length){
                dx = neighbors[0].x - this.tile.x;
                dy = neighbors[0].y - this.tile.y;
            }
        }
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
            if(!newTile.monster || (newTile.monster && newTile.monster instanceof Harmonizer)){ //||(newTile.monster.statusEff["Charmed"] > 0&&(this.isPlayer||this.statusEff["Charmed"] > 0))||newTile.monster.isPassive
                let boxpull = false;
                if (this.tile.getNeighbor(-dx,-dy).monster && this.tile.getNeighbor(-dx,-dy).monster.pushable && this.isPlayer) boxpull = this.tile;
                if (this.statusEff["Constricted"]>0){
                    log.addLog("Constricted");
                    shakeAmount = 5;
                    return false;
                }
                if (this.canmove){
                    this.move(newTile);
                    if (!this.isPlayer) this.axioms.castContin("STEP",this);
                }
                if (boxpull) boxpull.getNeighbor(-dx,-dy).monster.move(boxpull);
                if (this instanceof Oracle) this.bonusAttack += (1/3);
            }else{
                let crit;
                research.completeResearch("Intro");
                if(((this.isPlayer != newTile.monster.isPlayer)||newTile.monster.statusEff["Marked"] > 0||(this.statusEff["Charmed"] > 0 && !newTile.monster.isPlayer && !newTile.monster.statusEff["Charmed"] > 0))&&!this.isPassive && !newTile.monster.isGuide &&!newTile.monster.pushable && !(this.statusEff["Charmed"] > 0&&newTile.monster.isPlayer)){
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
                    if (newTile.monster){
                        this.axioms.castContin("ATTACK",this);
                        if (this.storedAttack) {
                            this.storedAttack.trigger(this);
                            this.storedAttack = false;
                            this.statusEff["Infused"] = 0;
                        }
                    }
                    if ((this.statusEff["Persuasive"] > 0) && newTile.monster){
                        newTile.monster.statusEff["Charmed"] += 25;
                        this.statusEff["Persuasive"] = lose(this.statusEff["Persuasive"],5);
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
                        if (newTile.monster.statusEff["Dissociated"] == 0) newTile.monster.falsehp = newTile.monster.hp;
                        newTile.monster.statusEff["Dissociated"] = 2;
                        
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
                    if (this.animating && this === player){
                        tickProjectors();
                        this.animating = false;
                        tilesDisplay.projectorDisplay.x = -448;
                        tilesDisplay.projectorDisplay.y = -448;
                        tilesDisplay.creatureDisplay.x = -448;
                        tilesDisplay.creatureDisplay.y = -448;
                    }
                    this.offsetX = -(newTile.x - this.tile.x)/2;    
                    this.offsetY = -(newTile.y - this.tile.y)/2;  
                    this.originalOffsetX = this.offsetX;
                    this.originalOffsetY = this.offsetY; 
                }
                else if(this.isPlayer && newTile.monster.isGuide && newTile.monster.dialoguecount < newTile.monster.diamax){
                    log.addLog(newTile.monster.dialogue[newTile.monster.dialoguecount]);
                    newTile.monster.dialoguecount++;
                }else if (this.isPlayer && newTile.monster.isGuide && newTile.monster.dialoguecount == newTile.monster.diamax){
                    log.addLog(newTile.monster.dialogue[newTile.monster.dialoguecount]);//message = newTile.monster.dialogue[dialoguecount];
                    newTile.monster.dialoguecount = newTile.monster.diareset;
                }else if (newTile.monster.pushable){ //this should integrate more cleanly with step code
                    let lm = this.lastMove;
                    let coredevour = false;
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
                                coredevour = true;
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
                        if (!coredevour && !abandon) newTile.monster.move(pushTile);
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
        if (damage <= 0) return;          
        if(this.statusEff["Invincible"]>0 || (this.isInvincible && this.order < 0)){           
            return;                                                             
        }
        else if (this.isInvincible && this.order >= 0){
            playSound("epsitink");
            return;
        }
        if (this.statusEff["Dissociated"] > 0) this.falsehp -= damage;
        else if (this.statusEff["Dissociated"] == 0 && !(this instanceof Tail)) this.hp -= damage;
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
        this.updateHp();
    }

    die(){
        this.dead = true;
        if (this.tile.clickTrap && this.tile.clickTrap.triggerType == "DEATH"){
            this.tile.clickTrap.trigger();
            this.tile.clickTrap = false;
        }
        this.axioms.castContin("ONDEATH",this);
        if (this.tile.monster == this) this.tile.monster = null;
        if (this.statusEff["Puppeteered"] > 0 && !this.tile.siphon && !this.respawned){
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
            if (this.statusEff["Charmed"] > 0 && !this.name.includes("Vermin")) felid.statusEff["Charmed"] += this.statusEff["Charmed"];
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
        tilesDisplay.removeChild(this.creaturecon);
        if (this.tile.monster) this.tile.monster.setUpSprite(); // have a feeling this is weird, it's for the felidols
    }

    move(tile){
        if(this.tile){
            this.tile.monster = null;
            if (this.animating && this === player){
                tickProjectors();
                this.animating = false;
                tilesDisplay.projectorDisplay.x = -448;
                tilesDisplay.projectorDisplay.y = -448;
                tilesDisplay.creatureDisplay.x = -448;
                tilesDisplay.creatureDisplay.y = -448;
            }
            this.offsetX = this.tile.x - tile.x;
            this.offsetY = this.tile.y - tile.y;
            this.originalOffsetX = this.offsetX;
            this.originalOffsetY = this.offsetY;
            this.anispeed = 1/9*(Math.abs(this.offsetX)+Math.abs(this.offsetY));
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
        this.soul = "Does not have a soul of its own -- is merely the combination of its many passengers.";
        this.ability = "";
        this.noloot = true;
        this.fov = 0;
        this.wheel = new SoulBreathing();
        this.souldropped = true;
    }

    grantStarters(){
        this.assignAxiom(["EGO","PLUS","HEAL"],"SAINTLY",2);
        this.assignAxiom(["EGO","PARACEON"],"ORDERED",2);
        this.assignAxiom(["EGO","CLICK","EGO","PLUSCROSS","HARM"],"ARTISTIC",3);
        this.assignAxiom(["XCROSS","HARM"],"UNHINGED",3);
        this.assignAxiom(["EGO","TRAIL","BLINK","SPREAD","IGNORECASTER","HARM"],"FERAL",3); // this must get the rest. get INFINITEPOWER and also add power scaling to BLINK
        this.assignAxiom(["EGO","ATKDELAY","SMOOCH","HARM"],"VILE",5);
        for (let i of player.axioms.active){
            i.id = "STARTER";
            i.icon = player.axioms.active.indexOf(i);
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
        super(tile, 5, 1, "UNHINGED", description["Shrike"]);
        this.soul = "Animated by a Feral (2) soul.";
        this.name = "Starpaper Shrike";
        this.ability = monabi["Shrike"];
        this.speed = 2;
        this.assignAxiom(["TURNEND","EGO","HASTE"],"UNHINGED",1);
    }
}

class Apiarist extends Monster{
    constructor(tile){
        super(tile, 6, 3, "ORDERED", description["Apiarist"]);
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Brass Apiarist";
        this.ability = monabi["Apiarist"];
        this.assignAxiom(["STEP","EGO","STOP"],"ORDERED",2);
    }
}

class Second extends Monster{
    constructor(tile){
        super(tile, 7, 1, "VILE", description["Second"]);
        this.soul = "Animated by a Vile (1) soul.";
        this.name = "Second Emblem of Sin";
        this.ability = monabi["Second"];
        this.assignAxiom(["TURNEND","EGO","PLUS","DEVOUR","HEAL","STOP"],"VILE",0); //should be turnstart
    }
}

class Tinker extends Monster{
    constructor(tile){
        super(tile, 8, 2, "SAINTLY", description["Tinker"]);
        this.soul = "Animated by an Artistic (4) soul.";
        this.name = "Frenzied Dream-Tinker";
        this.ability = monabi["Tinker"];
        this.assignAxiom(["TURNEND","EGO","THRASH"],"SAINTLY",2); //should be turnstart
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
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Shelled Electromedic";
        this.ability = monabi["Snail"];
        this.canmove = false;
        this.isPassive = true;
        this.assignAxiom(["TURNEND","EGO","STOP","RANDDIR","BLINK"],"ARTISTIC",2); //maybe boost up blink potency
        this.assignAxiom(["ONTELE","BEAM","HARM"],"UNHINGED",1);
    }
    // doStuff(){
    //     let directions = [[-1,0],[1,0],[0,-1],[0,1]];
    //     let indexx = randomRange(0,3);
    //     this.lastMove = directions[indexx]
    //     spells["SNAILLASER"](this);
    //     super.doStuff();
    // }
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
        this.soul = "Animated by an Ordered (5) soul.";
        this.name = "Shackle-Slug";
        this.ability = monabi["Slug"];
        this.assignAxiom(["STEP","EGO","STOP","CLICK","EGO","STOP"],"ORDERED",2);
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

class Monk extends Monster{
    constructor(tile){
        super(tile, 45, 2, commoneq[[ "VILE", "FERAL", "UNHINGED", "ARTISTIC", "ORDERED", "SAINTLY"][randomRange(0,5)]], description["Monk"]);
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
        this.assignAxiom(["ONDEATH","EGO","DEATHCLICK","CLICK","EGO","SUMMFELIDOL"],"VILE",2); //remove decay of traps?
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
        this.assignAxiom(["ATTACK","SMOOCH","APIS"],"FERAL",1);
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