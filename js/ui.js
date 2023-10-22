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

    addLog(creature,num){
        if (!dialogueSequences[creature]) return;
        let message = dialogueSequences[creature][num];
        if (!message) return;
        if (this.textcon.children.length > 0 && message == this.textcon.children[this.textcon.children.length-1].originalText){
            this.textcon.children[this.textcon.children.length-1].repetitions += 1;
            this.textcon.children[this.textcon.children.length-1].text = this.textcon.children[this.textcon.children.length-1].originalText +  " x" + this.textcon.children[this.textcon.children.length-1].repetitions;
            return;
        }
        let coloring = dialogueSequences[creature].color;
        const style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 18,
            fill: coloring,
            wordWrap: true,
            wordWrapWidth: 450,
            lineJoin: 'round',
        });
        //if (dialogueSequences[creature].booleanText) style.breakWords = true; // so boolean (the character) doesn't go out of the frame (no spaces)
        printOutText(message,0,0,style,this.textcon);
        const richText = new PIXI.Text(message, style);
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
        if (this.trackedEntity.species == "Harmonizer") this.entityOpinion.style.fill = "cyan";
        else this.entityOpinion.style.fill = "plum";
        const textMetrics = PIXI.TextMetrics.measureText(this.entityLore.text, this.entityLore.style);
        this.entityOpinion.y = 45 + textMetrics.height;
        this.entitySprite.texture = allsprites.textures['sprite'+speciesData[this.trackedEntity.species]["sprite"]];
        let printedTags = 0;
        for (let i of this.trackedEntity.tags){
            if (tagSprites[i]) this.tagTracker[printedTags].texture = allsprites.textures['icon'+tagSprites[i]];
            else this.tagTracker[printedTags].texture = allsprites.textures['icon1'];
            printedTags++;
        }
        for (let i = printedTags; i<4; i++){
            this.tagTracker[i].texture = allsprites.textures['icon7'];
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
        this.tagTracker = [];
        for (let i = 0; i<4; i++){
            let axiomslot = new FoxSprite(allsprites.textures['icon7']);
            axiomslot.width = 32;
            axiomslot.height = 32;
            axiomslot.x = 272/2;
            axiomslot.y = 80+i*37;

            this.tagTracker.push(axiomslot);
            this.axiomCon.addChild(axiomslot);
            axiomslot.eventMode = 'static';
            axiomslot.on('pointerdown', () => {
            });
            axiomslot.on('pointerover', () => {
                let wai = new PIXI.filters.GlowFilter();
                wai.outerStrength = 1;
                axiomslot.filters = [wai];
            });
            axiomslot.on('pointerout', () => {
                axiomslot.filters = [];
            });
        }
        //this.tagTracker.reverse();
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