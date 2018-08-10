function add_event_listeners(cnv) {
    cnv.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    //Add mouse listeners.
    cnv.addEventListener("mousedown", function (e) {
        mouse_down(e);
    });
    cnv.addEventListener("mouseup", function (e) {
        //mouse_up(e);
    });
    cnv.addEventListener("mousemove", function (e) {
        mouse_move(e);
    });
    window.addEventListener("wheel", function (e) {
        scrolled(e.deltaY < 0);
    });
    window.addEventListener("keydown", function(e){
        let code = e.keyCode;
        if(code == 65){
            //Scroll up.
            scrolled(false);
        }
        if(code == 90){
           //Scroll down
            scrolled(true);
           }
    });
}

function scrolled(event) {
    //When scrolling we only care about the shape that is being dragged (if there is one)
    if (draggingShapes.length > 0) {
        for (let i in draggingShapes) {
            let shape = draggingShapes[i];
            console.log("Scroll");
            shape.scroll();
           
        }
    }
}

function mouse_down(event) {

    console.log(event.button);
    //Check if we are dragging a shape, if so drop it, else look for shape to pick up. 
    if (event.button == 0) {
        //If LEFT CLICK
        if (draggingShapes.length > 0) {
            
            //There's something in the array.
            for (let i = draggingShapes.length - 1; i >= 0; i--) {
                //Loop backwards as deleting elements. 
                let shape = draggingShapes[i];
                shape.draw_on_mouse();
                //Snap shape to grid. 
              
                draggingShapes.splice(i, 1);
                shapes.push(shape);
                shape.draggable = true;
                shape.dragging = false;
                
                for(let j = 0; j < shape.blocks.length; j++){
                    for(let k = 0; k < shape.blocks[j].length; k++){
                        let block = shape.blocks[j][k];
                        if(block.dragging){
                            block.dragging = false;
                        }
                    }
                }
        
                shape.draw();
            } //end shapes loop 
        } else {
            //Nothing in the array.
            let rect = canvas.getBoundingClientRect();
            mx = event.clientX - rect.left;
            my = event.clientY - rect.top;
            
            for (let i = shapes.length - 1; i >= 0; i--) {
                let shape = shapes[i];
                
                for (let j in shape.blocks) {
                    
                    for (let k in shape.blocks[j]) {
                        let block = shape.blocks[j][k];
                        
                        if (block.solid && (mx > block.x && mx < block.x + tileSize) && (my > block.y && my < block.y + tileSize)) {
                            if (shape.draggable && !shape.dragging) {
                                block.dragging = true;
                                shape.dragging = true;
                                shape.draggable = false;
                                draggingShapes.push(shape);
                                shapes.splice(i, 1);
                            }
                        }
                    }
                    
                }
            }
        }
        
        drawBoard();
        holder.checkSpaces();
        //When a shape is dropped, check the holder to see if a new shape can be spawned.
        
    } else {
        //Right button. 
        if (draggingShapes.length > 0) {
            for (let i = 0; i < draggingShapes.length; i++) {
                let shape = draggingShapes[i];
                shape.mirror();
            }
        }
    }
    
}

function mouse_move(event) {
    let rect = canvas.getBoundingClientRect();
    mx = event.clientX - rect.left;
    my = event.clientY - rect.top;
    
}
