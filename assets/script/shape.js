class Shape {

	constructor(x, y, tileSize, canvas) {

		// Note that the x shape is passed is in cell form (i.e x cells from the left, not in pixels)
		this.tileSize = tileSize;
		this.canvas = canvas;
		this.x = x;
		this.y = y;

		this.orientation = 0;
		this.dragging = false;
		this.pattern = this.pickPattern();
		this.flipped = 0;
		this.blocks;
		this.delete = false;
		
		this.makeBlocks();
	}

	checkBounds(boardWidth, boardHeight) {
		// Bound the shape to the game grid.
		this.dragging = false;

		let shapeWidth  =  this.getWidth();
		let shapeHeight = this.getHeight(); 


		if(this.x < 0){
			this.x = 0;
		}
		if(this.x + shapeWidth >= boardWidth){
			console.log("Shape over x");
			this.x = boardWidth - shapeWidth - 1;
		}
		if(this.y < 0){
			this.y = 0;
		}
		if(this.y + shapeHeight >= boardHeight){
			this.y = boardHeight - shapeHeight - 1;
		}
		this.makeBlocks();

	}


	makeBlocks() {
		this.blocks = [];
		//Blocks for new patterns
	

		let patternBlocks;
		if(this.flipped){
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
				shape: this,
				type: 'shape'
			}
			this.blocks.push(blk);
		}

	}

	mirror() {
		if(this.flipped){
			this.flipped = 0;
		} else {
			this.flipped = 1;
		}
		
	}

	pickPattern() {
		let random = Math.random() * 100;
		let counter = 0;
		for(let i = 0; i < pieces.length; i++){
			let piece = pieces[i];
			counter += piece[2];
			if(random <= counter){
				this.color = piece[1];
				return piece[0];
			}
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
	}


	//Returns width of shape in blocks.
	getWidth() {
		let max = 0;
		for (let i = 0, j = this.blocks.length; i < j; i++) {
			let col = this.blocks[i].col;
			if (col >= max) {
				max = col;
			}
		}
		return max;
	}

	//Returns height of shape in blocks
	getHeight() {
		let max = 0;
		for (let i = 0, j = this.blocks.length; i < j; i++) {
			let row = this.blocks[i].row;
			if (row >= max) {
				max = row;
			}
		}
		return max;
	}

	drag(mx, my, ctx) {
		// Drag the shape to nearest gridpoint and draw.


		//Get nearest gridpoint to the mouse
		let tileSize = this.tileSize;
		this.gridx = Math.floor(mx / tileSize);
		this.gridy = Math.floor(my / tileSize);

		drawCell(ctx, this.gridx * tileSize, this.gridy * tileSize, tileSize, "black");
		this.drawOnMouse(ctx);
	}


	drawOnMouse(ctx) {
		//Draw the middle of the shape on the mouse. 
		let width = this.getWidth() + 1;
		let height = this.getHeight() + 1;
		//Middle of shape has to be 
		let mCol = Math.floor(width / 2) ;
		let mRow = Math.floor(height / 2);
		this.x = this.gridx - mCol;
		this.y = this.gridy - mRow;
		// tx/ty is the position the shape has to be in for the dragged block to be in midx/midy.
		this.makeBlocks();
		for(let i = 0; i < this.blocks.length; i++){
			let blk = this.blocks[i];
			drawCell(ctx, blk.x, blk.y, this.tileSize, blk.color);
			
		}
	}

	scroll(dir) {
		
		this.orientation = (this.orientation += 1) % this.pattern.normal.length;
		this.makeBlocks();
	}



}
