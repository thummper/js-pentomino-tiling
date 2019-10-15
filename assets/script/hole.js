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
		this.bEdges = [];
		this.shapes = []; 
		// We need to store the shapes that have been added to this hole and the order they were added.


		this.nShapes = 0;
		this.nBlocks = 0;
		this.filled = 0;

		this.baseDelay = 6;
		this.delay = 6;

	}

	checkBounds(shape){
		if((shape.x >= this.x && shape.x < this.x + this.holeSize) && (shape.y >= this.y && shape.y < this.y + this.holeSize)){
			return this;
		} else {
			return false;
		}
	}

	placed(shape){
		this.makeBlocks();
		this.getEdgeHoles();
		// TODO: Delay
		if(shape == null){
			// Increment Decay
			this.delay--;
		} else {
			this.shapes.push(shape);
			this.delay = this.baseDelay;
		}
		if(this.delay <= 0){
			if(this.shapes.length == 0){
				this.ruinHole();
			} else {
				this.removeLast();
			}
			this.delay = this.baseDelay;
		}
	}

	ruinHole(){

		console.log("Hole is being expanded.");
		let potentialExpand = this.getExpandableEdges();
		let randomBlock = randomIndex(potentialExpand);
		let blockArr    = potentialExpand[randomBlock];
		let block = blockArr[0];
		let edges = blockArr[1];
		let randomEdge = edges[randomIndex(edges)];
		let indexes = {
			"up": [block.row - 1, block.col],
			"down": [block.row + 1, block.col],
			"left": [block.row, block.col - 1],
			"right": [block.row, block.col + 1]
		};
		let ind = indexes[randomEdge];
		this.grid[ind[0]][ind[1]] = 1;
		this.nBlocks++;
	}

	removeLast(){
		console.log("Shape should be deleted");
		this.shapes[this.shapes.length - 1].delete = true;
		this.shapes.pop();
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
						let width  = this.getWidth(shapePattern )
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
		this.makeBlocks();
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
				grid[row + blockRow][col + blockCol] = 1;
				this.nBlocks++;
			}
		}
		return true;
	}

	testPlace(grid, row, col = null) {
		// Checks indexes are ok
		if(col == null){
			if (row < 0) {
				return false;
			}
			if (typeof grid[row] === 'undefined') {
				return false;
			}
			if (typeof grid[row] !== 'undefined') {
				return true;
			}
		}
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

	
	testEdge(grid, row, col){
		// In this case undefined should also return true. 
		if (row < 0 || col < 0) {
			return 1;
		}
		if (typeof grid[row] === 'undefined') {
			return 1;
		}
		if (typeof grid[row][col] === 'undefined') {
			return 1;
		}
		if (grid[row][col] == 0) {
			return 2;
		}
		if(grid[row][col] == 1){
			return 0;
		}
	}

	getExpandableEdges(){
		let blocks = this.blocks;
		let bEdges  = [];
			for(let i = 0; i < blocks.length; i++){
				let block = blocks[i];
				let edges = [];
				//Test each side. 
				let row = block.row;
				let col = block.col;
				let inds = [ [row - 1, col, "up"], [row + 1, col, "down"], [row, col - 1, "left"], [row, col + 1, "right"] ];
				for(let j = 0; j < inds.length; j++){
					let ind = inds[j];
					let r = ind[0];
					let c = ind[1];
					let dir = ind[2];
					// Confused.. We check if the index exists, we don't check the value. If the index doesn't exist then it is an edge piece. 
					let tested = this.testEdge(this.grid, r, c);
					/* 
					0 - Not edge. 
					1 - Edge, but not expandable here
					2 - Edge, can expand here
					*/
					if(tested == 2){
						edges.push(dir);
					}
				}
				if(edges.length > 0){
					bEdges.push([block, edges]);
				}
			}
		
		return bEdges;

	}

	getEdgeHoles(){
		// Get the blocks and edges that have nothing next to them.
		let blocks = this.blocks;
		let bEdges  = [];

		for(let i = 0; i < blocks.length; i++){
			let block = blocks[i];
			let row = block.row;
			let col = block.col;
			bEdges[row + ' ' + col] = [];
		}


		for(let i = 0; i < blocks.length; i++){
			let block = blocks[i];
			let edges = [];
			//Test each side. 
			let row = block.row;
			let col = block.col;
			let inds = [ [row - 1, col, "up"], [row + 1, col, "down"], [row, col - 1, "left"], [row, col + 1, "right"] ];
			for(let j = 0; j < inds.length; j++){
				let ind = inds[j];
				let r = ind[0];
				let c = ind[1];
				let dir = ind[2];
				// Confused.. We check if the index exists, we don't check the value. If the index doesn't exist then it is an edge piece. 
				let tested = this.testEdge(this.grid, r, c);
				/* 
				0 - Not edge. 
				1 - Edge, but not expandable here
				2 - Edge, can expand here
				*/
				if(tested == 1 || tested == 2){
					edges.push(dir);
				}
			}
			if(edges.length > 0){
				bEdges[row + ' ' + col] = edges;
			}
		}
		this.bEdges = bEdges;
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
		let shape = pickShape();
		return shape[0].normal;
	}

	draw(board) {
		// Try and place the hole in the grid.
		for (let i = 0; i < this.grid.length; i++) {
			for(let j = 0; j < this.grid[i].length; j++) {
				// Check for edges maybe? 

				let testInd = i + ' ' + j; // "row col"
				let edges   = this.bEdges[testInd];
				let cell = board[this.y + i][this.x + j];
				if (this.grid[i][j] == 1) {
					let opacity = 1;
					if(this.delay == 3){
						opacity = 0.33;
					}
					if(this.delay == 2){
						opacity = 0.66;
					}
					let drawEdges = false;
					if(this.delay <= 3){
						drawEdges = true;
					}


					let hole = {
						x: cell.x,
						y: cell.y,
						solid: true,
						color: "rgba(54, 69, 79, 0.8)",
						border: "black",
						type: "hole",
						hole: this, // Not sure if this is turbo bad or not
						edges: [],
						drawEdges: drawEdges,
						edgeOpacity: opacity,
					};
					if(edges){
						hole.edges = edges;
					}
					
					cell.contains.push(hole);
				}
			}
		}
	}

	checkState(board, combo) {
		//TODO, this is somehow broken
		let filled = 0;
		let overfill = 0;
		let overflow = 0;
		// We are looping through the grid spaces on the game board and checking if they are full
		for (let i = this.y; i < this.y + this.holeSize; i++) {
			for (let j = this.x; j < this.x + this.holeSize; j++) {
				let fill = 0;
				let off  = 0;
				let ovf  = 0;
				let cell = board[i][j];
				// Cell is undefined error here, looks like y / x + hole size is somehow overflowing the board 
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
		console.log("Hole Filled");
		console.log("Base Score: ", baseScore);
		console.log("Combo Bonus: ", comboBonus);
		console.log("Overfill: ", this.overfill);
		console.log("Penalty: ", penalty);
		console.log("Time: ", totalTime);
		console.log("Time Score: ", timeScore);
		console.log("Total Score: ", totalScore);
		console.log("---------------------------");
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
		this.sTime = null;
		this.eTime = null;

		this.generateHole();
		
	}


	makeBlocks(){
		this.blocks = [];
		for(let i = 0; i < this.grid.length; i++){
			for(let j = 0; j < this.grid[i].length; j++){
				let cell = this.grid[i][j];
				if(cell == 1){
					let row = i;
					let col = j;
					let block = {
						row: row,
						col: col,
					}
					this.blocks.push(block);
				}
			}
		}
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