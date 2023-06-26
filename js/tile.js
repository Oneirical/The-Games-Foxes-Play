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
        this.recallpoint = false;
        this.souls = [];
        this.fuffified = false;
        this.clickTrap = false;
        this.spellDirection = false;
        this.tilecon = new PIXI.Container();
    }

    setUpSprite(){
        this.tilecon = new PIXI.Container();
        tilesDisplay.addChild(this.tilecon);
        this.tilecon.x = this.x*tileSize;
        this.tilecon.y = this.y*tileSize;
        let hai = this.sprite;
        let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
        newSprite.width = tileSize;
        newSprite.height = tileSize;
        
        this.tilecon.addChild(newSprite);
        this.spriteDisplay = newSprite;
        //add traps here
        drawHitbox(tileSize/2, tileSize/2,tileSize,this.tilecon);
        this.hitBox = this.tilecon.children[this.tilecon.children.length-1];
        this.spriteDisplay.eventMode = 'static';
        this.spriteDisplay.on('pointerover', (event) => {
            this.hitBox.alpha = 0.4;
        });
        this.spriteDisplay.on('pointerdown', (event) => {
        });
        this.spriteDisplay.on('pointerout', (event) => {
            this.hitBox.alpha = 0;
        });
        this.effect = false;
        app.ticker.add(() => {
            if (this.effect){
                this.effect.alpha -= 0.02;
                if (this.effect.alpha <= 0){
                    this.tilecon.removeChild(this.effect);
                    this.effect = false;
                }
            }
        });
    }

    setUpResearch(source){
        let hai = this.sprite;
        if (hai == 2) return;
        let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
        this.tilecon.x = this.x*64;
        this.tilecon.y = this.y*64;
        newSprite.width = 64;
        newSprite.height = 64;
        this.tilecon.addChild(newSprite);
        this.spriteDisplay = newSprite;
        source.addChild(this.tilecon);
    }

    tickTile(newTex){
        this.spriteDisplay.texture = newTex;
        if (this.clickTrap){
            this.clickTrap.lifetime--;
            if (this.clickTrap.lifetime <= 0){
                this.clickTrap.destroy();
                this.clickTrap = false; 
            }
        }
    }

    replace(newTileType){
        tilesDisplay.removeChild(tiles[this.x][this.y].tilecon);
        tiles[this.x][this.y] = new newTileType(this.x, this.y);
        tiles[this.x][this.y].setUpSprite();
        tilesDisplay.setChildIndex(tiles[this.x][this.y].tilecon,0);
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

    getConnectedRooms(){
        let connectedTiles = [this];
        let frontier = [this];
        while(frontier.length){
            let neighbors = frontier.pop()
                                .getAdjacentPassableRooms()
                                .filter(t => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        return connectedTiles; 
    }

    getAdjacentPassableRooms(){
        return this.getAdjacentRooms().filter(t => t != "OOB" && t.passable);
    }

    getAdjacentRooms(){
        return shuffle([
            this.getRoom(0, -1),
            this.getRoom(0, 1),
            this.getRoom(-1, 0),
            this.getRoom(1, 0)
        ]);
    }

    getRoom(dx, dy){
        if (this.x + dx > 8 ||this.x + dx < 0 ||this.y + dy < 0 || this.y + dy > 8) return "OOB";
        else return worldgen[this.x + dx][this.y + dy];
    }

    drawFreeform(x, y, size){
        drawSpriteFreeform(this.sprite, this.x, this.y, x, y, size);
    }

    draw(){
        drawSprite(this.sprite, this.x, this.y);
        if (this.clickTrap){
            drawSprite(69,this.x,this.y);
        }
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
        if (this.recallpoint){
            drawSprite(69,this.x,this.y);
            this.lore = description["RecallPoint"];
            this.name = "Identity Anchor";
        }
        if(this.effectCounter){                    
            this.effectCounter--;
            ctx.globalAlpha = this.effectCounter/30;
            drawSprite(this.effect, this.x, this.y);
            ctx.globalAlpha = 1;
        }
    }

    setEffect(effectSprite){                                  
        this.effect = new FoxSprite(allsprites.textures["sprite"+effectSprite]);
        this.effect.width = 112;
        this.effect.height = 112;
        this.tilecon.addChild(this.effect);
    }

    checkDirection(room){
        if (room.size == 9){
            if (this.y == 0) this.direction = "N";
            else if (this.x == 0) this.direction = "W";
            else if (this.x == room.size-1) this.direction = "E";
            else if (this.y == room.size-1) this.direction = "S";
        }
        else{
            if (this.y == 0 && this.x < 9) this.direction = "N";
            else if (this.x == 0 && this.y < 9) this.direction = "W";
            else if (this.y == 0 && this.x > 9) this.direction = "N2";
            else if (this.x == 0 && this.y > 9) this.direction = "W2";
            else if (this.x == room.size-1 && this.y < 9) this.direction = "EE";
            else if (this.x == room.size-1 && this.y > 9) this.direction = "E2";
            else if (this.y == room.size-1 && this.x > 9) this.direction = "S2";
            else if (this.y == room.size-1 && this.x < 9) this.direction = "SS";
        }
    }
}


class Floor extends Tile{
    constructor(x,y){
        super(x, y, 2, true);
        this.mutable = true;
        this.lore = description["Floor"];
        this.name = "Eroded Floortiles";
    };

    stepOn(monster){
        let trapsafe = true;
        if (this.clickTrap){
            this.clickTrap.trigger();
            this.clickTrap = false;
        }
        if (monster.isPlayer){
            trapsafe = player.activemodule != "Hover";
        }
        if (monster.isPlayer && (this.pin || this.eviltrap || this.cuff) && !trapsafe){
            if (!player.consumeCommon(1,false)) {
                log.addLog("FluffyInsufficientPower");
                player.activemodule = "NONE";
                playSound("off");
                trapsafe = true;
            }
        }
        if((!monster.isPlayer&&!monster.statusEff["Charmed"] > 0)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if((!monster.isPlayer&&!monster.statusEff["Charmed"] > 0&&!monster.permacharm)&& this.flufftrap){
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
        if ((monster.isPlayer||monster.statusEff["Charmed"] > 0) && this.eviltrap && trapsafe){
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

class TrueFloor extends Floor{
    constructor(x,y){
        super(x,y,2,true);
        this.mutable = false;
    }
}

class Platform extends Floor{
    constructor(x,y){
        super(x, y, 57, true);
        this.lore = description["Floor"];
        this.name = "Eroded Floortiles";
        this.sprite = 57;
    };
}

class Ladder extends Floor{
    constructor(x,y){
        super(x, y, 58, true);
        this.lore = description["Floor"];
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
        if((!monster.isPlayer&&!monster.statusEff["Charmed"] > 0)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.statusEff["Charmed"] > 0) && this.eviltrap){
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
        this.mutable = false;
    };

    stepOn(monster){
    }
}

class NoBreakWall extends Tile{
    constructor(x, y){
        super(x, y, 3, false);
        this.lore = description["Barrier"];
        this.name = "Apocalypse Barrier";
        this.eat = false;
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

    draw(){
        ctx.globalAlpha = 0.35;
        super.draw();
        ctx.globalAlpha = 1;
    }
}

class BExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, false);
        this.lore = description["Seal"];
        this.name = "Soulsteel Seal";
        this.eat = false;
        this.id = 0;
        this.checkDirection(room);
        this.textures = {
            "N" : 84,
            "S" : 17,
            "W" : 83,
            "E" : 85
        }
        this.sprite = this.textures[this.direction[0]];
    }
}

class BAscendExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, false);
        this.lore = description["Seal"];
        this.name = "Soulsteel Seal";
        this.eat = false;
        this.id = 0;
        this.checkDirection(room);
        this.textures = {
            "N" : 84,
            "S" : 17,
            "W" : 83,
            "E" : 85
        }
        this.sprite = this.textures[this.direction[0]];
    }
}

class MapExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
        this.eat = false;
        this.checkDirection(room);
        this.textures = {
            "N" : 89,
            "S" : 86,
            "W" : 87,
            "E" : 88
        }
        this.sprite = this.textures[this.direction[0]];
    }
    stepOn(monster){
        if(monster.isPlayer){
            playSound("newLevel");
            this.monster = 0;
            world.saveRoom(world.getRoom());
            world.enterRoom(this.direction);
            log.allgrey = true;
        }
    }
}

