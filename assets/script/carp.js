//Global pieces array [Z, '#D88642'], [X, '#208D99'], [I, '#4A3F4F']
let pieces = [
	[P, '#71B3B0', 22],
	[F, '#D55A4C', 14],
	[Y, '#F5994E', 14],
	[L, '#8B2134', 8],
	[N, '#D6BB50', 8],
	[T, '#961628', 7],
	[W, '#1D6D53', 4],
	[U, '#21746C', 4],
	[V, '#2CAD7D', 4],
	[Z, '#c23616', 4]
];



class Game {
	constructor() {
		//Game Variables
		this.tileSize = 23;
		this.holeSize = 13;
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
		this.lastFrame = 0;
		this.frameTime = 0;

		this.canvas;
		this.ctx;
		this.mx = 0;
		this.my = 0;

		this.xPadding;
		this.yPadding;
		this.spawnShapes = false;

		//Hole & Levels
		this.level = 0;
		this.holeLevel = 10;
		this.holesFilled = 0;
		this.maxHoles = 4;
		this.maxHolders = 4;

		//Score stuff
		this.ticker = 0;
		this.combo = 0;
		this.totalScore = 0;
		this.scoreTracker = 0;
		this.pastScores = [];
		this.floatingText = []; //Holds any floating text on the screen.

		//Average 
		this.holeScores = [];
		this.averageScores = [];
		this.comboScore = [];

		this.graphInfo = [
			{
				element: document.getElementById("comboGraph"),
				title  : "Average Score & Combo",
				yAxis  : [
					{
						type: 'value',
					},
					{
						type: 'value',
						min: 0,
						max: 100
					}
				],
				xAxis  : [
					{
						
						type: 'category',
						d: this.comboScore,
					}
				],
				series : [
					{
						type: 'bar',
						d: this.comboScore,
						yAxisIndex: 1
					},
					{
						type: 'line',
						d: this.averageScores
					}
				]
			}
		]
		this.graphs = [];

	}


