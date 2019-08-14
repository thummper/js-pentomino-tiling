class Shape {

	constructor(x, y, tileSize, canvas) {

		// Note that the x shape is passed is in cell form (i.e x cells from the left, not in pixels)
		console.log("New Shape. X: ", x, " Y: ", y);
		this.tileSize = tileSize;
		this.canvas = canvas;
		this.x = x * tileSize;
		this.y = y;

		this.orientation = 0;
		this.dragging = false;
		this.pattern = this.pickPattern();
		this.blocks;
		this.delete = false;
		
		this.makeBlocks();
	}

	checkBounds(boardSize) {
		this.dragging = false;
		//We should check that we can drop the shape. 
		let bx = (this.x + this.pattern[0].length * this.tileSize) / this.tileSize;
		let by = (this.y + this.pattern.length * this.tileSize) / this.tileSize;
		if (this.x < 0) {
			//bx is negative. 
			this.x = 0;
			this.makeBlocks();

		}
		if ((this.x + this.pattern[0].length * this.tileSize) > this.canvas.width) {
			let blockd = bx - boardSize;
			this.x -= blockd * this.tileSize;
			this.makeBlocks();
		}
		if (this.y < 0) {
			this.y = 0;
			this.makeBlocks();
		}
		if (this.y + this.pattern.length * this.tileSize > this.canvas.height) {
			let blockd = by - boardSize;
			this.y -= blockd * this.tileSize;
			this.makeBlocks();
		}
	}


	makeBlocks() {
		this.blocks = [];
		//Blocks for new patterns
		let patternBlocks = this.pattern[this.orientation];
		for (let i = 0, j = patternBlocks.length; i < j; i++) {
			let block = patternBlocks[i];
			let row = block[0];
			let col = block[1];
			let blk = {
				x: this.x + (col * this.tileSize),
				y: this.y + (row * this.tileSize),
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
		this.orientation = (this.orientation + 2) % 4;
	}

	pickPattern() {
		let probs = [13, 13, 12, 11, 10, 10, 6, 6, 6];
		let shape = null;
		//Number between 1 and 100
		let number = Math.floor(Math.random() * 80);
		let total = 0;
		for (let i in probs) {
			total += probs[i];
			if (number <= total) {
				shape = pieces[i][0];
				this.color = pieces[i][1];
				break;
			}
		}
		return shape;
	}

	draw(board, bW, bH) {
		
		for (let row = 0, r = bH; row < r; row++) {
			for (let col = 0, c = bW; col < c; col++) {

				let cell = board[row][col];
				if (cell.x == this.x && cell.y == this.y) {

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
		
		this.gridx = Math.floor(mx / tileSize) * tileSize;
		this.gridy = Math.floor(my / tileSize) * tileSize;
		// BAD 


		drawCell(ctx, this.gridx, this.gridy, tileSize, "black");
		this.draw_on_mouse(ctx);
	}


	draw_on_mouse(ctx) {
		//Draw the middle of the shape on the mouse. 
		let width = this.getWidth() + 1;
		let height = this.getHeight() + 1;
		//Middle of shape has to be 
		let mrow = Math.floor(width / 2) * this.tileSize;
		let mcol = Math.floor(height / 2) * this.tileSize;

		this.x = (this.gridx - mrow);
		this.y = (this.gridy - mcol);
		// tx/ty is the position the shape has to be in for the dragged block to be in midx/midy.
		this.makeBlocks();
		for(let i in this.blocks){
			let b = this.blocks[i];
			drawCell(ctx, b.x, b.y, this.tileSize, b.color);
			
		}
	}

	scroll(dir) {
		this.orientation = (this.orientation += 1) % 4;
		this.makeBlocks();
	}



}
