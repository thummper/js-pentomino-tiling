var Shape = function (colour, x, y) {
    this.draggable = true;
    this.dragging = false;
    this.patterns = this.pickPattern();
    this.pattern = this.patterns[0];
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
	this.pattern = this.pattern.slice(0).map(function(arr){return arr.reverse();});
}
Shape.prototype.pickPattern = function () {
    var p = pieces[parseInt(Math.random() * pieces.length, 10)];
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
                    dragging: false
                });
            }

        }
    }

}
Shape.prototype.drag = function () {
	//Get the nearest blockpoint to the mouse and put the block we are dragging on it.
	let mousex = mx;
	let mousey = my;
	let xgrid, ygrid;
	//Coords of each gridpoint are a multiple of tileSize, find the nearest x,y multiples of tilesize to the mouse.
	
	//X COORD
	let x_remainder = mousex / tileSize;
	//Decide whether to move left or right. 
	
	if(x_remainder <= tileSize / 2){
		//Move left.
		xgrid = tileSize * Math.floor(mousex / tileSize);
	} else {
		//Move right.
		xgrid = tileSize * Math.ceil(mousex / tileSize);
	}
	
	//Y COORD
	let y_remainder = mousey / tileSize;
	if(y_remainder <= tileSize / 2){
		//Move up
		ygrid = tileSize * Math.floor(mousey / tileSize);
	} else {
		//Move down
		ygrid = tileSize * Math.ceil(mousey/ tileSize);
	}
	this.midx = xgrid;
	this.midy = ygrid;
	testx = xgrid;
	testy = ygrid;
	
	
	
	
	
	
	

}
Shape.prototype.draw_on_mouse = function () {
	//The block we picked up should be drawn on the mouse?
	let bx, by;
	
	for( i in this.blocks){
		let blk = this.blocks[i];
		if(blk.dragging){
			bx = blk.col;
			by = blk.row;
		}
	}
	//We have the col/row.
	//If midx / midy should be the coords of blk, translate - row and - col and set shape coords.
	tx = this.midx - (tileSize * bx);
	ty = this.midy - (tileSize * by);
	this.x = tx;
	this.y = ty;
	
	//Loop through and draw?
	for(i in this.blocks){
		let blk = this.blocks[i];
		rect(tx + (blk.col * tileSize), ty + (blk.row * tileSize), tileSize, tileSize, this.colour);
	}
	
	

}

Shape.prototype.scroll = function(){
    this.pattern_number = (this.pattern_number + 1) % this.patterns.length;
    this.pattern = this.patterns[this.pattern_number];
 
    
}
