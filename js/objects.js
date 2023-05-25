class ClickTrap{
    constructor(tile,functions,power){
        this.functions = functions.slice();
        this.power = power;
        this.tile = tile;
    }

    trigger(){
        for (let i of this.functions){
            effects[i](this.tile,this.power);
        }
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