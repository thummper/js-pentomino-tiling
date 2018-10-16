function Holder(canvas, ctx, game) {
	//Max pattern size is 5 x 5, the bottom 5 grid spaces are reserved for spawning pieces.
	//When holder is made, the board is already defined.
	this.game = game;
	this.tileSize = game.tileSize;
	this.canvas = canvas;
	this.ctx = ctx
	this.padding = 1;
	this.padSpaces;
	this.y = canvas.height - ((5 + this.padding) * this.tileSize);
	this.hasPiece = true;
	this.width = this.height = 5; //5 tiles.
	//Hold all spaces in an array (like shape blocks)
	this.spaces = [];

}
Holder.prototype.checkSpaces = function () {
	let board = this.game.board;
	//Check each space and see if it's empty
	for(let i = 0, j = this.spaces.length; i < j; i++){
		let space = this.spaces[i];
		space.piece = false;
		
		
		let holdercol = Math.round(space.x / this.tileSize);
		let holderrow = Math.round(space.y / this.tileSize);
		
		for (let row = holderrow; row < holderrow + this.height; row++){
			let boardRow = board[row];
			
			for(let col = holdercol; col < holdercol + this.width; col++){
				let boardCell = boardRow[col];
				if(boardCell.contains.length > 0){
					
					for(let cell = 0; cell < boardCell.contains.length; cell++){
						let bc = boardCell.contains[cell];
						if(bc.type == 'shape_solid'){
							space.piece = true;
						}
						
					}
				}
			}
			
			
		}
		if(space.piece == false){
			console.log("Holder: ", i, " is free");
		}
	}
}

Holder.prototype.trySpawn = function () {
	//Will attempt to spawn a new shape. 
	for (let i in this.spaces) {
		let space = this.spaces[i];
		if (space.piece == false) {
			space.piece = true;
			let shape = new Shape(space.x, space.y, this.game);
			this.game.shapes.push(shape);
		}
	}
}

Holder.prototype.makeSpaces = function () {
	//Set up the shape spaces.
	let numSpaces = 4;
	let holeblocks = 4 * this.width;
	let left = this.game.boardSize - holeblocks - 2;
	let padding = Math.floor(left / (numSpaces - 1));
	
	let spaces = Math.floor((this.game.boardSize - this.padding) / this.width);
	this.padSpaces = (this.game.boardSize - this.padding) % 5;
	
	let x = 1;
	
	for (let i = 0; i < numSpaces; i++) {
		
		if(i != 0){
			x += padding;
		}
		this.spaces.push({
			//What the fuck does this even mean
			x: ( x + (i * 5) ) * this.tileSize,
			y: this.y,
			w: this.width,
			h: this.height,
			piece: false,
			bg: "rgba(255, 165, 0, 0.2)"
		});
	}
	
};

Holder.prototype.drawSpace = function () {
	//Loops through spaces array and draws on the board.
	for(let i in this.spaces){
		let space = this.spaces[i];
		
		this.game.drawRect(space.x, space.y, (space.w * this.tileSize), space.bg);
	}
}