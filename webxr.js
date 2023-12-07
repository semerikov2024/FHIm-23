import * as THREE from "three";
import {ARButton} from "three/addons/webxr/ARButton.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";


document.addEventListener("DOMContentLoaded", async() => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera();
	const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);

	const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
	const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
	const cube = new THREE.Mesh(geometry, material);

	cube.position.set(0, 0, -0.3);
	scene.add(cube);

	const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
	scene.add(light);

	new GLTFLoader().load(
			// resource URL
			'assets/stone.glb',
			// called when the resource is loaded
			function (model) {
				console.log("Вдалось завантажити модель", model);
				model.scene.scale.set(0.08, 0.08, 0.08);
				model.scene.position.set(-1, 0, 0);
				scene.add(model.scene);
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% моделі завантажено" );
			},
			// called when loading has errors
			function ( error ) {
				console.log("Не вдалось завантажити модель");
			}
		);



	renderer.xr.enabled = true;

	const arButton = ARButton.createButton(renderer, {
		optionalFeatures: ["dom-overlay"],
		domOverlay: {root: document.body}
	});
	document.body.appendChild(arButton);

	const controller = renderer.xr.getController(0);
	scene.add(controller);

	controller.addEventListener("select", () => {
		const geometry1 = new THREE.BoxGeometry(0.03, 0.03, 0.03);
		const material1 = new THREE.MeshPhongMaterial({color: 0xffffff * Math.random()});
		const mesh = new THREE.Mesh(geometry1, material1);
		mesh.position.applyMatrix4(controller.matrixWorld);
		mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
		scene.add(mesh);
	});

	renderer.setAnimationLoop(() => {
		renderer.render(scene, camera);
	});
});

