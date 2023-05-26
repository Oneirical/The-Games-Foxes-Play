function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  

function setupPixi(){
    app = new PIXI.Application({
        view: document.getElementById("pixi-canvas"),
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        width: 1920,
        height: 1080
    });
    document.body.appendChild(app.view);
    tilesDisplay = new PIXI.Container();
    tilesDisplay.x = (1920-16*16*resolutionSize)/2+(resolutionSize+12)*16+8;
    tilesDisplay.y = (1080-16*9*resolutionSize)/2+8;
    app.stage.addChild(tilesDisplay);
    allsprites = new PIXI.Spritesheet(
        PIXI.BaseTexture.from(atlasData.meta.image),
        atlasData
    );
    allsprites.parse();
    startGame();
    drawTiles();
    setUpUI();
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
                let newSprite = new PIXI.Sprite(allsprites.textures['sprite'+hai]);
                newSprite.width = 32;
                newSprite.height = 32;
                newSprite.anchor.set(0.5,0.5);
                newSprite.x = (j*32);
                newSprite.y = (i*32);
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
                newSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
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
            tilesDisplay.children[j+(i*9)].children[0].texture = bai; //extend this to also place traps and caged souls
        }
    }
}

function setUpUI(){
    //drawChainBorder(376,44,32,32,app.stage); //main
    ////title
    // //map
    //drawChainBorder(34,44+32*13+64,10,5,app.stage); //status

    // //souls
    // //log
    //drawChainBorder(372+32*32+28,44+32*29,15,3,app.stage); //buttons
    uiDisplayLeft = new PIXI.Container();
    uiDisplayLeft.x = 34;
    uiDisplayLeft.y = 44;
    app.stage.addChild(uiDisplayLeft);
    //drawChainBorder(32,32,uiDisplayLeft);
    uiDisplayRight = new PIXI.Container();
    uiDisplayRight.x = 372+32*32+28;
    uiDisplayRight.y = 44;
    app.stage.addChild(uiDisplayRight);
    areaname.setUpSprites();
    statuses.setUpSprites();
    buttons.setUpSprites()
    wheel.setUpSprites();
    player.axioms.setUpSprites();
    world.setUpSprites();
    log.setUpLog();
}

function drawTiles(){
    for (let i = tilesDisplay.children.length - 1; i >= 0; i--) {	tilesDisplay.removeChild(tilesDisplay.children[i]);};
    tileSize = ((resolutionSize)*16)/(world.getRoom().size/9);
    for(let i=0;i<numTiles;i++){
        for(let j=0;j<numTiles;j++){
            tiles[i][j].setUpSprite();
        }
    }
    drawSprites();
    drawChainBorder(32,32,tilesDisplay);
}


function drawSprites(){
    for(let k=monsters.length;k>=0;k--){
        let con;
        if (k == monsters.length) con = player;
        else con = monsters[k];
        con.setUpSprite();
    }
}

function getMouse(){
    console.log((app.renderer.events).rootPointerEvent.global.x);
    console.log((app.renderer.events).rootPointerEvent.global.y);
}

function removeColorTags(text){
    return text.replace(/\[[\s\S]*?\]/g, '');
}

function printOutTextO(text,x,y,style,source){
    let textBlock = new PIXI.Container();
    textBlock.x = x;
    textBlock.y = y;
    textBlock.linesnum = 0;
    printOutText(text,x,y,style,textBlock);
    source.addChild(textBlock);
    let arr = [];
    for (let i of textBlock.children) arr.push(i.text);
    let totalse = arr.join(' ');
    style.wordWrap = true;
    textBlock.linesnum += PIXI.TextMetrics.measureText(totalse,style).height;
    //handle including ;l in there, maybe?
}

function printOutText(text,x,y,style,source, oldx)
{
    let fitWidth = style.wordWrapWidth;
    let lineHeight = 20;
    if (text.includes(';l')){
        let breaker = text.split(';l');
        let yscale = y;
        for (let i = 0; i<breaker.length; i++){
            let sis = "";
            if (i != 0) sis = breaker[i-1];
            printOutText(breaker[i],  x, yscale + Math.min(1,i)*20 + (PIXI.TextMetrics.measureText(sis,style).height)-20,style,source);
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
            else if (!pickcolor) pickcolor = "white";
            if (source.ancient) pickcolor = "#b4b5b8";
            if (fitWidth-xsave <= 0){
                xsave = xsave-fitWidth;
                y+= lineHeight;
            }
            newStyle.fill = pickcolor;
            newStyle.wordWrapWidth -= xsave;
            printOutText(breaker2[i], x, y, newStyle, source, oldx);
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