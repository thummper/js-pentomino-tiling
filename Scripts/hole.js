let bshapes = [
	[p, '#71B3B0'], [f, '#D55A4C'], [y, '#F5994E'], [t, '#961628'], [w, '#1D6D53'], [n, '#D6BB50'], [u, '#21746C'], [v, '#2CAD7D'], [l, '#8B2134'], [z, '#D88642'], [x, '#208D99'], [i, '#4A3F4F']
		];

var Hole = function (x, y, dimention, difficulty, game) {
	this.x = x;
	this.y = y;
	this.game = game;
	this.dimen = dimention;
	this.tileSize = game.tileSize;
	this.difficulty = difficulty;
	this.grid = [];
	this.score = null;
	this.sTime = null;
	this.eTime = null;
	this.shapes = [];
	this.blocks = [];
	this.nShapes = 0;
	this.overfill = 0;

}

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
	let should = false;
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
			console.log(blockcols);
			if (blockcols >= 3) {
				should = true;
			}
		} else {
			should = true;
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
	for (let i = 0, j = this.grid.length; i < j; i++) {
		for (let k = 0, l = this.grid[i].length; k < l; k++) {
			let block = this.grid[i][k];
			if (block) {
				//Get spot on board.
				let cell = this.game.board[this.y + i][this.x + k];
				let contents = cell.contains;
				if (contents.length > 1) {
					//Something else in the cell
					let incell = contents.length - 2;
					filled++;
					if (incell > 0) {
						//Overflow
						overfill += incell;
					}
				}
			}
		}
	}
	if (this.filled > 0 && this.sTime == null) {
		this.sTime = performance.now();
	}
	if (this.nShapes * 5 == filled) {
		console.log("Shape filled");
		this.score = this.calcScore(overfill);
		return true;
	}
	return false;
}


Hole.prototype.calcScore = function (overfill) {
	this.eTime = performance.now();
	let time = (this.eTime - this.sTime) / 1000; //Time in seconds.
	let noov =  Math.pow( Math.E, ((-time)/8) + 8) + (this.nShapes * 50);
	let score = Math.pow( Math.E, ((-time * overfill)/8) + 8) + (this.nShapes * 50);
	
	
	
	console.log("%c Finished hole of difficulty %i with overfill %i in time of %i for a score of %i", "color:orange;", this.difficulty,overfill, time, score);
	console.log("Score no over: ", noov);
	return score;

}

Hole.prototype.regenerate = function () {
	//Should probably not have this here.
	this.removeShapes();
	this.grid = null;
	this.nShapes = 0;
	this.blocks = [];

	this.overfill = 0;
	this.full = false;
	this.score = null;
	this.startTime = null;
	this.endTime = null;
	this.shapes = [];
	this.makeBlocks();
	this.generateHole();



}
Hole.prototype.removeShapes = function () {
	for (let i = 0; i < this.grid.length; i++) {
		for (let j = 0; j < this.grid[i].length; j++) {
			//Get the blocks from the board. 
			let block = this.grid[i][j];
			if (block) {
				let cell = this.game.board[this.y + i][this.x + j];
				for (let k in cell.contains) {
					let cell_item = cell.contains[k];
					if (cell_item.shape) {
						//Mark the shape for deletion.
						cell_item.shape.delete = true;
					}
				}
			}
		}
	}
}
