<script lang="ts">
	import P5 from '$lib/components/P5.svelte';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/types/index.js';
	import { Circle } from '$lib/classes/Circle';
	import { Graph } from '$lib/classes/Graph';
	import Delaunator from 'delaunator';

	let width = 55;
	let height = 55;

	let graph: Graph;

	const sketch: Sketch = (p5: p5) => {
		graph = new Graph(p5);

		let debug = false;

		p5.setup = () => {
			p5.createCanvas(700, 700);
			p5.noStroke();

			let seed = p5.random(100000000000);
			console.log(seed);
			p5.randomSeed(seed);

			let i = 0;
			while (i < 50) {
				graph.addNode(p5.createVector(p5.random(p5.width), p5.random(p5.height)), 10);
				i++;
			}

			graph.triangulate();

			p5.noLoop();
			p5.frameRate(30);
		};

		p5.draw = () => {
			p5.background(0);
			graph.optimize();
			graph.display(false);
		};

		p5.mouseClicked = () => {};

		p5.mousePressed = () => {
			p5.loop();
		};

		p5.mouseReleased = () => {
			p5.noLoop();
		};
	};
</script>

<P5 {sketch} />