	getHoverShape(){
		let shapes = this.shapes; 
		for(let i = 0; i < shapes.length; i++){
			// Mouse In takes a cell, make a temp one.
			let shape  = shapes[i];
			let x = shape.x * this.tileSize;
			let y = shape.y * this.tileSize;
			let width  = shape.width * this.tileSize;
			let height = shape.height * this.tileSize;
			if(this.mouseInGeneral(x, y, width, height)){
				console.log("Mouse in: ", shape);
				// Mouse is in general area of shape.
				let blocks = shape.blocks;
				for(let j = 0; j < blocks.length; j++){
					let block = blocks[j];
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

	handleMouse(){

		if(this.leftClick){
			this.leftClick = false;
			if (this.dragShape == null) {
				// Find the shape we are hovering and pick it up.
				this.getHoverShape();
			} else {
				// Dragging something.
				let shape = this.dragShape;
				shape.checkBounds(this.boardWidth, this.boardHeight);
				shape.checkPlace(this.board, this.holder);
				if(shape.canPlace){
					// We ARE placing a shape here, so either a hole gets the shape, or it doesnt and should increment it's decay counters
					for(let i = 0; i < this.holes.length; i++){
						let hole = this.holes[i];
						if(hole.checkBounds(shape)){
							hole.placed(shape);
						} else {
							hole.placed(null);
						}
						
					}
					this.shapes.push(shape);
					this.dragShape = null;
				}

			}
		}

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
				this.leftClick = true;
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
			this.dragShape.scroll(direction);
		}
	}


	resizeCanvas() {
		// Remake everything canvas related.
		console.log("Resizing Canvas");
		this.shapes = [];
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;

		let wCells = Math.floor(this.canvas.width / this.tileSize);
		let hCells = Math.floor(this.canvas.height / this.tileSize);

		this.boardWidth = wCells;
		this.boardHeight = hCells;

		this.holder = null;

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
		let boardWidth = this.boardWidth;
		let nHoles = Math.floor(boardWidth / 7);
		if(nHoles > this.maxHolders){
			nHoles = this.maxHolders;
		}
		// Hole is 5 blocks + 2 blocks padding on left side.


		let holder = new Holder(this.canvas, this.ctx, this.tileSize, nHoles, this.boardWidth, this.boardHeight);
		holder.makeSpaces();
		this.holder = holder;
		let newShapes = this.holder.trySpawn();
		this.shapes = this.shapes.concat(newShapes);
	}

	makeShapeHoles() {

		this.holes = [];

		let minX = 1;
		let maxX = this.boardWidth - 1;
		let minY = 1;
		let maxY = this.boardHeight - 6;

		let nRow = Math.floor((maxY - minY) / (this.holeSize + 1));
		let nCols = Math.floor((maxX - minX) / (this.holeSize + 1));

		// AHH 




		let maxHoles = this.maxHoles;
		let holesPerRow = maxHoles / nRow;
		let xPadding = Math.floor((this.boardWidth - (this.holeSize * holesPerRow)) / holesPerRow);
		console.log("XPadding: ", xPadding);
		let x = Math.floor(minX + xPadding);
		let y = minY;
		// This many holes per row
		console.log("HPR: ", holesPerRow);


		for (let i = 0; i < nRow; i++) {
			let hpr = holesPerRow;
			for (let j = 0; j < nCols; j++) {

				if(maxHoles > 0 && hpr > 0){
					maxHoles--;
					hpr--;
					let hole = new Hole(x, y, this.holeSize, this.boardWidth, this.boardHeight, this.tileSize, 3);
					hole.generateHole();
					this.holes.push(hole);
					x += this.holeSize + 1;
				}
			}
			y += this.holeSize + 3;
			x = minX + xPadding;
		}
	}





	setup() {
		//Setup Canvas
		this.canvas = document.getElementById('carpCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.addListeners();
		this.resizeCanvas();

		//Add event listeners


		//Start game 

		for (let i = 0; i < this.graphInfo.length; i++) {
			let baseOptions = {
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				title : {},
				xAxis : [],
				yAxis : [],
				series: [],
			};
			
			let graph = new Graph(baseOptions, this.graphInfo[i]);
			this.graphs.push(graph);
		}

		this.loop();

	}

	makeFloating(content, x, y){
		console.log("Making floating, ", content, " ", x, " ", y);
		let ft = new FloatingText(content, x, y);
		this.floatingText.push(ft);
	}

	checkHoles() {
		for (let i = 0, j = this.holes.length; i < j; i++) {
			let hole = this.holes[i];
			// TODO: checkstate is broken
			let filled = hole.checkState(this.board, this.combo);
			if (filled) {
				// Hole is filled. 

				this.holeScores.push(hole.score);
				this.totalScore += hole.score;
				this.scoreTracker += hole.score;

				if(hole.overfill == 0){
					this.makeFloating("Masterpiece", hole.x * this.tileSize, hole.y * this.tileSize);

				} else {
					this.combo = 0;
					console.log("OVERFILL: ", hole.overfill);
					if(hole.overfill < 4){
						this.makeFloating("Craftsmanship", hole.x * this.tileSize, hole.y * this.tileSize);
					} else if(hole.overfill < 8){
						this.makeFloating("Fine Work", hole.x * this.tileSize, hole.y * this.tileSize);
					} else if(hole.overfill < 16){
						this.makeFloating("Poor Work", hole.x * this.tileSize, hole.y * this.tileSize);
					}
				}
				hole.regenerate(this.board);
			}
		}






	}

	getTimeStamp() {
		let date = new Date();
		let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return time;
	}



	average() {
		// Something is wrong? 
		let time = this.getTimeStamp();
		this.comboScore.push([this.combo, time]);


		let totalScores = 0;
		if (this.holeScores.length) {
			let holeScores = this.holeScores;

			for (let i = 0; i < holeScores.length; i++) {
				totalScores += holeScores[i];
			}
			totalScores = totalScores / holeScores.length;
			console.log("AV Score: ", totalScores);
			this.averageScores.push([
				totalScores,
				time
			]);
		} else {
			this.averageScores.push([0, time]);
		}



		if (this.comboScore.length >= 20) {
			let diff = this.comboScore.length - 20;
			this.comboScore.splice(0, diff);
			this.averageScores.splice(0, diff);
		}
	}

	drawFloating(){
		let nft = [];
		for(let i = 0; i < this.floatingText.length; i++){
			let ft = this.floatingText[i];
			ft.draw(this.ctx);
			ft.update();
			if(ft.opacity > 0){
				nft.push(ft);
			}
		}
		this.floatingText = nft;
	
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
		this.drawFloating();
		
		for(let hole of this.holes){
			if(hole.sTime != null){
				let now = performance.now();
				let time = (now - hole.sTime)/1000;
			
				this.ctx.fillStyle = "black";
				this.ctx.fillText(time, hole.x * this.tileSize, hole.y * this.tileSize);
			}
		}

		for(let shape of this.shapes){
			drawRect(this.ctx, shape.x * this.tileSize, shape.y * this.tileSize, shape.width * this.tileSize, shape.height * this.tileSize);
		
		}
		drawArc(this.ctx, this.mx, this.my, 10);




		if (this.trySpawn) {
			this.holder.checkSpaces(this.board);
			let newShapes = this.holder.trySpawn();
			this.shapes = this.shapes.concat(newShapes);
			this.trySpawn = false;
		}


		if (this.dragShape) {
			this.dragShape.drag(this.mx, this.my, this.ctx);
			this.dragShape.checkBounds(this.boardWidth, this.boardHeight);
			this.dragShape.checkPlace(this.board, this.holder);
		}


		this.holder.drawSpaces();


		// We need to handle mouse events in the loop, some click events depend on the state of the game board that may or may not be populated when the event fires
		this.handleMouse();


		this.frames++;
		this.ticker += this.frameTime;
		if (this.ticker / 1000 >= 5) {
			// 5 Second Timer.
			this.ticker = 0;
			this.average();
			this.updateGraphs();
		}
		window.requestAnimationFrame(this.loop.bind(this));
	}


	updateGraphs() {
		let graphs = this.graphs;
		for (let i = 0; i < graphs.length; i++) {
			let g = graphs[i];
			g.update();
		}
	}

	getFPS() {
		let now = performance.now();
		let lastTime = this.lastFrame;
		let timeTaken = now - lastTime;
		this.frameTime = timeTaken;

		this.lastFrame = now;

		if (this.framesTime) {
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
			}
		}
	}

	//TODO: Make these functions not bad.
	mouseInGeneral(x, y, width, height){
		//Should be given in pixels.
		return(this.mx > x && this.mx < x + width && this.my > y && this.my < y + height);
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






/* Start Game Onload */
window.onload = function () {
	console.log("Window Load");
	let game = new Game();
	game.setup();
};
/* Global Functions */
function pickShape() {
	let randomInt = Math.random() * 89;
	let counter = 0;
	for(let i = 0; i < pieces.length; i++){
		let p = pieces[i];
		let oCounter = counter; 
		counter += p[2];
		if(randomInt >= oCounter && randomInt <= counter){
			return p;
		}
	}
}
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor() {
	return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}

function drawRect(ctx, x, y, w, h){
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath();
}

function drawArc(ctx, x, y, d){
	ctx.beginPath();
	ctx.arc(x, y, d, 0, 2 * Math.PI);
	ctx.fillStyle = "orange";
	ctx.fill();
	ctx.closePath();
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