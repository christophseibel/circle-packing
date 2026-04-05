import { Circle } from './Circle';
import { Delaunay } from 'd3';
import type p5 from 'p5';
import * as THREE from 'three';

export class Graph {
	nodes: Circle[] = [];
	edges: Set<number>[] = [];

	scene: THREE.Scene;

	palette = ['#0cdfae', '#17bb3a', '#fcd217', '#f32f59', '#e612fa'];

	constructor(scene: THREE.Scene) {
		this.scene = scene;
	}

	addNode(position: THREE.Vector2, r: number): Circle {
		const circle = new Circle(position, r);
		this.nodes.push(circle);
		this.edges.push(new Set());

		return circle;
	}

	connect(a: number, b: number) {
		this.edges[a].add(b);
		this.edges[b].add(a);
	}

	triangulate() {
		const coords = new Float64Array(this.nodes.length * 2);
		this.nodes.forEach((n, i) => {
			coords[i * 2] = n.position.x;
			coords[i * 2 + 1] = n.position.y;
		});
		const delaunay = new Delaunay(coords);

		const { triangles } = delaunay;
		for (let i = 0; i < triangles.length; i += 3) {
			const a = triangles[i];
			const b = triangles[i + 1];
			const c = triangles[i + 2];
			this.connect(a, b);
			this.connect(b, c);
			this.connect(c, a);
		}

		return delaunay;
	}

	optimize() {
		let i = 0;
		while (i < 10) {
			this.edges.forEach((edge, index) => {
				const circle = this.nodes[index];
				let totalForce = new THREE.Vector2(0, 0);
				let circleGrowth = 0;
				edge.forEach((index) => {
					const neighbor = this.nodes[index];
					let direction = neighbor.position.clone().sub(circle.position);
					let overlap = direction.length() - (circle.radius + neighbor.radius);
					let force = direction.normalize().multiplyScalar(overlap);
					circleGrowth += overlap;
					totalForce.add(force);
				});
				circle.position.add(totalForce.multiplyScalar(0.01));
				circle.radius = circle.radius + circleGrowth * 0.001;
			});
			i++;
		}
	}

	display() {}
}

const next = (i: number) => i - (i % 3) + ((i + 1) % 3);

//	let totalForce = p5.createVector(0, 0);
//	let circleGrowth = 0;
//  graph.getNeighbors(circle).forEach((neighbor) => {
// 	let direction = circle.position.copy().sub(neighbor.position);
// 	let overlap = direction.mag() - (circle.radius + neighbor.radius);
// 	let force = direction.normalize().mult(overlap);

// 	circleGrowth += overlap;
// 	totalForce.add(force);

// 	p5.push();
// 	p5.stroke(255);
// 	p5.line(circle.position.x, circle.position.y, neighbor.position.x, neighbor.position.y);
// 	p5.pop();
// });

// circle.radius = circle.radius + circleGrowth * 0.01;
// circle.position.sub(totalForce.mult(0.1));
