import { Circle } from './Circle';
import { Delaunay } from 'd3';
import type p5 from 'p5';

export class Graph {
	nodes: Circle[] = [];
	edges: Set<number>[] = [];

	center: p5.Vector;

	p5: p5;
	seed: number;

	palette = [
		'#1870a5',
		'#462013',
		'#e03c10',
		'#1e4851',
		'#8f4921',
		'#8c180e',
		'#ed961d',
		'#a1822c',
		'#afb4a0'
	];

	constructor(p5: p5) {
		this.p5 = p5;
		this.center = p5.createVector(p5.width / 2, p5.height / 2);
		this.seed = this.p5.random(1000000);
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

	optimize(): number {
		let i = 0;
		let totalState = 0;
		while (i < 20) {
			this.edges.forEach((edge, index) => {
				const circle = this.nodes[index];

				let totalForce = this.p5.createVector(0, 0);
				let circleGrowth = 0;

				edge.forEach((index) => {
					const neighbor = this.nodes[index];

					let direction = circle.position.copy().sub(neighbor.position);
					let overlap = direction.mag() - (circle.radius + neighbor.radius);
					let force = direction.normalize().mult(overlap);

					circleGrowth += overlap;
					totalForce.add(force);
				});

				circle.position.sub(totalForce.mult(0.01));
				circle.radius = circle.radius + circleGrowth * 0.001;

				totalState += totalForce.mag();
			});
			i++;
		}

		return totalState;
	}

	display(debug: boolean) {
		this.p5.randomSeed(this.seed);
		this.edges.forEach((edge, index) => {
			const circleA = this.nodes[index];

			this.p5.push();

			this.p5.translate(circleA.position.x, 500, circleA.position.y);
			// this.p5.rotateX(90);
			this.p5.fill(this.p5.random(this.palette));
			if (debug) {
				this.p5.stroke(this.p5.random(this.palette));
				this.p5.fill(255);
				// this.p5.text(index, 0, 0);
				this.p5.noFill();
			}

			// this.p5.stroke(this.p5.random(this.palette));
			// this.p5.strokeWeight(0.25);

			this.p5.cylinder(circleA.radius * 0.98, this.p5.random(1000, 1080));

			this.p5.pop();

			edge.forEach((index) => {
				const circleB = this.nodes[index];
				this.p5.push();
				this.p5.stroke(this.p5.random(this.palette));
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
