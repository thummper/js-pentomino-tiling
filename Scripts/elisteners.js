class EventListeners{
	constructor(canvas, game){
		this.canvas = canvas;
		this.game = game;
		this.addListeners();
		this.mx;
		this.my;
	}
	addListeners(){
		let cnv = this.canvas;
		cnv.addEventListener('contextmenu', this.contextMenu(event));
		cnv.addEventListener('mousedown', this.mousePressed(event));
		cnv.addEventListener('mousemove', this.mouseMoved(event));
		cnv.addEventListener('keydown', this.keyPressed(event));
		cnv.addEventListener('wheel', this.mouseWheel(event));		
		
	}
	contextMenu(event){
		event.preventDefault();
		event.stopPropagation();
	}
	mousePressed(event){
		if (event.button == 0) {
			if(this.game.dragShape != null){
				//We are dragging a shape, drop it.
				let shape = this.game.dragShape;
				this.game.shapes.push(shape);
				shape.draggable = true;
				shape.dragging = false;
				//TODO, move this to the shapes class.
				for(let j = 0, k = shape.blocks.length; j < k; j++){
					for(let l = 0, m = shape.blocks[j].length; l < m; l++){
						let block = shape.blocks[j][l];
						if(block.dragging){
							block.dragging = false;
						}
					}
				}
				shape.draw();
				this.game.dragShape = null;
			} else {
				//Nothing is being dragged.
				let rect = this.canvas.getBoundingClientRect();
				this.mx = event.clientX - rect.left;
				this.my = event.clientY = rect.top;
				for(let i = this.game.shapes.length - 1; i >= 0; i--){
					let shape = this.game.shapes[i];
					for(let j = 0, k = shape.blocks.length; j < k; j++){
						for(let l = 0, m = shape.blocks[i].length; l < m; l++){
							let block = shape.blocks[j][k];
							if(shape.draggable && !shape.dragging && block.solid && (this.mx > block.x && this.mx < block.x + this.game.tileSize) && (this.my > block.y && my < block.y + this.game.tileSize)){
								block.dragging = true;
								shape.dragging = true;
								shape.draggable = false;
								this.game.dragShape = shape;
								this.game.shapes.splice(i, 1);
							}
						}
					}
				}
			}
		} else {
			//Right button
			if(this.game.dragShape != null){
				this.game.dragShape.mirror();
			}
			
		}
		//Check holders 
	}
	mouseMoved(event){
		let rect = this.canvas.getBoundingClientRect();
		this.mx = event.clientX - rect.left;
    	this.my = event.clientY - rect.top;
		
	}
	mouseWheel(event){
		let direction = false;
		if(event.deltaY < 0){
			direction = true;
		}
		this.scroll(direction);
	}
	scroll(direction){
		//Will scroll based on boolean value
		if(this.game.dragShape != null){
			this.game.dragShape.scroll();
		}
	}
	keyPressed(event){
		let kc = event.keyCode;
		if(kc == 65){
			//Scroll 
			this.scroll(true);
		}
		if(kc == 90){
			//Scroll
			this.scroll(false);
		}
		
	}
}
