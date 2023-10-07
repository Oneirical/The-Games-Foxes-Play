class Tooltip{
    constructor(){
        this.displayCon = new PIXI.Container();
        const graphics = new PIXI.Graphics();
        graphics.beginFill("black");
        graphics.drawRect(-16, -16, 15*32-2, 20*32-2);
        graphics.endFill();
        this.displayCon.addChild(graphics);
        drawChainBorder(15,20,this.displayCon);
        app.ticker.add(() => {
            const mousePos = getMouse();
            this.displayCon.x = mousePos[0]+8;
            this.displayCon.y = mousePos[1]+8;
        });
    }
}

class NodeDescription{
    constructor(){
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        drawChainBorder(15,28,this.displayCon);
        const graphics = new PIXI.Graphics();
        graphics.beginFill("black");
        graphics.drawRect(-8, -8, 14*32+16, 27*32+16);
        graphics.endFill();
        this.displayCon.addChild(graphics);
        this.displayCon.x = 930;
        this.displayCon.y = 60;
        this.displayCon.visible = true;
    }

    getDataText(node){

        let dataPoint = node.dataType;
        let dataAnswer = node.storage;

        if (!dataAnswer) return "Nothing.";

        switch (dataPoint){
            case "Message":
                return "Message: "+dataAnswer;
            case "Number":
                return "Number: "+dataAnswer;
            case "Boolean":
                if (dataAnswer) return "Boolean: True";
                else return "Boolean: False"; 
            case "Creature":
                let crea = allCreatures[dataAnswer];
                return "Creature: "+crea.name+" at X: "+crea.tile.x+" and Y: "+crea.tile.y;
            case "Axiom":
                return "Axiom: "+soulData[dataAnswer]["name"];
            case "Direction":
                const dirs = {
                    "N" : "North",
                    "S" : "South",
                    "W" : "West",
                    "E" : "East"
                }
                return "Direction: "+dirs[dataAnswer];
            case "Caste":
                return "Caste: "+dataAnswer;
            case "Species":
                return "Species: "+creaturePresentation[dataAnswer]["name"];
            case "Tile":
                const tile = getTileInUniverse(dataAnswer);
                const worldLevel = universe.worlds[dataAnswer.split(';')[0]];
                return "Tile: "+tile.name+" at X: "+tile.x+" and Y: "+tile.y+" in the "+worldNames[worldLevel.id]; //edit this
            default:
                return "Nothing.";
        }
    }

    getDescription(node){
        if (!node) return;
        if (node instanceof ResearchNode) node = node.id;
        this.displayCon.removeChildren();
        const graphics = new PIXI.Graphics();
        graphics.beginFill("black");
        graphics.drawRect(-8, -8, 14*32+16, 27*32+16);
        graphics.endFill();
        this.displayCon.addChild(graphics);
        drawChainBorder(15,28,this.displayCon);
        let height = 0;
        let newSprite = new FoxSprite(allsprites.textures['icon'+node.icon]);
        newSprite.x = 32*13;
        newSprite.width = 32;
        newSprite.height = 32;
        this.displayCon.addChild(newSprite);
        let tag = soulData[node.nameID];
        let soulDataTypes;
        if (!node.dataType) soulDataTypes = "This Axiom cannot contain any Data.";
        else soulDataTypes = "This Axiom can contain "+ node.dataType +"-type Data.";
        const text = [tag["name"],researchflags["Saintly"], tag["descript"],tag["lore"],soulDataTypes, "This Axiom currently contains:\n\n"+this.getDataText(node)]; //,node.extra
        for (let i of text){
            if (!i) continue;
            let coloring = "white";
            if (i == tag["lore"]) coloring = "plum";
            const style = new PIXI.TextStyle({
                fontFamily: 'Play',
                fontSize: 18,
                fill: coloring,
                wordWrap: true,
                wordWrapWidth: 13*32,
                lineJoin: 'round',
            });
            let bumpValue = textWithoutCringe(i,0,height,style,this.displayCon);
            if (text.indexOf(i) > 0) bumpValue+=40;
            height+= bumpValue;
            if (text.indexOf(i) > 0) drawChainLine(14,16,height-7,"h",this.displayCon);
        }
    }
}

