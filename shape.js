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




}
Shape.prototype.mirror = function(){
	//Change pattern to the mirror pattern.
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
    //Updates all coordiantes to mouse. 
    this.x = mx; 
    this.y = my;
    for(i in this.blocks){
        let block = this.blocks[i];
        block.x = mx + (block.col * tileSize);
        block.y = my + (block.row * tileSize);
    }
}
Shape.prototype.draw_on_mouse = function () {
    //Translate around the block that is being dragged.
    let dx, dy;
    for( i in this.blocks){
        let block = this.blocks[i];
        if(block.dragging){
            //work out difference
            dx = this.x - block.x;
            dy = this.y - block.y;
        }
    }
    
    for( i in this.pattern){
        for( j in this.pattern[i]){
            if(this.pattern[i][j]){
                rect(mx + (j * tileSize) - (this.pattern[0].length * tileSize)/2, my + (i * tileSize) - (this.pattern.length * tileSize)/2, tileSize, tileSize, this.colour);
            }
        }
    }
    
//    for( i in this.blocks ){
//        let block = this.blocks[i];
//        rect(block.x + dx - (tileSize / 2), block.y + dy - (tileSize / 2), tileSize, tileSize, this.colour);
//    }

}

Shape.prototype.scroll = function(){
    this.pattern_number = (this.pattern_number + 1) % this.patterns.length;
    this.pattern = this.patterns[this.pattern_number];
//    let b = 0;
//    for( i in this.pattern){
//        for(j in this.pattern[i]){
//            if(this.pattern[i][j]){
//                //Update block b. 
//                let block = this.blocks[b];
//                block.col = j;
//                block.row = i;
//                block.x = this.x + (block.col * tileSize);
//                block.y = this.y + (block.row * tileSize);
//                b++;
//            }
//        }
//    }
    
    //Need to redo blocks array OR draw shape on mouse from pattern. 
    
    
}
