var Hole = function (x, y, dimention, difficulty) {
    this.x = x;
    this.y = y;
    this.difficulty = difficulty;
    this.dimen = dimention;
    this.create = performance.now();

    this.blocks = [];
    this.spaces = 0;
    this.filled = 0;
    this.numblocks = 0;
    this.overfill = 0;
    this.full = false;
    this.score = null;
    console.log("SET DIMEN: " + dimention);
}

Hole.prototype.generate = function () {
    this.numblocks = 0;
    this.blocks = [];
    //Generates a hole that can be filled with pentominos.
    //Generate hole's blocks.
    for (let i = 0; i <= this.dimen; i++) {
        let row = [];
        for (let k = 0; k <= this.dimen; k++) {
            row.push(0);
        }
        this.blocks.push(row);
    }
    //Draw the shape on the board.
    //Blocks array is empty - generate the first shape and add it randomly.
    let shape = this.pickPattern();
    console.log("dimen: " + this.dimen);
    console.log("len: " + (shape.length - 1));
    let shapex = random_range(0, this.dimen - shape[0].length);
    let shapey = random_range(0, this.dimen - shape.length);
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                this.blocks[shapey + i][shapex + j] = 1;
            }
        }
    }
    this.numblocks++;

    for (let i = this.numblocks; i < this.difficulty; i++) {
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

                            board[row + i][col + j].contains.push({
                                x: (this.x + i) * tileSize,
                                y: (this.y + j) * tileSize,
                                solid: true,
                                colour: "rgba(0, 0, 0, 0.2)",
                                border: "black",
                                type: "hole"
                            });
                        }
                    }
                }
                break;
            }
        }
    }
}
Hole.prototype.checkState = function () {
    if (!this.full) {
        this.filled = 0;
        this.overfill = 0;
        //Will determine if the hole is filled or not. 
        //Number of free spaces in spaces/ taken spaces in filled.
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[i].length; j++) {
                let block = this.blocks[i][j];
                if (block) {
                    //Block is actually a hole.
                    //Check the board.
                    let boardcell = board[this.y + i][this.x + j];


                    if (boardcell.contains.length > 1) {
                        //If it's more than one, there's something else in the block.
                        let num_shapes = boardcell.contains.length - 1;
                        if (num_shapes > 1) {
                            //We are overfilling the shape
                            while (num_shapes > 1) {
                                this.overfill++;
                                num_shapes--;
                            }
                        }
                        //All overfill has been adding.
                        this.filled++;
                    }
                }
            }
        }
        if (this.filled == this.spaces) {
            let time = (performance.now() - this.create) / 1000;
            this.score = this.calcScore(this.difficulty, this.overfill, time);
            this.full = true;
            console.log("Hole is full, overfill: " + this.overfill);
        }
    } else {



        console.log("hole filled: " + this.score);
        return this.score;
    }
}
Hole.prototype.calcScore = function (difficulty, overfill, time) {
    let baseScore = difficulty / (time / 100);
    baseScore -= (overfill * (difficulty - 1.5));
    return baseScore;
}
Hole.prototype.trim = function () {
    console.log("Blocks before: ");
    console.log(this.blocks);
    //Removes empty rows and columns from a hole. 


    for (let i = this.blocks.length - 1; i >= 0; i--) {
        let removable = true;
        for (let j = this.blocks[i].length; j >= 0; j--) {
            if (this.blocks[i][j] == 1) {
                removable = false;
            }
        }
        if (removable) {
            //Remove this row.
            this.blocks.splice(i, 1);
        }
    }



    //Extra rows have been removed. 
    //Remove excess columns.
    for(let i = 0; i < this.blocks[0].length; i++){
        //For each column in the array.
        let removable = true;
        
        for(let j = 0; j < this.blocks.length; j++){
            //For each row.
            let cell = this.blocks[j][i];
            if(cell == 1){
                this.removable = false;
            }
        }
        if(removable){
            //Remove column i.
            
            for(let j = 0; j < this.blocks.length; j++){
                this.blocks[j].splice(i, 1);
            }
            
        }
        
        
        
        
        
        
    }
    
    


    console.log("Blocks after: ");
    console.log(this.blocks);




}

Hole.prototype.clear = function () {
    //Remove the shapes associated with the hole.
}
