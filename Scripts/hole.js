var Hole = function (x, y, d) {
	this.x = x;
	this.y = y;
	this.difficulty = d;
	this.blocks;
}

Hole.prototype.generate = function () {
	//Generates a hole that can be filled with pentominos.
	//Lets say that difficulty is the amount of pentominoes this hole is made from.
	let shapes;
	for(let i = 0; i < this.difficulty; i++){
		shapes.push(this.pickPattern());
	}
	//Now we have to combine the shapes in the array somehow. 
	
	
}
Hole.prototype.pickPattern = function () {
	var p = pieces[parseInt(Math.random() * pieces.length, 10)].slice();
	return p;
}
