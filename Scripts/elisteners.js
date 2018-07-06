function add_event_listeners(cnv) {
	cnv.addEventListener("contextmenu", function(e){
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

        scrolled(e);
    });
}

function scrolled(event) {
    //When scrolling we only care about the shape that is being dragged (if there is one)
    if(draggingShapes.length > 0){
        for(let i in draggingShapes){
            let shape = draggingShapes[i];
            console.log("Scroll");
            shape.scroll();
        }
    }
}

function mouse_down(event) {

	console.log(event.button);
    //Check if we are dragging a shape, if so drop it, else look for shape to pick up. 
	
	
	if(event.button == 0){
		
	
    if (draggingShapes.length > 0) {
        //There's something in the array.
        for (let i = draggingShapes.length - 1; i >= 0; i--) {
            //Loop backwards as deleting elements. 
            let shape = draggingShapes[i];
            //Snap shape to grid. 
            gridSnap(shape);
            draggingShapes.splice(i, 1);
            shapes.push(shape);
            shape.draggable = true;
            shape.dragging = false;

            for (j in shape.blocks) {
                if (shape.blocks[i].dragging) {
                    shape.blocks[i].dragging = false;
                }
            }
        } //end shapes loop 
    } else {
        let rect = canvas.getBoundingClientRect();
        mx = event.clientX - rect.left;
        my = event.clientY - rect.top;
        for (let i = shapes.length - 1; i >= 0; i--) {
            let shape = shapes[i];
            for (let j in shape.blocks) {
                let block = shape.blocks[j];
                if (mx > block.x && mx < block.x + tileSize && my > block.y && my < block.y + tileSize) {
                    console.log("Tapped Block " + j + " of Shape " + i);
                    //If the shape is draggable and not dragging, drag the shape
                    if (shape.draggable && !shape.dragging) {
                        shape.dragging = true;
                        shape.draggable = false;
						block.dragging = true;
                        //Remove the shape from shapes array and put it in dragging shapes.
                        draggingShapes.push(shape);
                        shapes.splice(i, 1);
                    }
                    return;
                }
            } //end blocks loop 
        } //end shapes loop
    }
	drawBoard();
	holder.checkSpaces();
	//When a shape is dropped, check the holder to see if a new shape can be spawned.
	
	} else {
		//Right button. 
		if(draggingShapes.length > 0){
			for(let i = 0; i < draggingShapes.length; i++){
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
