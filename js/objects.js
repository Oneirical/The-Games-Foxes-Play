class Direction{
    constructor(direction){
        this.direction = direction;
    }
}

class Colour{
    static colourTypes = ["Red","Yellow","Green","Cyan","Blue","Plum","Lime","Orange","Pink"];
    constructor(colour){
        this.colour = colour;
    }
}

class Caste{
    static casteTypes = ["SAINTLY","ORDERED","ARTISTIC","UNHINGED","FERAL","VILE"];
    constructor(caste){
        this.caste = caste;
    }
}

class ClickTrap{
    constructor(tile,lifetime,data){
        this.praxes = [];
        for (let i = data["currentPrax"]+1; i < data["praxes"].length; i++){
            this.praxes.push(data["praxes"][i]);
        }
        this.power = data.power;
        this.triggerType = data["clickTrigger"];
        this.lifetime = lifetime;
        this.tile = tile;
        this.setUpSprite();
    }

    setUpSprite(){
        this.trapImg = new FoxSprite(allsprites.textures["sprite12"]);
        this.trapImg.width = 112;
        this.trapImg.height = 112;
        this.tile.tilecon.addChild(this.trapImg);
    }

    destroy(){
        this.tile.tilecon.removeChild(this.trapImg);
    }

    trigger(){
        let caster = this.tile.monster;
        let blast = new Axiom(this.praxes,"ARTISTIC",this.power);
        blast.castAxiom(caster);
        this.destroy();
    }
}

class DelayedAttack{
    constructor(data){
        this.praxes = [];
        this.power = data.power;
        for (let i = data["currentPrax"]+1; i < data["praxes"].length; i++){
            this.praxes.push(data["praxes"][i]);
        }
    }
    trigger(caster){
        let blast = new Axiom(this.praxes,"ARTISTIC",this.power);
        blast.castAxiom(caster);
    }
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