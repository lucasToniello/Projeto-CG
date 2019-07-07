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
	cameraPerspectiva = null;
	velocidade = 0;
	aceleracao = 0;

	constructor(car){
		this.object.add(car);
		this.object.position.z = -5;
		this.camera = new Camera([0, 2, -5], [0, 2, 5]);
		this.cameraPerspectiva = new Camera([-40, 40, 10], [0, 0, 0]);
		scene.add(this.object);  
		scene.add(this.camera);
		scene.add(this.cameraPerspectiva);
	}

	movimentoFrente(){
		this.object.position.z += 1.5*Math.cos(this.object.rotation.y);
		this.object.position.x += 1.5*Math.sin(this.object.rotation.y);
		this.camera.object.position.z += 1.5*Math.cos(this.object.rotation.y);
		this.camera.object.position.x += 1.5*Math.sin(this.object.rotation.y);
		this.cameraPerspectiva.object.position.z += 1.5*Math.cos(this.object.rotation.y);
		this.cameraPerspectiva.object.position.x += 1.5*Math.sin(this.object.rotation.y);
	}

	movimentoRe(){
		this.object.position.z -= Math.cos(this.object.rotation.y);
		this.object.position.x -= Math.sin(this.object.rotation.y);
		this.camera.object.position.z -= Math.cos(this.object.rotation.y);
		this.camera.object.position.x -= Math.sin(this.object.rotation.y);
		this.cameraPerspectiva.object.position.z -= Math.cos(this.object.rotation.y);
		this.cameraPerspectiva.object.position.x -= Math.sin(this.object.rotation.y);
	}

	rotaciona(angulo){
		this.object.rotation.y += THREE.Math.degToRad(angulo);
		this.camera.object.rotation.y -= THREE.Math.degToRad(angulo);
	}

	getCamera(){
		return this.camera.object;
	}

	getCameraPerspectiva(){
		return this.cameraPerspectiva.object;
	}
}

class Reta {

	x0 = 0;
	y0 = 0;
	mx = 1; // apenas 0 ou 1
	my = 1;

	constructor(x0, y0, mx, my){
		this.x0 = x0;
		this.y0 = y0;
		this.mx = mx; 
		this.my = my;
	}

	getPonto(dx){
		var x = this.x0 + (this.mx*dx);
		var y = this.y0 + (this.my*dx)

		return [x, y, 0];
	}
}

class Obstaculo {

	object = null;
	mx = 0;
	mz = 0;
	dist = 0;
	distMaxima = 0;

	constructor(pos, mx, mz, distMaxima){
		var geometry = new THREE.BoxGeometry(3, 3, 3);
		var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
		this.object = new THREE.Mesh(geometry, material);
		this.object.position.z = 16;
		this.mx = mx;
		this.mz = mz;
		this.distMaxima = distMaxima;
		scene.add(this.object);
	}

	move(d){
		this.object.position.x += (this.mx*d);
		this.object.position.z += (this.mz*d);
		this.dist += d;

		if (this.dist > this.distMaxima){
			this.dist = 0;
			this.mx *= (-1);
			this.mz *= (-1);
		}
	}
}

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
		var material = new THREE.LineBasicMaterial({color : 0x000000});
		var curva = new THREE.Line(geometry, material);
		curva.rotation.x = THREE.Math.degToRad(90);

		return curva
	}

	adicionaTracado(r0, r1, r2, r3){	
		var p0, p1, p2, p3;

		for (var i = 0; i < 7; i += 0.02){
			p0 = r0.getPonto(i)
			p1 = r1.getPonto(i)
			p2 = r2.getPonto(i)
			p3 = r3.getPonto(i)
			this.curvas.add(this.novaCurva(p0, p1, p2, p3))
		}
	}

	atualizaObstaculos(){

	}
}