class CasteTab{
    constructor(caste){
        this.caste = caste;
        this.extension = 4;
        this.extended = false;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.truePos = 252;
        drawChainBorder(12,3,this.displayCon);
        for (let i of this.displayCon.children[0].children){
            if (i.x == 11*32) this.displayCon.children[0].removeChild(i);
        }
        let newSprite = new FoxSprite(allsprites.textures['icon'+this.caste]);
        newSprite.width = 64;
        newSprite.height = 64;
        newSprite.alpha = 0.8;
        this.displayCon.addChild(newSprite);
        const tabText = {
            33: "Fundamentals",
            0: "Saintly",
            1: "Ordered",
            2: "Artistic",
            3: "Unhinged",
            4: "Feral",
            5: "Vile"
        };
        const tabColor = {
            33: "white",
            0: "lime",
            1: "orangered",
            2: "orange",
            3: "yellow",
            4: "yellowgreen",
            5: "plum"
        };
        const style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 32,
            fill: tabColor[this.caste],
        });
        printOutText(tabText[this.caste],92,15,style,this.displayCon);
        for (let i of this.displayCon.children[2].children) i.anchor.set(0.5,0.5);
        const graphics = new PIXI.Graphics();
        graphics.beginFill("white");
        graphics.drawRect(-16, -16, 11*32, 3*32);
        graphics.endFill();
        graphics.alpha = 0.1;
        graphics.eventMode = 'static';
        graphics.on('pointerover', (event) => {
            this.displayCon.truePos = 16;
        });
        graphics.on('pointerdown', (event) => {
            research.selectCaste(this.casteNum);
        });
        graphics.on('pointerout', (event) => {
            if (!this.displayCon.extended) this.displayCon.truePos = 252;
        });
        this.displayCon.addChild(graphics);
        app.ticker.add(() => {
            if (this.displayCon.extended) this.displayCon.truePos = 16;
            if (this.displayCon.x < this.displayCon.truePos) this.displayCon.x = Math.min(this.displayCon.x+24,this.displayCon.truePos);
            else if (this.displayCon.x > this.displayCon.truePos) this.displayCon.x = Math.max(this.displayCon.x-24,this.displayCon.truePos);
        });
    }
}

class Cursor{
    constructor(tile){
        this.move(tile);
        this.sprite = 18;
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.isPlayer = false;
    }
    getDisplayX(){                     
        return this.tile.x;
    }

    getDisplayY(){                                                                  
        return this.tile.y;
    }
    tryMove(newTile){
        if (newTile.x < numTiles && newTile.y < numTiles && newTile.x >= 0 && newTile.y >= 0){
            if (inResearch && !(research.page[newTile.x][newTile.y] instanceof ResearchNode ||research.page[newTile.x][newTile.y] instanceof ResearchConnector )) return;
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
        this.tile.cursor = null;
        this.sprite = 99999;
    }
}

class LocationDisplay{
    constructor(){
        this.displayCon;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,3,this.displayCon);
        let style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 40,
            fill: "plum",
        });
        this.richText = new PIXI.Text(world.name, style);
        this.richText.anchor.set(0.5,0.5);
        this.richText.x = (335+22)/4+54;
        this.richText.y = (121+31)/4-8;
        this.displayCon.addChild(this.richText);
    }

    update(){
        this.richText.text = worldNames[world.id];
        if (this.richText.text.length > 15){
            this.richText.style.wordWrap = true;
            this.richText.style.wordWrapWidth = 9*32;
            this.richText.style.fontSize = 30;
        }
        else {
            this.richText.style = new PIXI.TextStyle({
                fontFamily: 'Play',
                fontSize: 40,
                fill: "plum",
            });
        }
    }
}

class ButtonsDisplay{
    constructor(){

    }
    
    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*29;
        drawChainBorder(15,3,this.displayCon);
        let newSprite = new FoxSprite(allsprites.textures['icon67']);
        newSprite.x = 0;
        newSprite.width = 64;
        newSprite.height = 64;
        newSprite.eventMode = 'static';
        newSprite.on('pointerdown', (event) => {
            toResearchMode();
        });
        newSprite.on('pointerover', (event) => {
            let wai = new PIXI.filters.GlowFilter();
            wai.outerStrength = 1;
            newSprite.filters = [wai];
        });
        newSprite.on('pointerout', (event) => {
            newSprite.filters = [];
        });
        this.displayCon.addChild(newSprite);
        drawChainLine(2,88,16,"v",this.displayCon);

