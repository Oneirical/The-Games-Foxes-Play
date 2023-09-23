function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
}

class FoxSprite extends PIXI.Sprite{
    constructor(imageURL)
    {
        super(imageURL);
        this.eventMode = 'none';
        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }
}
  

function beginEverything(){
    animationTick = new PIXI.Ticker;
    animationTick.start();
    app = new PIXI.Application({
        view: document.getElementById("pixi-canvas"),
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        width: 1920,
        height: 1080
    });

    document.addEventListener("mousedown",function() {
        isMouseDown = true;
    }, false);
    document.addEventListener("mouseup",function() {
        isMouseDown = false;
    }, false);
    allsprites = new PIXI.Spritesheet(
        PIXI.BaseTexture.from(atlasData.meta.image),
        atlasData
    );
    allsprites.parse();
    document.body.appendChild(app.view);

    uiDisplayLeft = new PIXI.Container();
    uiDisplayLeft.x = 34;
    uiDisplayLeft.y = 44;
    app.stage.addChild(uiDisplayLeft);

    tilesDisplay = new PIXI.Container();
    tilesDisplay.x = 328;
    tilesDisplay.y = -4;
    app.stage.addChild(tilesDisplay);

    tilesDisplay.notPlayerTiles = new PIXI.Container();
    tilesDisplay.addChild(tilesDisplay.notPlayerTiles);
    
    uiDisplayRight = new PIXI.Container();
    uiDisplayRight.x = 1424;
    uiDisplayRight.y = 44;
    app.stage.addChild(uiDisplayRight);

    startGame();

    areaname.setUpSprites();
    buttons.setUpSprites();
    soulTree.setUpSprites();
    wheel.setUpSprites();
    world.setUpSprites();
    log.setUpLog();
    statuses.setUpSprites();
    sideTooltip.setUpSprites();

    let tilesChains = new PIXI.Container();
    app.stage.addChild(tilesChains);
    tilesChains.x = (1920-16*16*7)/2+(7+12)*16+8;
    tilesChains.y = (1080-16*9*7)/2+8;
    drawChainBorder(32,32,tilesChains);
    drawPixel("black",(1920-16*16*7)/2+(7+12)*16,(1080-16*9*7)/2,112*9,app.stage); // this is for the zoom in effect
    tilesDisplay.maskReference = app.stage.children[app.stage.children.length-1];
    tilesDisplay.maskReference.alpha = 0;
    drawProjectors();
    
    world.enterRoom("N");
    // let rai = new PIXI.filters.ColorOverlayFilter();
    // rai.color = "1a5fb4";
    // rai.alpha = 0;
    // let alarmCount = 0;
    //tilesDisplay.filters = [rai];
    app.ticker.add(() => {
        screenshake();
        app.stage.x = shakeX;
        app.stage.y = shakeY;

        //alarmCount+=0.1;
        //rai.alpha = Math.sin(alarmCount)-0.5;
    });
    tilesDisplay.addChild(player.creaturecon);
    world.cage.generateWorld()
    world.cage.pocketworld.hypnoDisplay();
        //FPS counter
    // const style = new PIXI.TextStyle({
    //     fontFamily: 'Play',
    //     fontSize: 18,
    //     fill: "yellow",
    // });
    // printOutText("60",10,40,style,uiDisplayLeft);
    // let count = 0;
    // app.ticker.add(() => {
    //     count++;
    //     if (count == 10) {uiDisplayLeft.children[uiDisplayLeft.children.length-1].children[0].text = app.ticker.FPS; count = 0;}
    // });
}

function drawChainLine(l,x,y,dir,source){
    let chaincon = new PIXI.ParticleContainer();
    chaincon.x = x;
    chaincon.y = y;
    source.addChild(chaincon);
    for (let i=0; i<l;i++){
        let character = ".";
        if (dir == "h"){
            if (i == 0) character = "B";
            else if (i == l-1) character = "E";
            else character = "-";
        }
        else{
            if (i == 0) character = "T";
            else if (i == l-1) character = "L";
            else character = "<";
        }
        let hai = 139;
        if (["B","E","L","T"].includes(character)) hai = 141;
        let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
        newSprite.width = 32;
        newSprite.height = 32;
        newSprite.anchor.set(0.5,0.5);
        let push = 0;
        if (["L","B"].includes(character)) push = 22;
        if (dir == "h"){
            newSprite.x = (i*32);
            newSprite.y = -push;
        }
        else{
            newSprite.y = (i*32);
            newSprite.x = -push;
        }
        const rotatea = {
            "Q" : 0,
            "P" : Math.PI/2,
            "Z" : 3*Math.PI/2,
            "M" : Math.PI,
            "-" : Math.PI/2,
            "=" : 3*Math.PI/2,
            "<" : 0,
            ">" : Math.PI,
            "B" : 3*Math.PI/2,
            "E" : Math.PI/2,
            "L" : Math.PI,
            "T" : 0,
        }
        newSprite.rotation = rotatea[character];
        
        chaincon.addChild(newSprite);
    }

}

