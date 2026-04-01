import type p5 from 'p5';

export class Circle {
	position: p5.Vector;
	radius: number;

	constructor(position: p5.Vector, radius: number) {
		this.position = position;
		this.radius = radius;
	}
}