        let axiomButton = new FoxSprite(allsprites.textures['icon6']);
        axiomButton.x = 88;
        axiomButton.width = 64;
        axiomButton.height = 64;
        axiomButton.eventMode = 'static';
        axiomButton.on('pointerdown', (event) => {
            toAxiomMode();
        });
        axiomButton.on('pointerover', (event) => {
            let wai = new PIXI.filters.GlowFilter();
            wai.outerStrength = 1;
            axiomButton.filters = [wai];
        });
        axiomButton.on('pointerout', (event) => {
            axiomButton.filters = [];
        });
        this.displayCon.addChild(axiomButton);
        drawChainLine(2,176,16,"v",this.displayCon);

        uiDisplayRight.addChild(this.displayCon);
    }
}

class MessageLog{
    constructor(){
        this.history = [];
        this.writeheight = [];
        this.repeats = [];
        this.allgrey = false;
    }

    setUpLog(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*16;
        uiDisplayRight.addChild(this.displayCon);
        this.textcon = new PIXI.Container();
        this.displayCon.addChild(this.textcon);
        drawChainBorder(15,12,this.displayCon);
        PIXI.Assets.addBundle('fonts', {
            Play: 'Play-Regular.ttf',
        });
        PIXI.Assets.loadBundle('fonts');
    }

    addLog(message){
        if (this.textcon.children.length > 0 && messages[message] == this.textcon.children[this.textcon.children.length-1].originalText){
            this.textcon.children[this.textcon.children.length-1].repetitions += 1;
            this.textcon.children[this.textcon.children.length-1].text = this.textcon.children[this.textcon.children.length-1].originalText +  " x" + this.textcon.children[this.textcon.children.length-1].repetitions;
            return;
        }
        let coloring = colours[message];
        if (message.includes("Fluffy")) coloring = "cyan";
        else if (message.includes("Rose")) coloring = "lightpink";
        else if (message.includes("Epsilon")) coloring = "orangered";
        else if (message.includes("Saint")) coloring = "lime";
        else if (message.includes("Faith")) coloring = "white";
        else if (message.includes("Error")) coloring = "yellow";
        const style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 18,
            fill: coloring,
            wordWrap: true,
            wordWrapWidth: 7*16*16-(7*9*16+(7+12)*16+10)-20,
            lineJoin: 'round',
        });
        printOutText(messages[message],0,0,style,this.textcon);
        const richText = new PIXI.Text(messages[message], style);
        richText.repetitions = 0;
        richText.originalText = richText.text;
        if (this.textcon.children.length > 1){
            this.textcon.children[this.textcon.children.length-2].ancient = true;
            for (let i = 0; i<this.textcon.children.length-1; i++){
                this.textcon.children[i].y += this.textcon.children[this.textcon.children.length-1].linesnum+5;
                for (let j = 0; j<this.textcon.children[i].children.length; j++){
                    if (this.textcon.children[i].y + this.textcon.children[i].children[j].y > 335) this.textcon.children[i].children[j].visible = false;
                }
                if (this.textcon.children[i].y > 700) this.textcon.removeChildAt(i);
            }
        }
    }
}

class InvokeWheel{
    constructor(){
        //let pi = Math.PI;
        //dist = 45;
        //let center = [center[0]+28,center[1]+38];
        //this.hotkeycoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
    }

