class Shake{
    constructor(x, y){
        this.baseX = x;
        this.baseY = y;
        this.minx = 0;
        this.maxx = 0;
        this.miny = 0;
        this.maxy = 0;
        this.intensity = 1;
        this.dx;
        this.dy;
        this.x = x;
        this.y = y;
        this.calcSpeed();
    }

    calcSpeed(){
        this.minx = this.x - 3;
        this.maxx = this.x + 3;

        this.miny = this.y - 3;
        this.maxy = this.y + 3;

        let xRange = this.maxx - this.minx;
        let yRange = this.maxy - this.miny;

        // Lets say int 1 is 5 shakes per second. distance over time

        this.dx = this.intensity * 0.03;
        this.dy = this.intensity *  0.03;
    
    }

    update(frameTime){
        this.x = this.x + (frameTime * this.dx);
        this.y = this.y + (frameTime * this.dy);
        this.bindCoords();
    }

    bindCoords(){
        if(this.x > this.maxx){
            this.x = this.maxx;
            this.dx = -this.dx;
        }
        if(this.y > this.maxy){
            this.y = this.maxy;
            this.dy = -this.dy;
        }
        if(this.x < this.minx){
            this.x = this.minx;
            this.dx = -this.dx;
        }
        if(this.y < this.miny){
            this.y = this.miny;
            this.dy = -this.dy;
        }
    }


}