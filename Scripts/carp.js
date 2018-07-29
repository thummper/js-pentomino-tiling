window.onload = function () {
	document.body.style.opacity = "1";

	//Start script
	setup();
};
//variables 
let tileSize = 34;
let width = 22;
let height = width;
let xspan;
let yspan;
let mx;
let my;
let canvas;
let ctx;
let lc = 20;
//Used for drawing shape x/y
let testx;
let testy;
let shapes = [];
let draggingShapes = [];
let pieces = [
	[I, "cyan"],
	[J, "blue"],
	[L, "orange"],
	[O, "yellow"],
	[S, "green"],
	[T, "purple"],
	[Z, "red"]
];
let board = [];
let holder;





function setup() {
	canvas = document.getElementById("carp_canvas");
	ctx = canvas.getContext("2d");
	canvas.width = tileSize * width;
	canvas.height = tileSize * height;

	//Set up the gameboard. 
	for (let row = 0; row < height; row++) {
		board[row] = [];
		for (let col = 0; col < width; col++) {
			board[row][col] = {
				x: col * tileSize,
				y: row * tileSize,
				contains: false
			};
		}
	}
	holder = new Holder();
	holder.makeSpaces();

	//Add event listeners.
	add_event_listeners(canvas);
	//Start the game
	loop();
}

function loop() {
	//Clear canvas
	clear();
	//Draw the grid
	resetBoard();
	//Add all shapes to the grid.
	for (i in shapes) {
		let shape = shapes[i];
		shape.draw();
	}
	//Draw grid and shapes.
	
	drawBoard();
	holder.drawSpace();
	holder.trySpawn();
	
	
	
	//Draw the dragging shape on the mouse.
	for (i in draggingShapes) {
		let shape = draggingShapes[i];
		shape.drag();
		shape.draw_on_mouse();
	}
	
	//Draw the x/y of the dragging shape.
	if (testx && testy) {
		rect(testx, testy, tileSize, tileSize, "yellow");
	}
	
	//Run loop as fast as possible.
	window.requestAnimationFrame(loop);
}
//Functions for gameloop
function drawBoard() {
	for (let row = 0; row < width; row++) {
		for (let col = 0; col < height; col++) {
			if (board[row][col].contains) {
				rect(col * tileSize, row * tileSize, tileSize, tileSize, board[row][col].contains.colour, "rgba(0,0,0,0.3)");

			} else {
				rect(col * tileSize, row * tileSize, tileSize, tileSize, "white", "rgba(0,0,0,0.3)");

			}
		}
	}
}

function resetBoard() {
	//reset the game board for next loop. 
	for (let row = 0; row < height; row++) {
		board[row] = [];
		for (let col = 0; col < width; col++) {
			board[row][col] = {
				x: col * tileSize,
				y: row * tileSize,
				contains: false
			};
		}
	}
}

function rect(x, y, w, h, colour, border) {
	//Draw a rectangle with various inputs.
	if (arguments.length == 6) {
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.fillStyle = colour;
		ctx.strokeStyle = border;
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

	} else if (arguments.length == 4) {
		//Draw black rect 
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.fill();
		ctx.closePath();

	} else {
		//Draw rect with colour. 
		ctx.beginPath();
		ctx.fillStyle = colour;
		ctx.rect(x, y, w, h);
		ctx.fill();
		ctx.closePath();

	}

}
//MOVE TO SHAPE.
function drag(shape) {
	//Shape should remain on grid while being dragged? 
	//Get the nearest gridpoint to the block that is being dragged, translate and then set shape coords. 
	
	
}
//MOVE TO SHAPE
function gridSnap(shape) {
//	//Snap the shape to the nearest gridpoint.
//	let xrem = mx % tileSize;
//	let yrem = my % tileSize;
//	let xsnap, ysnap;
//	xsnap = mx - xrem;
//	ysnap = my - yrem;
//	//Find the block we are dragging and translate the coords.
//	xsnap -= Math.floor((shape.pattern[0].length)/2) * tileSize;
//	ysnap -= Math.floor((shape.pattern.length)/2   ) * tileSize;
//	//Don't let shape off the canvas.
//	if(xsnap < 0){
//		xsnap = 0;
//	}
//	if(ysnap < 0){
//		ysnap = 0;
//	}
//	testx = xsnap;
//	testy = ysnap;
//	shape.x = xsnap;
//	shape.y = ysnap;
}

function random_range(min, max) {
	//Return random positive integer. 
	return Math.round(Math.random() * (max - min) + 1);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let cols = ["red", "orange", "green", "purple", "yellow", "teal", "cyan", "magenta", "darkorange", "black", "grey"];
function randomcol(){
	return cols[random_range(0, cols.length)];
	
}
