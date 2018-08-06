var Hole = function (x, y, d) {
    this.x = x;
    this.y = y;
    this.difficulty = d;
    //Max width / height of this piece.
    this.maxw = this.maxh = 8;
    this.numblocks = 0;
    this.freeslots = [];


    //Blocks should store all solid blocks inside hole.
    this.blocks = [];
}

Hole.prototype.generate = function () {
    this.blocks = [];
    this.numblocks = 0;
    this.freeslots = [];
    //Bad algorithm.
    //Generates a hole that can be filled with pentominos.
    //Lets say that difficulty is the amount of pentominoes this hole is made from.
    //OK, if there are no blocks in the array, make one and add it. 
    if (this.numblocks == 0) {
        //Nothing in hole. 
        let shape = this.pickPattern();
        //Pick a random valid x/y pair to serve as base coords (this is col/row relative to the hole's position). 
        let shapex = random_range(0, this.maxw - (shape.length + 1));
        let shapey = random_range(0, this.maxh - (shape.length + 1));
        console.log("Shape is at: ", shapex, " ", shapey);
        //Add the shape's blocks to the block array? 
        //At this point the blocks array should be empty, so we'll make it and add this shape's blocks.
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
        this.numblocks++;
        this.findSpaces();
    }
    //At this point we have a hole with one pentomino in it?
    //Check if number blocks = to difficulty. 
    for (let i = this.numblocks; i < this.difficulty; i++) {
        console.log("Generated additional shape");
        //While blocks need to be added, add them.
        let shape = this.pickPattern();
        let canDraw = true;
        for (let j = this.freeslots.length - 1; j >= 0; j--) {
            let row = this.freeslots[j][0];
            let col = this.freeslots[j][1];

            if ((row + shape.length < this.maxh) && col + shape[0].length < this.maxw) {
                for (let k = 0; k < shape.length; k++) {
                    for (let l = 0; l < shape[k].length; l++) {
                        if (shape[k][l]) {
                            if (this.blocks[row + k][col + l] == 1) {
                                console.log("This slot wont work");
                                canDraw = false;
                                break;
                                //Remove this slot as it is impossilbe to draw in.
                            }
                        }
                    }
                }


                if (canDraw) {
                    for (let j = 0; j < shape.length; j++) {
                        for (let k = 0; k < shape[j].length; k++) {
                            if (shape[j][k]) {
                                this.blocks[row + j][col + k] = 1;
                            }
                        }
                    }
                    this.numblocks++;
                    this.findSpaces();
                } else {
                    console.log("cant draw shape");
                }

            }
        }
    }
    if(this.numblocks != this.difficulty){
     this.generate();   
    }
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
