// Global piece array
let pieces = [
	[P, '#71B3B0'],
	[F, '#D55A4C'],
	[Y, '#F5994E'],
	[T, '#961628'],
	[W, '#1D6D53'],
	[N, '#D6BB50'],
	[U, '#21746C'],
	[V, '#2CAD7D'],
	[L, '#8B2134']
];


// Global Functions
function drawRect(ctx, x, y, w, h, bg = null, border = null){
    if(h == null){
        h = w;
    }
    if(bg !== null){
        ctx.fillStyle = bg;
    }
    ctx.drawRect(x, y, w, h);
    if(border !== null){
        ctx.strokeStype = border;
        ctx.strokeRect(x, y, w, h);
    }
}


class Tiling {
    constructor(){

        this.tileSize  = 20;
        this.boardSize = null;

        //Frame information
        this.frameTime = null;
        this.frames    = 0;
        this.fps       = 0;

        // Board padding
        this.hPadding, this.wPadding;
        this.board = null;


        this.canvas = document.getElementById("carp_canvas");
        

    }

    getBoardSize(){
        /* 
        Want the game grid to be YxY, Y is the largest number of tiles that can fit the width or height of the canvas. 
        */
       let height = this.canvas.height;
       let width  = this.canvas.width; 
       let numHeight = height / this.tileSize;
       let numWidth  = width  / this.tileSize;

       let boardSize = 0;
       if(numHeight <= numWidth){
           boardSize = Math.floor(numHeight);
       } else {
           boardSize = Math.floor(numWidth);
       }
       this.boardSize = boardSize;
       console.log("Board Size: ", boardSize);

       // Need to work out padding so that the grid is centered in the canvas
       this.wPadding = numWidth % this.tileSize;
       this.hPadding = numWidth % this.tileSize;
    }

    makeBoard(){
        console.log("Making board: ", this.boardSize);
        let board;
        let row = 0;
        let col = 0;
        for(row; row < this.boardSize; row++){
            for(col; col < this.boardSize; col++){
                board[row][col] = {
                    x: col * this.tileSize,
                    y: row * this.tileSize,
                    contains: []
                }
            }
        }
        this.board = board;
    }

    drawBoard(){
        for(let row = 0; row < this.boardSize; row++){
            for(let col = 0; col < this.boardSize; col++){

                let cell = this.board[row][col];
                let cellContains = cell.contains.length;
                let block = null;
                if(cellContains > 0){
                    block = cell.contains[cellContains - 1];
                }
                if(block == null){
                    block = {
                        color: "white",
                        border: "rgba(0,0,0,0.2)"
                    }
                }
                drawRect(this.ctx, col * this.tileSize, row * this.tileSize, this.tileSize, null, block.color, block.border);
                

            }
        }
    }

    loop(){
        this.fps();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
       

        this.drawBoard();
        this.frames++;
    }

    fps(){
        if (this.frameTime) {
            let now = performance.now();
            if(now - this.frameTime >= 1000){
                this.fps = this.frames;
                this.frames = 0;
                this.frameTime = now;
            }
        } else {
            this.frameTime = performance.now();
        }
    }


}

class Holder{

    constructor(canvas, ctx, boardSize, tileSize){
        this.boardSize = boardSize;
        this.width  = this.height = 5;
        this.y      = canvas.height - (6 * tileSize);
        this.spaces = [];
    }

    makeSpaces(boardSize, tileSize){
        let maxSpaces  = 4;
        let freeSpaces = Math.floor(boardSize / this.width);
        if(freeSpaces > maxSpaces){
            freeSpaces = maxSpaces
        }

        let totalBlocks = freeSpaces * this.width;
        let blocksLeft  = boardSize  - totalBlocks;
        let padding     = Math.floor(blocksLeft / freeSpaces);

        let x = 1;
        for(let i = 0; i < freeSpaces; i++){
            x += padding;
            this.spaces.push(
                {
                    x: x * tileSize,
                    y: this.y, 
                    w: this.width,
                    h: this.height,
                    bg: "rgba(255, 165, 0, 0.2)"
                }
            );
            x += this.width;
        }



    }

    drawSpaces(){
        let spaces = this.spaces;
        for(let i = 0, j = spaces.length; i < j; i++){
            let space = spaces[i];
            drawRect(this.ctx, space.x, space.y, (space.w * this.tileSize), null, space.bg);
        }
    }

    checkSpaces(){
        // ?
    }





}