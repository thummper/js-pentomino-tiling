var Shape = function (colour, x, y) {
    this.draggable = true;
    this.dragging = false;
    this.patterns = this.pickPattern();
    this.pattern = this.patterns[0].slice();
    this.pattern_number = 0;
    this.colour = colour || "black";
    this.x = x;
    this.y = y;
    //Store the coordinates of each of its blocks. 
    this.blocks = [];
	this.midx;
	this.midy;
}

Shape.prototype.mirror = function(){
	//Change pattern to the mirror pattern.
    let temp_pattern = this.pattern.slice();
    for(i in temp_pattern){
        temp_pattern[i] = temp_pattern[i].slice().reverse();
    }
    this.pattern = temp_pattern;
}

Shape.prototype.pickPattern = function () {
    var p = pieces[parseInt(Math.random() * pieces.length, 10)].slice();
    this.colour = p[1];
    return p[0];
}

Shape.prototype.draw = function () {
    //Add the shape to the board. 
    //Find the location of shape on board.
    this.blocks = [];
    let boardcol;
    let boardrow;
    for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
            if (board[col][row].x == this.x && board[col][row].y == this.y) {
                boardcol = col;
                boardrow = row;
            }
        }
    }
    for (let x = 0; x < this.pattern.length; x++) {
        for (let y = 0; y < this.pattern[x].length; y++) {
            if (this.pattern[x][y]) {
                //Non zero pattern, add to board. 
                board[boardcol + x][boardrow + y].contains = this;
                this.blocks.push({
                    col: y,
                    row: x,
                    x: board[boardcol + x][boardrow + y].x,
                    y: board[boardcol + x][boardrow + y].y,
                    dragging: false,
                    solid: true
                });
            } else {
                
                this.blocks.push({
                    col: y,
                    row: x,
                    x: board[boardcol + x][boardrow + y].x,
                    y: board[boardcol + x][boardrow + y].y,
                    dragging: false,
                    solid: false
                });
            }
        }
        //So blocks array is exactly the same as shape array but contains more information.
    }
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
	for( i in this.blocks){
		let blk = this.blocks[i];
		if(blk.dragging){
			bx = blk.col;
			by = blk.row;
		}
	}
    // midx/midy is the position the block should be drawn.

	tx = this.midx - (tileSize * bx) - tileSize;
	ty = this.midy - (tileSize * by) - tileSize;
	this.x = tx;
	this.y = ty;
    // tx/ty is the position the shape has to be in for the dragged block to be in midx/midy.
    for( i in this.blocks ){
        
        let block = this.blocks[i];
        if(block.solid){
            
        rect( this.x + (block.col * tileSize), this.y + (block.row * tileSize), tileSize, tileSize, this.colour);            
        }

    }
    
    
    
    
    


}

Shape.prototype.scroll = function(){
    this.pattern_number = (this.pattern_number + 1) % this.patterns.length;
    this.pattern = this.patterns[this.pattern_number];
    
    //reset dragging block 
    
    for(i in this.blocks){
        let block = this.blocks[i];
        if(block.dragging){
            block.dragging = false;
        }
    }

    
}
