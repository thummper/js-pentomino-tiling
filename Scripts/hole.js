var Hole = function (x, y, d) {
    this.x = x;
    this.y = y;
    this.difficulty = d;
    //Max width / height of this piece.
    this.maxw = this.maxh = 12;
    this.numblocks = 0;
    //Blocks should store all solid blocks inside hole.
    this.blocks = [];
    this.spaces = 0;
    this.filled = 0;
}

Hole.prototype.generate = function () {
    //Generates a hole that can be filled with pentominos.
    //Generate hole's blocks.
    for (let i = 0; i < this.maxh; i++) {
        let row = [];
        for (let k = 0; k < this.maxw; k++) {
            row.push(0);
        }
        this.blocks.push(row);
    }
    //Draw the shape on the board.
    
    
    //Blocks array is empty - generate the first shape and add it randomly.
    let shape = this.pickPattern();
    let shapex = random_range(0, this.maxw - (shape.length + 1));
    let shapey = random_range(0, this.maxh - (shape.length + 1));

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            //Add the shape to the block array. 
            if (shape[i][j]) {
                this.blocks[shapey + i][shapex + j] = 1;
            }
        }
    }
    this.numblocks++;
    
    
    //At this point we have a hole with one pentomino in it
    //Try and generate the same number of blocks as difficulty. 
    for (let i = this.numblocks; i < this.difficulty; i++) {
        console.log("Generated additional shape");
        shape = this.pickPattern();
        //Loop through the blocks. 
        for (let x = 0; x < this.blocks.length; x++) {
            for (let y = 0; y < this.blocks[x].length; y++) {
                let cell = this.blocks[x][y];
                if (cell != 1) {
                    //There's nothing in this space, try to draw the block.
                    let draw = true;
                    for (let j = 0; j < shape.length; j++) {
                        for (let k = 0; k < shape[j].length; k++) {
                            if (shape[j][k]) {
                                //Non-zero shape block.
                                if ((x + j) <= this.blocks.length - shape.length && (y + k) <= this.blocks[0].length - shape[0].length) {
                                    if (this.blocks[x + j][y + k]) {
                                        draw = false;
                                        break;
                                    }
                                } else {
                                    draw = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (draw) {
                        //We could draw the block here, but should we? 
                        //At least 1 non-zero shape block HAS to be touching another one.
                        let sdraw = 0;
                        for (let j = 0; j < shape.length; j++) {
                            for (let k = 0; k < shape[j].length; k++) {
                                if (shape[j][k]) {
                                    //for each non-zero shape, check if the blocks around it would contain something 
                                    //if it was drawn into the blocks array.
                                    let trow = x + j;
                                    let tcol = y + k;
                                    if (trow + 1 <= this.blocks.length) {
                                        if (this.blocks[trow + 1][tcol] == 1) {
                                            sdraw++;
                                        }
                                    }
                                    if (trow + -1 >= 0) {
                                        if (this.blocks[trow - 1][tcol] == 1) {
                                            sdraw++;
                                        }
                                    }
                                    if (tcol - 1 >= 0) {
                                        if (this.blocks[trow][tcol - 1] == 1) {
                                            sdraw++;
                                        }
                                    }
                                    if (tcol + 1 <= this.blocks.length) {
                                        if (this.blocks[trow][tcol + 1] == 1) {
                                            sdraw++;
                                        }
                                    }
                                }
                            }
                        }
                    
                        if (sdraw >= 3 && (this.numblocks < this.difficulty)) {
                            console.log("Drawing a Shape");
                            //We can and should draw this shape.
                            for (let j = 0; j < shape.length; j++) {
                                for (let k = 0; k < shape[j].length; k++) {
                                    if (shape[j][k]) {
                                        this.blocks[x + j][y + k] = 1;
                                       
                                    }
                                }
                            }
                            this.numblocks++;
                        } 
                    }
                }
            }
        }
    }
    this.spaces = this.numblocks * 5;
}

Hole.prototype.pickPattern = function () {
    var p = pieces[parseInt(Math.random() * pieces.length, 10)].slice();
    return p;
}

Hole.prototype.draw = function () {
    //Draw the hole onto the grid.
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let cell = board[row][col];
            if (row == this.y && col == this.x) {
                //Found start of hole.
                for (let i = 0; i < this.blocks.length; i++) {
                    for (let j = 0; j < this.blocks[i].length; j++) {
						
                        let block = this.blocks[i][j];
                        if (block) {
							
                            board[row + i][col + j].contains.push(
								{
                                x: (this.x + i) * tileSize,
                                y: (this.y + j) * tileSize,
                                solid: true,
                                colour: "rgba(0, 0, 0, 0.2)",
                                border: "black",
                                type: "hole"
                            }
							);
                        }
                    }
                }
                break;
            }
        }
    }
}
Hole.prototype.checkState = function(){
    this.filled = 0;
    //Will determine if the hole is filled or not. 
    //Number of free spaces in spaces/ taken spaces in filled.
    for(let i = 0; i < this.blocks.length; i++){
        for(let j = 0; j < this.blocks[i].length; j++){
            let block = this.blocks[i][j];
            if(block){
                //Block is actually a hole.
                //Check the board.
                let boardcell = board[this.y + i][this.x + j];
                if(boardcell.contains){
            
                }
            }
        }
    }
    
    if(this.filled == this.spaces){
      
    } else{

    }
}