    getMacros(){
        if (!this.activeButtons) return;
        const souls = player.getSouls();
        let filledButtons = 0;
        for (let i of souls){
            if (!i) continue;
            for (let j of Object.keys(i.commands)){
                this.activeButtons[filledButtons].bindingKey = j;
                this.activeButtons[filledButtons].texture = allsprites.textures['icon'+i.commands[j]];
                this.activeHotkeys[filledButtons].text = j;
                this.activeHotkeys[filledButtons].visible = true;
                filledButtons++;
            }
        }
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        uiDisplayRight.addChild(this.displayCon);
        drawChainBorder(15,15,this.displayCon);
        let center = [(1885-1410)/2-16,(505-30)/2-16];
        let dist = 100;
        let nudge = 1.8;
        let pi = Math.PI;
        let wheelcoords = [[center[0], center[1]-dist*nudge],[center[0]-dist*nudge, center[1]],[center[0]+dist*nudge, center[1]], [center[0], center[1]+dist*nudge],[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        dist = 45;
        this.wheelCon = new PIXI.Container();
        this.displayCon.addChild(this.wheelCon);
        this.activeButtons = [];
        this.activeHotkeys = [];
        for (let i = 0; i<12; i++){
            let newSprite = new FoxSprite(allsprites.textures['icon7']);
            newSprite.width = (7-3)*16;
            newSprite.height = (7-3)*16;
            newSprite.anchor.set(0.5,0.5);
            newSprite.x = wheelcoords[i][0];
            newSprite.y = wheelcoords[i][1];
            this.activeButtons.push(newSprite);
            
            this.wheelCon.addChild(newSprite);
            this.wheelCon.children[i].eventMode = 'static';
            this.wheelCon.children[i].on('click', (event) => {
                if (this.wheelCon.children[i].bindingKey) playerInput(this.wheelCon.children[i].bindingKey);
            });
            this.wheelCon.children[i].on('pointerover', (event) => {
                let wai = new PIXI.filters.GlowFilter();
                wai.outerStrength = 1;
                this.wheelCon.children[i].filters = [wai];
            });
            this.wheelCon.children[i].on('pointerout', (event) => {
                this.wheelCon.children[i].filters = [];
            });
        }

        dist = 50;
        nudge = 2.8;
        wheelcoords = [[center[0], center[1]-dist*nudge],[center[0]-dist*nudge, center[1]],[center[0]+dist*nudge, center[1]], [center[0], center[1]+dist*nudge],[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        for (let i = 0; i<12; i++){
            let richText = new PIXI.Text("B");
            richText.style = new PIXI.TextStyle({
                fontFamily: 'Play',
                fontSize: 15,
                fill: "white",
            });
            richText.x = wheelcoords[i][0]-8;
            richText.y = wheelcoords[i][1]-9;
            richText.visible = false;
            this.wheelCon.addChild(richText);
            this.activeHotkeys.push(richText);
        }

        this.bouncySouls = new PIXI.ParticleContainer();
        this.spinningPile = new PIXI.ParticleContainer();
        this.spinningPile.x = center[0]-8;
        this.spinningPile.y = center[1]-8;
        this.displayCon.addChild(this.bouncySouls);
        this.displayCon.addChild(this.spinningPile);
    }

    addSoul(skey,noturb){
        const drops = {
            "Vile" : Vile,
            "Feral" : Feral,
            "Unhinged" : Unhinged,
            "Artistic" : Artistic,
            "Ordered" : Ordered,
            "Saintly" : Saintly,
        }
        let loot = new drops[skey.name]();
        let caste = Object.keys(drops).indexOf(skey.name);
        loot.displayIcon.width = 32;
        loot.displayIcon.height = 32;
        loot.displayIcon.x = 194;
        loot.displayIcon.y = 194;
        loot.displayIcon.alpha = 0.15;
        loot.displayIcon.bounceborder = 420;
        loot.displayIcon.trspeed = 5;
        loot.displayIcon.caste = caste;
        this.bouncySouls.addChild(loot.displayIcon);
        if (this.inPaint) {
            let can = loot.displayIcon;
            can.bounceborder = 32;
            can.x = 16;
            can.y = 16;
            can.width = 16;
            can.height = 16;
            can.alpha = 0.5;
            can.trspeed = 2;
            this.wheelCon.children[6-can.caste].paintCan.addChild(can);
        }
        app.ticker.add(() => {
            if (loot.displayIcon.x > loot.displayIcon.bounceborder) loot.displayIcon.dirx = -Math.abs(loot.displayIcon.dirx);
            else if (loot.displayIcon.x < -6) loot.displayIcon.dirx = Math.abs(loot.displayIcon.dirx);
            else if (loot.displayIcon.y > loot.displayIcon.bounceborder) loot.displayIcon.diry = -Math.abs(loot.displayIcon.diry);
            else if (loot.displayIcon.y < -6) loot.displayIcon.diry = Math.abs(loot.displayIcon.diry);
            loot.displayIcon.x += loot.displayIcon.dirx*loot.displayIcon.trspeed;
            loot.displayIcon.y += loot.displayIcon.diry*loot.displayIcon.trspeed;
        });
    }
}

class SoulTree{
    constructor(){
        this.castes = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY","SERENE"];
        this.trackedEntity;
    }

    updateSlots(newEntity){
        if (!newEntity) this.trackedEntity = player; // temporary
        else this.trackedEntity = newEntity;
        for (let i = 0; i<6; i++){
            if (this.trackedEntity.souls[basic[5-i+1]] instanceof Soul) this.axiomCon.children[i].alpha = 1;
            else this.axiomCon.children[i].alpha = 0.5;
        }
        this.entityName.text = creaturePresentation[this.trackedEntity.species]["name"];
        this.entityName.style.fill = creaturePresentation[this.trackedEntity.species]["color"];
        this.entityLore.text = creaturePresentation[this.trackedEntity.species]["lore"];
        this.entityOpinion.text = creaturePresentation[this.trackedEntity.species]["opinion"];
        const textMetrics = PIXI.TextMetrics.measureText(this.entityLore.text, this.entityLore.style);
        this.entityOpinion.y = 45 + textMetrics.height;
        this.entitySprite.texture = allsprites.textures['sprite'+speciesData[this.trackedEntity.species]["sprite"]];
        let hpIndicator = this.trackedEntity.hp;
        for (let i of this.healthTracker){
            if (hpIndicator <= 0){
                i.texture = allsprites.textures['icon7'];
            }
            else i.texture = allsprites.textures['sprite75'];
            hpIndicator--;
        }
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*15;
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,17,this.displayCon);
        drawChainLine(9,16,210,"h",this.displayCon);
        drawChainLine(9,16,50,"h",this.displayCon);
        this.axiomCon = new PIXI.Container();
        this.axiomCon.x = -8;
        this.axiomCon.y = 210;
        this.displayCon.addChild(this.axiomCon);

        const xcoords = {
            0: 79,
            1: 193,
            2: 41,
            3: 231,
            4: 79,
            5: 193,
        }

        const ycoords = {
            0: 41,
            1: 41,
            2: 136,
            3: 136,
            4: 231,
            5: 231,
        }

        for (let i = 0; i<6; i++){
            let axiomslot = new FoxSprite(allsprites.textures['icon'+i]);
            axiomslot.width = 32;
            axiomslot.height = 32;
            axiomslot.x = xcoords[i];
            axiomslot.y = ycoords[i];
            axiomslot.alpha = 1;
            this.axiomCon.addChild(axiomslot);
            axiomslot.eventMode = 'static';
            axiomslot.on('pointerdown', (event) => {
                //this.storeAxiom(i);
                if (wheel.currentSoulDisplayed) wheel.displayCon.removeChild(wheel.currentSoulDisplayed.displayCon);
                if (!this.trackedEntity.souls[basic[5-i+1]]){
                    wheel.displayCon.addChild(wheel.wheelCon);
                    return;
                };
                wheel.displayCon.addChild(this.trackedEntity.souls[basic[5-i+1]].displayCon);
                wheel.displayCon.removeChild(wheel.wheelCon);
                wheel.currentSoulDisplayed = this.trackedEntity.souls[basic[5-i+1]];
            });
            axiomslot.on('pointerover', (event) => {
                let wai = new PIXI.filters.GlowFilter();
                wai.outerStrength = 1;
                axiomslot.filters = [wai];
            });
            axiomslot.on('pointerout', (event) => {
                axiomslot.filters = [];
            });
        }
        this.healthTracker = [];
        for (let i = 0; i<4; i++){
            let axiomslot = new FoxSprite(allsprites.textures['icon7']);
            axiomslot.width = 32;
            axiomslot.height = 32;
            axiomslot.x = 272/2+0.5;
            axiomslot.y = 80+i*37;

            this.healthTracker.push(axiomslot);
            this.axiomCon.addChild(axiomslot);
            axiomslot.eventMode = 'static';
            axiomslot.on('pointerdown', (event) => {
                this.activateAxiom(i);
            });
            axiomslot.on('pointerover', (event) => {
                let wai = new PIXI.filters.GlowFilter();
                wai.outerStrength = 1;
                axiomslot.filters = [wai];
            });
            axiomslot.on('pointerout', (event) => {
                axiomslot.filters = [];
            });
        }
        this.healthTracker.reverse();
        let newSprite = new FoxSprite(allsprites.textures['icon6']);
        newSprite.width = (7+12)*16;
        newSprite.height = (7+12)*16;
        this.axiomCon.addChild(newSprite);

        let style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 18,
            fill: "plum",
        });
        this.entityName = new PIXI.Text("If you see this it is buggo :3", style); //this.trackedEntity.name
        this.entityName.anchor.set(0.5,0.5);
        this.entityName.x = (335+22)/4+70;
        this.entityName.y = (121+31)/4-24;
        this.displayCon.addChild(this.entityName);

        this.entitySprite = new FoxSprite(allsprites.textures['sprite'+1]);
        this.entitySprite.width = 32;
        this.entitySprite.height = 32;
        this.entitySprite.y = -2;
        
        this.displayCon.addChild(this.entitySprite);

        style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 14,
            fill: "white",
            wordWrap: true,
            wordWrapWidth: 9*32
        });

