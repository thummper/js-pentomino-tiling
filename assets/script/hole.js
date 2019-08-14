class Hole {
	constructor(x, y, holeSize, boardWidth, boardHeight, tileSize, difficulty) {
		this.x = x;
		this.y = y;
		this.holeSize = holeSize;
		this.tileSize = tileSize;
		this.boardWidth = boardWidth;
		this.boardHeight = boardHeight;
		this.difficulty = difficulty;

		this.grid = [];
		this.score = null;
		this.sTime = null;
		this.eTime = null;
		this.blocks = [];
		this.nShapes = 0;
		this.nBlocks = 100;
		this.filled = 0;
	}

	makeBlocks() {
		this.grid = [];
		for (let i = 0; i < this.dimen; i++) {
			this.grid.push(new Array(this.dimen).fill(0));
		}
	}

	generateHole() {
		this.makeBlocks();

		for (let i = 0; i < this.difficulty; i++) {
			let patterns = this.getShape();
			let shape = patterns[0];
			let width = this.getWidth(shape);
			let height = this.getHeight(shape);

			if (this.nShapes == 0) {
				//There are no shapes in the array
				let middleRow = Math.floor((this.holeSize / 2) - (height / 2));
				let middleCol = Math.floor((this.holeSize / 2) - (width / 2));
				let placed = this.placeShape(shape, this.grid, middleRow, middleCol);

			} else {

				//There are already shapes in the array
				let places = this.getPlaces(this.grid);
				for (let p = 0, pp = places.length; p < pp; p++) {
					if (this.nShapes < this.difficulty) {
						//Less shapes than difficulty, try to place
						let place = places[p];
						let row = place[0] - height;
						let col = place[1] - width;

						let placed = this.placeShape(shape, this.grid, row, col);
						if (!placed) {

							for (let o = 1; o < 3; o++) {
								shape = patterns[o];
								let placeRotate = this.placeShape(shape, this.grid, row, col);
								if (placeRotate) {
									break;
								}
							}
						}
					}
				}
			}
		}

		this.nBlocks = 0;
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				if (this.grid[i][j] == 1) {
					this.nBlocks++;
				}
			}
		}
	}

	//Will try to place a shape in the grid, if possible, return true
	placeShape(shape, grid, row, col) {

		let canPlace = true;
		for (let i = 0; i < shape.length; i++) {
			let block = shape[i];
			let blockr = block[0];
			let blockc = block[1];
			if (grid[row + blockr] !== undefined) {
				if (grid[row + blockr][col + blockc] !== undefined) {
					if (grid[row + blockr][col + blockc] == 1) {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
			if (grid[row + blockr][col + blockc] == 1) {
				return false;
			}
		}


		let shouldPlace = true;
		if (this.nShapes != 0) {
			//Check above, right, bottom, left of shape for adjacent shapes.
		}
		if (canPlace && shouldPlace) {
			this.nShapes++;
			for (let i = 0, j = shape.length; i < j; i++) {
				let block = shape[i];
				let r = block[0];
				let c = block[1];
				grid[row + r][col + c] = 1;
			}
		}
	}


	//Returns true if index, false else
	indexTest(array, ind1, ind2) {
		if (ind1 < 0 || ind2 < 0) {
			return false;
		}
		if (typeof array[ind1] === 'undefined') {
			return false;
		}
		//ind1 is defined.
		if (typeof array[ind1][ind2] === 'undefined') {
			return false;
		} else {
			return true;
		}

	}


	getPlaces(grid) {
		let places = [];
		for (let i = 0, x = grid.length; i < x; i++) {
			for (let j = 0, y = grid[i].length; j < y; j++) {
				let block = grid[i][j];
				if (block != 0) {
					//Check above, left, right, bottom of block for places for new shapes.

					if (this.indexTest(grid, i, j + 1) && grid[i][j + 1] == 0) {
						places.push([i, j + 1]);
					}
					if (this.indexTest(grid, i, j - 1) && grid[i][j - 1] == 0) {
						places.push([i, j - 1]);
					}
					if (this.indexTest(grid, i - 1, j) && grid[i - 1][j] == 0) {
						places.push([i - 1, j]);
					}
					if (this.indexTest(grid, i + 1, j) && grid[i + 1][j] == 0) {
						places.push([i + 1, j]);
					}

				}
			}
		}
		return places;
	}

	getWidth(shape) {
		let max = 0;
		for (let i = 0, j = shape.length; i < j; i++) {
			let block = shape[i];
			let col = block[1];
			if (col >= max) {
				max = col;
			}
		}
		return max;
	}

	getHeight(shape) {
		let max = 0;
		for (let i = 0, j = shape.length; i < j; i++) {
			let block = shape[i];
			let row = block[0];
			if (row >= max) {
				max = row;
			}
		}
		return max;
	}


	getShape() {
		let probs = [13, 13, 12, 11, 10, 10, 6, 6, 6];
		let shape = null;
		let number = Math.floor(Math.random() * 80);
		let total = 0;
		for (let i in probs) {
			total += probs[i];
			if (number <= total) {
				shape = pieces[i][0];
				break;
			}
		}
		return shape;
	}

	draw(board) {
		// Hole has an x, y and dimention.
		for (let r = this.y; r < this.y + this.holeSize; r++) {
			for (let c = this.x; c < this.x + this.holeSize; c++) {
				let cell = board[r][c];
				board[r][c].contains.push({
					x: cell.x,
					y: cell.y,
					solid: true,
					color: "rgba(54, 69, 79, 0.8)",
					border: "black",
					type: "hole"
				});
			}
		}
	}

	checkState(board, combo) {
		let filled = 0;
		let overfill = 0;
		// We are looping through the grid spaces on the game board and checking if they are full
		for(let i = this.y; i < this.y + this.holeSize; i++){
			for(let j = this.x; j < this.x + this.holeSize; j++){
				let cell = board[i][j];
				if(cell.contains.length == 2){

					if(cell.contains[1].type == "shape"){
						filled++;
					}

				} else if (cell.contains.length >= 3){
					filled++;
					overfill += cell.contains.length - 3;

				}
			}
		}




		this.filled = filled;

		if (this.sTime == null && this.filled > 0) {
			this.sTime = performance.now();
		}
		return false; //AAAAHHH
		if (this.nBlocks == filled) {

			this.score = this.calcScore(overfill, combo);
			this.overfill = overfill;
			return false; //TODO: Holes are currently absolutely totaled (SPAM COMPLETING)
		}
		return false;
	}


	calcScore(overfill, combo) {
		this.eTime = performance.now();
		let time = (this.eTime - this.sTime) / 1000; //Time in seconds.
		let noov = Math.pow(Math.E, ((-time) / 8) + 8) + (this.nShapes * 50 * (combo * 1000));
		let score = Math.pow(Math.E, ((-time * overfill) / 8) + 8) + (this.nShapes * 50 * (combo * 1000));
		console.log("%c Finished hole of difficulty %i with overfill %i in time of %i for a score of %i", "color:orange;", this.difficulty, overfill, time, score);
		console.log("Score no over: ", noov);
		return score;
	}

	regenerate() {
		this.removeShapes();
		this.grid = null;
		this.nShapes = 0;
		this.nBlocks = 0;
		this.overfill = 0;
		this.blocks = [];
		this.score = null;
		this.startTime = null;
		this.endTime = null;
		this.makeBlocks();
		this.generateHole();
	}

	removeShapes() {
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



}