function drawChainBorder(w,h,source){
    let temp;
    temp = w;
    w = h;
    h = temp;
    let chaincon = new PIXI.ParticleContainer();
    source.addChild(chaincon);
    for (let i=0; i<w;i++){
        for (let j=0;j<h;j++){
            if (i == 0 || j == 0 || i == w-1 || j == h-1){
                let character = ".";
                if (i == 0 && j == 0) character = "Q";
                else if (i == 0 && j == h-1) character = "P";
                else if (i == w-1 && j == 0) character = "Z";
                else if (i == w-1 && j == h-1) character = "M";
                else if (i == 0) character = "-";
                else if (i == w-1) character = "=";
                else if (j == 0) character = "<";
                else if (j == h-1) character = ">";
                
                let hai = 139;
                if (["Q","P","Z","M"].includes(character)) hai = 140;
                else if (["B","E","L","T"].includes(character)) hai = 141;
                let newSprite = new FoxSprite(allsprites.textures['sprite'+hai]);
                newSprite.width = 32;
                newSprite.height = 32;
                newSprite.anchor.set(0.5,0.5);
                let huff = 0;
                if (source == tilesDisplay) huff = 8;
                newSprite.x = (j*32)+huff;
                newSprite.y = (i*32)+huff;
                const rotatea = {
                    "Q" : 0,
                    "P" : Math.PI/2,
                    "Z" : 3*Math.PI/2,
                    "M" : Math.PI,
                    "-" : Math.PI/2,
                    "=" : 3*Math.PI/2,
                    "<" : 0,
                    ">" : Math.PI,
                    "B" : 3*Math.PI/2,
                    "E" : Math.PI/2,
                    "L" : Math.PI,
                    "T" : 0,
                }
                newSprite.rotation = rotatea[character];
                
                chaincon.addChild(newSprite);
            }
        }
    }
}

function tickTiles(){
    for(let i=0;i<numTiles;i++){
        for(let j=0;j<numTiles;j++){
            let hai = tiles[i][j].sprite;
            let bai = allsprites.textures['sprite'+hai];
            tiles[i][j].tickTile(bai);
            //tilesDisplay.children[j+(i*9)].children[0].texture = bai; //extend this to also place traps and caged souls
        }
    }
}

function drawProjectors(){
    tilesDisplay.mask = tilesDisplay.maskReference;
    drawTiles();
    projectorDisplay = new PIXI.Container();
    projectorDisplay.x = -448;
    projectorDisplay.y = -448;
    tilesDisplay.notPlayerTiles.addChild(projectorDisplay);
    let creatureDisplay = new PIXI.Container();
    creatureDisplay.x = -448;
    creatureDisplay.y = -448;
    tilesDisplay.notPlayerTiles.addChild(creatureDisplay);
    tilesDisplay.projectorDisplay = projectorDisplay;
    tilesDisplay.creatureDisplay = creatureDisplay;
    zoom = 10;
    tileSize = 64;
    projectorDisplay.projectors = [];
    for(let i=0;i<zoom*2;i++){
        projectorDisplay.projectors[i] = [];
        for(let j=0;j<zoom*2;j++){
            let projector = new PIXI.Container();
            projector.x = i*tileSize+64*(15-zoom);
            projector.y = j*tileSize+64*(15-zoom);
            if (tiles[i-zoom+player.tile.x] && tiles[i-zoom+player.tile.x][j-zoom+player.tile.y]) projector.referenceTile = tiles[i-zoom+player.tile.x][j-zoom+player.tile.y];
            if (projector.referenceTile){
                projector.addChild(projector.referenceTile.tilecon);
            }
            else{
                newSprite = new PIXI.Graphics();
                newSprite.beginFill("black");
                newSprite.drawRect(0, 0, tileSize, tileSize);
                newSprite.endFill();
                projector.addChild(newSprite);
            }
            projectorDisplay.addChild(projector);
            projectorDisplay.projectors[i][j] = projector;
        }
    }
    //drawSprites();
}

