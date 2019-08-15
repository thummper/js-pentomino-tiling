class Holder {
	constructor(canvas, ctx, tileSize, holes, boardWidth, boardHeight) {

		this.tileSize = tileSize;
		this.nHoles = holes;
		this.canvas = canvas;
		this.ctx = ctx;

		this.boardHeight = boardHeight;
		this.boardWidth = boardWidth;
		//Minus width and 1 for padding
		this.y = (boardHeight - 6);
		this.width = 5;
		this.height = 5;
		this.padding = 2; //2 block padding on left side.


		this.spaces = [];
		this.piece = true;
	}

	makeSpaces() {
		this.spaces = [];
		let nHoles = this.nHoles;
		let x = this.padding;
		for (let i = 0; i < nHoles; i++) {
		
			this.spaces.push({
				x: x,
				y: this.y,
				w: this.width,
				h: this.height,
				piece: false,
				bg: "rgba(255, 165, 0, 0.2)"
			});
			x += this.width + this.padding;
		}


	}

	drawSpaces() {
		// Space x/y is in blocks, not actual pixels 
		for (let i = 0; i < this.spaces.length; i++) {
			let space = this.spaces[i];
			this.ctx.beginPath();
			this.ctx.fillStyle = space.bg;
			this.ctx.rect((space.x * this.tileSize), (space.y * this.tileSize), (space.w * this.tileSize), (space.w * this.tileSize));
			this.ctx.fill();
			this.ctx.closePath();
		}
	}


	empty() {
		for (let space of this.spaces) {
			if (space.piece !== false) {
				space.piece.delete = true;
			}
		}
	}

	checkSpaces(board) { 
		let spaces = this.spaces;
		for(let i = 0; i < spaces.length; i++){
			let space = spaces[i];
			space.piece = false;
			let x = space.x;
			let y = space.y;
			for(let r = y; r < y + this.height; r++){
				for(let c = x; c < x + this.width; c++){
					let cell = board[r][c];
					for(let item = 0; item < cell.contains.length; item++){
						let cellItem = cell.contains[item];
						if(cellItem.type == "shape"){
							space.piece = cellItem.shape;
						}
					}
				}
			}
		}
	}

	trySpawn() {
		let newShapes = [];
		for (let i = 0, j = this.spaces.length; i < j; i++) {
			let space = this.spaces[i];
			if (space.piece == false) {
				let shape = new Shape(space.x, space.y, this.tileSize, this.canvas);
				space.piece = shape;
				// Work out where to place
				let shapeW = shape.getWidth();
				let shapeH = shape.getHeight();
				let wPadding = Math.floor((this.width  - shapeW) / 2);
				let hPadding = Math.floor((this.height - shapeH) / 2);
				shape.x += wPadding;
				shape.y += hPadding;
				shape.makeBlocks();
				newShapes.push(shape);
			}
		}
		return newShapes;
	}


}