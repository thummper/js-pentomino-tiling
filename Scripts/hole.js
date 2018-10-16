let p = [
	[0, 1],
	[1, 0],
	[1, 1],
	[2, 0],
	[2, 1]
		];
let x = [
	[0, 1],
	[1, 0],
	[1, 1],
	[1, 2],
	[2, 1]
		];
let z = [
	[0, 1],
	[0, 2],
	[1, 1],
	[1, 0]
		];
let f = [
	[0, 1],
	[0, 2],
	[1, 0],
	[1, 1],
	[2, 1]

];
let y = [
	[0, 0],
	[0, 1],
	[0, 2],
	[0, 3],
	[1, 1]

];
let t = [
	[0, 0],
	[0, 1],
	[0, 2],
	[1, 1],
	[2, 1]
];
let w = [
	[0, 0],
	[0, 1],
	[1, 1],
	[1, 2],
	[2, 2]

];
let n = [
	[0, 2],
	[1, 1],
	[1, 2],
	[2, 1],
	[3, 1]
];
let u = [
	[0, 0],
	[0, 2],
	[1, 0],
	[1, 1],
	[1, 2]
];
let v = [
	[0, 0],
	[1, 0],
	[2, 0],
	[2, 1],
	[2, 2]
];
let l = [
	[0, 1],
	[1, 1],
	[2, 1],
	[3, 1],
	[3, 2]
];
let i = [
	[0, 2],
	[1, 2],
	[2, 2],
	[3, 2],
	[4, 2]
]

let bshapes = [
	[p, '#71B3B0'], [f, '#D55A4C'], [y, '#F5994E'], [t, '#961628'], [w, '#1D6D53'], [n, '#D6BB50'], [u, '#21746C'], [v, '#2CAD7D'], [l, '#8B2134'], [z, '#D88642'], [x, '#208D99'], [i, '#4A3F4F']
		];

var Hole = function (x, y, dimention, difficulty, game) {
	this.game = game;
	this.tileSize = game.tileSize;
	this.x = x;
	this.y = y;
	this.difficulty = difficulty;
	this.dimen = dimention;
	this.create = performance.now();
	this.grid = null;
	this.nShapes = 0;


	this.blocks = [];
	this.spaces = 0;
	this.filled = 0;
	this.numblocks = 0;
	this.overfill = 0;
	this.full = false;
	this.score = null;
	this.startTime = null;
	this.endTime = null;
	this.shapes = [];

}
//Make blocks will essentially reset the hole to a blank dimen x dimen array
Hole.prototype.makeBlocks = function () {
	this.grid = [];
	for (let i = 0; i < this.dimen; i++) {
		this.grid.push(new Array(this.dimen).fill(0));
	}
}
Hole.prototype.generateHole = function () {
	//Will try to add this.difficulty number of shapes to the grid
	for (let i = 0; i < this.difficulty; i++) {
		let shape = this.getShape();
		let width = this.get_max_col(shape);
		let height = this.get_max_row(shape);
		if (this.nShapes == 0) {
			//This is the first shape in the array. 
			let randRow = Math.floor((this.dimen / 2) - height / 2);
			let randCol = Math.floor((this.dimen / 2) - width / 2);
			let placed = this.placeShape(shape, this.grid, randRow, randCol);
			if (placed) {
				this.nShapes++;
			}
		} else {
			//There are shapes already in the grid
			let places = this.getPlaces(this.grid);
			//For each place, try and place the shape.
			for (let j = 0, k = places.length; j < k; j++) {
				if (this.nShapes < this.difficulty) {
					let place = places[j];
					let row = place[0] - height;
					let col = place[1] - width;

					if (row >= 0 && row < this.dimen && col >= 0 && col <= this.dimen) {
						let placed = this.placeShape(shape, this.grid, row, col);
						if (placed) {
							this.nShapes++;
						}
					}
				} else {
					break;
				}
			}
		}
	}
}
Hole.prototype.getPlaces = function (grid) {
	let places = [];

	for (let i = 0, x = grid.length; i < x; i++) {
		for (let j = 0, y = grid[i].length; j < y; j++) {
			let block = grid[i][j];
			if (block != 0) {
				try {
					if (grid[i][j + 1] == 0) {
						places.push([i, j + 1]);
					}
				} catch (err) {

				}
				try {
					if (grid[i][j - 1] == 0) {
						places.push([i, j - 1]);
					}
				} catch (err) {

				}
				try {
					if (grid[i + 1][j] == 0) {
						places.push([i + 1, j]);
					}
				} catch (err) {

				}
				try {
					if (grid[i - 1][j] == 0) {
						places.push([i - 1, j]);
					}
				} catch (err) {}
			}
		}
	}
	return places;
}
Hole.prototype.placeShape = function (shape, grid, row, col) {
	//Going to try and place the shape in the grid at row, col.
	let can = true;
	for (let i = 0; i < shape.length; i++) {
		let block = shape[i];
		try {
			if (grid[row + block[0]][col + block[1]] != 0) {
				can = false;
				return can;
			}
		} catch (err) {
			can = false;
			return can;
		}
	}
	let should = true;
	if (can) {
		//We can place the shape, but should we? 
		if (this.nShapes != 0) {
			//Only check if we should if there's already a shape in the grid
			let blockcols = 0;
			for (let i = 0, j = shape.length; i < j; i++) {
				let block = shape[i];
				//Check above, right, bottom, left
				let brow = row + block[0];
				let bcol = col + block[1];
				//Above
				try {
					if (grid[brow - 1][bcol] != 0) {
						blockcols++;
					}
				} catch (err) {

				}
				//Right
				try {
					if (grid[brow][bcol + 1] != 0) {
						blockcols++;
					}
				} catch (err) {

				}
				//Bottom
				try {
					if (grid[brow + 1][bcol] != 0) {
						blockcols++;
					}
				} catch (err) {

				}
				//Left
				try {
					if (grid[brow][bcol - 1] != 0) {
						blockcols++;
					}
				} catch (err) {

				}

			}
			if (blockcols < 3) {
				should = false;
				return should;
			}
		}
		if (should) {
			//We can and should place the block
			for (let i = 0, j = shape.length; i < j; i++) {
				let block = shape[i];
				grid[row + block[0]][col + block[1]] = 1;
			}

		}
	}
	return should;
}
Hole.prototype.getrandom = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
Hole.prototype.get_max_col = function (shape) {
	let col = null;
	for (let i = 0, j = shape.length; i < j; i++) {
		let block = shape[i];
		if (col == null) {
			col = block[1];
		} else {
			if (block[1] > col) {
				col = block[1];
			}
		}
	}
	return col;
}
Hole.prototype.get_max_row = function (shape) {
	let row = null;
	for (let i = 0, j = shape.length; i < j; i++) {
		let block = shape[i];
		if (row == null) {
			row = block[0];
		} else {
			if (block[1] > row) {
				row = block[1];
			}
		}
	}
	return row;
}

