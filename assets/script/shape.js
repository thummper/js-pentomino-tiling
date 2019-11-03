class Shape {

	constructor(x, y, tileSize, canvas) {

		// Note that the x shape is passed is in cell form (i.e x cells from the left, not in pixels)
		this.tileSize = tileSize;
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.shake = null;


		this.orientation = 0;
		this.dragging = false;
		this.delete = false;
		this.canPlace = true;
		this.placeIncrement = false;
		this.flipped = 0;
		this.width = 0;
		this.height = 0;
		this.blocks = [];
		this.getShape();
		this.makeBlocks();
		this.getSize();

	}

	getShape(){
		this.shape = pickShape();
		this.pattern = this.shape[0];
		this.color = this.shape[1];
		this.hoverColor = this.color;

	}

	checkPlace(board, holder) {
		// In order to place a shape, at least one block belonging to it has to be in a hole cell or a holder cell.
		let holeCounter = 0;
		let holderCounter = 0;
		// Given that we can only place a shape in one hole at a time.
		for (let i = 0; i < this.blocks.length; i++) {
			let block = this.blocks[i];
			let row = block.x / this.tileSize;
			let col = block.y / this.tileSize;
			let cell = board[col][row];
			if (cell.contains.length && cell.contains[0].type == "hole") {
				holeCounter++;
			}
		}

		if (holeCounter == 0 && holderCounter == 0) {
			this.color = "red";
			this.canPlace = false;
		} else {
			this.color = this.shape[1];
			this.canPlace = true;
			this.placeIncrement = true;
		}

		if(this.inHolder(holder)){
			this.placeIncrement = false;
			this.color = this.shape[1];
			this.canPlace = true;
		}


	}

	inHolder(holder){

		let spaces = holder.spaces;
		for(let i = 0; i < spaces.length; i++){
			let space = spaces[i];
			if(this.x >= space.x && this.x <= space.x + space.w && this.y >= space.y  && this.y <= space.y + space.h){
				return true;
			}
		}
		return false;
	}

	checkBounds(boardWidth, boardHeight) {
		// Bind the shape within the game grid.
		this.dragging = false;

		let shapeWidth = this.width;
		let shapeHeight = this.height;

		if (this.x < 0) {
			this.x = 0;
		}
		if (this.x + shapeWidth >= boardWidth) {
			this.x = boardWidth - shapeWidth - 1;
		}
		if (this.y < 0) {
			this.y = 0;
		}
		if (this.y + shapeHeight >= boardHeight) {
			this.y = boardHeight - shapeHeight - 1;
		}
		this.makeBlocks();
	}


	makeBlocks() {
		this.blocks = [];
		//Blocks for new patterns
		let patternBlocks;
		if (this.flipped) {
			patternBlocks = this.pattern.flipped[this.orientation];
		} else {
			patternBlocks = this.pattern.normal[this.orientation];
		}


		for (let i = 0, j = patternBlocks.length; i < j; i++) {
			let block = patternBlocks[i];
			let row = block[0];
			let col = block[1];
			let blk = {
				x: (this.x + col) * this.tileSize,
				y: (this.y + row) * this.tileSize,
				row: row,
				col: col,
				dragging: false,
				color: this.color,
				shape: this, // Not sure if this is ok.
				type: 'shape'
			}
			this.blocks.push(blk);
		}

	}

	mirror() {
		if (this.flipped) {
			this.flipped = 0;
		} else {
			this.flipped = 1;
		}

	}



	draw(board, bW, bH) {
		// Shape needs to be bound inside the grid.  

		for (let row = 0, r = bH; row < r; row++) {
			for (let col = 0, c = bW; col < c; col++) {


				if (col == this.x && row == this.y) {
					//Draw shape on to grid, starting here.
					for (let i = 0, j = this.blocks.length; i < j; i++) {
						let block = this.blocks[i];
						let rw = block.row;
						let cl = block.col;
						board[row + rw][col + cl].contains.push(block);
					}
				}
			}
		}

		// help, we draw the shape into the grid using it's x and y and display it that way.
		// To apply an animation we'll need to draw them independant of the grid
		// So grid needs to be in background and handle game logic
		// Then we need to draw everything based on its own x/y??? 

	}


	getPattern(){
		let patternBlocks;
		if (this.flipped) {
			patternBlocks = this.pattern.flipped[this.orientation];
		} else {
			patternBlocks = this.pattern.normal[this.orientation];
		}
		return patternBlocks;
	}

	//Returns width of shape in blocks.
	getSize() {
		let pattern = this.getPattern();
		let highestRow = 0;
		let highestCol = 0;
		for(let block of pattern){
			let row = block[0] + 1;
			let col = block[1] + 1;

			if(row >= highestRow){
				highestRow = row;
			}
			if(col >= highestCol){
				highestCol = col;
			}

		}
		this.width = highestCol;
		this.height = highestRow;
	}



	drag(mx, my, ctx) {
		// Drag the shape to nearest gridpoint and draw.
		//Get nearest gridpoint to the mouse
		let tileSize = this.tileSize;
		this.gridx = Math.floor(mx / tileSize);
		this.gridy = Math.floor(my / tileSize);

		//drawCell(ctx, this.gridx * tileSize, this.gridy * tileSize, tileSize, "black");
		this.drawOnMouse(ctx);
	}


	drawOnMouse(ctx) {
		//Draw the middle of the shape on the mouse. 
		let width = this.width;
		let height = this.height;
		//Middle of shape has to be 
		let mCol = Math.floor(width / 2);
		let mRow = Math.floor(height / 2);
		this.x = this.gridx - mCol;
		this.y = this.gridy - mRow;
		// tx/ty is the position the shape has to be in for the dragged block to be in midx/midy.
		this.makeBlocks();
		for (let i = 0; i < this.blocks.length; i++) {
			let blk = this.blocks[i];
			drawCell(ctx, blk.x, blk.y, this.tileSize, blk.color);

		}
	}

	scroll(dir) {
		let pattern = this.pattern.normal;
		if(dir){
			if(this.orientation == 0){
				this.orientation = pattern.length;
			}
			this.orientation = (this.orientation -= 1) % pattern.length;
		} else {
			this.orientation = (this.orientation += 1) % pattern.length;
		}
		this.makeBlocks();
		this.getSize();
	}



}