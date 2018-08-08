var Shape = function (x, y) {
    this.draggable = true;
    this.dragging = false;
    this.pattern = this.pickPattern();
    this.colour = randomcol();
    this.x = x;
    this.y = y;
    //Store the coordinates of each of its blocks. 
    this.blocks;
    this.midx;
    this.midy;
    this.makeBlocks();
}

Shape.prototype.mirror = function () {
    this.blocks.map(function(arr){return arr.reverse();});
}


Shape.prototype.makeBlocks = function () {
    this.blocks = [];
    for (let x = 0; x < this.pattern.length; x++) {
        this.blocks.push([]);

        for (let y = 0; y < this.pattern[x].length; y++) {
            if (this.pattern[x][y]) {
                //Non zero pattern, add to board. 
                let block = {
					x: this.x + (y * tileSize),
					y: this.y + (x * tileSize),
                    dragging: false,
                    solid: true,
                    colour: this.colour || "black",
                    border: "transparent",
                    type: "shape_solid"

                };
                this.blocks[x][y] = block;
            } else {
                //Non Zero
                let block = {
					x: this.x + (y * tileSize),
					y: this.y + (x * tileSize),
                    dragging: false,
                    solid: false,
                    colour: "transparent",
                    type:"shape_hollow"
                };
                this.blocks[x][y] = block;
            }
        }
    }

}

Shape.prototype.pickPattern = function () {
    var p = pieces[ parseInt(Math.random() * pieces.length, 10) ].slice();
    this.colour = randomcol;
    return p;
}

Shape.prototype.draw = function () {
    
    for (let col = 0; col < board.length; col++) {
        for (let row = 0; row < board[col].length; row++) {
            
			let cell = board[col][row];
            if(cell.x == this.x && cell.y == this.y){
                
                //Found the correct grid position
                for(let i = 0; i < this.blocks.length; i++){
                    for(let j = 0; j < this.blocks[i].length; j++){
                        let block = this.blocks[i][j];
                        if(block.solid){
                            //Add to grid.
                            board[col + i][row + j].contains.push(block);
                        
                        }
                    }
                }
                
                
                
            }
            
            

        }
    }
	

	

    //Blocks have been added to the grid.
}

Shape.prototype.drag = function () {
    //Get the nearest blockpoint to the mouse and put the block we are dragging on it.
    let mousex = mx;
    let mousey = my;
    let xgrid, ygrid;
    ygrid = Math.ceil(mousey / tileSize) * tileSize;
    xgrid = Math.ceil(mousex / tileSize) * tileSize;
    //midx/midy is the closest grid square to the mouse
    this.midx = xgrid;
    this.midy = ygrid;
    testx = xgrid;
    testy = ygrid;
}

Shape.prototype.draw_on_mouse = function () {
    //The block we picked up should be drawn on the mouse?
    let bx, by;
    //The block we picked up should be drawn in the grid space closest to the mouse
    for (i in this.blocks) {
        let blk = this.blocks[i];
        if (blk.dragging) {
            bx = blk.col;
            by = blk.row;
        }
    }


    for (let i = 0; i < this.blocks.length; i++) {
        for (let j = 0; j < this.blocks[i].length; j++) {
            let block = this.blocks[i][j];
            if (block.dragging) {
                bx = j;
                by = i;
            }
        }
    }
    // midx/midy is the position the block should be drawn.

    tx = this.midx - (tileSize * bx) - tileSize;
    ty = this.midy - (tileSize * by) - tileSize;
    this.x = tx;
    this.y = ty;
    // tx/ty is the position the shape has to be in for the dragged block to be in midx/midy.
    for (let i = 0; i < this.blocks.length; i++) {
        for (let j = 0; j < this.blocks[i].length; j++) {
            let block = this.blocks[i][j];
			block.x = this.x + (j * tileSize);
			block.y = this.y + (i * tileSize);
			
			
            if (block.solid) {
                rect(this.x + (j * tileSize), this.y + (i * tileSize), tileSize, tileSize, block.colour);
            }
        }
    }







}

Shape.prototype.scroll = function (dir) {
    //Rotate the blocks matrix by 90 deg
    let width = this.blocks.length;
    let height = this.blocks[0].length;
    if (width == height) {
        //Square matrix 
        if(dir){
            this.rotateCounter();
        } else {
            this.rotateSquare();   
        }
        
    } else {
        //Non square
        this.rotate();
    }
    this.draw_on_mouse();
}

Shape.prototype.rotateSquare = function () {
    //Rotate a square array 90 degrees clockwise
    let a = this.blocks;
    var n = a.length;
    for (var i = 0; i < n / 2; i++) {
        for (var j = i; j < n - i - 1; j++) {
            var tmp = a[i][j];
            a[i][j] = a[n - j - 1][i];
            a[n - j - 1][i] = a[n - i - 1][n - j - 1];
            a[n - i - 1][n - j - 1] = a[j][n - i - 1];
            a[j][n - i - 1] = tmp;
        }
    }
    this.draw_on_mouse();
}

Shape.prototype.rotateCounter = function () {
    let a = this.blocks;
    var n = a.length;
    for (var i = 0; i < n / 2; i++) {
        for (var j = i; j < n - i - 1; j++) {
            var tmp = a[i][j];
            a[i][j] = a[j][n - i - 1];
            a[j][n - i - 1] = a[n - i - 1][n - j - 1];
            a[n - i - 1][n - j - 1] = a[n - j - 1][i];
            a[n - j - 1][i] = tmp;
        }
    }
    return a;


}

Shape.prototype.rotate = function () {
    //Rotate a non-square array 90 degrees clockwise.
}
