//Global pieces array [Z, '#D88642'], [X, '#208D99'], [I, '#4A3F4F']
let pieces = [
	[P, '#71B3B0'],
	[F, '#D55A4C'],
	[Y, '#F5994E'],
	[T, '#961628'],
	[W, '#1D6D53'],
	[N, '#D6BB50'],
	[U, '#21746C'],
	[V, '#2CAD7D'],
	[L, '#8B2134']
];



class Game {
	constructor() {
		//Game Variables
		this.tileSize = 20;
		this.holeSize = 12;
		this.shapes = [];
		this.holes = [];
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

		//Score stuff
		this.ticker = 0;
		this.combo = 0;
		this.totalScore = 0;
		this.scoreTracker = 0;
		this.pastScores = [];
		//Average 
		this.averageScores = [];
		this.averageGraph = new Graph(document.getElementById('graph_canvas'), this.averageScores);
		this.averageGraph.start();

	}
	
	makeBoard() {
		for (let row = 0; row < this.boardSize; row++) {
			this.board[row] = [];
			for (let col = 0; col < this.boardSize; col++) {
				this.board[row][col] = {
					x: col * this.tileSize,
					y: row * this.tileSize,
					contains: []
				};
			}
		}
	}
	
	setup() {
		//Setup Canvas
		this.canvas = document.getElementById('carp_canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.canvas.height = this.tileSize * this.boardSize;
		this.makeBoard();
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
		let hpr = Math.floor((this.boardSize - 2) / this.holeSize);
		let hrs = Math.floor((this.boardSize - 7) / this.holeSize);


		let tblocks = hpr * this.holeSize;
		let lblocks = this.boardSize - tblocks - 2;
		let hwp = 0;
		if (hpr > 2) {
			hwp = Math.floor(lblocks / hpr);
		} else {
			hwp = lblocks;
		}
		let y = 1;
		for (let i = 0; i < hrs; i++) {
			let x = 1;
			//For each hole row
			for (let j = 0; j < hpr; j++) {
				//Add holes per row.

				let hole = new Hole(x, y, this.holeSize, 10, this);
				hole.makeBlocks();
				hole.generateHole();
				this.holes.push(hole);
				x += this.holeSize + hwp;
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

	checkHoles() {
		for (let i = 0, j = this.holes.length; i < j; i++) {
			let hole = this.holes[i];
			let filled = hole.checkState();
			if (filled) {
				this.totalScore += hole.score;
				this.scoreTracker += hole.score;
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
		console.log(" Updating Graph ");
//		this.averageGraph.update();
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
		
		if(this.dragShape){
			this.dragShape.drag(this.eventListeners.mx, this.eventListeners.my);
		}
		

		
		
		
		this.holder.drawSpaces();
		if (this.ticker >= 240) {
			this.ticker = 0;
			this.checkScore();
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
		for (let row = 0; row < this.boardSize; row++) {
			for (let col = 0; col < this.boardSize; col++) {
				let cell = this.board[row][col];

				if (cell.contains.length > 0) {
					for (let i = cell.contains.length - 1; i >= 0; i--) {
						let block = cell.contains[i];
						this.drawRect(col * this.tileSize, row * this.tileSize, this.tileSize, block.color);
						break; //Draw the last one only.
					}
				} else {
					//Nothing in the cell. 
					this.drawRect(col * this.tileSize, row * this.tileSize, this.tileSize, 'white', 'rgba(0, 0, 0, 0.2)');
				}
			}
		}
	}

	
	clearCanvas() {
		this.makeBoard();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawHoles() {
		for (let i = 0, j = this.holes.length; i < j; i++) {
			let hole = this.holes[i];
			hole.draw();
		}
	}

	drawShapes() {
		let nShapes = [];
		for (let i = 0, j = this.shapes.length; i < j; i++) {
			let shape = this.shapes[i];
			if (!shape.delete) {
				this.shapes[i].draw();
				nShapes.push(shape);
			}
		}
		this.shapes = nShapes;
	}

	drawRect(x, y, size, color, border) {
		let cx = this.ctx;
		cx.beginPath();
		cx.rect(x, y, size, size);
		if (color) {
			cx.fillStyle = color;
		} else {
			cx.fillStyle = 'black';
		}
		cx.fill();
		if (border) {
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

		console.log("UPDATING", this.data);
		for (i in this.data) {
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
