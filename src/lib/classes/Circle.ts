import type p5 from 'p5';
import * as THREE from 'three';
import { thickness } from 'three/tsl';

export class Circle {
	position: THREE.Vector2;
	radius: number;

	constructor(position: THREE.Vector2, radius: number) {
		this.position = position;
		this.radius = radius;
	}

	// update() {
	// 	this.mesh.position.x = this.position.x;
	// 	this.mesh.position.z = this.position.y;
	// 	this.mesh.geometry.dispose();
	// 	this.mesh.geometry = createPipeGeometry(this.radius - this.thickness, this.radius, 10);
	// }
}
