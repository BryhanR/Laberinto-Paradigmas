
/*
* 			INTEGRANTES:
*
*	ALEXANDRA AGUILAR NAJERA	304780037
*	MASSIEL MORA RODRIGUEZ		604190071
* 	BRYHAN RODRIGUEZ MORA		115420325
*	JEAN CARLO VARGAS ZUÑIGA	402220474
*/


class Point{

	constructor(x, y){
		this.x = x || 0;
		this.y = y || 0;
	}

	add(v){
		return new Point(this.x + v.x, this.y + v.y);
	}
	
	clone(){
		return new Point(this.x, this.y);
	}
	
	degreesTo(v){
		let dx = this.x - v.x;
		let dy = this.y - v.y;
		let angle = Math.atan2(dy, dx); // radians
		return angle * (180 / Math.PI); // degrees
	}
	
	distance(v){
		let x = this.x - v.x;
		let y = this.y - v.y;
		return Math.sqrt(x * x + y * y);
	}
	
	equals(toCompare){
		return this.x == toCompare.x && this.y == toCompare.y;
	}
	
	interpolate(v, f){
		return new Point( v.x + (this.x - v.x) * f, v.y + (this.y - v.y) * f );
	}
	
	length(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	
	normalize(thickness){
		let l = this.length();
		this.x = this.x / l * thickness;
		this.y = this.y / l * thickness;
	}

	offset(dx, dy){
		this.x += dx;
		this.y += dy;
	}
	subtract(v){
		return new Point(this.x - v.x, this.y - v.y);
	}
	
	toString(){
		return "(x=" + this.x + ", y=" + this.y + ")";
	}
	
	distance(pt1, pt2){
		let x = pt1.x - pt2.x;
		let y = pt1.y - pt2.y;
		return Math.sqrt(x * x + y * y);
	}
}