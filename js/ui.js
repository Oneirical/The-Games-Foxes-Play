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

    getDataText(dataPoint){
        if (typeof dataPoint === "string") return "Message: "+dataPoint;
        else if (typeof dataPoint === "number") return "Number: "+dataPoint;
        else if (typeof dataPoint === "boolean"){
            if (dataPoint) return "Boolean: True";
            else return "Boolean: False";
        }
        else if (dataPoint instanceof Tile) return "Tile: "+dataPoint.name+" at X: "+dataPoint.x+" and Y: "+dataPoint.y;
        else if (dataPoint instanceof Monster) return "Creature: "+dataPoint.name+" at X: "+dataPoint.tile.x+" and Y: "+dataPoint.tile.y;
        else if (dataPoint instanceof Axiom) return "Axiom: "+soulData[dataPoint.nameID]["name"];
        else if (dataPoint instanceof Colour) return "Colour: "+dataPoint.colour;
        else if (dataPoint instanceof Direction){
            const dirs = {
                "N" : "North",
                "S" : "South",
                "W" : "West",
                "E" : "East"
            }
            return "Direction: "+dirs[dataPoint.direction];
        }
        else if (dataPoint instanceof Caste) return "Caste: "+dataPoint.caste;
        else if (dataPoint instanceof Soul) return "A captive Soul.";
        else if (dataPoint && dataPoint.species) return "Species: "+dataPoint.species;
        else return "Nothing."
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
        if (node.dataType.length == 0) soulDataTypes = "This Axiom cannot contain any Data.";
        else if (node.dataType.length == 1) soulDataTypes = "This Axiom can contain "+ node.dataType[0] +"-type Data.";
        else if (node.dataType.length == 2) soulDataTypes = "This Axiom can contain " + node.dataType[0]+ "-type or " + node.dataType[1] +"-type Data.";
        // extra case for length > 2?
        const text = [tag["name"],researchflags["Saintly"], tag["descript"],tag["lore"],soulDataTypes, "This Axiom currently contains:\n\n"+this.getDataText(node.storage)]; //,node.extra
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

class AxiomList{
    constructor(){
        this.setUpSprites();
    }

    fillInRows(entity){
        this.axiomRows.removeChildren();
        const source = entity.axioms;
        for (let i =0 ; i<10; i++){
            const maxSize = 18;
            let slot;
            if (i < 6) slot = source.active[i];
            else slot = source.storage[i-6];
            for (let j = 0; j<maxSize; j++){
                let spriteID = inside[slot.sequence[j]];
                if (!spriteID) spriteID = 7;
                let praxisSprite = new FoxSprite(allsprites.textures["icon"+spriteID]);
                if (i < 6) praxisSprite.y = source.active.indexOf(slot)*87+7;
                else praxisSprite.y = (6+source.storage.indexOf(slot))*87+7;
                if (j>maxSize/2) praxisSprite.y += 32;
                praxisSprite.x = (j+1)*32+52;
                if (j>maxSize/2) praxisSprite.x -= (maxSize/2+1)*32;
                praxisSprite.width = 32;
                praxisSprite.height = 32;
                const currentSpell = slot.sequence[j];
                praxisSprite.eventMode = 'static';
                this.descriptionBox = new NodeDescription();
                this.descriptionBox.setUpSprites();
                this.descriptionBox.displayCon.x = -15*32;
                this.descriptionBox.displayCon.y = 32;
                uiDisplayRight.addChild(this.descriptionBox.displayCon);
                this.descriptionBox.displayCon.visible = false;
                const graphics = new PIXI.Graphics();
                graphics.beginFill("black");
                graphics.drawRect(-8, -8, 14*32, 28*32-16);
                graphics.endFill();
                this.descriptionBox.displayCon.addChild(graphics);
                praxisSprite.on('pointerdown', (event) => {
                });
                praxisSprite.on('pointerover', (event) => {
                    if (currentSpell){
                        this.descriptionBox.displayCon.visible = true;
                        this.descriptionBox.getDescription(currentSpell);
                    }
                    let wai = new PIXI.filters.GlowFilter();
                    wai.outerStrength = 1;
                    praxisSprite.filters = [wai];
                });
                praxisSprite.on('pointerout', (event) => {
                    this.descriptionBox.displayCon.visible = false;
                    praxisSprite.filters = [];
                });

                this.axiomRows.addChild(praxisSprite);
            }
        }
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        drawChainBorder(15,28,this.displayCon);
        this.axiomRows = new PIXI.Container();
        const rowColors = ["lime","orangered","orange","yellow","yellowgreen","plum","white","white","white","white"];
        for (let i = 0; i<10; i++){
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(5, rowColors[i], 1);
            graphics.beginFill("black");
            graphics.drawRect(80, i*87, 370, 77);
            graphics.endFill();
            this.displayCon.addChild(graphics);
        }
        for (let i = 0; i<10; i++){
            let spriteID = i;
            if (spriteID > 5) spriteID = 7;
            let casteSprite = new FoxSprite(allsprites.textures["icon"+spriteID]);
            casteSprite.y = i*87+8;
            casteSprite.width = 64;
            casteSprite.height = 64;
            this.displayCon.addChild(casteSprite);
        }
        this.displayCon.addChild(this.axiomRows);
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
        this.dead = true;
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

class StatusDisplay{
    constructor(){
        this.trackedEntity;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*15;
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,5,this.displayCon);
        drawChainLine(4,110,15,"v",this.displayCon);
        drawChainLine(4,165,15,"v",this.displayCon);
        this.hpCon = new PIXI.Container();
        this.hpCon.x = 8;
        this.hpCon.y = 6;
        this.statusCon = new PIXI.Container();
        this.statusCon.x = 166;
        this.statusCon.y = 6;
        for (let i = 0; i<2;i++){
            for (let j = 0; j<6; j++){
                let newSprite = new FoxSprite(allsprites.textures['icon7']);
                newSprite.x = i*60;
                newSprite.y = j*20;
                newSprite.width = 16;
                newSprite.height = 16;
                this.statusCon.addChild(newSprite);
                const style = new PIXI.TextStyle({
                    fontFamily: 'Play',
                    fontSize: 12,
                    fill: "white",
                });
                printOutText("0",10+i*30,j*10,style,this.statusCon);
            }
        }
        this.displayCon.addChild(this.statusCon);
        this.displayCon.addChild(this.hpCon);
        for (let i = 0; i<2;i++){
            for (let j = 0; j<3; j++){
                let newSprite = new FoxSprite(allsprites.textures['icon1']);
                newSprite.x = i*40;
                newSprite.y = j*40;
                newSprite.width = 32;
                newSprite.height = 32;
                this.hpCon.addChild(newSprite);
            }
        }
        this.soulCon = new PIXI.Container();
        this.soulCon.x = 111;
        this.soulCon.y = 6;
        this.displayCon.addChild(this.soulCon);
        let newSprite = new FoxSprite(allsprites.textures['icon49']);
        newSprite.x = 0;
        newSprite.y = 40;
        newSprite.width = 32;
        newSprite.height = 32;
        this.soulCon.addChild(newSprite);
    }

    updateDisplay(){
        this.trackedEntity = player;
        let i = this.trackedEntity;
        if (!i.isPlayer) this.displayCon.visible = false;
        for (let b of this.hpCon.children) b.visible = true;
        let count = 0;
        for (let j = 0; j < i.hp; j++){
            count++;
        }
        for (let r = count; r<6;r++){
            this.hpCon.children[r].visible = false;
        }
        count = 0;
        for (let e of Object.keys(i.statusEff)){
            this.statusCon.children[count+1].children[0].text = i.statusEff[e];
            if (i.statusEff[e] > 0) {
                this.statusCon.children[count].texture =  allsprites.textures['icon0'];
                count +=2;
            }
            else if (i.statusEff[e] == 0){
                this.statusCon.children[count].texture =  allsprites.textures['icon7'];
            }
        }
    }
}

class ComponentsDisplay{
    constructor(contin,forms,mutators,functions,power,cost,caste){
        //this.timer = 0;
        this.forms = [];
        this.functions = [];
        this.mutators = [];
        this.contin = [];
        this.caste = caste;
        this.power = power;
        this.cost = cost;
        if (functions) for (let i of functions) this.functions.push(i);
        if (mutators) for (let i of mutators) this.mutators.push(i);
        if (forms) for (let i of forms) this.forms.push(i);
        if (contin) for (let i of contin) this.contin.push(i);
        this.cage = [];
        this.build();
    }

    build(){
        //if (!spellpatterns[this.type]) return;
        let seq = 1;
        for(let i=0;i<5+2;i++){
            this.cage[i] = [];
            for(let j=0;j<4+2;j++){
                if((i == 0 && j == 0) || (i == 5+1 && j == 4+1) ||(i == 0 && j == 4+1) ||(j == 0 && i == 5+1)) this.cage[i][j] = new Floor(i,j);
                else if (i == 0) this.cage[i][j] = new CageWall(i,j,"w");
                else if (j == 0) this.cage[i][j] = new CageWall(i,j,"n");
                else if (i == 5+1) this.cage[i][j] = new CageWall(i,j,"e");
                else if (j == 4+1) this.cage[i][j] = new CageWall(i,j,"s");
                else{
                    this.cage[i][j] = new CageContainer(i,j);
                    this.cage[i][j].sprite = 121+j;
                    this.cage[i][j].spritesave = 121+j;
                    //this.cage[i][j].value = new keyspells[spellpatterns[this.type][j-1][i-1]];
                    //if (!(this.cage[i][j].value instanceof Empty)) this.cage[i][j].value.turbulent = true;
                }
            }
        }

        for(let j=0;j<4+2;j++){
            for(let i=0;i<5+2;i++){
                if (this.cage[i][j] instanceof CageContainer){
                    for (let k=0;k<this.contin.length;k++){
                        if(j == 1&& i-1 == k){
                            this.cage[i][j].value = new Component(this.contin[k]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.forms.length;k++){
                        if (j == 2 && i-1 == k){
                            this.cage[i][j].value = new Component(this.forms[k]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.functions.length;k++){
                        if(j == 4&& i-1 == k){
                            this.cage[i][j].value = new Component(this.functions[k]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    for (let k=0;k<this.mutators.length;k++){
                        if(j == 3&& i-1 == k){
                            this.cage[i][j].value = new Component(this.mutators[k]);
                            this.cage[i][j].seq = seq;
                            seq++;
                        }
                    }
                    if(!this.cage[i][j].value) this.cage[i][j].value = new Empty();
                }
            }
        }
    }
}

class InfluenceDisplay{
    constructor(){
        universe.getTotalInfluence();
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*15;  
        this.inflCon = new PIXI.Container();
        this.displayCon.addChild(this.inflCon);
        drawChainBorder(7,17,this.displayCon);
        const colors = ["lime","orangered","orange","yellow","yellowgreen","plum"];
        for (let i = 0; i<6; i++){
            let chSprite = 'icon'+i;
            let newSprite = new FoxSprite(allsprites.textures[chSprite]);
            newSprite.y = i*50;
            newSprite.x = 0;
            newSprite.width = 48;
            newSprite.height = 48;
            this.inflCon.addChild(newSprite);
            const style = new PIXI.TextStyle({
                fontFamily: 'Play',
                fontSize: 18,
                fill: colors[i],
            });
            const castes = ["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"];
            textWithoutCringe(universe.totalInfluence[castes[i]].toString(),70,i*50+12,style,this.inflCon);
        }
        drawChainLine(6,16,7*50-32,"h",this.inflCon);
        for (let i = 0; i<2; i++){
            let chSprite = 'icon7';
            if (i == 0) chSprite = 'sprite26';
            let newSprite = new FoxSprite(allsprites.textures[chSprite]);
            newSprite.y = (i+6)*50+16;
            newSprite.x = 0;
            newSprite.width = 48;
            newSprite.height = 48;
            this.inflCon.addChild(newSprite);
            const sumCol = ["cyan","white"];
            const style = new PIXI.TextStyle({
                fontFamily: 'Play',
                fontSize: 18,
                fill: sumCol[i],
            });
            const types = ["Serene","Total"];
            const multi = ["/ 2","/ 10"];
            textWithoutCringe(universe.totalInfluence[types[i]].toString(),70,i*50+328,style,this.inflCon);
            textWithoutCringe(multi[i],130,i*50+328,style,this.inflCon);
        }
        drawChainLine(6,16,9*50-12,"h",this.inflCon);
        let newSprite = new FoxSprite(allsprites.textures['icon13']);
        newSprite.y = 9*50;
        newSprite.x = 0;
        newSprite.width = 48;
        newSprite.height = 48;
        this.inflCon.addChild(newSprite);
        const style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 18,
            fill: "lightblue",
        });
        textWithoutCringe(universe.calculatePotency().toString(),70,462,style,this.inflCon);
    }
}

class CraftingDisplay{
    constructor(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*15;  
        this.displayCon.x = 32*7; 
        this.craftCon = new PIXI.Container();
        this.displayCon.addChild(this.craftCon);
        drawChainBorder(3,17,this.displayCon);
        for (let i = 0; i<8; i++){
            let newSprite = new FoxSprite(allsprites.textures['icon7']);
            newSprite.y = i*64;
            newSprite.x = 0;
            newSprite.width = 64;
            newSprite.height = 64;
            newSprite.eventMode = 'static';
            newSprite.assignedPraxis = "EMPTY";
            newSprite.on('pointerover', (event) => {
                this.findMatching(newSprite.assignedPraxis);
                let wai = new PIXI.filters.GlowFilter();
                wai.outerStrength = 1;
                newSprite.filters = [wai];
            });
            newSprite.on('pointerout', (event) => {
                this.resetShadows();
                newSprite.filters = [];
            });
            this.craftCon.addChild(newSprite);
        }
    }

    updateDisplay(){
        for (let i = 0; i<8; i++){
            const currentSpell = world.cage.pocketworld.reward["Sequence"][i];
            let sprite = inside[currentSpell];
            if (!sprite) sprite = 7;
            this.craftCon.children[i].texture = allsprites.textures['icon'+sprite];
            this.craftCon.children[i].assignedPraxis = currentSpell;
        }
    }

    resetShadows(){
        for (let i = 0; i<numTiles; i++){
            for (let j = 0; j<numTiles; j++){
                if (tiles[i][j] instanceof CageContainer){
                    tiles[i][j].tilecon.alpha = 1;
                }
            }
        }
    }

    findMatching(praxis){
        if (!praxis) return;
        for (let i = 0; i<numTiles; i++){
            for (let j = 0; j<numTiles; j++){
                if (tiles[i][j] instanceof CageContainer && world.cage.slots[i][j].patternFound != praxis){
                    tiles[i][j].tilecon.alpha = 0.3;
                }
                else if (tiles[i][j] instanceof CageContainer && world.cage.slots[i][j].patternFound === praxis){
                    tiles[i][j].tilecon.alpha = 1;
                }
            }
        }
    }
}

class CatalogueDisplay{
    constructor(){
        this.setUpSprites();
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*16;
        this.catalogueCon = new PIXI.Container();
        this.displayCon.addChild(this.catalogueCon);
        this.catalogueCon.x = 8;
        this.catalogueCon.y = 8;
        drawChainBorder(15,12,this.displayCon);
        for (let i = 0; i<7; i++){
            for (let j = 0; j<5; j++){
                const currentSpell = research.knownSpells[j+i*8];
                let sprite = inside[currentSpell];
                if (!sprite) sprite = 7;
                let newSprite = new FoxSprite(allsprites.textures['icon'+sprite]);
                newSprite.x = j*48;
                newSprite.y = i*48;
                newSprite.width = 48;
                newSprite.height = 48;
                newSprite.eventMode = 'static';
                this.descriptionBox = new NodeDescription();
                this.descriptionBox.setUpSprites();
                this.descriptionBox.displayCon.x = -15*32;
                this.descriptionBox.displayCon.y = 32;
                uiDisplayRight.addChild(this.descriptionBox.displayCon);
                this.descriptionBox.displayCon.visible = false;
                const graphics = new PIXI.Graphics();
                graphics.beginFill("black");
                graphics.drawRect(-8, -8, 14*32, 28*32-16);
                graphics.endFill();
                this.descriptionBox.displayCon.addChild(graphics);
                newSprite.on('pointerdown', (event) => {
                });
                newSprite.on('pointerover', (event) => {
                    if (currentSpell){
                        this.descriptionBox.displayCon.visible = true;
                        this.descriptionBox.getDescription(currentSpell);
                    }
                    let wai = new PIXI.filters.GlowFilter();
                    wai.outerStrength = 1;
                    newSprite.filters = [wai];
                });
                newSprite.on('pointerout', (event) => {
                    this.descriptionBox.displayCon.visible = false;
                    newSprite.filters = [];
                });
                this.catalogueCon.addChild(newSprite);

            }
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

class SoulBreathing{
    constructor(){
        //this.wheel = [new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty(),new Empty()];
        let center = [(canvas.height+canvas.width-256)/2-40, 195*canvas.height/900]; //256: minimap height
        this.dist = 100*(7/7);
        let dist = this.dist;
        let pi = Math.PI;
        this.wheelcoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        dist = 45*(7/7);
        center = [center[0]+28,center[1]+38];
        this.hotkeycoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];

        this.subduedSouls = [];
        this.turbulentSouls = []; //
        this.exhaustedSouls = [];
        this.resolve = 3; //update this later with the bonus
        //this.castes = [new Saintly(),new Ordered(),new Artistic(),new Unhinged(),new Feral(),new Vile()];
        this.hide = false;
        this.ipseity = 0;
        let first = [587, 420];
        let vert = 52;
        let hori = 64*5-5;
        center = [(canvas.height+canvas.width-256)/2-40, 195*canvas.height/900];
        dist = 100*(7/7);
        this.circlemotion = {centerX:(canvas.height+canvas.width-256)/2-16, centerY:195*canvas.height/900+24, radius:170};
        this.paintcoords = [[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        this.paintcir = [];
        for (let i of this.paintcoords) this.paintcir.push({centerX:i[0]+24, centerY:i[1]+24, radius:15});
        this.currentbrush = 8;
        this.turbstatus = true;
        this.castecoords = [first,[first[0]+hori,first[1]],[first[0],first[1]+vert],[first[0]+hori,first[1]+vert],[first[0],first[1]+vert*2],[first[0]+hori,first[1]+vert*2]];
        //this.turbulentmarkers = [new Feral(),new Feral()];
        //this.turbulentmarkers[0].turbulent = true;
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        uiDisplayRight.addChild(this.displayCon);
        drawChainBorder(15,15,this.displayCon);
        let center = [(1885-1410)/2-16,(505-30)/2-16];
        let dist = 100*(7/7);
        let pi = Math.PI;
        let wheelcoords = [[center[0], center[1]-dist],[center[0]+Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist],[center[0]+dist, center[1]],[center[0]+Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0], center[1]+dist],[center[0]-Math.cos(pi/4)*dist, center[1]+Math.sin(pi/4)*dist],[center[0]-dist, center[1]],[center[0]-Math.cos(pi/4)*dist, center[1]-Math.sin(pi/4)*dist]];
        dist = 45*(7/7);
        this.wheelCon = new PIXI.Container();
        this.displayCon.addChild(this.wheelCon);
        let paintcans = [];
        for (let i = 0; i<8; i++){
            let newSprite = new FoxSprite(allsprites.textures['icon7']);
            newSprite.width = (7-3)*16;
            newSprite.height = (7-3)*16;
            newSprite.anchor.set(0.5,0.5);
            newSprite.x = wheelcoords[i][0];
            newSprite.y = wheelcoords[i][1];
            
            this.wheelCon.addChild(newSprite);
            this.wheelCon.children[i].eventMode = 'static';
            this.wheelCon.children[i].on('click', (event) => {
                this.selectCan(i);
            });
            this.wheelCon.children[i].on('pointerover', (event) => {
                if (this.teleMode){
                    this.destinationText.text = areaNames[i];
                    const areaStyles = {
                        1: "lime",
                        2: "orangered",
                        3: "orange",
                        4: "yellow",
                        5: "yellowgreen",
                        6: "plum",
                        7: "cyan",
                    }
                    this.destinationText.style.fill = areaStyles[i];
                }
            });
            this.wheelCon.children[i].on('pointerout', (event) => {
                if (this.teleMode){
                    this.destinationText.text = areaNames["Select"];
                    this.destinationText.style.fill = "white";
                }
            });
            newSprite.paintCan = new PIXI.Container();
            newSprite.paintCan.eventMode = 'none';
            newSprite.paintCan.x = newSprite.x-22;
            newSprite.paintCan.y = newSprite.y-22;
            paintcans.push(newSprite.paintCan);
        }
        for (let i of paintcans) this.wheelCon.addChild(i);
        this.bouncySouls = new PIXI.ParticleContainer();
        this.spinningPile = new PIXI.ParticleContainer();
        this.spinningPile.x = center[0]-8;
        this.spinningPile.y = center[1]-8;
        this.displayCon.addChild(this.bouncySouls);
        this.displayCon.addChild(this.spinningPile);
    }

    toPaintMode(){
        this.displayCon.removeChild(this.destinationText);
        this.inPaint = true;
        this.catalogue = new CatalogueDisplay();
        this.craftShow = new CraftingDisplay();
        this.inflShow = new InfluenceDisplay();
        // add "if in harmony paint" statement here
        //uiDisplayRight.removeChild(log.displayCon);
        //uiDisplayRight.addChild(this.catalogue.displayCon);
        //uiDisplayLeft.removeChild(player.axioms.displayCon);
        //uiDisplayLeft.removeChild(statuses.displayCon);
        //uiDisplayLeft.addChild(this.craftShow.displayCon);
        //uiDisplayLeft.addChild(this.inflShow.displayCon);
        //this.craftShow.updateDisplay();
        for (let i = 0; i< 8;  i++){
            let hai = (i-1+58);
            if (i == 0) hai = 7;
            this.wheelCon.children[i].texture = allsprites.textures['icon'+hai];
            if (i!=0) this.wheelCon.children[i].alpha = 0.25;
            else this.wheelCon.children[i].alpha = 0.5;
        }
        let initial =this.bouncySouls.children.length-1;
        for (let i = initial; i>=0; i--){
            let can = this.bouncySouls.children[i];
            can.bounceborder = 32;
            can.x = 16;
            can.y = 16;
            can.width = 16;
            can.height = 16;
            can.alpha = 0.5;
            can.trspeed = 2;
            this.wheelCon.children[6-can.caste].paintCan.addChild(can);
        }
    }

    toTeleMode(){
        this.teleMode = true;
        for (let i = 1; i< 8;  i++){
            if (i == 7) this.wheelCon.children[i].texture = allsprites.textures['sprite'+26];
            else this.wheelCon.children[i].texture = allsprites.textures['icon'+(i-1)];
            this.wheelCon.children[i].alpha = 0.5;
            this.wheelCon.children[i].paintCan.visible = false;
        }
        const style = new PIXI.TextStyle({
            fontFamily: 'Play',
            fontSize: 18,
            fill: "white",
        });
        this.destinationText = new PIXI.Text(areaNames["Select"],style);
        this.destinationText.anchor.set(0.5);
        this.destinationText.x = 220;
        this.destinationText.y = 400;
        this.displayCon.addChild(this.destinationText);
    }

    selectCan(i){
        if (this.selectedCan != null || i == this.selectedCan) {
            for (let s of this.wheelCon.children[this.selectedCan].paintCan.children){
                s.trspeed = 2;
                s.alpha = 0.5;
            }
            if (this.selectedCan != 0 && !this.teleMode) this.wheelCon.children[this.selectedCan].alpha = 0.25;
            else this.wheelCon.children[this.selectedCan].alpha = 0.5;
        }
        if (i == this.selectedCan){
            this.selectedCan = null;
            return;
        }
        this.selectedCan = i;
        if (this.selectedCan != 0 && !this.teleMode) this.wheelCon.children[i].alpha = 0.5;
        else this.wheelCon.children[i].alpha = 1;
        for (let s of this.wheelCon.children[i].paintCan.children){
            s.trspeed = 5;
            s.alpha = 0.8;
        }
        if (this.teleMode){
            world.cage.generateWorld()
            world.cage.pocketworld.hypnoDisplay();
            player.move(getTile(world.cageCorner[0]+4,world.cageCorner[1]+4))
        }
    }

    toNormalMode(){
        this.inPaint = false;
        uiDisplayRight.removeChild(this.catalogue.displayCon);
        uiDisplayRight.addChild(log.displayCon);
        uiDisplayLeft.addChild(statuses.displayCon);
        uiDisplayLeft.removeChild(this.craftShow.displayCon);
        uiDisplayLeft.removeChild(this.inflShow.displayCon);
        if (this.selectedCan != null) this.selectCan(this.selectedCan);
        this.selectedCan = null;
        for (let i = 0; i< 8;  i++){
            this.wheelCon.children[i].alpha = 1;
            this.wheelCon.children[i].texture = allsprites.textures['icon7'];
            let initial = this.wheelCon.children[i].paintCan.children.length-1;
            for (let k = initial; k>=0; k--){
                let j = this.wheelCon.children[i].paintCan.children[k];
                j.x = 194;
                j.y = 194;
                j.width = 32;
                j.height = 32;
                j.alpha = 0.15;
                j.trspeed = 5;
                j.bounceborder = 420;
                this.bouncySouls.addChild(j);
            }
        }
    }

    reshuffle(){
        for(let i=0;i<this.exhaustedSouls.length;i++){
            this.subduedSouls.push(this.exhaustedSouls[i]);
            this.exhaustedSouls[i] = "deleted";
        }
        this.subduedSouls = shuffle(this.subduedSouls);
        removeItemAll(this.exhaustedSouls,"deleted");
    }

    countsubduedSoulsSouls(turb){
        let counts = [0,0,0,0,0,0];
        for (let k of this.subduedSouls){
            for (let g of this.castes){
                if (k.caste == g.caste && k.turbulent == turb) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    countDiscardSouls(turb){
        let counts = [0,0,0,0,0,0];
        for (let k of this.turbulentSouls){
            for (let g of this.castes){
                if (k.caste ==  g.caste && k.turbulent == turb) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    countSavedSouls(){
        let counts = [0,0,0,0,0,0];
        for (let k of this.exhaustedSouls){
            for (let g of this.castes){
                if (k.caste ==  g.caste) counts[this.castes.indexOf(g)]++;
            } 
        }
        return counts;
    }

    getWheelSpace(){
        let space = 0;
        for (let i of this.wheel){
            if (i instanceof Empty) space++;
        }
        return space;
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
        if (!noturb) loot.turbulent = true;
        this.turbulentSouls.push(loot);
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
        research.completeResearch("Herald");
    }

    retrieveSoul(override){
        let measureX = override.x - world.cageCorner[0];
        let measureY = override.y - world.cageCorner[1];
        if (world.cage.slots[measureX][measureY] instanceof Empty) return;
        if (world.cage.slots[measureX][measureY] instanceof Shattered){
            this.ipseity+= 10;
            world.cage.slots[measureX][measureY] = new Empty();
            world.cage.size--;
            if(world.cage.size > 0) world.cage.generateWorld();
            else world.cage.displayon = false;
            research.completeResearch("Shattered");
            return;
        }
        let retrievesuccess = true;
        if (!world.cage.slots[measureX][measureY].turbulent)research.completeResearch("Subdued");
        if (basic.includes(world.cage.slots[measureX][measureY].id)){
            if (world.cage.slots[measureX][measureY].turbulent){
                this.turbulentSouls.push(world.cage.slots[measureX][measureY]);
                this.wheelCon.children[7-basic.indexOf(world.cage.slots[measureX][measureY].id)].paintCan.addChild(world.cage.slots[measureX][measureY].displayIcon);
                let can = world.cage.slots[measureX][measureY].displayIcon; //oh so NOW you assign a variable to that. Fu!
                can.bounceborder = 32;
                can.x = 16;
                can.y = 16;
                can.width = 16;
                can.height = 16;
                can.alpha = 0.5;
                can.trspeed = 2;
                if (7-basic.indexOf(world.cage.slots[measureX][measureY].id) == this.selectedCan){
                    can.trspeed = 5;
                    can.alpha = 0.8;
                }
            }
            else{
                this.subduedSouls.push(world.cage.slots[measureX][measureY]);
                let newSoul = this.subduedSouls[this.subduedSouls.length-1].displayIcon;
                let startangle = 0;
                if (this.subduedSouls.length > 1) startangle = this.subduedSouls[this.subduedSouls.length-2].displayIcon.calAngle + 0.1;
                newSoul.calAngle = startangle;
                newSoul.width = 16;
                newSoul.height = 16;
                newSoul.spinSpeed = 0.01;
                newSoul.spinDist = 170;
                app.ticker.add((delta) => {
                    newSoul.calAngle+= newSoul.spinSpeed;
                    newSoul.x = newSoul.spinDist*Math.cos(newSoul.calAngle);
                    newSoul.y = newSoul.spinDist*Math.sin(newSoul.calAngle);
                });
                this.spinningPile.addChild(newSoul);
            } 
        }
        else retrievesuccess = player.axioms.addAxiom(world.cage.slots[measureX][measureY]);
        if (retrievesuccess) {
            world.cage.slots[measureX][measureY] = new Empty();
            tiles[measureX][measureY].tickTile(allsprites.textures['sprite110']);
            world.cage.size--;
        }
        if(world.cage.size > 0) world.cage.generateWorld();
        else world.cage.displayon = false;
    }

    cycleSouls(){
        this.exhaustedSouls.push(this.wheel[0]);
        this.spinningPile.addChild(this.wheel[0].displayIcon);
        this.wheel[0].displayIcon.spinDist = 30;
        this.wheel[0] = new Empty();
        for (let i =0; i<this.wheel.length-1;i++){
            this.wheel[i] = this.wheel[i+1];
        }
        this.wheel[7] = new Empty();
    }

    resetAngles(){
        for (let i = 0; i<this.subduedSouls.length; i++){
            if (i == 0) continue;
            else this.subduedSouls[i].angle = this.subduedSouls[i-1].angle+0.1;
        }
    }

    tickWheel(){
        if (!world.fighting) return;
        for (let k of this.wheelCon.children){
            if (k instanceof FoxSprite){
                k.texture = this.wheel[this.wheelCon.children.indexOf(k)].displayIcon.texture;
            }
        }
    }

    cageSoul(slot, override){
        if (!override) override = player.tile;
        let measureX = override.x - world.cageCorner[0];
        let measureY = override.y - world.cageCorner[1];
        const choices = [Saintly, Ordered, Artistic, Unhinged, Feral, Vile, Serene];
        let soulType = choices[slot-1];
        let soul;
        if (!soulType){
            this.retrieveSoul(override);
            return;
        }
        for (let i of this.turbulentSouls) if (i instanceof soulType){ 
            soul = i; 
            break;
        }
        if (soul){
            if (!(world.cage.slots[measureX][measureY] instanceof Empty)){
                this.retrieveSoul(override);
            }
            removeItemOnce(this.turbulentSouls,soul);
            soul.cageX = measureX;
            soul.cageY = measureY;
            world.cage.slots[measureX][measureY] = soul;
            world.cage.size++;
            if(world.cage.size > 0) world.cage.generateWorld();
            research.completeResearch("Turbulent");
            research.completeResearch("Brush");
            if (this.wheelCon.children[slot].paintCan.children.length > 0) this.wheelCon.children[slot].paintCan.removeChildAt(0);
            override.tickTile();
        }
    }

    lookForSoul(type, turbulent){
        for (let i = 0; i < this.turbulentSouls.length; i++){
            if (this.turbulentSouls[i].id == type && this.turbulentSouls[i].turbulent == turbulent) return ["turbulentSouls",i];
        }
        for (let i = 0; i < this.subduedSouls.length; i++){
            if (this.subduedSouls[i].id == type && this.subduedSouls[i].turbulent == turbulent) return ["subduedSouls",i];
        }
        return false;
    }
}

class SoulTree{
    constructor(){
        this.active = [new Empty(),new Empty(),new Empty(),new Empty(), new Empty(), new Empty()];
        this.storage = [new Empty(),new Empty(),new Empty(),new Empty()];
        this.castes = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY","SERENE"];
        this.axiomList = new AxiomList();
        this.describepage = 0;

        this.trackedEntity;
    }

    updateSlots(newEntity){
        if (!newEntity) this.trackedEntity = player; // temporary
        else this.trackedEntity = newEntity;
        for (let i = 0; i<6; i++){
            if (this.trackedEntity.souls[basic[5-i+1]] instanceof Soul) this.axiomCon.children[i].alpha = 1;
            else this.axiomCon.children[i].alpha = 0.5;
        }
    }

    setUpSprites(){
        this.displayCon = new PIXI.Container();
        this.displayCon.y = 32*21;
        uiDisplayLeft.addChild(this.displayCon);
        drawChainBorder(10,11,this.displayCon); 
        this.axiomCon = new PIXI.Container();
        this.axiomCon.x = -8;
        this.axiomCon.y = 10;
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

        for (let i = 0; i<4; i++){
            let axiomslot = new FoxSprite(allsprites.textures['icon7']);
            axiomslot.width = 32;
            axiomslot.height = 32;
            axiomslot.x = (79+193)/2;
            axiomslot.y = 82+i*36;
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
        let newSprite = new FoxSprite(allsprites.textures['icon6']);
        newSprite.width = (7+12)*16;
        newSprite.height = (7+12)*16;
        this.axiomCon.addChild(newSprite);
        this.updateSlots();
    }

    updateAxioms(){
        if (!this.axiomCon) return;
        for (let i = 0; i<6; i++){
            this.axiomCon.children[i].texture = allsprites.textures['icon'+this.active[i].icon];
            if (this.active[i].icon > 5) this.axiomCon.children[i].alpha = 1;
            else this.axiomCon.children[i].alpha = 0.7;
        }
        for (let i = 0; i<4; i++){
            this.axiomCon.children[i+6].texture = allsprites.textures['icon'+this.storage[i].icon];
        }
        if (inInventory) this.axiomList.fillInRows(player);
    }

    activateAxiom(slot){
        let soul = this.storage[slot];
        if (soul instanceof Empty) return;
        let caste;
        caste = 5-this.castes.indexOf(this.storage[slot].caste);
        this.storage[slot] = new Empty();
        if (caste == -1){
            //make serenes work
        }
        this.storeAxiom(caste, this.active[caste]);
        this.active[caste] = soul;
        this.updateAxioms();
    }

    hasSoul(type){
        for (let x of this.active){
            if (x instanceof type) return true;
        }
        return false;
    }

    addAxiom(soul){
        let noroom = 0;
        for (let i of this.storage){
            if (noroom == this.storage.length){
                shakeAmount = 5;
                return false;
            }
            else if (i instanceof Empty){
                this.storage[this.storage.indexOf(i)] = soul;
                break;
            }
            else noroom++;
        }
        this.updateAxioms();
        return true;
    }

    storeAxiom(slot){
        let soul = this.active[slot];
        let noRoom = true;
        if (this.active[slot].id == "STARTER") return;
        else{
            for (let i of this.storage){
                if (i instanceof Empty){
                    this.storage[this.storage.indexOf(i)] = soul;
                    noRoom = false;
                    break;
                }
            }
            if (!noRoom) this.active[slot] = this.castesclass[slot];
        }
        this.updateAxioms();
    }
}

class Soul{
    constructor(name,owner){
        this.id = name;
        this.name = soulname[name];
        this.icon;
        this.lore = souldesc[name];
        this.caste;
        this.command = "S";
        this.influence = "A";
        this.subdescript = soulabi[name];
        this.glamdescript;
        this.hardescript;
        this.alpha = 1;
        this.turbulent = false;
        this.index = 0;
        this.triggers = false;
        this.chosen = false;
        this.offsetX = 0;      
        this.shattered = false;                                             
        this.offsetY = 0;
        this.spinSpeed = 0.05;
        this.thrashcounter = 0;
        this.x = 0;
        this.y = 0;
        this.speed = 0.01;
        this.angle = 0;

        this.contingencies = [];
        this.axioms = [];
        this.owner = owner;
        if (!this.owner) this.owner = "None";
        if (["EMPTY","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"].includes(name)) return;
        this.setUpAxioms();
        this.findContingencies();
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
            "StandardForm" : 66,
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
                    this.axioms[i][j].build();
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
        newSoul.findContingencies();
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

    findAxioms(type){
        let found = [];
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                if (this.axioms[i][j] instanceof type) found.push(this.axioms[i][j]);
            }
        }
        return found;
    }

    findContingencies(){
        for (let i = 0; i<5; i++){
            for (let j = 0; j<5; j++){
                if(this.axioms[i][j].contingency) this.contingencies.push(this.axioms[i][j]);
            }
        }
    }

    getLogicNeighbours(axiom, includeSource){
        if (!includeSource) includeSource = false;
        let results = [];
        const neig = [[-1,0],[1,0],[0,1],[0,-1]];
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
        if (!this.owner.dead) return;
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
            for (let i of Object.keys(Axiom.storageEquivalences)){
                if (sourceAxiom.storage instanceof Axiom.storageEquivalences[i]){
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
            this.owner.trigger(i.constructor.name, data); // for triggerwatch contingency
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

    describe(){
        let bump = 0;
        if ((5*64-32-ctx.measureText(this.name).width) < 0) bump = 20; 
        printOutText(toTitleCase(this.caste) + " Caste", 18, 590, 50 + bump, colours[this.caste], 20, 6*64-35);
        //printOutText(inventorytext[this.command], 18, 590, 170, colours[this.command], 20, 6*64-35); for future use, or maybe just place this thing in its own screen
        if (basic.includes(this.id)) printOutText("Empty Slot", 18, 590, 30, "white", 20, 6*64-35);
        else printOutText(this.name, 18, 590, 30, colours[this.id], 20, 6*64-100);
        printOutText(this.subdescript, 18, 590, 110, "white", 20, 6*64-35);
        //printOutText(this.lore, 18, 10, 600, colours[this.id], 20, 690);
        drawSymbol(this.icon, 890, 20, 64);
    }

    thrash(x, y, size){
        if (!this.turbulent) drawSymbol(this.icon, x, y,size);
        else{
            this.thrashcounter++;
            if (this.thrashcounter > 10){
                let rt = randomRange(1,4);
                if (rt == 1) this.offsetX+= 0.1;
                else if (rt == 2) this.offsetX-= 0.1;
                else if (rt == 3)this.offsetY+= 0.1;
                else if (rt == 4)this.offsetY-= 0.1;
                this.thrashcounter = 0;
            }
            drawSymbol(this.icon, x+this.offsetX*size,  y + this.offsetY*size,size);
            this.offsetX -= Math.sign(this.offsetX)*(this.speed);     
            this.offsetY -= Math.sign(this.offsetY)*(this.speed);
        }
    }

    describeWheel(){
        if (world.getRoom() instanceof SoulCage) return;
        const hijack = {
            "VILE" : 0,
            "FERAL" : 1,
            "UNHINGED" : 2,
            "ARTISTIC" : 3,
            "ORDERED" : 4,
            "SAINTLY" : 5
        }
        const index = hijack[this.caste];
        printOutText(toTitleCase(this.caste) + " Soul", 18, 10, 600, colours[this.id], 20, 690);
        if (this instanceof Empty) printOutText(soulabi["EMPTY"], 18, 10, 640, "white", 20, 690);
        else {
            let command = player.axioms.active[index].id;
            if (basic.includes(command)) command = "Commanded by its own whims";
            else command = "Commanded by a Legend";
            printOutText(command, 18, 10, 620, "lightgrey", 20, 690);
            if (false && !basic.includes(player.axioms.active[index].id) && player.axioms.active[index].influence != "I") printOutText(player.axioms.active[index].subdescript, 18, 10, 660, "white", 20, 690);
            else printOutText("\n[g]Base Effect[w]\n"+this.subdescript, 18, 10, 660, "white", 20, 690);
        }
        
    }

    describeAbridged(){
        if (!cursormode){
            let bump = 0;
            if ((5*64-32-ctx.measureText(this.name).width) < 0) bump = 20; 
            printOutText(toTitleCase(this.caste) + " Caste", 18, 590, 50 + bump, colours[this.caste], 20, 6*64-35);
            if (basic.includes(this.id)) printOutText("Empty Slot", 18, 590, 30, "white", 20, 6*64-35);
            else printOutText(this.name, 18, 590, 30, colours[this.id], 20, 6*64-100);
            printOutText(this.subdescript, 18, 590, 110, "white", 20, 6*64-35);
            drawSymbol(this.icon, 890, 20, 64);
            drawSymbol(34, 590, 500, 64);
            printOutText("Inhale this Soul (Q) to choose it and exit the Relay.", 18, 660, 528, "white", 20, 6*64-105);
        }
    }

    talk(){
        log.addLog(this.id);
    }
}

class Empty extends Soul{
    constructor(){
        super("EMPTY");
        this.icon = 7;
    }
}