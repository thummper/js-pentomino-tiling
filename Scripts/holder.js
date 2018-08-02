var Holder = function () {
	//Max pattern size is 5 x 5, the bottom 5 grid spaces are reserved for spawning pieces.
	//When holder is made, the board is already defined.
	this.padding = 1;
	this.padSpaces;
	this.y = canvas.height - ((5 + this.padding) * tileSize);
	this.hasPiece = true;
	this.width = this.height = 5; //5 tiles.
	//Hold all spaces in an array (like shape blocks)
	this.spaces = [];

}
Holder.prototype.checkSpaces = function(){
	console.log("check spaces");
	//Checks each space to see if it is empty. 
	for(let k in this.spaces){
		
		let space = this.spaces[k];
		//Do a similar thing to the shape draw function - check if the grid is empty based on x,y,w,h.
		console.log("SPACE %i/%i", space.x, space.y);
		
		
		for(let row in board){
			
			for(let col in board[row]){
				
				let cell = board[row][col];
				
				if(cell.x == space.x && cell.y == space.y){
					console.log("CELL MATCH: %i/%i", cell.x, cell.y);
					//Found the cell 
					let free = true;
					
					for(let i = 0; i < this.height; i++){
						for(let j = 0; j < this.width; j++){
							if(board[parseInt(row) + i][parseInt(col) + j].contains){
								free = false;
							}
						}
					}
					if(free){
						space.piece = false;
						console.log("Space %i is free", parseInt(k));
					} else {
						console.log("Space %i is not free", parseInt(k));	
					}
				}
			}
		}
		
	}
	
}
Holder.prototype.trySpawn = function(){
	//Will attempt to spawn a new shape. 
	for(let i in this.spaces){
		let space = this.spaces[i];
		if(space.piece == false){
			space.piece = true;
			shapes.push(new Shape(randomcol(), space.x, space.y));
		}
	}
	
}
Holder.prototype.makeSpaces = function(){
	//Set up the shape spaces.
	let spaces = Math.floor((width - this.padding) / this.width);
	this.padSpaces = (width - this.padding) % 5;
	console.log("SPACES AVAILAIBLE: " + spaces + " PADDING: " + this.padSpaces );
	//Ignore padding for now as width/height is static.
	for(let i = 0; i < spaces; i++){
		let extra = 0;
		if(this.padSpaces > 0){
			extra = 1
			this.padSpaces--;
		}
		this.spaces.push({
			
			x: 			(this.padding * tileSize) + (i * (5 + extra) * tileSize),
			y: 			this.y,
			w: 			this.width,
			h:			this.height,
			piece: 		false,
			bg:			"rgba(255, 165, 0, 0.2)"
			
		});
	}
};

Holder.prototype.drawSpace = function(){
	//Loops through spaces array and draws on the board. 
	for(let i in this.spaces){
		let space = this.spaces[i];
		//Draw
		rect(space.x, space.y, space.w * tileSize, space.h * tileSize, space.bg, "black");
	}
}

