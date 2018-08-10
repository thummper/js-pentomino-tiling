//variables 
let xspan, yspan, mx, my, canvas, ctx, holder, fpsc, fps, starttime;
let mp = 0;
let filled = 0;
let score = 0;
let tileSize = 28;
let width = 32,
    height = width;
let hole_dimen = 12;
let num_holes = 0;
let difficulty = 7;
let lc = 20;
let lp = 0;
let pp = 0;
let hole_rows = 2;

let shapes = [];
let draggingShapes = [];
let pieces = [P, P, P, F, F, Y, Y, T, T, W, N, U, V, L, Z, X, I];
let board = [];
let holes = [];

window.onload = function () {
    document.body.style.opacity = "1";
    fpsc = document.getElementById("fps");
    //Start script
    setup();
};
window.setInterval(function () {
    fpsc.innerHTML = fps;
}, 1000);


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
            score += hole_score;
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
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);;
}
