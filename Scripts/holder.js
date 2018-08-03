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
    
	console.log("Checking Spaces");
	//Checks each space to see if it is empty.
    for(let i = 0; i < this.spaces.length; i++){
        
        let space = this.spaces[i];
        let free = true;
        //Find the space on the board
        for(let x = 0; x < board.length; x++){
            
            for(let y = 0; y < board[x].length; y++){
                let cell = board[x][y];
                if(cell.x == space.x && cell.y == space.y){                    
                    //Found the top left of the cell.
                    //Loop through all cells in shape.
                    let r = x + space.h;
                    let t = y + space.w;

                    
                    for(let j = x; j < r; j++){
                        for(let k = y; k < t; k++){
                            console.log("checking: ")
                            if(board[j][k].contains){

                                free = false;   
                            }
                        }
                    } 
                }
            }
        }
        
        if(free){
            //Holder is empty. 
            console.log("Holder is free");
            space.piece = false;
        } else {
            space.piece = true;
        }
    }
}

Holder.prototype.trySpawn = function(){
	//Will attempt to spawn a new shape. 
	for(let i in this.spaces){
		let space = this.spaces[i];
		if(space.piece == false){
			space.piece = true;
			shapes.push(new Shape(space.x, space.y));
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