Hole.prototype.getShape = function () {
	let probs = [13, 13, 12, 11, 10, 10, 6, 6, 6, 5, 4, 3];
	let shape = null;
	//Number between 1 and 100
	let number = Math.floor(Math.random() * 100);

	let total = 0;
	for (let i in probs) {
		total += probs[i];
		if (number <= total) {
			shape = bshapes[i][0];
			break;
		}
	}
	return shape;
}
Hole.prototype.draw = function () {
	//Draw the hole onto the grid.
	let board = this.game.board;



	for (let row = 0; row < this.grid.length; row++) {
		for (let col = 0; col < this.grid[row].length; col++) {
			if (this.grid[row][col] != 0) {
				board[row + this.y][col + this.x].contains.push({
					x: board[row + this.y][col + this.x].x,
					y: board[row + this.y][col + this.x].y,
					solid: true,
					color: "rgba(54, 69, 79, 0.8)",
					border: "black",
					type: "hole"
				});
			}
		}
	}
}
Hole.prototype.checkState = function () {
	//Check if the hole is filled or not.
	let filled = 0;
	let overfill = 0;









	//	this.filled = 0;
	//	this.overfill = 0;
	//	for (let i = 0; i < this.blocks.length; i++) {
	//		for (let j = 0; j < this.blocks[i].length; j++) {
	//			let block = this.blocks[i][j];
	//			if (block) {
	//				let cell = board[this.y + i][this.x + j];
	//				if(cell.contains.length >= 2){
	//					this.filled++;
	//                    this.overfill += cell.contains.length - 2;
	//				}
	//			}
	//		}
	//	}
	//    if(this.startTime == null && this.filled > 0){
	//        //The first block has been put in the hole. 
	//        this.startTime = performance.now();
	//    }
	//	if(this.filled == this.spaces){
	//		this.endTime = performance.now(); 
	//        if(this.overfill == 0){
	//            //There's no overfill
	//            mp++;
	//        } else {
	//            //There's overfill, break chain
	//            if(mp != 0){
	//                mp = 0;
	//                pp = pp - (mp * 4);
	//            }
	//        }
	//		console.log("Finished hole, MP counter: " + mp);
	//		
	//        return true;
	//        
	//	}
	//    return false;
	return false;
}


Hole.prototype.calcScore = function () {
	let time = (this.endTime - this.startTime) / 1000;
	let baseScore = this.difficulty / (time / 10000);
	baseScore -= (this.overfill * (difficulty - 1.5));
	baseScore += (500 * mp);

	console.log("%c Finished hole of difficulty %i in time of %i for a score of %i", "color:orange;", this.difficulty, time, baseScore);
	return [this.endTime, baseScore];
}
Hole.prototype.reset = function () {
	//Blocks are associated with a shape, loop through this hole's blocks and remove
	//any shapes associated with the hole.
	for (let i = 0; i < this.blocks.length; i++) {
		for (let j = 0; j < this.blocks[i].length; j++) {
			//Get the blocks from the board. 
			let block = this.blocks[i][j];
			if (block) {
				let cell = board[this.y + i][this.x + j];
				for (let k in cell.contains) {
					let cell_item = cell.contains[k];
					if (cell_item.shape) {
						//If the cell item is a shape, delete that shape.
						cell_item.shape.delete = true;
					}
				}
			}
		}
	}


	//So all shapes with blocks in the shape's range will be deleted. 
	//Reset the hole
	this.makeBlocks();
	this.numblocks = 0;
	this.score = null;
	this.generateHole();
}