function tickProjectors(){
    tilesDisplay.creatureDisplay.removeChildren();
    for(let i=0;i<zoom*2;i++){
        for(let j=0;j<zoom*2;j++){
            let projector = tilesDisplay.projectorDisplay.projectors[i][j];
            projector.removeChildren();
            if (tiles[i-zoom+player.tile.x] && tiles[i-zoom+player.tile.x][j-zoom+player.tile.y]){
                projector.referenceTile = tiles[i-zoom+player.tile.x][j-zoom+player.tile.y];
                tiles[i-zoom+player.tile.x][j-zoom+player.tile.y].projectedBy = projector;
            }
            else projector.referenceTile = null;
            if (projector.referenceTile && !(projector.referenceTile instanceof RealityWall)){
                projector.addChild(projector.referenceTile.tilecon);
                if (projector.referenceTile.monster && player != projector.referenceTile.monster){
                    tilesDisplay.creatureDisplay.addChild(projector.referenceTile.monster.creaturecon);
                    projector.referenceTile.monster.creaturecon.originalX = i*tileSize+64*(15-zoom);
                    projector.referenceTile.monster.creaturecon.originalY = j*tileSize+64*(15-zoom);
                    projector.referenceTile.monster.creaturecon.x = i*tileSize+64*(15-zoom)+projector.referenceTile.monster.offsetX*tileSize;
                    projector.referenceTile.monster.creaturecon.y = j*tileSize+64*(15-zoom)+projector.referenceTile.monster.offsetY*tileSize;
                    //tilesDisplay.projectorDisplay.swapChildren(projector,tilesDisplay.projectorDisplay.projectors[zoom*2-1][zoom*2-1]);
                }
            }
            else{
                newSprite = new PIXI.Graphics();
                newSprite.beginFill("black");
                newSprite.drawRect(0, 0, tileSize, tileSize);
                newSprite.endFill();
                projector.addChild(newSprite);
            }
        }
    }
}

function drawTiles(){
    tileSize = 64;
    for (let r of universe.worlds){
        for(let i=0;i<numTiles;i++){
            for(let j=0;j<numTiles;j++){
                if (r.playSpace.tiles[i] && r.playSpace.tiles[i][j] && !r.playSpace.tiles[i][j].graphicsReady && !(r.playSpace.tiles[i][j] instanceof RealityWall) && !((r.playSpace.tiles[i][j] instanceof LayerBackground) && r.playSpace.tiles[i][j].sprite == 2)) r.playSpace.tiles[i][j].setUpSprite();
            }
        }
        
        for(let i=0;i<5;i++){
            for(let j=0;j<5;j++){
                if (!r.rooms[i][j].graphicsReady) r.rooms[i][j].setUpSprites();
            }
        } 
    }
}

function animateAll(){
    for (let i of monsters){
        i.setUpAnimation();
    }
}

function drawSprites(){
    for (let r of universe.worlds){
        for (let m of r.playSpace.monsters){
            if (!m.graphicsReady && !m.creaturecon){
                m.setUpSprite();
                m.setUpAnimation();
            }
        }
    }
}

function getMouse(){
    return [(app.renderer.events).rootPointerEvent.global.x,(app.renderer.events).rootPointerEvent.global.y];
}

function checkPixel(tile){
    if (tile instanceof BExit ||tile instanceof MapExit) return "red";
    else if (tile instanceof BAscendExit ||tile instanceof AscendExit) return "lightgray"; //
    else if (tile instanceof Window) return "gray";
    else if (tile.passable || tile instanceof RealityWall) return "black";
    else return "white";
}

function drawPixel(fill,x,y,size,source){
    const graphics = new PIXI.Graphics();
    graphics.beginFill(fill);
    graphics.drawRect(x, y, size, size);
    graphics.endFill();
    source.addChild(graphics);
}

function drawHitbox(x,y,size,source){
    const graphics = new PIXI.Sprite(allsprites.textures['sprite130']);
    graphics.x = x;
    graphics.y = y;
    graphics.height = size;
    graphics.width = size;
    graphics.alpha = 0;
    graphics.anchor.set(0.5);
    source.addChild(graphics);
}

function removeColorTags(text){
    return text.replace(/\[[\s\S]*?\]/g, '');
}

