window.onload = function () {
	document.body.style.opacity = "1";

	//Start script
	setup();
};
//variables 
let tileSize = 28;
let width = 26;
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
let pieces = [P, P, P, F, F, Y, Y, T, T, W, N, U, V, L, Z, X, I];
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
        let holes =[];
        let maxi, maxn;
        for(let i = 0; i < 10; i++){
            let hhole = new Hole(8, 8, random_range(2, 8));
            hhole.generate();
            holes.push(hhole);
        }
        
        
        for(i in holes){
            if(maxi && maxn){
                if(holes[i].numblocks >= maxn){
                    maxn = holes[i].numblocks;
                    maxi = i;
                }
            } else {
                maxi = i;
                maxn = holes[i].numblocks;
            }
        }
        console.log("Picked hole: " + maxn);
        hole = holes[maxi];
        console.log("Array: " );
        console.log(hole.blocks);   
        
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
            let cell = board[row][col];
			if (cell.contains && cell.contains.solid) {
                rect(cell.x, cell.y, tileSize, tileSize, cell.contains.colour, cell.contains.border);    
			} else{
				rect(col * tileSize, row * tileSize, tileSize, tileSize, "white", "rgba(0, 0, 0, 0.3)");
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
