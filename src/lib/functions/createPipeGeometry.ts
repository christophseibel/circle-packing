import * as THREE from 'three';

export function createPipeShape(
	innerRadius: number,
	outerRadius: number,
	height: number
): THREE.Shape {
	const ringShape = new THREE.Shape();
	ringShape.moveTo(0, 0);
	ringShape.ellipse(0, 0, outerRadius, outerRadius, 0, Math.PI * 2);

	const ringHoleShape = new THREE.Shape();
	ringHoleShape.moveTo(0, 0);
	ringHoleShape.ellipse(0, 0, innerRadius, innerRadius, 0, Math.PI * 2);

	ringShape.holes.push(ringHoleShape);

	return ringShape;
}
