import type p5 from 'p5';

export class Circle {
	position: p5.Vector;
	radius: number;
	id: number;

	constructor(position: p5.Vector, radius: number, id: number) {
		this.position = position;
		this.radius = radius;
		this.id = id;
	}
}
