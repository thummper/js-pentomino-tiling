class FloatingText{
    constructor(content, x, y){
        this.x = x;
        this.y = y;
        this.dx = random(0.2, 0.3, 1);
        this.dy = random(0.2, 0.4, 1);
        this.lifeTime = 200; //Frame lifetime.
        this.opacity = 1.0;
        this.content = content;
    }
    // Oh we can do it with one function.


    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, " + this.opacity + ")";
        ctx.font = "26px Arial";
        ctx.fillText(this.content, this.x, this.y);
        ctx.closePath();
    }

    update(){
        this.opacity -= 0.02;
        this.x += this.dx;
        this.y += this.dy;
    }
}