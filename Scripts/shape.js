class Shape {

	constructor(x, y, game) {
		this.game = game;
		this.tileSize = game.tileSize;
		this.x = x;
		this.y = y;

		this.orientation = 0;
		this.dragging = false;
		this.pattern = this.pickPattern();
		this.blocks;
		this.delete = false;
		
		this.makeBlocks();
	}

	checkBounds() {
		//We should check that we can drop the shape. 
		let bx = (this.x + this.pattern[0].length * this.game.tileSize) / this.game.tileSize;
		let by = (this.y + this.pattern.length * this.game.tileSize) / this.game.tileSize;
		if (this.x < 0) {
			//bx is negative. 
			this.x = 0;
			this.makeBlocks();

		}
		if ((this.x + this.pattern[0].length * this.game.tileSize) > this.game.canvas.width) {
			let blockd = bx - this.game.boardSize;
			this.x -= blockd * this.game.tileSize;
			this.makeBlocks();
		}
		if (this.y < 0) {
			this.y = 0;
			this.makeBlocks();
		}
		if (this.y + this.pattern.length * this.game.tileSize > this.game.canvas.height) {
			let blockd = by - this.game.boardSize;
			this.y -= blockd * this.game.tileSize;
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

	draw() {

		let board = this.game.board;
		for (let row = 0, r = board.length; row < r; row++) {
			for (let col = 0, c = board[row].length; col < c; col++) {

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

	drag(mx, my) {
		//Get nearest gridpoint to the mouse
		console.log("Mouse Drag");
		let tileSize = this.game.tileSize;
		
		this.gridx = Math.floor(mx / tileSize) * tileSize;
		this.gridy = Math.floor(my / tileSize) * tileSize;
		
		console.log("Closese grid: ", this.gridx, this.gridy);
		this.game.drawRect(this.gridx, this.gridy, this.game.tileSize, "black");
		this.draw_on_mouse();
	}

	draw_on_mouse() {
		//Draw the middle of the shape on the mouse. 
		let width = this.getWidth() + 1;
		let height = this.getHeight() + 1;
		console.log("Width ", width, " Height ", height);
		//Middle of shape has to be 
		let mrow = Math.floor(width / 2) * this.game.tileSize;
		let mcol = Math.floor(height / 2) * this.game.tileSize;

		this.x = (this.gridx - mrow);
		this.y = (this.gridy - mcol);
		// tx/ty is the position the shape has to be in for the dragged block to be in midx/midy.
		this.makeBlocks();
		for(let i in this.blocks){
			let b = this.blocks[i];
			console.log("Drawing at: ", b.x, b.y, b.color);
			this.game.drawRect(b.x, b.y, this.game.tileSize, b.color);
		}
	}

	scroll(dir) {
		this.orientation = (this.orientation += 1) % 4;
		this.makeBlocks();
	}

	rotateSquare() {
		//Rotate a square array 90 degrees clockwise
		let a = this.blocks;
		var n = a.length;
		for (var i = 0; i < n / 2; i++) {
			for (var j = i; j < n - i - 1; j++) {
				var tmp = a[i][j];
				a[i][j] = a[n - j - 1][i];
				a[n - j - 1][i] = a[n - i - 1][n - j - 1];
				a[n - i - 1][n - j - 1] = a[j][n - i - 1];
				a[j][n - i - 1] = tmp;
			}
		}
		this.draw_on_mouse();
	}

	rotateCounter() {
		let a = this.blocks;
		var n = a.length;
		for (var i = 0; i < n / 2; i++) {
			for (var j = i; j < n - i - 1; j++) {
				var tmp = a[i][j];
				a[i][j] = a[j][n - i - 1];
				a[j][n - i - 1] = a[n - i - 1][n - j - 1];
				a[n - i - 1][n - j - 1] = a[n - j - 1][i];
				a[n - j - 1][i] = tmp;
			}
		}
		return a;
	}

}
