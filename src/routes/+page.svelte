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
			p5.createCanvas(700, 700, p5.WEBGL);
			p5.angleMode(p5.DEGREES);

			let seed = p5.random(100000000000);
			p5.randomSeed(seed);
			graph = new Graph(p5);

			let i = 0;
			let amount = 100;
			let r = 360 / amount;
			while (i < amount) {
				graph.addNode(
					p5.createVector(p5.cos(r * i) * p5.random(180, 200), p5.sin(r * i) * p5.random(180, 200)),
					2
				);
				i++;
			}

			i = 0;
			amount = 50;
			r = 360 / amount;
			while (i < amount) {
				graph.addNode(
					p5.createVector(p5.cos(r * i) * p5.random(80, 120), p5.sin(r * i) * p5.random(80, 120)),
					2
				);
				i++;
			}

			i = 0;
			amount = 7;
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
			p5.noLoop();
		};

		p5.draw = () => {
			p5.background('#080809');
			p5.camera(0, -400, 400, 0, 100, 0);
			p5.directionalLight(255, 255, 255, -1, 1, 1);
			p5.ambientLight('#dbd9cd');

			graph.display(debug);
			graph.optimize();
		};

		p5.keyPressed = () => {
			if (p5.keyCode === 13) {
				debug = !debug;
			}

			if (p5.keyCode === 32) {
				if (reload) {
					reload = false;
					p5.setup();
				} else {
					reload = true;
					p5.loop();
				}
			}
		};
	};
</script>

<P5 {sketch} />
<!-- 
<input type="checkbox" bind:checked={debug} /> -->
