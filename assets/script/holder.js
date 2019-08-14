class Holder {
	constructor(canvas, ctx, tileSize, holes, boardWidth, boardHeight) {
	
		this.tileSize = tileSize;
		this.nHoles = holes;
		this.canvas = canvas;
		this.ctx = ctx;

		this.boardHeight = boardHeight;
		this.boardWidth = boardWidth;
		//Minus width and 1 for padding
		this.y = (boardHeight - 6) * this.tileSize;
		this.width = 5;
		this.height = 5;
		this.padding = 2; //2 block padding on left side.


		this.spaces = [];
		this.piece = true;
	}

	makeSpaces() {
		let nHoles = this.nHoles;
		let x = this.padding;
		for(let i = 0; i < nHoles; i++){
			console.log("X: ", x);
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
		for (let i = 0, j = this.spaces.length; i < j; i++) {
			let space = this.spaces[i];
			this.ctx.save();
			this.ctx.fillStyle = space.bg;
			this.ctx.rect((space.x * this.tileSize), space.y, (space.w * this.tileSize), (space.w * this.tileSize));
			this.ctx.fill();
			this.ctx.restore();
		}
	}


	empty(){
		for(let space of this.spaces){
			if(space.piece !== false){
				space.piece.delete = true;
			}
		}
	}

	checkSpaces(board) {

		for(let space of this.spaces){
		
			console.log("SPACE: ", space);
			if(space.piece !== false){
				space.piece = false;
				console.log("Y: ", space.y);

				let y = Math.floor(space.y / this.tileSize);
				let x = Math.floor(space.x / this.tileSize);

				for(let row = y; row < y + this.height; row++){
					for(let col = x; col < x + this.width; col++){
						let cell = board[row][col];
						for(let item of cell.contains){
							if(item.type == "shape"){
								space.piece = item.shape;
								break;
							}
						}
					}
				}
			}
			console.log("SPACE CONTAINS: ", space.piece);
			
		}
	}

	trySpawn() {
		let newShapes = [];
		for (let i = 0, j = this.spaces.length; i < j; i++) {
			let space = this.spaces[i];
			if (space.piece == false) {
				let shape = new Shape(space.x, space.y, this.tileSize, this.canvas);
				space.piece = shape;
				newShapes.push(shape);
			}
		}
		return newShapes;
	}


}
