import { Circle } from './Circle';
import type p5 from 'p5';

export class Graph {
	nodes: Map<number, Circle> = new Map();
	edges: Map<number, Set<Circle>> = new Map();

	nodeCount = 0;

	addNode(position: p5.Vector, radius: number): Circle {
		let circle = new Circle(position, radius, this.nodeCount);
		this.nodes.set(this.nodeCount, circle);
		this.edges.set(this.nodeCount, new Set());

		this.nodeCount++;

		return circle;
	}

	connect(circleA: Circle, circleB: Circle) {
		this.edges.get(circleA.id)?.add(circleB);
		this.edges.get(circleB.id)?.add(circleA);
	}

	optimize() {}

	getNeighbors(circle: Circle): Circle[] {
		return [...(this.edges.get(circle.id) || [])];
	}
}
