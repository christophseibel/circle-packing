import { Circle } from './Circle';
import Delaunator from 'delaunator';
import type p5 from 'p5';

export class Graph {
	nodes: Circle[] = [];
	edges: Set<number>[] = [];

	p5: p5;

	constructor(p5: p5) {
		this.p5 = p5;
	}

	addNode(position: p5.Vector, r: number): Circle {
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
		const triangulation = Delaunator.from(
			this.nodes,
			(n) => n.position.x,
			(n) => n.position.y
		);

		for (let i = 0; i < triangulation.triangles.length; i++) {
			const a = triangulation.triangles[i];
			const b = triangulation.triangles[next(i)];
			this.connect(a, b);
		}
		return triangulation;
	}

	optimize() {
		let i = 0;
		while (i < 5) {
			this.edges.forEach((edge, index) => {
				let totalForce = this.p5.createVector(0, 0);
				let circleGrowth = 0;
				const circle = this.nodes[index];

				edge.forEach((index) => {
					const neighbor = this.nodes[index];

					let direction = circle.position.copy().sub(neighbor.position);
					let overlap = direction.mag() - (circle.radius + neighbor.radius);
					let force = direction.normalize().mult(overlap);

					circleGrowth += overlap;
					totalForce.add(force);
				});
				circle.position.sub(totalForce.mult(0.1));
				circle.radius = circle.radius + circleGrowth * 0.01;
			});
			i++;
		}
	}

	display(debug: boolean) {
		this.p5.randomSeed(1);
		this.edges.forEach((edge, index) => {
			const circleA = this.nodes[index];

			this.p5.push();

			this.p5.translate(circleA.position.x, circleA.position.y);
			this.p5.fill(this.p5.random(100, 255));
			if (debug) {
				this.p5.noFill();
			}
			this.p5.ellipse(0, 0, circleA.radius * 2);
			this.p5.pop();

			edge.forEach((index) => {
				const circleB = this.nodes[index];
				this.p5.push();
				this.p5.stroke('blue');
				if (debug)
					this.p5.line(
						circleA.position.x,
						circleA.position.y,
						circleB.position.x,
						circleB.position.y
					);
				this.p5.pop();
			});
		});
	}
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
