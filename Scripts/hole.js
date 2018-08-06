var Hole = function (x, y, d) {
    this.x = x;
    this.y = y;
    this.difficulty = d;
    //Max width / height of this piece.
    this.maxw = this.maxh = 10;
    this.numblocks = 0;
    this.freeslots = [];


    //Blocks should store all solid blocks inside hole.
    this.blocks = [];
}

Hole.prototype.generate = function () {

    //Generates a hole that can be filled with pentominos.
    //Lets say that difficulty is the amount of pentominoes this hole is made from.
    //OK, if there are no blocks in the array, make one and add it. 
    //Nothing in hole. 
    let shape = this.pickPattern();
    //Pick a random valid x/y pair to serve as base coords (this is col/row relative to the hole's position). 
    let shapex = random_range(0, this.maxw - (shape.length + 1));
    let shapey = random_range(0, this.maxh - (shape.length + 1));


    //Generate hole's blocks.
    for (let i = 0; i < this.maxh; i++) {
        let row = [];
        for (let k = 0; k < this.maxw; k++) {
            row.push(0);
        }
        this.blocks.push(row);
    }
    //Draw the shape on the board.

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            //Add the shape to the block array. 
            if (shape[i][j]) {
                this.blocks[shapey + i][shapex + j] = 1;
            }
        }
    }
    this.numblocks = 1;

    //At this point we have a hole with one pentomino in it?
    //Check if number blocks = to difficulty. 
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
                                    }
                                } else {
                                    draw = false;
                                }
                            }
                        }
                    }

                    if (draw) {
                        console.log("Could draw shape");
                        //We could draw the block here, but should we? 
                        //At least 1 non-zero shape block HAS to be touching another one.
                        let sdraw = false;
                        for (let j = 0; j < shape.length; j++) {
                            for (let k = 0; k < shape[j].length; k++) {
                                if (shape[j][k]) {
                                    //for each non-zero shape, check if the blocks around it would contain something 
                                    //if it was drawn into the blocks array.
                                    let trow = x + j;
                                    let tcol = y + k;


                                    if (trow + 1 <= this.blocks.length) {
                                        if (this.blocks[trow + 1][tcol] == 1) {
                                            sdraw = true;
                                        }
                                    }
                                    if (trow + -1 >= 0) {
                                        if (this.blocks[trow - 1][tcol] == 1) {
                                            sdraw = true;
                                        }
                                    }
                                    if (tcol - 1 >= 0) {
                                        if (this.blocks[trow][tcol - 1] == 1) {
                                            sdraw = true;
                                        }
                                    }
                                    if (tcol + 1 <= this.blocks.length) {
                                        if (this.blocks[trow][tcol + 1] == 1) {
                                            sdraw = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (sdraw && (this.numblocks < this.difficulty)) {
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

    console.log("Generated a hole with: " + this.numblocks + " spaces");


}


Hole.prototype.findSpaces = function () {
    this.freeslots = [];
    //Will look for spaces in the blocks array to try and draw shapes.
    for (let i = 0; i < this.blocks.length; i++) {
        for (let j = 0; j < this.blocks[i].length; j++) {
            let cell = this.blocks[i][j];

            if (cell == 1) {

                if ((i + 1) <= this.blocks.length - 1) {
                    if (!this.blocks[i + 1][j]) {
                        this.freeslots.push([i + 1, j]);
                    }
                }
                if ((i - 1) >= 0) {
                    if (!this.blocks[i - 1][j]) {
                        this.freeslots.push([i + 1, j]);
                    }
                }

                if ((j + 1) <= this.blocks[0].length - 1) {
                    if (!this.blocks[i][j + 1]) {
                        this.freeslots.push([i + 1, j]);
                    }
                }
                if ((j - 1) >= 0) {
                    if (!this.blocks[i][j - 1]) {
                        this.freeslots.push([i + 1, j]);
                    }
                }

            }
        }
    }
    console.log("Found spaces at: ");
    console.log(this.freeslots);
}


Hole.prototype.pickPattern = function () {
    var p = pieces[parseInt(Math.random() * pieces.length, 10)].slice();
    return p;
}

Hole.prototype.draw = function(){

    //Draw the hole onto the grid.
    for(let row = 0; row < board.length; row++){
        for(let col = 0; col < board[row].length; col++){
            
            let cell = board[row][col];
            if(row == this.y && col == this.x){
                //Found start of hole.
                for(let i = 0; i < this.blocks.length; i++){
                    for(let j = 0; j < this.blocks[i].length; j++){
                        let block = this.blocks[i][j];
                        if(block){
                            board[row + i][col + j].contains = {
                                x:  (this.x + i) * tileSize,
                                y:  (this.y + j) * tileSize,
                                solid: true,
                                colour: "black"
                            };
                            
                        }
                        
                    }
                    
                    
                }
                
                
            }
            
            
        }
    }
    
    
    
}
