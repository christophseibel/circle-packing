<script lang="ts">
	import P5 from '$lib/components/P5.svelte';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/types/index.js';
	import { Circle } from '$lib/classes/Circle';
	import { Graph } from '$lib/classes/Graph';

	let width = 55;
	let height = 55;

	let graph: Graph;
	let debug = $state(false);
	let reload = false;

	const sketch: Sketch = (p5: p5) => {
		p5.setup = () => {
			p5.createCanvas(600, 650, p5.WEBGL);
			p5.angleMode(p5.DEGREES);

			let seed = p5.random(100000000000);
			p5.randomSeed(seed);
			graph = new Graph(p5);

			let i = 0;
			let amount = p5.random(30, 50);
			let r = 360 / amount;
			while (i < amount) {
				graph.addNode(
					p5.createVector(p5.cos(r * i) * p5.random(180, 200), p5.sin(r * i) * p5.random(180, 200)),
					2
				);
				i++;
			}

			i = 0;
			amount = p5.random(15, 30);
			r = 360 / amount;
			while (i < amount) {
				graph.addNode(
					p5.createVector(p5.cos(r * i) * p5.random(80, 120), p5.sin(r * i) * p5.random(80, 120)),
					2
				);
				i++;
			}

			i = 0;
			amount = p5.random(3, 14);
			r = 360 / amount;
			while (i < amount) {
				graph.addNode(
					p5.createVector(p5.cos(r * i) * p5.random(20, 70), p5.sin(r * i) * p5.random(20, 70)),
					5
				);
				i++;
			}

			graph.addNode(p5.createVector(0, 0), 10);

			graph.triangulate();
			p5.frameRate(60);
			p5.noStroke();
		};

		p5.draw = () => {
			p5.background('#5252f1');
			p5.camera(0, -400, 400, 0, 100, 0);
			p5.directionalLight(p5.color(180, 180, 255), p5.createVector(-0.8, 0.1, -0.05));
			p5.directionalLight(p5.color(255, 255, 255), p5.createVector(0, 1, 0));

			p5.ambientLight('#374287');

			graph.display(debug);
			graph.optimize();
		};

		p5.keyPressed = () => {
			if (p5.keyCode === 13) {
				debug = !debug;
			}

			if (p5.keyCode === 32) {
				p5.setup();
			}
		};
	};
</script>

<P5 {sketch} />
<!-- 
<input type="checkbox" bind:checked={debug} /> -->
