<script lang="ts">
	import P5 from '$lib/components/P5.svelte';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/types/index.js';
	import { Circle } from '$lib/classes/Circle';
	import { Graph } from '$lib/classes/Graph';
	let width = 55;
	let height = 55;

	let graph = new Graph();

	const sketch: Sketch = (p5: p5) => {
		p5.setup = () => {
			p5.createCanvas(700, 700);
			p5.noStroke();

			let circle0 = graph.addNode(p5.createVector(100, 100), 20);
			let circle1 = graph.addNode(p5.createVector(600, 200), 20);
			let circle2 = graph.addNode(p5.createVector(450, 350), 20);
			let circle3 = graph.addNode(p5.createVector(500, 600), 20);
			let circle4 = graph.addNode(p5.createVector(100, 600), 20);
			let circle5 = graph.addNode(p5.createVector(300, 500), 20);
			let circle6 = graph.addNode(p5.createVector(270, 350), 20);
			let circle7 = graph.addNode(p5.createVector(260, 280), 20);
			let circle8 = graph.addNode(p5.createVector(350, 280), 20);

			let circleA = graph.addNode(p5.createVector(260, 200), 20);

			// graph.connect(circle0, circle1);

			graph.connect(circle0, circleA);
			graph.connect(circleA, circle1);
			graph.connect(circleA, circle7);
			graph.connect(circle1, circle2);
			graph.connect(circle2, circle3);
			graph.connect(circle3, circle5);
			graph.connect(circle5, circle4);
			graph.connect(circle4, circle0);

			graph.connect(circle0, circle6);
			graph.connect(circle1, circle6);
			graph.connect(circle2, circle6);
			graph.connect(circle3, circle6);
			graph.connect(circle4, circle6);
			graph.connect(circle5, circle6);

			graph.connect(circle7, circle0);
			graph.connect(circle7, circle1);
			graph.connect(circle7, circle6);

			graph.connect(circle8, circle1);
			graph.connect(circle8, circle2);
			graph.connect(circle8, circle6);

			// graph.connect(circle1, circle4);
			// graph.connect(circle0, circle2);
			graph.connect(circle3, circle4);

			console.log(graph.edges);

			p5.noLoop();
			p5.frameRate(30);
		};

		p5.draw = () => {
			p5.background(0);
			p5.randomSeed(2);

			graph.nodes.forEach((circle) => {
				let totalForce = p5.createVector(0, 0);
				let circleGrowth = 0;

				p5.push();
				p5.stroke(255);
				p5.strokeWeight(1);
				graph.getNeighbors(circle).forEach((neighbor) => {
					let direction = circle.position.copy().sub(neighbor.position);
					let overlap = direction.mag() - (circle.radius + neighbor.radius);
					let force = direction.normalize().mult(overlap);

					circleGrowth += overlap;
					totalForce.add(force);

					p5.push();
					p5.stroke(255);
					// p5.line(circle.position.x, circle.position.y, neighbor.position.x, neighbor.position.y);
					p5.pop();
				});

				circle.radius = circle.radius + circleGrowth * 0.01;
				circle.position.sub(totalForce.mult(0.1));
				p5.noFill();
				p5.push();
				p5.translate(circle.position.x, circle.position.y);

				p5.stroke(p5.random(20, 255));
				// p5.fill(p5.random(20, 255));
				p5.ellipse(0, 0, circle.radius * 1.9);
				p5.pop();
				p5.pop();
			});
		};

		p5.mouseClicked = () => {
			p5.loop();
		};
	};
</script>

<P5 {sketch} />