        this.entityLore = new PIXI.Text("If you see this it is buggo :3", style); //this.trackedEntity.name
        this.entityLore.y = 46;
        this.displayCon.addChild(this.entityLore);

        style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 14,
            fill: "plum",
            wordWrap: true,
            wordWrapWidth: 9*32
        });

        this.entityOpinion = new PIXI.Text("If you see this it is buggo :3", style); //this.trackedEntity.name
        this.entityOpinion.y = 0;
        this.displayCon.addChild(this.entityOpinion);

        this.updateSlots();
    }
}

class Soul{
    constructor(name,owner){
        this.id = name;
        this.caste;


        this.offsetX = 0;      
        this.shattered = false;                                             
        this.offsetY = 0;
        this.spinSpeed = 0.05;
        this.x = 0;
        this.y = 0;
        this.speed = 0.01;
        this.angle = 0;

        this.contingencies = [];
        this.commands = {};
        this.axioms = [];
        this.tags = new Set();
        this.owner = owner;
        if (!this.owner) this.owner = "None";
        if (["EMPTY","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"].includes(name)) return;
        this.setUpAxioms();
        this.findBindings();
    }

    setUpSprites(){
        const inside = {
            "NumberIncrementer" : 67,
            "ModuloGate" : 68,
            "NumberStorage" : 69,
            "HealProvider" : 70,
            "Contingency" : 72,
            "CloneCreature" : 71,
            "Structures" : 73,
            "LinkForm" : 75,
            "Song" : 76,
            "DamageDealer" : 35,
            "Herald" : 37,
            "FormDir" : 36,
            "Turbulent" : 28,
            "FormEntity" : 13,
            "BooleanGate" : 33,
            "SpeciesCheck" : 24,
            "FormTile" : 26,
            "Security" : 1,
            "AssimilateBroadcast" : 49,
            "OverwriteSlot" : 14,
            "BooleanFlip" : 39,
            "MoveFunction" : 74,
            "NoTargetStop" : 40,
            "RadioBroadcaster" : 27,
            "SENET" : 8,
            "SoulInjector" : 29,
            "EgoForm" : 66,
            "CrossForm" : 66, // this should not be the same
            "PARACEON" : 41,
            "SMOOCH" : 17,
            "LastDamageSource" : 18,
            "PaintTile" : 30,
            "FailCatcher" : 43,
            "TriggerWatch" : 42,
            "ClearPaint" : 32,
            "VoidTargets" : 38,
            "EPSILON" : 44,
            "Brush" : 65,
            "SoulAbsorber" : 20,
            "Saintly" : 0,
            "Ordered" : 1,
            "Unhinged" : 3,
            "Feral" : 4,
            "Vile" : 5,
            "Artistic" : 2,
            "ContinKilled" : 15,
            "RadioReceiver" : 16,
            "RealityAnchor" : 20,
            "PaintFilter" : 25,
            "EntityFilter" : 22,
            "Axioms" : 6,
            
            
            "ZENORIUM" : 65,
        }
        this.displayCon = new PIXI.Container();
        let size = 80;
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                let icon = 7;
                if (!this.axioms[i][j].empty) icon = inside[this.axioms[i][j].constructor.name];
                this.axioms[i][j].icon = icon;
                let axiom = new FoxSprite(allsprites.textures['icon'+icon]);
                axiom.eventMode = 'static';
                axiom.x = i*size+24;
                axiom.y = j*size+24;
                axiom.width = size;
                axiom.height = size;
                axiom.on('pointerdown', (event) => {
                });
                axiom.on('pointerover', (event) => {
                    app.stage.addChild(sideTooltip.displayCon);
                    sideTooltip.getDescription(this.axioms[i][j]);
                    let wai = new PIXI.filters.GlowFilter();
                    wai.outerStrength = 1;
                    axiom.filters = [wai];
                });
                axiom.on('pointerout', (event) => {
                    app.stage.removeChild(sideTooltip.displayCon);
                    axiom.filters = [];
                });
                this.displayCon.addChild(axiom);
            }
        }
    }

    setUpAxioms(){
        let id = this.id;
        for (let i = 0; i<5; i++){
            this.axioms[i] = [];
            for (let j = 0; j<5; j++){
                const hai = logicMaps[id]["keys"];
                if (logicMaps[id][i][j] == ".") this.axioms[i][j] = new EmptyAxiom();
                else{
                    if (!hai[logicMaps[id][i][j]]) throw new Error("Component " + logicMaps[id][i][j] +" was not specified in rooms.js");
                    this.axioms[i][j] = Object.create(hai[logicMaps[id][i][j]]);
                }
                this.axioms[i][j].x = i;
                this.axioms[i][j].y = j;
                this.axioms[i][j].soul = this;
            }
        }
        this.setUpSprites();
    }

    cloneSoul(){
        let newSoul = new Soul("Empty",this.owner);
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                newSoul.axioms[i][j] = Object.create(this.axioms[i][j]); //may cause problems eventually with souls inside souls - maybe ban this and setup "references" to other creatures instead of storing souls
            }
        }
        newSoul.setUpSprites();
        newSoul.findBindings();
        return newSoul;
    }

    loopThroughAxioms(){
        let ax = [];
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                ax.push(this.axioms[i][j]);
            }
        }
        return ax;
    }

    forceInjectAxiom(axiomType){ //modifies soul
        let emptySpace = this.findAxioms(EmptyAxiom);
        if (emptySpace.length === 0) return false;
        else{
            this.axioms[emptySpace[0].x][emptySpace[0].y] = new axiomType();
            this.findBindings();
            return true;
        }
    }

    findAxioms(type){
        let found = [];
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                if (this.axioms[i][j] instanceof type) found.push(this.axioms[i][j]);
            }
        }
        return found;
    }

    getIconOfCommand(axiom){
        const neigh = this.getLogicNeighbours(axiom,true);
        for (let i of neigh){
            if (i instanceof DefineIcon && i.storage) return i.storage;
        }
    }

    findBindings(){
        this.contingencies = [];
        this.commands = {};
        this.tags.clear();
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                if(this.axioms[i][j].contingency) this.contingencies.push(this.axioms[i][j]);
                if(this.axioms[i][j] instanceof RadioReceiver && this.axioms[i][j].storage && this.axioms[i][j].storage.length === 1){
                    this.commands[this.axioms[i][j].storage] = this.getIconOfCommand(this.axioms[i][j]);
                }
                if (this.axioms[i][j].tag) this.tags.add(this.axioms[i][j].tag);
            }
        }
    }

    getLogicNeighbours(axiom, includeSource){
        if (!includeSource) includeSource = false;
        let results = [];
        const neig = [[0,1],[1,0],[0,-1],[-1,0]];
        for (let i of neig){
            let fou;
            if (between(axiom.x+i[0],-1,5) && between(axiom.y+i[1],-1,5)) fou = this.axioms[axiom.x+i[0]][axiom.y+i[1]];
            else continue;
            if (!fou.empty && (includeSource || !(axiom.sourceX == fou.x && axiom.sourceY == fou.y))){
                if (!includeSource){
                    fou.sourceX = axiom.x;
                    fou.sourceY = axiom.y;
                }
                results.push(fou);
            }
        }
        return results;
    }

    absorbSoul(start,destination){
        this.owner.creaturecon.x = tileSize*(8+(start.x-player.tile.x));
        this.owner.creaturecon.y = tileSize*(8+(start.y-player.tile.y));
        tilesDisplay.addChild(this.owner.creaturecon);
        const destinationX = tileSize*(8+(destination.tile.x-player.tile.x));
        const destinationY = tileSize*(8+(destination.tile.y-player.tile.y));
        const oriX = this.owner.creaturecon.x;
        const oriY = this.owner.creaturecon.y;
        let source = this.owner.creaturecon;
        let wao = new PIXI.Ticker;
        wao.start();
        wao.add(() => {
            if (!approxEqual(source.x,destinationX,3) && !approxEqual(source.y,destinationY,3)){
                source.x += (destinationX - oriX)/10;
                source.y += (destinationY - oriY)/10;
            }
            else{
                tilesDisplay.removeChild(source);
                wao.destroy();
            }
        });
        removeItemOnce(start.souls,this);
    }

    checkCompatibility(sourceAxiom, destAxiom){
        let foundType;
        if (typeof sourceAxiom.storage === "boolean") foundType = "Boolean";
        else if (typeof sourceAxiom.storage === "number") foundType = "Number";
        else if (typeof sourceAxiom.storage === "string") foundType = "Message";
        else {
            let storageEquivalences = {
                "Creature" : Creature,
                "Axiom" : Axiom,
                "Soul" : Soul,
                "Colour" : Colour,
                "Direction" : Direction,
                "Tile" : Tile,
                "Caste" : Caste,
            };
            for (let i of Object.keys(storageEquivalences)){
                if (sourceAxiom.storage instanceof storageEquivalences[i]){
                    foundType = i;
                    break;
                }
            }
        }
        if (destAxiom.dataType.includes(foundType)) return true;
        else return false;
    }

    trigger(event,assi){
        let data;
        for (let i of this.contingencies) if (i.storage == event || (i.dataType.includes("Axiom") && i.storage.constructor.name == event)){
            if (assi){
                if (assi[0]["caster"]){
                    data = assi;
                }
                else for (let j of assi){
                    let studying = this.axioms[i.x+j.relativeDir[0]][i.y+j.relativeDir[1]];
                    if (this.checkCompatibility(j,studying)) studying.storage = j.storage;
                }
            }
            this.pulse(i,data);
        }
    }

    pulse(source,dataOverwrite){
        let data = [{
            "synapses" : [source],
            "targets" : [],
            "caster" : this.owner,
            "break" : false,
            "showEffects" : false,
        }];
        if (dataOverwrite){
            data = dataOverwrite;
            for (let i of data) i["synapses"] = [source];
        }
        let loopNum = 0;
        while(data.length != 0){
            loopNum++;
            if (loopNum >= 1000){
                throw new Error("Infinite loop in "+this.owner.id+".");
                break;
            }
            let currentSynapse = data[0];
            let i = currentSynapse["synapses"][0];
            currentSynapse = i.act(currentSynapse);
            currentSynapse["targets"] = [...new Set(currentSynapse["targets"])]; // remove duplicates
            if (currentSynapse["showEffects"]) for (let i of currentSynapse["targets"]) i.setEffect(14); //TODO maybe change the effect depending on soul caste
            this.owner.trigger(i.constructor.name); // for triggerwatch contingency
            let additions = [];
            for (let r of this.getLogicNeighbours(i)) additions.push(r);
            if (additions.length == 0) currentSynapse["break"] = true;
            if (additions.length >= 1 && !currentSynapse["break"]) currentSynapse["synapses"].push(additions[0]);
            if (additions.length > 1 && !currentSynapse["break"]){
                for (let o = 1; o<additions.length; o++){
                    data.push({
                        "synapses" : [additions[o]],
                        "targets" : currentSynapse["targets"].slice(),
                        "caster" : currentSynapse["caster"],
                        "break" : currentSynapse["break"],
                    });
                }
            }
            removeItemOnce(currentSynapse["synapses"],i);
            if (currentSynapse["break"]){
                currentSynapse["synapses"] = [];
                let additionsFail = [];
                for (let r of this.getLogicNeighbours(i)) {
                    if (r instanceof FailCatcher) additionsFail.push(r);
                }
                if (additionsFail.length == 0) removeItemOnce(data,currentSynapse);
                else currentSynapse["break"] = false;
                if (additionsFail.length >= 1) currentSynapse["synapses"].push(additionsFail[0]);
                if (additionsFail.length > 1){
                    for (let o = 1; o<additionsFail.length; o++){
                        data.push({
                            "synapses" : [additionsFail[o]],
                            "targets" : currentSynapse["targets"].slice(),
                            "caster" : currentSynapse["caster"],
                            "break" : currentSynapse["break"],
                        });
                    }
                }
            }
        }
    }
}

class Empty extends Soul{
    constructor(){
        super("EMPTY");
        this.icon = 7;
    }
}