function textWithoutCringe(text,x,y,style,source){ // here lies my sanity - june 5th 2023-june 7th 2023
    let textBlock = new PIXI.Container();
    textBlock.x = x;
    textBlock.y = y;
    let newText = new PIXI.Text(removeColorTags(text),style);
    textBlock.addChild(newText);
    source.addChild(textBlock);

    let allLines = PIXI.TextMetrics.measureText(removeColorTags(text),style).lines;
    for (let i of allLines){
        for (let j of Object.keys(specialWords)) if (i.includes(j) && style.fill != "plum"){ 
            let regex = new RegExp(".+?(?="+j+")");
            let atX = 0;
            if (i.match(regex))atX = PIXI.TextMetrics.measureText(" "+i.match(regex)[0],style).width;
            let newStyle = new PIXI.TextStyle();
            for (let i of Object.keys(style)) newStyle[i] = style[i];
            newStyle.fill = specialWords[j];
            const graphics = new PIXI.Graphics();
            graphics.beginFill("black");
            graphics.drawRect(atX, allLines.indexOf(i)*20, PIXI.TextMetrics.measureText(j,style).width, 20); //it's always 20 or 23 depending on the computer OS, WHY???
            graphics.endFill();
            textBlock.addChild(graphics);
            let colorText = new PIXI.Text(j,newStyle);
            colorText.x = atX;
            colorText.y = allLines.indexOf(i)*20;
            textBlock.addChild(colorText);
        }
    }
    return PIXI.TextMetrics.measureText(removeColorTags(text),style).height;
}

function printOutText(text,x,y,style,source){
    let textBlock = new PIXI.Container();
    textBlock.x = x;
    textBlock.y = y;
    textBlock.linesnum = 0;
    handleColors(text,x,y,style,textBlock);
    source.addChild(textBlock);
    let arr = [];
    for (let i of textBlock.children) arr.push(i.text);
    let totalse = arr.join(' ');
    style.wordWrap = true;
    textBlock.linesnum += PIXI.TextMetrics.measureText(totalse,style).height;
    return textBlock.linesnum;
    //handle including ;l in there, maybe?
}

function handleColors(text,x,y,style,source, oldx)
{
    let fitWidth = style.wordWrapWidth;
    let lineHeight = 20;
    if (text.includes(';l')){
        let breaker = text.split(';l');
        let yscale = y;
        for (let i = 0; i<breaker.length; i++){
            let sis = "";
            if (i != 0) sis = breaker[i-1];
            handleColors(breaker[i],  x, yscale + Math.min(1,i)*20 + (PIXI.TextMetrics.measureText(sis,style).height)-60,style,source);
            yscale = yscale + 20*Math.min(1,i) + (PIXI.TextMetrics.measureText(sis,style).height);
            source.linesnum += 20;
        }

        return;
    }
    let breaker2 = text.split('[');
    if (text.includes('[')){
        let xsave = 0;
        let oldx = [x,fitWidth];
        for (let i = 0; i<breaker2.length; i++) {
            let newStyle = new PIXI.TextStyle();
            for (let i of Object.keys(style)) newStyle[i] = style[i];
            let pickcolor = colourcodes[breaker2[i].slice(0, 2)];
            if (pickcolor) breaker2[i] = breaker2[i].slice(2);
            else if (!pickcolor) pickcolor = newStyle.fill;
            if (source.ancient) pickcolor = "#b4b5b8";
            if (fitWidth-xsave <= 0){
                xsave = xsave-fitWidth;
                y+= lineHeight;
            }
            if (pickcolor == "bold") newStyle.fontWeight = pickcolor;
            else if (pickcolor == "italic") newStyle.fontStyle = pickcolor;
            else newStyle.fill = pickcolor;
            newStyle.wordWrapWidth -= xsave;
            handleColors(breaker2[i], x, y, newStyle, source, oldx);
            x += PIXI.TextMetrics.measureText(breaker2[i],newStyle).width;
            if (x >= (oldx[0] + oldx[1])) x = oldx[0] + nextlinesave;
            xsave += PIXI.TextMetrics.measureText(breaker2[i],newStyle).width;
        }
        return;
    }
    let sx = x;
    fitWidth = fitWidth || 0;
    if (fitWidth <= 0)
    {
        let output = new PIXI.Text(text, style);
        output.x = x;
        output.y = y;
        source.addChild(output);
    }
    if (!text) return;
    let currentLine = 0;
    if (fitWidth < 20){
        if (text[0] == " ") text = text.slice(1);
        currentLine++;
        if (oldx) sx = oldx[0];
        fitWidth = oldx[1];
    }
    let words = text.split(' ');
    let idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        let str = words.slice(0,idx).join(' ');
        style.wordWrap = false;
        let w = PIXI.TextMetrics.measureText(str,style).width;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            let combined = words.slice(0,idx-1).join(' ');
            let output = new PIXI.Text(combined, style);
            output.x = sx;
            output.y = y + (lineHeight*currentLine);
            source.addChild(output);
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
            if(oldx){
                sx = oldx[0];
                fitWidth = oldx[1];
            }
        }
        else
        {idx++;}
    }
    if (idx > 0){
        let all = words.join(' ');
        let output = new PIXI.Text(all, style);
        output.x = sx;
        output.y = y + (lineHeight*currentLine);
        source.addChild(output);
        nextlinesave = PIXI.TextMetrics.measureText(words.join(' '),style).width;
    }        
}

