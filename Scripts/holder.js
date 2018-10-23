class Holder {
	constructor(canvas, ctx, game) {
		this.game = game;
		this.canvas = canvas;
		this.ctx = ctx;
		this.tileSize = game.tileSize;

		this.padding = 1;
		this.y = canvas.height - ((5 + this.padding) * this.tileSize);
		this.piece = true;
		this.width = this.height = 5;
		this.spaces = [];
	}

	makeSpaces() {
		let max_spaces = 4;
		let fit_spaces = Math.floor(this.game.boardSize / this.width);
		if (fit_spaces < 4) {
			//Can't fit 4 spaces
		} else {
			//Just draw 4 spaces
			let blocks_total = 4 * this.width;
			let blocks_left = this.game.boardSize - 1 - blocks_total;
			console.log
			let padding = Math.floor(blocks_left / 4);
			console.log("Padding, ", padding);

			let x = 1;
			for (let i = 0; i < 4; i++) {
				
					x += padding;
				
				this.spaces.push({
					x: x * this.tileSize,
					y: this.y,
					w: this.width,
					h: this.height,
					piece: false,
					bg: "rgba(255, 165, 0, 0.2)"
				});
				x += this.width;
			}
		}
	}

	drawSpaces() {

		for (let i = 0, j = this.spaces.length; i < j; i++) {
			let space = this.spaces[i];
			this.game.drawRect(space.x - this.tileSize, space.y, (space.w * this.tileSize), space.bg);
		}

	}

	checkSpaces() {

		let board = this.game.board;
		for (let i = 0, j = this.spaces.length; i < j; i++) {
			let space = this.spaces[i];
			space.piece = false;

			let col = Math.round(space.x / this.tileSize);
			let row = Math.round(space.y / this.tileSize);

			for (let r = row; r < row + space.width; r++) {
				let boardRow = board[row];
				for (let c = col; c < col + space.width; c++) {
					let cell = boardRow[c];
					if (cell.contains.length > 0) {
						let contents = cell.contains;
						for (let c = 0; c < contents.length; c++) {
							if (contents[c].type == 'shape') {
								space.piece = true;
								break;
							}
						}
					}
				}
			}
		}
	}

	trySpawn() {
		for (let i = 0, j = this.spaces.length; i < j; i++) {
			let space = this.spaces[i];
			if (!space.piece) {
				space.piece = true;
				let shape = new Shape(space.x, space.y, this.game);
				this.game.shapes.push(shape);
			}
		}
	}


}
