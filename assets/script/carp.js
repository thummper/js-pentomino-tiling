//Global pieces array [Z, '#D88642'], [X, '#208D99'], [I, '#4A3F4F']
let pieces = [
	[P, '#71B3B0', 13],
	[F, '#D55A4C', 13],
	[Y, '#F5994E', 12],
	[T, '#961628', 12],
	[W, '#1D6D53', 11],
	[N, '#D6BB50', 10],
	[U, '#21746C', 9],
	[V, '#2CAD7D', 9],
	[L, '#8B2134', 8],
	[Z, '#c23616', 6]
];



class Game {
	constructor() {
		//Game Variables
		this.tileSize = 24;
		this.holeSize = 11;
		this.shapes = [];
		this.holes = [];
		this.dragShape = null;

		//Main game grid is boardsize * boardsize
		this.boardSize = 32;
		this.boardWidth = 0;
		this.boardHeight = 0;
		this.board = [];
		this.holder;
		//Other Variables
		this.framesTime;
		this.FPS = 0;
		this.frames = 0;
	
		this.canvas;
		this.ctx;
		this.mx = 0;
		this.my = 0;

		this.xPadding;
		this.yPadding;
		this.spawnShapes = false;

		//Score stuff
		this.ticker = 0;
		this.combo = 0;
		this.totalScore = 0;
		this.scoreTracker = 0;
		this.pastScores = [];
		//Average 
		this.averageScores = [];
		//this.averageGraph = new Graph(document.getElementById('graph_canvas'), this.averageScores);
		//this.averageGraph.start();

	}


	addListeners() {
		window.addEventListener("resize", function () {
			this.resizeCanvas();
		}.bind(this));

		window.addEventListener("mousemove", function (event) {
			let rect = this.canvas.getBoundingClientRect();
			this.mx = event.clientX - rect.left;
			this.my = event.clientY - rect.top;
			
		}.bind(this));

		window.addEventListener("contextmenu", function (event) {
			event.preventDefault();
			event.stopPropagation();
		}.bind(this));

		window.addEventListener("mousedown", function (event) {
			//Left click
			if (event.button == 0) {
				if(this.dragShape == null){
					// If there are 2 shapes in a block, we pick u the bottom and the other is deleted?
					for(let i = this.shapes.length - 1; i >= 0; i--){
						let shape = this.shapes[i];
						if(!shape.dragging){
							let blocks = shape.blocks;
							for(let block of blocks){
								if(block.type == "shape"){
									if(this.mouseIn(block)){
										block.dragging = true;
										shape.dragging = true;
										this.dragShape = shape;
										this.shapes.splice(i, 1);
										return;
										
									}
								}
							}
						}
					}
				} else {
					// Dragging something.
					let shape = this.dragShape;
					shape.checkBounds(this.boardWidth, this.boardHeight);
					this.shapes.push(shape);
					this.dragShape = null;
				}
			} else {
				//Right button
				if (this.dragShape != null) {
					this.dragShape.mirror();
				}
			}
			this.trySpawn = true;
		}.bind(this));

		window.addEventListener("keydown", function (event) {
			let kc = event.keyCode;
			if (kc == 65) {
				//Scroll 
				this.scroll(true);
			}
			if (kc == 90) {
				//Scroll
				this.scroll(false);
			}
		}.bind(this));

		window.addEventListener("wheel", function (event) {
			event.preventDefault();
			let direction = false;
			if (event.deltaY < 0) {
				direction = true;
			}
			this.scroll(direction);
		}.bind(this));




	}

	scroll(direction) {
		//Will scroll based on boolean value
		if (this.dragShape != null) {
			this.dragShape.scroll();
		}
	}


	resizeCanvas() {
		console.log("Resizing Canvas");
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;

		let wCells = Math.floor(this.canvas.width / this.tileSize);
		let hCells = Math.floor(this.canvas.height / this.tileSize);

		this.boardWidth = wCells;
		this.boardHeight = hCells;


		// if(wCells < hCells){
		// 	this.boardSize = wCells;
		// } else {
		// 	this.boardSize = hCells;
		// }

		if (this.holder) {
			this.holder.empty(this.board);
		}


		this.makeBoard();
		this.makeHolder();
		this.makeShapeHoles();
	}