function screenshake(){ // SHAKE SHAKE SHAKE
    if(shakeAmount){
        shakeAmount--;
    }
    let shakeAngle = Math.random()*Math.PI*2;
    shakeX = Math.round(Math.cos(shakeAngle)*shakeAmount); 
    shakeY = Math.round(Math.sin(shakeAngle)*shakeAmount);
}


class GlitchSprite {
  
    constructor(glitch,time, onlyOnce) {
    
      this.img = glitch;
      this.time = time;
      this.onlyOnce = onlyOnce;
  
      this.img.filters = [new PIXI.filters.RGBSplitFilter(), new PIXI.filters.GlitchFilter()]
  
      this.img.filters[0].red.x = 0
      this.img.filters[0].red.y = 0
      this.img.filters[0].green.x = 0
      this.img.filters[0].green.y = 0
      this.img.filters[0].blue.x = 0
      this.img.filters[0].blue.y = 0
  
      this.img.filters[1].slices = 0 
      this.img.filters[1].offset = 20
      
      this.anim = this.anim.bind(this)
      this.anim()
      this.complete = false;
      
    }
    
    randomIntFromInterval(min, max) {
      return Math.random() * (max - min + 1) + min
    }
    
    anim() {
      if (this.complete || this.img.filters.length == 0) {
        this.img.filters = [];
        return;
      }
      const THAT = this
      let tl;
      if (this.onlyOnce){
        tl = gsap.timeline({
            delay: 0,
            onComplete: this.anim
          })
        this.complete = true;
      }
      else {
        tl = gsap.timeline({
            delay: this.randomIntFromInterval(3, this.time),
            onComplete: this.anim
          })
      }

  
      tl.to(this.img.filters[0].red, {
        duration: 0.2,
        x: this.randomIntFromInterval(-15, 15),
        y: this.randomIntFromInterval(-15, 15)
      })
  
      tl.to(this.img.filters[0].red, {
        duration: 0.01,
        x: 0,
        y: 0
      })
  
      tl.to(this.img.filters[0].blue, {
        duration: 0.2,
        x: this.randomIntFromInterval(-15, 15),
        y: 0,
        onComplete() {
          
          THAT.img.filters[1].slices = 20
          THAT.img.filters[1].direction = THAT.randomIntFromInterval(-75, 75)
            
        }
      }, '-=0.2')
  
      tl.to(this.img.filters[0].blue, {
        duration: 0.1,
        x: this.randomIntFromInterval(-15, 15),
        y: this.randomIntFromInterval(-5, 5),
        onComplete() {
  
          THAT.img.filters[1].slices = 12
          THAT.img.filters[1].direction = THAT.randomIntFromInterval(-75, 75)
          
        }
      })
  
      tl.to(this.img.filters[0].blue, {
        duration: 0.01,
        x: 0,
        y: 0,
        onComplete() {
  
          THAT.img.filters[1].slices = 0
          THAT.img.filters[1].direction = 0
  
        }
      })
  
      tl.to(this.img.filters[0].green, {
        duration: 0.2,
        x: this.randomIntFromInterval(-15, 15),
        y: 0
      }, '-=0.2')
  
      tl.to(this.img.filters[0].green, {
        duration: 0.1,
        x: this.randomIntFromInterval(-20, 20),
        y: this.randomIntFromInterval(-15, 15)
      })
  
      tl.to(this.img.filters[0].green, {
        duration: 0.01,
        x: 0,
        y: 0
      })
  
      tl.timeScale(1.2)
      
    }
     
  } 