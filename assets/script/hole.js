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
		this.nBlocks = 0;
		this.filled = 0;
	}

	makeGrid() {
		this.grid = [];
		for (let i = 0; i < this.holeSize; i++) {
			this.grid.push(new Array(this.holeSize).fill(0));
		}

	}

	generateHole() {

		this.makeGrid();

		// Add a shape to the hole for each level of difficulty.
		for (let i = 0; i < this.difficulty; i++) {
			let shapePatterns = this.getShape();
			let shape = shapePatterns[0];
			let w = this.getWidth(shape);
			let h = this.getHeight(shape);
			if (this.nShapes == 0) {
				// This is the first shape to be put in the grid.
				let mRow = Math.floor((this.holeSize / 2) - (h / 2));
				let mCol = Math.floor((this.holeSize / 2) - (w / 2));

				this.placeShape(shape, this.grid, mRow, mCol);

			} else {
				// There are already other shapes in the grid.
				let places = this.getPlaces(this.grid);
				for (let p = 0; p < places.length; p++) {
					let place = places[p];
					let placed = false;
					for (let o = 0; o < shapePatterns.length; o++) {
						let shapePattern = shapePatterns[o];

						let height = this.getHeight(shapePattern);
						let width = this.getWidth(shapePattern);
						let row = Math.floor(place[0] - height / 2);
						let col = Math.floor(place[1] - width / 2);
						placed = this.placeShape(shapePattern, this.grid, row, col);
						if (placed) {
							break;
						}
					}
				}
			}
		}
		console.log("Blocks; ", this.nBlocks);
	}


	placeShape(shape, grid, row, col) {

		let canPlace = true;
		// Loop through all shape blocks, see if we can place them in the grid.
		for (let i = 0; i < shape.length; i++) {
			let shapeBlock = shape[i];
			let blockRow = shapeBlock[0];
			let blockCol = shapeBlock[1];
			if (typeof grid[row + blockRow] === 'undefined') {
				// The row exists
				canPlace = false;
				return false;
			}
			if (typeof grid[row + blockRow][col + blockCol] === 'undefined') {
				canPlace = false;
				return false;
			}
			if(grid[row + blockRow][col + blockCol] == 1){
				canPlace = false;
				return false;
			}
		}


		let shouldPlace = true;
		if (this.nShapes > this.difficulty) {
			shouldPlace = false;
		}
		// TODO: Should place? 
		if (canPlace && shouldPlace) {
			// Place the shape in the grid.
			this.nShapes++;
			for (let i = 0; i < shape.length; i++) {
				let shapeBlock = shape[i];
				let blockRow = shapeBlock[0];
				let blockCol = shapeBlock[1];
				if(grid[row+blockRow][col+blockCol] == 1){
					console.log("Why are you placing here?");
				}


				grid[row + blockRow][col + blockCol] = 1;
				this.nBlocks++;
			}
		}
		return true;
	}


	//Returns true if index, false else

	testPlace(grid, row, col) {
		if (row < 0 || col < 0) {
			return false;
		}
		if (typeof grid[row] === 'undefined') {
			return false;
		}
		if (typeof grid[row][col] === 'undefined') {
			return false;
		}
		if (grid[row][col] === 0) {
			return true;
		}
	}

	getPlaces(grid) {
		let potentialPlaces = [];
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j] == 1) {
					// We only want to place new shapes around previous ones, so if there is a shape here add all surrounding places to potential.

					//Above
					if (this.testPlace(grid, i + 1, j)) {
						potentialPlaces.push([i + 1, j]);
					}
					//Below
					if (this.testPlace(grid, i - 1, j)) {
						potentialPlaces.push([i - 1, j]);
					}
					//Left
					if (this.testPlace(grid, i, j - 1)) {
						potentialPlaces.push([i, j - 1]);
					}
					//Right
					if (this.testPlace(grid, i, j + 1)) {
						potentialPlaces.push([i, j + 1]);
					}
				}
			}
		}
		return potentialPlaces;
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
		// Try and place the hole in the grid.
		for (let i = 0; i < this.grid.length; i++) {
			for(let j = 0; j < this.grid[i].length; j++) {
				let cell = board[this.y + i][this.x + j];
				if (this.grid[i][j] == 1) {
					let hole = {
						x: cell.x,
						y: cell.y,
						solid: true,
						color: "rgba(54, 69, 79, 0.8)",
						border: "black",
						type: "hole"
					};
					cell.contains.push(hole);
				}
			}
		}
	}

	checkState(board, combo) {
		let filled = 0;
		let overfill = 0;
		let overflow = 0;
		// We are looping through the grid spaces on the game board and checking if they are full



		for (let i = this.y; i < this.y + this.holeSize; i++) {
			for (let j = this.x; j < this.x + this.holeSize; j++) {

				let fill = 0;
				let off   = 0;
				let ovf  = 0;


				let cell = board[i][j];
				let contents = cell.contains;
				if(contents.length && contents[0].type == "hole"){
					for(let c = 1; c < contents.length; c++){
						let item = contents[c];
						if(item.type == "shape"){
							if(fill == 0){
								fill++;
							} else {
								off++;
							}
						}
					}
				} else if(contents.length){
					for(let c = 0; c < contents.length; c++){
						let item = contents[c];
						if(item.type == "shape"){
							ovf++;
						}
					}
				}
				filled   += fill;
				overfill += off;
				overflow += ovf;
			}	
		}
		//console.log("F: ", filled, " OV: ", overfill, " OF: ", overflow);
		


		this.filled = filled;
		this.overfill = overfill + overflow;

		if (this.sTime == null && this.filled > 0) {
			this.sTime = performance.now();
		}
		
		if (this.nBlocks == filled) {
			this.score = this.calcScore(overfill, combo);
			return true;
		}
		return false;
	}


	calcScore(overfill, combo) {
		let time = performance.now();
		let totalTime = (time - this.sTime)/1000;
		let timeScore = totalTime * 0.3;

		let comboBonus = 20 * combo;
		let baseScore = this.nBlocks * this.difficulty;
		let penalty   = this.overfill * this.difficulty;

		let totalScore = baseScore - penalty - timeScore + comboBonus;
		console.log("Filled hole in: ", totalTime, " Score: ", totalScore);
		console.log("Base: ", baseScore, " Penalty: ", penalty, " TimeS: ", timeScore);
		return totalScore;
	}

	regenerate(board) {
		this.removeShapes(board);
		this.grid = null;
		this.nShapes = 0;
		this.nBlocks = 0;
		this.overfill = 0;
		this.blocks = [];
		this.score = null;
		this.startTime = null;
		this.endTime = null;

		this.generateHole();
	}

	removeShapes(board) {
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				//Get the blocks from the board. 
				let block = this.grid[i][j];
				if (block) {
					let cell = board[this.y + i][this.x + j];
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