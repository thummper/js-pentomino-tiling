//Global pieces array
let pieces = [P, F, Y, T, W, N, U, V, L, Z, X, I]

class Game{
	constructor(){
		//Game Variables
		this.tileSize = 24;
		this.holeSize = 12;
		this.shapes   = [];
		this.holes    = [];
		this.dragShape = null;
		
		//Main game grid is boardsize * boardsize
		this.boardSize = 32; 
		this.board = [];
		this.holder;
		//Other Variables
		this.framesTime;
		this.FPS = 0;
		this.frames = 0;
		this.eventListeners;
		this.canvas;
		this.ctx; 
	}
	makeBoard(){
		for(let row = 0; row < this.boardSize; row++){
			this.board[row] = [];
			for(let col = 0; col < this.boardSize; col++){
				this.board[row][col] = {
					x: col * this.tileSize,
					y: row * this.tileSize,
					contains: []
				};
			}
		}
	}
	setup(){
		//Setup Canvas
		this.canvas = document.getElementById('carp_canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.canvas.height = this.tileSize * this.boardSize;
		//Make the board.
		this.makeBoard();

		
		//Make shape holder
		this.holder = new Holder(this.canvas, this.ctx, this);
		this.holder.makeSpaces();
		//Make initial holes
		
		//We have to work out how many holes we can fit in the gap 
		/* For now, hole size is static
		   Min X: tileSize
		   Min Y: tileSize
		   Max X: tileSize * boardWidth - 1
		   Max Y: tileSize * boardWidth - 1 - 6 (Shape holders take up last 6 blocks)
		*/
		let maxX = this.tileSize * (this.boardSize - 1);
		let maxY = this.tileSize * (this.boardSize - 7);
		let hpr  = Math.floor((this.boardSize - 2) / this.holeSize);
		let hrs  = Math.floor((this.boardSize - 7) / this.holeSize);
		
		let y = 1;
		for(let i = 0; i < hrs; i++){
			let x = 1;
			//For each hole row
			for(let j = 0; j < hpr; j++){
				//Add holes per row.
				
				let hole = new Hole(x, y, this.holeSize, 10, this);
				hole.makeBlocks();
				hole.generateHole();
				this.holes.push(hole);
				x += this.holeSize;
			}
			y += this.holeSize;
		}
		//Should have max amount of holes now.
		//Add event listeners
		this.eventListeners = new EventListeners(this.canvas, this);
		this.holder.trySpawn();
		//Start game 
		this.loop();
		
	}
	
	checkHoles(){
		for(let i = 0, j = this.holes.length; i < j; i++){
			let hole = this.holes[i];
			hole.checkState();
		}
	}
	
	loop(){
		this.getFPS();
		
		//Clear the grid and then add everything back to it.
		this.clearCanvas();
		this.drawHoles();
		this.drawShapes();
		this.checkHoles();
		//At this point the grid contains all shapes and holes.
		this.drawBoard();
		this.holder.drawSpace();
		

		if(this.dragShape != null){
			this.dragShape.drag(this.eventListeners.mx, this.eventListeners.my);
			this.dragShape.draw_on_mouse();
		}
		
		this.frames++;
		window.requestAnimationFrame(this.loop.bind(this));
	}
	getFPS(){
		if(this.framesTime){
			let now = performance.now();
			if(now - this.framesTime >= 1000){
				this.FPS = this.frames;
				this.frames = 0;
				this.framesTime = now;
			}
		} else {
			this.framesTime = performance.now();
		}
	}
	drawBoard(){
		for(let row = 0; row < this.boardSize; row++){
			for(let col = 0; col < this.boardSize; col++){
				let cell = this.board[row][col];
				
				if(cell.contains.length > 0){
					for(let i = cell.contains.length - 1; i >= 0; i--){
						let block = cell.contains[i];
						this.drawRect(col * this.tileSize, row * this.tileSize, this.tileSize, block.color);
						break; //Draw the last one only.
					}
				} else {
					//Nothing in the cell. 
					this.drawRect(col * this.tileSize, row * this.tileSize, this.tileSize, 'white', 'rgba(0, 0, 0, 0.35)');
				}
			}
		}	
	}
	clearCanvas(){
		//Reset grid and clear canvas
		//TODO, seems really inefficient to call this function every loop.
		this.makeBoard();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	drawHoles(){
		for(let i = 0, j = this.holes.length; i < j; i++){
			this.holes[i].draw();
		}
	}
	drawShapes(){
		let newShapes = []
		for(let i = 0, j = this.shapes.length; i < j; i++){
			let shape = this.shapes[i];
			if(!shape.delete){
				this.shapes[i].draw();
				newShapes.push(shape);
			} 
		}
		this.shapes = newShapes;
	}
	drawRect(x, y, size, color, border){
		let cx = this.ctx;
		cx.beginPath();
		cx.rect(x, y, size, size);
		if(color){
			cx.fillStyle = color;
		} else {
			cx.fillStyle = 'black';
		}
		cx.fill();
		if(border){
			cx.strokeStyle = border;
			cx.stroke();
		}
		cx.closePath();
	}
}

/* Start Game Onload */ 
window.onload = function () {
	let game = new Game();
	game.setup();
};
/* Global Functions */
function random(min, max){
	return Math.floor( Math.random() * (max - min + 1) + min);
}
function randomColor(){
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}