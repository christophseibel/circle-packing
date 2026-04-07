<script lang="ts">
	import { Circle, createPipeShape, Graph } from '$lib';

	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { RectAreaLightUniformsLib } from 'three/examples/jsm/Addons.js';
	import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';
	import { FlakesTexture } from 'three/examples/jsm/Addons.js';
	import GUI from 'lil-gui';
	import { render } from 'svelte/server';

	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const scene = new THREE.Scene();
		const graph = new Graph(scene);

		const camera = new THREE.PerspectiveCamera(20, 500 / 500, 0.1, 1000);
		camera.position.set(0, 330, 300);
		camera.lookAt(0, 200, 0);

		const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;

		// const controls = new OrbitControls(camera, renderer.domElement);

		const light0 = new THREE.DirectionalLight(new THREE.Color().setRGB(1, 1, 1), 10);
		light0.position.set(1000, 140, 800);
		light0.target.position.set(0, 160, 0);

		const light1 = new THREE.DirectionalLight(new THREE.Color().setRGB(1, 1, 1), 2);
		light1.position.set(-200, 140, -50);
		light1.target.position.set(0, 160, 0);

		const lightHelper0 = new THREE.DirectionalLightHelper(light0);
		const lightHelper1 = new THREE.DirectionalLightHelper(light1);

		scene.add(light0);
		scene.add(light0.target);
		// scene.add(cameraHelper0);
		scene.add(light1);
		scene.add(light1.target);
		// scene.add(cameraHelper1);

		let i = 0;
		let amount = Math.floor(randomNumber(30, 60));
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

		i = 0;
		amount = Math.floor(randomNumber(3, 6));
		r = (Math.PI * 2) / amount;
		while (i < amount) {
			graph.addNode(
				new THREE.Vector2(
					Math.cos(r * i) * randomNumber(10, 15),
					Math.sin(r * i) * randomNumber(10, 15)
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

		const texture = new THREE.CanvasTexture(new FlakesTexture());
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.x = 0.1;
		texture.repeat.y = 0.06;

		const topMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const insideMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

		const loader = new THREE.TextureLoader();
		const matcapTexture = await loader.loadAsync('src/lib/images/matcap.png');
		const matcapMaterial = new THREE.MeshMatcapMaterial({
			color: new THREE.Color().setRGB(1, 0, 0),
			matcap: matcapTexture
		});

		const palette = [
			new THREE.Color().setRGB(0.1, 0.1, 0.5),
			new THREE.Color().setRGB(1, 0.08, 0.1),
			new THREE.Color().setRGB(0.4, 0.16, 0.7),
			new THREE.Color().setRGB(1, 0.37, 0),
			new THREE.Color().setRGB(0.1, 0.3, 0.31),
			new THREE.Color().setRGB(0.5, 0.5, 1)
		];

		graph.nodes.forEach((circle) => {
			const shape = createPipeShape(circle.radius - randomNumber(0.4, 1), circle.radius, 10);

			const geometry = new THREE.ExtrudeGeometry(shape.ringShape, {
				depth: randomNumber(198, 200),
				curveSegments: 128,
				bevelEnabled: false
			});

			const outerSideCount = 128 * 2 * 6;

			const sideGroup = geometry.groups[1];
			const sidesStart = sideGroup.start;
			const totalSideCount = sideGroup.count;

			geometry.groups = [
				geometry.groups[0],
				{ start: sidesStart, count: outerSideCount, materialIndex: 1 },
				{
					start: sidesStart + outerSideCount,
					count: totalSideCount - outerSideCount,
					materialIndex: 2
				}
			];

			const pipeMaterial = new THREE.MeshPhysicalMaterial({
				clearcoat: 1,
				clearcoatRoughness: 0.1,
				metalness: 1,
				roughness: 0.4,
				color: palette[Math.floor(randomNumber(0, palette.length + 0))],
				normalMap: texture,
				normalScale: new THREE.Vector2(0.1, 0.1),
				clearcoatNormalMap: texture,
				clearcoatNormalScale: new THREE.Vector2(0.05, 0.05)
			});

			const mesh = new THREE.Mesh(geometry, [topMaterial, pipeMaterial, insideMaterial]);
			mesh.receiveShadow = true;
			mesh.castShadow = true;
			mesh.position.x = circle.position.x;
			mesh.position.z = circle.position.y;
			mesh.rotation.x = -Math.PI / 2;
			mesh.name = 'pipe';
			scene.add(mesh);
		});

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

<style>
	canvas {
		background: linear-gradient(#5c93e4, #d4d7ec);
	}
</style>
