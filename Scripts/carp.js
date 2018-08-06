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
let pieces = [P, F, Y, T, W, N, U, V, L, Z, X, I];
let board = [];
let holder;
let hole = null;





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
    
    //Make and set up the shape holder
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
    
    if(!hole){
        //Theres no hole. 
        hole = new Hole(1, 1, 4);
        hole.generate();
    } else {
        //There is a hole. 
        hole.draw();
        
    }
    
    
	//Add all shapes to the grid.
    if(shapes.length > 0){
        for (i in shapes) {
		  let shape = shapes[i];
            shape.draw();
        }
    }

	//Draw grid and shapes.
	
	drawBoard();
    holder.trySpawn();
	holder.drawSpace();
	
	
	
	//Draw the dragging shape on the mouse.
	for (i in draggingShapes) {
		let shape = draggingShapes[i];
		shape.drag();
		shape.draw_on_mouse();
	}
	
	//Run loop as fast as possible.
	window.requestAnimationFrame(loop);
}
//Functions for gameloop
function drawBoard() {
	for (let row = 0; row < width; row++) {
		for (let col = 0; col < height; col++) {
			if (board[row][col].contains) {
                //Gridspot contains a block, draw it.
                let block = board[row][col].contains;
                if(block.solid){
                    rect(block.x, block.y, tileSize, tileSize, block.colour, "black");    
                }
			} else{
				rect(col * tileSize, row * tileSize, tileSize, tileSize, "transparent", "rgba(0,0,0,0.3)");
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
				contains: null
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


function random_range(min, max) {
	//Return random positive integer. 
	return Math.round(Math.random() * (max - min) + 1);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let cols = ["red", "orange", "green", "purple", "yellow", "teal", "cyan", "magenta", "darkorange", "black", "grey"];
function randomcol(){
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);;
	
}
