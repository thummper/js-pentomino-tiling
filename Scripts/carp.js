//variables 
let xspan, yspan, mx, my, canvas, ctx, holder, fpsc, fps, starttime;
let mp = 0;
let filled = 0;
let scores = [];
let score_data = [];
let tileSize = 24;
let width = 32,
    height = width;
let hole_dimen = 12;
let num_holes = 0;
let difficulty = 7;
let lc = 20;
let lp = 0;
let pp = 0;
let hole_rows = 2;
let performance_chart = document.getElementById("performance_chart");
let p_chart;
let shapes = [];
let draggingShapes = [];
let pieces = [P, P, F, F, Y, Y, T, T, W, N, U, V, L, Z, X, I];
let board = [];
let holes = [];
let gr_scores = [];
let gr_labels = [];

let time = performance.now();
let av_score = 0;
let perf_points_element;
let average_score_container;

window.onload = function () {
    document.body.style.opacity = "1";
    fpsc = document.getElementById("fps");
	perf_points_element = document.getElementById("pp");average_score_container = document.getElementById("av-score");
    //Start script
    setup();
};
window.setInterval(function () {
    fpsc.innerHTML = fps;
	perf_points_element.innerHTML = pp;
	average_score_container.innerHTML = av_score;
}, 1000);


function setup() {
	
	
	
    canvas = document.getElementById("carp_canvas");
    ctx = canvas.getContext("2d");
	chartctx = document.getElementById("performance_chart").getContext("2d");
    canvas.width = tileSize * width;
    canvas.height = tileSize * height;
	p_chart = new Chart(chartctx, {
		type: 'line',
		data: {
			labels: gr_labels,
			datasets: [{
				data: gr_scores
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
		}
	});
	
    //Set up the gameboard. 
    for (let row = 0; row < height; row++) {
        board[row] = [];
        for (let col = 0; col < width; col++) {
            board[row][col] = {
                x: col * tileSize,
                y: row * tileSize,
                contains: []
            };
        }
    }
    //Make and set up the shape holder
    holder = new Holder();
    holder.makeSpaces();


    //Work out how many holes we can have?
    num_holes = Math.floor(width/hole_dimen);


    for (let i = 0; i < hole_rows; i++) {
        for (let j = 0; j < num_holes; j++) {
            
            let hx = 3 + (j * hole_dimen);
            let hy = 3 + (i * hole_dimen);
            console.log("Hole at: " + hx + " " + hy);
            holes.push(gen_best_hole(hx, hy, hole_dimen, difficulty));
            
        }
    }
    //Add event listeners.
    add_event_listeners(canvas);
    loop();
}


function gen_best_hole(tx, ty, dimention, diff) {
    //Given a dimention and difficulty, generate a few holes and pick the best one.
    let temp_holes = [];
    let best;
    for (let i = 0; i < 5; i++) {
        let hole = new Hole(tx, ty, dimention, diff);
        hole.generate();
        temp_holes.push(hole);
        if (best) {
            if (hole.numblocks >= temp_holes[best].numblocks) {
                best = i;
            }
        } else {
            best = i;
        }
    }
    return temp_holes[best];
}

function loop() {	
	average_scores();
    work_fps();
    clearGame();
    if (holes.length > 0) {
        for (let i in holes) {
            let hole = holes[i];
            hole.draw();
        }
    }
    if (shapes.length > 0) {
        for (let i = shapes.length - 1; i >= 0; i--) {
            let shape = shapes[i];
            if (shape.delete) {
                //Remove the shape from the object, killing it.
                shapes.splice(i, 1);
            } else {
                //Shape is not marked for deletion, let it live.
                shape.draw();
            }
        }
    }
    //Have to check hole state after shapes are drawn unfortunatly
    if (holes.length > 0) {
        for (let i = holes.length - 1; i >= 0; i--) {
            let hole = holes[i];
            let hole_finished = hole.checkState();
            //If the hole is finished, get the score and reset the hole.
            if(hole_finished){
            let hole_score = hole.calcScore();
            console.log("Finished a hole with score: " + hole_score);
            scores.push(hole_score);
            hole.reset();
            }
        }
    }
    //Draw grid and shapes.
    drawBoard();
    holder.trySpawn();
    holder.drawSpace();
    if (draggingShapes.length > 0) {
        for (i in draggingShapes) {
            let shape = draggingShapes[i];
            shape.drag();
            shape.draw_on_mouse();
        }
    }
    lp++;
    window.requestAnimationFrame(loop);
}

function average_scores(){
	let temp_score = av_score;
	let time1 = performance.now();
	if(time){
		let timediff = time1 - time;
		if(timediff > 5000){
			let scr = 0;
			let scr_len = scores.length;
			if(scr_len > 0){
			for(let i = 0; i < scr_len; i++){
				scr += scores[i];
			}
			let avg_score = scr / scr_len;
			if(avg_score > av_score){
				pp += 10;
			} else if(avg_score < av_score) {
				pp -= 3;
			}
			console.log("Average: " + avg_score + " last av: " + av_score);
			av_score = avg_score;
			if(p_chart.data.labels.length > 20){
				p_chart.data.labels.pop();
				p_chart.data.datasets[0].data.pop();
			}	
		
			p_chart.data.labels.push(time1);
			p_chart.data.datasets[0].data.push(av_score);
			p_chart.update();
			}
			time = time1;
		}
		
	} else {
		time = time1;
	}

	
	
}

function clearGame() {
    //Reset grid and clear canvas.
    //RESET GRID
    for (let row = 0; row < height; row++) {
        board[row] = [];
        for (let col = 0; col < width; col++) {
            board[row][col] = {
                x: col * tileSize,
                y: row * tileSize,
                contains: []
            };
        }
    }
    //CLEAR CANVAS
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function work_fps() {
    if (starttime) {
        if (performance.now() - starttime >= 1000) {
            //Game loop.
            fps = lp;
            lp = 0;
            starttime = performance.now();
        }
    } else {
        starttime = performance.now();
    }
}




function drawBoard() {
    for (let row = 0; row < width; row++) {
        for (let col = 0; col < height; col++) {
            let cell = board[row][col];
            if (cell.contains.length > 0) {
                for (let i = cell.contains.length - 1; i >= 0; i--) {
                    let block = cell.contains[i];
                    rect(col * tileSize, row * tileSize, tileSize, tileSize, block.colour);
                    break;
                }
            } else {
                rect(col * tileSize, row * tileSize, tileSize, tileSize, "white", "rgba(0, 0, 0, 0.3)");
            }
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
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


function randomcol() {
	var CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
    return CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)];
}
