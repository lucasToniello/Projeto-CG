var scene = new THREE.Scene();

class Camera {

	constructor(pi, pov){
		this.object = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
		this.object.position.set(pi[0], pi[1], pi[2]);
		this.object.lookAt(pov[0], pov[1], pov[2]);
		scene.add(this.object)
	}
}

class Car {

	object = new THREE.Object3D();
	velocidade = 0;
	aceleracao = 0;

	constructor(car){
		this.object.add(car);
		this.object.position.z = -5;
		this.camera = new Camera([-40, 40, 10], [0, 0, 0]);
		scene.add(this.object);  
		scene.add(this.camera);
	}

	movimentoFrente(){
		this.object.position.z += Math.cos(this.object.rotation.y)
		this.object.position.x += Math.sin(this.object.rotation.y)
		this.camera.object.position.z += Math.cos(this.object.rotation.y)
		this.camera.object.position.x += Math.sin(this.object.rotation.y)
	}

	movimentoRe(){
		this.object.position.z -= Math.cos(this.object.rotation.y)
		this.object.position.x -= Math.sin(this.object.rotation.y)
		this.camera.object.position.z -= Math.cos(this.object.rotation.y)
		this.camera.object.position.x -= Math.sin(this.object.rotation.y)
	}

	rotaciona(angulo){
		this.object.rotation.y += THREE.Math.degToRad(angulo);
	}

	getCamera(){
		return this.camera.object;
	}
}