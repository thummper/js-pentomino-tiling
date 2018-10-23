class EventListeners {
	
	constructor(canvas, game) {
		this.canvas = canvas;
		this.game = game;
		this.addListeners();
		this.mx;
		this.my;
	}
	
	addListeners() {
		let cnv = this.canvas;
		cnv.addEventListener('contextmenu', this.contextMenu.bind(this));
		cnv.addEventListener('mousedown', this.mousePressed.bind(this));
		cnv.addEventListener('mousemove', this.mouseMoved.bind(this));
		cnv.addEventListener('keydown', this.keyPressed.bind(this));
		cnv.addEventListener('wheel', this.mouseWheel.bind(this));

	}
	
	contextMenu(event) {
		event.preventDefault();
		event.stopPropagation();
	}

	mouseIn(block) {
		return (this.mx > block.x && this.mx < block.x + this.game.tileSize && this.my > block.y && this.my < block.y + this.game.tileSize);
	}

	mousePressed(event) {
		//Left click
		if (event.button == 0) {
			if (this.game.dragShape != null) {
				//We are dragging a shape, drop it.
				let shape = this.game.dragShape;
				
				shape.checkBounds();
				this.game.shapes.push(shape);
				shape.draw();
				
				//Perhaps this is firing before the grid is made? 
				this.game.holder.checkSpaces();
				this.game.holder.trySpawn();
				this.game.dragShape = null;
			} else {
				//Nothing is currently being dragged.
				
				let rect = this.canvas.getBoundingClientRect();
				this.mx = event.clientX - rect.left;
				this.my = event.clientY - rect.top;

				for (let i = this.game.shapes.length - 1; i >= 0; i--) {
					let shape = this.game.shapes[i];
					
					if (!shape.dragging) {
						let blocks = shape.blocks;
						for (let j = 0, k = blocks.length; j < k; j++) {
							let block = blocks[j];
					
							if (block.type == 'shape') {
							
								if (this.mouseIn(block)) {
									//Pick up the shape.
									block.dragging = true;
									shape.dragging = true;
									this.game.dragShape = shape;
									this.game.shapes.splice(i, 1);
								}
							}
						}
					}
					
				}
			}
		} else {
			//Right button
			if (this.game.dragShape != null) {
				this.game.dragShape.mirror();
			}
		} 
	}
	
	mouseMoved(event) {
		let rect = this.canvas.getBoundingClientRect();
		this.mx = event.clientX - rect.left;
		this.my = event.clientY - rect.top;
		


	}
	
	mouseWheel(event) {
		event.preventDefault();
		let direction = false;
		if (event.deltaY < 0) {
			direction = true;
		}
		this.scroll(direction);
	}
	
	scroll(direction) {
		//Will scroll based on boolean value
		if (this.game.dragShape != null) {
			this.game.dragShape.scroll();
		}
	}
	keyPressed(event) {
		let kc = event.keyCode;
		if (kc == 65) {
			//Scroll 
			this.scroll(true);
		}
		if (kc == 90) {
			//Scroll
			this.scroll(false);
		}
	}
	
}
