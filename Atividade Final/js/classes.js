var scene = new THREE.Scene();

class Camera {

	object = null;

	constructor(pi, pov){
		this.object = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
		this.object.position.set(pi[0], pi[1], pi[2]);
		this.object.lookAt(pov[0], pov[1], pov[2]);
		scene.add(this.object)
	}
}

class Car {

	object = new THREE.Object3D();
	camera = null;
	velocidade = 0;
	aceleracao = 0;

	constructor(car){
		this.object.add(car);
		this.object.position.z = -5;
		this.camera = new Camera([0, 2, -6], [0, 0, 5]);
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
		this.camera.object.rotation.y -= THREE.Math.degToRad(angulo);
	}

	getCamera(){
		return this.camera.object;
	}
}

// class Obstaculo {

// }

class Pista {

	curvas = new THREE.Group();
	// Obstaculos aqui

	constructor(){
		this.curvaInicio = this.novaCurva([-7, 0, 0], [-7, -14, 0], [7, -14, 0], [7, 0, 0]);
		scene.add(this.curvaInicio);	
		scene.add(this.curvas);
	}

	novaCurva(p0, p1, p2, p3){

		var curve = new THREE.CubicBezierCurve(
			new THREE.Vector3(p0[0], p0[1], p0[2]),
			new THREE.Vector3(p1[0], p1[1], p1[2]),
			new THREE.Vector3(p2[0], p2[1], p2[2]),
			new THREE.Vector3(p3[0], p3[1], p3[2])
		)

		var points = curve.getPoints(50);
		var geometry = new THREE.BufferGeometry().setFromPoints(points);
		var material = new THREE.LineBasicMaterial({ color : 0x000000 });
		var curva = new THREE.Line(geometry, material);
		curva.rotation.x = THREE.Math.degToRad(90);

		return curva
	}

	adicionaTracado(){	
		var p0, p1, p2, p3;

		for (var i = 0; i < 7; i += 0.01){
			p0 = [-i, 0, 0];
			p1 = [-30-i, 30+i, 0];
			p2 = [30+i, 30+i, 0];
			p3 = [i, 0, 0];
			this.curvas.add(novaCurva([p0, p1, p2, p3]))
		}
	}
}