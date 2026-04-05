<script lang="ts">
	import { Circle, createPipeShape, Graph } from '$lib';

	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const scene = new THREE.Scene();
		const graph = new Graph(scene);

		const camera = new THREE.PerspectiveCamera(20, 500 / 500, 0.1, 1000);
		camera.position.set(0, 400, 300);
		camera.lookAt(0, 200, 0);

		const renderer = new THREE.WebGLRenderer({ canvas: canvas });

		const gridHelper = new THREE.GridHelper(10, 10);
		scene.add(gridHelper);

		const color = 0xffffff;
		const intensity = 10;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(20, 10, 20);
		light.target.position.set(0, 0, 0);
		scene.add(light);
		scene.add(light.target);

		// new OrbitControls(camera, renderer.domElement);

		let i = 0;
		let amount = Math.floor(randomNumber(30, 50));
		let r = (Math.PI * 2) / amount;
		while (i < amount) {
			graph.addNode(
				new THREE.Vector2(
					Math.cos(r * i) * randomNumber(40, 45),
					Math.sin(r * i) * randomNumber(40, 45)
				),
				2
			);
			i++;
		}

		i = 0;
		amount = Math.floor(randomNumber(15, 30));
		r = (Math.PI * 2) / amount;
		while (i < amount) {
			graph.addNode(
				new THREE.Vector2(
					Math.cos(r * i) * randomNumber(20, 30),
					Math.sin(r * i) * randomNumber(20, 30)
				),
				2
			);
			i++;
		}

		graph.addNode(new THREE.Vector2(0, 0), 2);

		graph.triangulate();

		for (let i = 0; i < 1000; i++) {
			graph.optimize();
		}

		graph.nodes.forEach((circle) => {
			const shape = createPipeShape(circle.radius - randomNumber(0.4, 1), circle.radius, 10);
			const geometry = new THREE.ExtrudeGeometry(shape, {
				curveSegments: 128,
				depth: randomNumber(198, 200),
				bevelSize: 0
			});
			const matSide = new THREE.MeshStandardMaterial({ color: 0xffffff });
			const matStart = new THREE.MeshStandardMaterial({ color: 0xff0000 });
			const matEnd = new THREE.MeshStandardMaterial({ color: 0x0000ff });

			const mesh = new THREE.Mesh(geometry, [matSide, matStart, matEnd]);
			mesh.position.x = circle.position.x;
			mesh.position.z = circle.position.y;
			mesh.rotation.x = -Math.PI / 2;
			scene.add(mesh);
		});

		// const controls = new OrbitControls(camera, renderer.domElement);
		// controls.target.set(0, 200, 0);

		// const geometry = createPipeGeometry(0, 2, 2);
		// const circle = new Circle(new THREE.Vector2(0, 0), 2);

		renderer.setAnimationLoop((time: number) => {
			renderer.render(scene, camera);
		});
	});

	function randomNumber(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}
</script>

<canvas bind:this={canvas} width={700} height={700}></canvas>

<!-- <P5 {sketch} /> -->
<!-- 
<input type="checkbox" bind:checked={debug} /> -->