	makeBoard() {
		this.board = [];

		for (let row = 0; row < this.boardHeight; row++) {
			this.board[row] = [];
			for (let col = 0; col < this.boardWidth; col++) {
				this.board[row][col] = {
					x: (col * this.tileSize),
					y: (row * this.tileSize),
					contains: []
				};
			}
		}

	}


	makeHolder() {
		// Work out how many holders we can fit onto the board, and make them (with a max of 4).
		this.holder = null;
		let boardWidth = this.boardSize;
		let nHoles = Math.floor(boardWidth / 7);
		// Hole is 5 blocks + 2 blocks padding on left side.


		let holder = new Holder(this.canvas, this.ctx, this.tileSize, nHoles, this.boardWidth, this.boardHeight);
		holder.makeSpaces();
		this.holder = holder;
		let newShapes = this.holder.trySpawn();
		this.shapes = this.shapes.concat(newShapes);
	}

	makeShapeHoles() {
		/* 
		Make the holes that should be filled with shapes.
		*/

		// Seems like this would be easier to do in terms of cells rather than abs x/y

		this.holes = [];

		let minX = 1;
		let maxX = this.boardWidth - 1;
		let minY = 1;
		let maxY = this.boardHeight - 6; // By using this var, the board size will always have to be square.

		let nRow = Math.floor((maxY - minY) / (this.holeSize + 1));
		let nCols = Math.floor((maxX - minX) / (this.holeSize + 1));



		// Now make holes
		let x = minX;
		let y = minY;
		for (let i = 0; i < nRow; i++) {
			for (let j = 0; j < nCols; j++) {
				let hole = new Hole(x, y, this.holeSize, this.boardWidth, this.boardHeight, this.tileSize, 3);
			
				hole.generateHole();
				this.holes.push(hole);
				x += this.holeSize + 1;
			}
			y += this.holeSize + 3;
			x = minX;
		}
		console.log("nHoles", this.holes.length);

	}