class AscendExit extends Tile{
    constructor(x,y,room){
        super(x, y, 17, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
        this.eat = false;
        this.checkDirection(room);
        this.textures = {
            "N" : 94,
            "S" : 91,
            "W" : 92,
            "E" : 93
        }
        this.sprite = this.textures[this.direction[0]];
    }
    stepOn(monster){
        if(monster.isPlayer){
            playSound("newLevel");
            this.monster = 0;
            world.saveRoom(world.getRoom());
            universe.passUp(universe.currentworld-1,this.direction);
        }
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
    constructor(x, y, quadrant){ //I hope this doesn't break anything
        super(x, y, 2, false);
        this.lore = description["Reality"];
        this.name = "Nonexistent Nullspace";
        this.sprite = 2;
        this.quadrant = quadrant;
    }
}

class Exit extends Tile{
    constructor(x, y){
        super(x, y, 11, true);
        this.lore = description["OpenSeal"];
        this.name = "Unraveled Seal";
        super.checkDirection();
        this.textures = {
            "N" : 89,
            "S" : 86,
            "W" : 87,
            "E" : 88
        }
        this.sprite = this.textures[this.direction];
        if (world.getRoom() instanceof WorldSeed) this.sprite = 38;
    }

    stepOn(monster){
        if(monster.isPlayer){
            playSound("newLevel"); 
            if(level == numLevels){
                addScore(score, true); 
                showTitle();
            }else{
                level++;
                //startLevel(Math.min(maxHp, player.hp+2));
                sacritotal = "nan";
                rerolled = false;
                gameState = "running";
                rosetoxin = 0;
                //if (level == 17 && area == "Faith"){
                //    log.addLog("EpsilonWelcome1");
                //}
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
        //level+=14; //debug
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
        log.addLog("FluffyWelcome");
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
        player.fall = 0;
        areachange = false;
        super.stepOn(monster);
        if (level % 5 == 1 && level > 5) message= "FluffyWorkshop";
    }
}

class Plate extends Floor{ //delete later
    constructor(x, y){
        super(x, y, 75, true);
        this.lore = description["Mobilizer"];
        this.name = "Automaton Mobilizer";
        this.sprite = 75;
    }
    stepOn(monster){
        super.stepOn(monster);
    }
}

class Altar extends Floor{
    constructor(x,y){
        super(x, y, 30, true); //30
        this.value = new Empty();
        this.name = "Positive Harmonic Relay";
        this.lore = description["PosRelay"];
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.speed = 0.05;
        this.thrashcounter = 0;
    }

    setUpSprite(){
        super.setUpSprite();
        let soulcon = new FoxSprite(allsprites.textures['icon7']);
        soulcon.width = tileSize*0.8-20*0.8;
        soulcon.height = tileSize*0.8-20*0.8;
        soulcon.x = tileSize/2;
        soulcon.y = tileSize/2;
        soulcon.anchor.set(0.5);
        soulcon.shakeAmount = 0;
        this.soulCon = soulcon;
        this.tilecon.addChild(this.soulCon);
        drawHitbox(tileSize/2, tileSize/2,tileSize*0.8+7,this.tilecon);
        this.hitBox = this.tilecon.children[this.tilecon.children.length-1];
        this.spriteDisplay.eventMode = 'static';
        this.spriteDisplay.on('pointerover', (event) => {
            this.hitBox.alpha = 0.7;
            if (isMouseDown) wheel.cageSoul(wheel.selectedCan,getTile(this.x,this.y));
        });
        this.spriteDisplay.on('pointerdown', (event) => {
            wheel.cageSoul(wheel.selectedCan,getTile(this.x,this.y));
        });
        this.spriteDisplay.on('pointerout', (event) => {
            this.hitBox.alpha = 0;
        });
        animationTick.add((delta) => {//This is technically adding tons of ticker statements on each room entry.
            if (Math.random() > 0.97 && world.cage.slots[this.x][this.y].turbulent) soulcon.shakeAmount = 5;
            if(soulcon.shakeAmount){
                soulcon.shakeAmount--;
            }
            let shakeAngle = Math.random()*Math.PI*2;
            soulcon.offsetX = Math.round(Math.cos(shakeAngle)*soulcon.shakeAmount);
            soulcon.offsetY = Math.round(Math.sin(shakeAngle)*soulcon.shakeAmount);
            soulcon.x = tileSize/2 + soulcon.offsetX;
            soulcon.y = tileSize/2 + soulcon.offsetY;
        }); 
    }

    tickTile(newTex){
        super.tickTile(newTex);
        let hai = world.cage.slots[this.x][this.y].icon;
        this.soulCon.texture = allsprites.textures['icon'+hai];
        //if (world.cage.slots[this.x][this.y].turbulent) new GlitchSprite(this.soulCon,0);
    }

    getDisplayX(){                     
        return this.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.y + this.offsetY;
    }

    drawFreeform(x,y,size){
        super.drawFreeform(x,y,size);
        let factor = 8;
        let beeg = 64;
        if (size == 48){
            factor = 8;
            beeg = 32;
        }
        if (!this.value.turbulent) drawSymbol(this.value.icon, x+this.x*size+factor, y+this.y*size+factor,beeg);
        else{
            this.thrashcounter++;
            if (this.thrashcounter > 10 && this.offsetX == 0 && this.offsetY == 0){
                let rt = randomRange(1,4);
                if (rt == 1) this.offsetX+= 0.1;
                else if (rt == 2) this.offsetX-= 0.1;
                else if (rt == 3)this.offsetY+= 0.1;
                else if (rt == 4)this.offsetY-= 0.1;
                this.thrashcounter = 0;
            }
            drawSymbol(this.value.icon, x+this.getDisplayX()*size+factor,  y+this.getDisplayY()*size+factor,beeg);
            ctx.globalAlpha = 1;
            this.offsetX -= Math.sign(this.offsetX)*(this.speed);     
            this.offsetY -= Math.sign(this.offsetY)*(this.speed);
        }
    }

    draw(){
        if (world.cage.slots[this.x][this.y].shattered){
            world.cage.slots[this.x][this.y] = new Shattered();
            return;
        }
        super.draw();
        if (!world.cage.slots[this.x][this.y].turbulent) drawSymbol(world.cage.slots[this.x][this.y].icon, this.x*tileSize+16, this.y*tileSize+16,80);
        else{
            this.thrashcounter++;
            if (this.thrashcounter > 10 && this.offsetX == 0 && this.offsetY == 0){
                let rt = randomRange(1,4);
                if (rt == 1) this.offsetX+= 0.1;
                else if (rt == 2) this.offsetX-= 0.1;
                else if (rt == 3)this.offsetY+= 0.1;
                else if (rt == 4)this.offsetY-= 0.1;
                this.thrashcounter = 0;
            }
            drawSymbol(world.cage.slots[this.x][this.y].icon, this.getDisplayX()*tileSize + shakeX+16,  this.getDisplayY()*tileSize + shakeY+16,80);
            ctx.globalAlpha = 1;
            this.offsetX -= Math.sign(this.offsetX)*(this.speed);     
            this.offsetY -= Math.sign(this.offsetY)*(this.speed);
        }
    }

    getValue(){
        let number = "?";
        if (this.value instanceof Saintly) number = "6";
        else if (this.value instanceof Ordered) number = "5";
        else if (this.value instanceof Artistic) number = "4";
        else if (this.value instanceof Unhinged) number = "3";
        else if (this.value instanceof Feral) number = "2";
        else if (this.value instanceof Vile) number = "1";
        return number;
    }
}


class PosAltar extends Altar{
    constructor(x,y){
        super(x, y, 30, true); //30
        this.value = new Empty();
        this.sprite = 30;
        this.name = "Positive Harmonic Relay";
        this.lore = description["PosRelay"];
    }
}

class NegAltar extends Altar{
    constructor(x,y){
        super(x, y, 31, true); //31
        this.name = "Negative Harmonic Relay";
        this.sprite = 31;
        this.lore = description["NegRelay"];
        this.value = new Empty();
    }

}

class BetAltar extends Altar{
    constructor(x,y){
        super(x, y, 43, true); 
        this.name = "Soulscribe";
        this.sprite = 43;
        this.lore = description["Soulscribe"];
        this.value = new Empty();
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
        if((!monster.isPlayer&&!monster.statusEff["Charmed"] > 0)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.statusEff["Charmed"] > 0) && this.eviltrap){
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
        if((!monster.isPlayer&&!monster.statusEff["Charmed"] > 0)&& this.trap){  
            spells["ARTTRIGGER"](monster.tile);
            playSound("treasure");            
            this.trap = false;
        }
        if (monster.isPlayer && this.cuff){
            player.para = 1;
            playSound("fail");
            this.cuff = false;
        }
        if ((monster.isPlayer||monster.statusEff["Charmed"] > 0) && this.eviltrap){
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

class CageWall extends Floor{
    constructor(x,y, dir){
        super(x, y, 107, true);
        this.lore = description["IvoryCage"];
        this.name = "Ivory Bars";
        this.direction = dir;
        this.sprite = 107;
        if (this.direction == "w") this.sprite += 2;
        else if (this.direction == "e") this.sprite += 0;
        else if (this.direction == "n") this.sprite += 1;
        else if (this.direction == "s") this.sprite -= 1;
    };
}

class FloorSoul extends Floor{ //unused
    constructor(x, y, type){
        super(x,y,100, true);
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
        this.speed = 0.05;
        this.thrashcounter = 0;
    }

    getDisplayX(){                     
        return this.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.y + this.offsetY;
    }

    draw(){
        this.thrashcounter++;
        if (this.thrashcounter > 10 && this.offsetX == 0 && this.offsetY == 0){
            let rt = randomRange(1,4);
            if (rt == 1) this.offsetX+= 0.1;
            else if (rt == 2) this.offsetX-= 0.1;
            else if (rt == 3)this.offsetY+= 0.1;
            else if (rt == 4)this.offsetY-= 0.1;
            this.thrashcounter = 0;
        }
        drawSymbol(this.sprite, this.getDisplayX()*tileSize + shakeX,  this.getDisplayY()*tileSize + shakeY,tileSize);
        ctx.globalAlpha = 1;
        this.offsetX -= Math.sign(this.offsetX)*(this.speed);     
        this.offsetY -= Math.sign(this.offsetY)*(this.speed);
    }
}

class CageContainer extends Altar{
    constructor(x, y){
        super(x,y,110, true);
        this.sprite = 110;
        this.lore = description["Floor"];
        this.name = "Eroded Floortiles";
        this.value = new Empty();
        this.seq = 0;
        this.spritesave = 0;
    }

    stepOn(monster){
        super.stepOn(monster);
    }
}

class HypnoticProjector extends Floor{
    constructor(x, y){
        super(x,y,110, true);
        this.sprite = 110;
        this.lore = description["Hypno"];
        this.name = "Hypnotic Projector";
        this.value = new Empty();
    }

    stepOn(monster){
        super.stepOn(monster);
        if(monster.isPlayer && world.cage.displayon){
            if (world.cage.pocketworld.rooms[this.x][this.y].corridor){
                player.move(getTile(player.tile.x - player.lastMove[0],player.tile.y - player.lastMove[1]));
                player.offsetX = 0;
                player.offsetY = 0;
            } 
            else if (world.cage.slots[this.x][this.y].id != "EMPTY") universe.passDown(world.depth+1, this.x, this.y);
        }
    }

    setUpSprite(){
        super.setUpSprite();
        if (world.cage.displayon){
            world.cage.pocketworld.hypnoDisplay();
        }
    }
}

class ResearchConnector extends Floor{
    constructor(x,y,type,page){
        super(x,y,110, true);
        const conn = {
            "ur" : 116,
            "ul" : 117,
            "dr" : 115,
            "dl" : 114,
            "u" : 112,
            "t" : 118,
            "s" : 113,
            "+" : 119,
            "K" : 127,
            "Y" : 128,
            "J" : 127,
        }
        this.page = page;
        this.sprite = conn[type];
        this.lore = description["Floor"];
        this.name = "hai";
        this.connectType = type;
    }

    setUpResearch(source){
        super.setUpResearch(source);
        if (this.connectType == "J"){
            this.tilecon.rotation = Math.PI;
            this.tilecon.x += 64;
            this.tilecon.y += 64;
        }
        let wai = new PIXI.filters.GrayscaleFilter();
        this.tilecon.filters = [wai];
        this.tilecon.alpha = 0.3;
    }
}

const inside = {
    "Research" : 67,
    "Form" : 68,
    "Function" : 69,
    "Mutator" : 70,
    "Contingency" : 72,
    "Influence" : 71,
    "Structures" : 73,
    "RoseQuest" : 75,
    "Song" : 76,
    "Cage" : 35,
    "Herald" : 37,
    "Intro" : 36,
    "Turbulent" : 28,
    "Subdued" : 13,
    "Breath" : 33,
    "Seed" : 24,
    "Vision" : 26,
    "Security" : 1,
    "Shattered" : 49,
    "Estate" : 14,
    "PCage" : 39,
    "Craft" : 74,
    "Spellcast" : 40,
    "GYVJI" : 27,
    "SENET" : 8,
    "EGO" : 29,
    "BEAM" : 66,
    "PARACEON" : 41,
    "SMOOCH" : 17,
    "ASPHA" : 18,
    "CLICK" : 30,
    "KASHIA" : 43,
    "SACRIFICE" : 42,
    "STEP" : 32,
    "XCROSS" : 38,
    "EPSILON" : 44,
    "Brush" : 65,
    "STOP" : 20,
    "Saintly" : 0,
    "Ordered" : 1,
    "Unhinged" : 3,
    "Feral" : 4,
    "Vile" : 5,
    "Artistic" : 2,
    "JOLTZAZON" : 15,
    "PURPIZUG" : 16,
    "SHIZAPIS" : 20,
    "RASEL" : 25,
    "ABAZON" : 22,
    "Axioms" : 6,
    
    
    "ZENORIUM" : 65,
}

class ResearchNode extends Floor{
    constructor(x,y,type, page){
        super(x,y,110, true);
        this.sprite = 111;
        this.page = page;
        this.letter = type;
        this.axiomComponent = false;
        let source = 0;
        if (page > 0) source = 1;
        const castePages = {
            1 : "S",
            2: "O",
            3: "A",
            4 : "U",
            5 : "F",
            6: "V"
        }
        if (researchequivalences[source][type]) this.id = researchequivalences[source][type];
        if (this.id == "Caste"){
            this.id = shuffle(casteNodes)[0];
            removeItemOnce(casteNodes,this.id);
        }
        if (this.id == "INITIAL"){
            const casteTabNum = {
                1 : "EGO",
                2 : "PARACEON",
                3 : "GYVJI",
                4 : "BEAM",
                5 : "BLINK",
                6 : "HARM"
            }
            this.id = casteTabNum[page];
        }
        if (Object.keys(nodeloot).includes(this.id)){
            this.axiomComponent = this.id;
            let axiomType = lootPool[this.id][castePages[page]];
            this.id = shuffle(lootPool[this.id][castePages[page]])[0];
            removeItemOnce(axiomType,this.id);
        }
        this.lore = researchlore[this.id];
        this.name = researchnames[this.id];
        this.flags = researchflags[this.id];
        this.description = researchexpl[this.id];
        this.unlock = researchunlocks[this.id];
        if (researchunlockdata[this.id]) this.unlockdata = new researchunlockdata[this.id]("disabled");
        if (!this.unlock) this.unlock = researchunlocks["None"];
        this.discovered = false;
        this.completed = false;
        if (this.id == "Research") this.discovered = true;

        this.contents = inside[this.id];
    }

    discoverNode(){
        if (this.id == "Vision" && !(research.knownnodes.includes("Seed") && research.knownnodes.includes("Brush"))) return;
        else if (this.id == "Axioms" && !(research.knownnodes.includes("Form") && research.knownnodes.includes("Function"))) return;
        this.tilecon.alpha = 1;
        this.discovered = true;
        if (this.axiomComponent) this.innerSymbol.texture = (allsprites.textures['icon'+inside[this.id]]);
        if (this.page > 0 && !research.knownSpells.includes(this.id)) research.knownSpells.push(this.id);
        if (["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"].includes(this.id)){
            research.tabs[["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"].indexOf(this.id)+1][7][7].discoverNode();
            research.tabContainer.children[["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"].indexOf(this.id)+1].visible = true;
        }
    }

    completeNode(){
        this.completed = true;
        this.sprite = 120;
    }

    setUpResearch(source){
        let hai = 7;
        if (this.axiomComponent && !this.discovered){
            const typeSymbols = {
                "FORM" : 68,
                "FUNCTION" : 69,
                "MUTATOR" : 70,
                "CONTINGENCY" : 72,
            }
            hai = typeSymbols[this.axiomComponent];
        }
        else if (this.id) hai = inside[this.id];
        let newSprite = new FoxSprite(allsprites.textures['icon'+hai]);
        newSprite.width = 48;
        newSprite.x = 8;
        newSprite.y = 8;
        this.tilecon.alpha = 0.3;
        newSprite.height = 48;
        this.tilecon.addChild(newSprite);
        this.innerSymbol = newSprite;
        super.setUpResearch(source);
        this.spriteDisplay.eventMode = 'static';
        this.spriteDisplay.on('pointerover', (event) => {
            research.descriptionBox.getDescription(this);
            let wai = new PIXI.filters.GlowFilter();
            wai.outerStrength = 1;
            this.tilecon.filters = [wai];
        });
        this.spriteDisplay.on('pointerout', (event) => {
            this.tilecon.filters = [];
        });
    }

    draw(){
        if (!this.discovered) ctx.globalAlpha = 0.55;
        super.draw();
        if (this.discovered) drawSymbol(this.contents, this.x*112+16, this.y*112+16,80);
        else drawSymbol(7, this.x*112+16, this.y*112+16,80);
        if (!this.discovered) ctx.globalAlpha = 1;
    }
}

class Window extends Wall{
    constructor(x, y){
        super(x, y, 129, false);
        this.lore = description["Barrier"];
        this.name = "Apocalypse Barrier";
        this.mutable = false;
        this.sprite = 129;
    };

    draw(){
        ctx.globalAlpha = 0.65;
        super.draw();
        ctx.globalAlpha = 1;
    }
}

function goToCage(){
    tiles[4][0].stepOn(player);
    tiles[4][0].stepOn(player);
    summonExits();
    tiles[4][0].stepOn(player);
}