	setup() {
		//Setup Canvas
		this.canvas = document.getElementById('carpCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.addListeners();
		this.resizeCanvas();

		//Add event listeners
	

		//Start game 
		this.loop();

	}

	checkHoles() {
		for (let i = 0, j = this.holes.length; i < j; i++) {
			let hole = this.holes[i];
			// TODO: checkstate is broken
			let filled = hole.checkState(this.board, this.combo);
			if (filled) {
				this.totalScore += hole.score;
				this.scoreTracker += hole.score;
				if (hole.overfilled == 0) {
					this.combo++;
				} else {
					this.combo = 0;
				}
				hole.regenerate();
			}
		}
	}



	checkScore() {
		this.pastScores.push(this.scoreTracker);
		this.scoreTracker = 0;
		if (this.pastScores.length > 20) {
			let difference = 20 - this.pastScores.length;
			this.pastScores.splice(0, difference);
		}
		let total = 0;
		for (let i = 0, j = this.pastScores.length; i < j; i++) {
			total += this.pastScores[i];
		}
		let average = total / this.pastScores.length;
		let today = new Date();
		let time = today.getHours() + " : " + today.getMinutes() + " : " + today.getSeconds();
		this.averageScores.push([average, time]);

		if (this.averageScores.length > 20) {
			let difference = this.averageScores.length - 20;
			this.averageScores.splice(0, difference);
		}
		this.updateGraph();
	}

	updateGraph() {
		this.averageGraph.update();
	}

	loop() {
		this.getFPS();
		//Clear the grid and then add everything back to it.
		this.clearCanvas();
		this.drawHoles();
		this.drawShapes();
		this.checkHoles();
		//At this point the grid contains all shapes and holes.
		this.drawBoard();
		if(this.trySpawn){
			this.holder.checkSpaces(this.board);
			let newShapes = this.holder.trySpawn();
			this.shapes = this.shapes.concat(newShapes);
			this.trySpawn = false;
		}


		if (this.dragShape) {
			this.dragShape.drag(this.mx, this.my, this.ctx);
		}


		this.holder.drawSpaces();
		if (this.ticker >= 240) {
			this.ticker = 0;
			//this.checkScore();
		}

		this.frames++;
		this.ticker++;
		window.requestAnimationFrame(this.loop.bind(this));
	}

	getFPS() {
		if (this.framesTime) {
			let now = performance.now();
			if (now - this.framesTime >= 1000) {
				this.FPS = this.frames;
				this.frames = 0;
				this.framesTime = now;
			}
		} else {
			this.framesTime = performance.now();
		}
	}

	drawBoard() {
		for (let row = 0; row < this.boardHeight; row++) {
			for (let col = 0; col < this.boardWidth; col++) {
				let cell = this.board[row][col];
				if (cell.contains.length > 0) {
					for (let i = cell.contains.length - 1; i >= 0; i--) {
						let block = cell.contains[i];
						this.drawRect(cell.x, cell.y, this.tileSize, block.color, null);
						break; //Draw the last one only.
					}
				} else {
					//Nothing in the cell. 
					this.drawRect(cell.x, cell.y, this.tileSize, 'white', 'rgba(0, 0, 0, 0.2)');
				}


			
				if (this.mouseIn(cell)) {
					
					this.drawRect(cell.x, cell.y, this.tileSize, 'orange', 'rgba(0, 0, 0, 0.2)');
				}

			}
		}
	}

	mouseIn(cell) {
		return (this.mx > cell.x && this.mx < cell.x + this.tileSize && this.my > cell.y && this.my < cell.y + this.tileSize);
	}


	clearCanvas() {
		this.makeBoard();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}



	drawHoles() {
		this.checkHoles();
		for (let i = 0; i < this.holes.length; i++) {
			let hole = this.holes[i];
			hole.draw(this.board);
		}
	}

	drawShapes() {
		let liveShapes = [];
		for (let i = 0, j = this.shapes.length; i < j; i++) {
			let shape = this.shapes[i];
			if (!shape.delete) {
				this.shapes[i].draw(this.board, this.boardWidth, this.boardHeight);
				liveShapes.push(shape);
			}
		}
		this.shapes = liveShapes;
	}

	drawRect(x, y, size, color, border) {
		let cx = this.ctx;
		cx.beginPath();
		cx.rect(x, y, size, size);
		if (color !== null) {
			cx.fillStyle = color;
		} else {
			cx.fillStyle = 'black';
		}
		cx.fill();
		if (border !== null) {
			cx.strokeStyle = border;
			cx.stroke();
		}
		cx.closePath();
	}
}


class Graph {
	constructor(canvas, dataArray) {
		this.chart = echarts.init(canvas);
		this.data = dataArray;
		this.chartOptions = null;
	}
	start() {
		this.chartOptions = {
			grid: {
				left: 0,
				right: 0,
				top: 0,
			},
			xAxis: {
				data: ['1']
			},
			yAxis: {},
			series: [{
				type: 'line',
				data: [0]
			}]
		};
		this.chart.setOption(this.chartOptions);
	}

	update() {
		for (let i in this.data) {
			console.log(this.data[i]);
			this.chartOptions.xAxis.data.push(this.data[i][1]);
			this.chartOptions.series[0].data.push(this.data[i][0]);
			this.chart.setOption(this.chartOptions);
		}
		this.data.splice(0, this.data.length);

	}

}



/* Start Game Onload */
window.onload = function () {

	console.log("Window Load");
	let game = new Game();
	game.setup();
};
/* Global Functions */
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor() {
	return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}

function drawCell(ctx, x, y, size, color = null, border = null) {
	let cx = ctx;
	cx.beginPath();
	cx.rect(x, y, size, size);
	if (color !== null) {
		cx.fillStyle = color;
	} else {
		cx.fillStyle = 'black';
	}
	cx.fill();
	if (border !== null) {
		cx.strokeStyle = border;
		cx.stroke();
	}
	cx.closePath();
}