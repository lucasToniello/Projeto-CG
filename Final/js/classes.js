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

	constructor(car){
		this.object = new THREE.Object3D();
		this.object.add(car);
		this.object.position.x = 0;
		this.object.position.y = 0;
		this.object.position.z = 7.5;
		this.camera = new Camera([0, 2, 7.5], [0, 2, 15]);
		this.cameraPerspectiva = new Camera([-40, 40, 10], [0, 0, 0]);
		scene.add(this.object);  
	}

	idle(){
		if (this.velocidade > 1){
			this.velocidade -= 0.5;
		} else if (this.velocidade < -1){
			this.velocidade += 0.5;
		} else {
			this.velocidade = 0;
		}
	}

	acelera(){
		if (this.velocidade < 150){
			this.velocidade += 2;
		}
	}

	desacelera(){
		if (this.velocidade > -100){
			this.velocidade -= 1;
		}
	}

	movimento(){
		this.object.position.z += (this.velocidade/150)*Math.cos(this.object.rotation.y);
		this.object.position.x += (this.velocidade/150)*Math.sin(this.object.rotation.y);
		this.camera.object.position.z += (this.velocidade/150)*Math.cos(this.object.rotation.y);
		this.camera.object.position.x += (this.velocidade/150)*Math.sin(this.object.rotation.y);
		this.cameraPerspectiva.object.position.z += (this.velocidade/150)*Math.cos(this.object.rotation.y);
		this.cameraPerspectiva.object.position.x += (this.velocidade/150)*Math.sin(this.object.rotation.y);
	}

	rotaciona(angulo){
		this.object.rotation.y += THREE.Math.degToRad(angulo);
		this.camera.object.rotation.y -= THREE.Math.degToRad(angulo);
	}

	setPosicao(x, y, z){
		this.object.position.x = x;
		this.object.position.y = y;
		this.object.position.z = z;
		this.camera.object.position.set(x, y + 2, z);
		this.cameraPerspectiva.object.position.set(x - 40, y + 40, z + 2.5);
	}

	setRotacao(angulo){
		this.object.rotation.y = THREE.Math.degToRad(angulo);
		this.camera.object.rotation.y = THREE.Math.degToRad(angulo);
	}

	getCamera(){
		return this.camera.object;
	}

	getCameraPerspectiva(){
		return this.cameraPerspectiva.object;
	}

	getBox(){
		var pos = this.object.position;

		return [{x : pos.x + 1, y : pos.y, z : pos.z + 1}, 
				{x : pos.x + 1, y : pos.y, z : pos.z - 1}, 
				{x : pos.x - 1, y : pos.y, z : pos.z + 1}, 
				{x : pos.x - 1, y : pos.y, z : pos.z - 1}]
	}
}

class Reta {

	constructor(x0, y0, z0, mx, my, mz){
		this.setParametros(x0, y0, z0, mx, my, mz);
	}

	setParametros(x0, y0, z0, mx, my, mz){
		this.x0 = x0;
		this.y0 = y0;
		this.z0 = z0;
		this.mx = mx; 
		this.my = my;
		this.mz = mz;
	}

	getPonto(dx){
		var x = this.x0 + (this.mx*dx);
		var y = this.y0 + (this.my*dx);
		var z = this.z0 + (this.mz*dx);

		return [x, y, z];
	}
}

class Obstaculo {

	constructor(reta, distMaxima){
		var texture = new THREE.TextureLoader().load( '../res/textures/wood.jpg' );
		var geometry = new THREE.BoxGeometry(3, 3, 3);
		var material = new THREE.MeshPhongMaterial({
			color: 0xf5ef42,
		    specular:  0xf5bc42,
		    shininess: 15,
		    map: texture
		});

		this.object = new THREE.Mesh(geometry, material);
		this.reta = reta;
		this.direcao = 1;
		this.dist = 0;
		this.distMaxima = distMaxima;
		scene.add(this.object);
	}

	move(d){
		var proxPonto = this.reta.getPonto(this.dist + d);

		this.object.position.x = proxPonto[0];
		this.object.position.y = proxPonto[1];
		this.object.position.z = proxPonto[2];
		this.dist += this.direcao * d;

		if (this.dist > this.distMaxima){
			this.dist = this.distMaxima;
			this.direcao *= -1;
		} else if (this.dist < 0){
			this.dist = 0;
			this.direcao *= -1;
		}
	}

	// obj = car
	colisao(obj){
		var posicao = this.reta.getPonto(this.dist);

		if (obj.x > (posicao[0] - 1.5) && obj.x < (posicao[0] + 1.5)){
			if (obj.y > (posicao[1] - 1.5) && obj.y < (posicao[1] + 1.5)){
				if (obj.z > (posicao[2] - 1.5) && obj.z < (posicao[2] + 1.5)){
					return true;
				}
			}
		}

		return false;
	}
}

class Pista {

	constructor(){
		this.curvas = new THREE.Group();
		this.colisoes = {};
		this.obstaculos = [];
		this.obstaculos.push(new Obstaculo(new Reta(55.90, 1, 24.37, -0.74, 0, 0.688), 15))
		this.obstaculos.push(new Obstaculo(new Reta(76, 1, 119.4, 0, 0, -0.877), 15))
		this.obstaculos.push(new Obstaculo(new Reta(-126.5, 1, 29.50, -0.92, 0, -0.218), 15))
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

		return curva;
	}

	validaColisao(v, y){
		for (var i = 0; i < v.length; i++){
			if (y < v[i] + 5 && y > v[i] - 5){
				return false;
			}
		}

			return true;
	}

	adicionaColisoes(dict, p0, p1, p2, p3){

		var curve = new THREE.CubicBezierCurve(
			new THREE.Vector3(p0[0], p0[1], p0[2]),
			new THREE.Vector3(p1[0], p1[1], p1[2]),
			new THREE.Vector3(p2[0], p2[1], p2[2]),
			new THREE.Vector3(p3[0], p3[1], p3[2])
		)

		var point, x, y;

		for (var i = 0; i < 1000; i++){
			point = curve.getPoint(i/1000);
			x = Math.round(point.x);
			y = point.y;
			
			if (x in dict){
				if (this.validaColisao(dict[x], y)){
					this.colisoes[x].push(point.y);
				}

			} else {
				dict[x] = [point.y];
			}
		}
	}

	adicionaTracado(r0, r1, r2, r3){
		var p0, p1, p2, p3;

		this.adicionaColisoes(this.colisoes, r0.getPonto(0), r1.getPonto(0),
		r2.getPonto(0), r3.getPonto(0));

		for (var i = 0; i < 15; i += 0.05){
			p0 = r0.getPonto(i);
			p1 = r1.getPonto(i);
			p2 = r2.getPonto(i);
			p3 = r3.getPonto(i);
			this.curvas.add(this.novaCurva(p0, p1, p2, p3));
		}

		this.adicionaColisoes(this.colisoes, r0.getPonto(i), r1.getPonto(i),
		r2.getPonto(i), r3.getPonto(i));
		
	}

	moveObstaculos(dist){
		for (var i = 0; i < this.obstaculos.length; i++){
			this.obstaculos[i].move(dist);
		}
	}

	// obj = car
	colisao(obj){
		var posicoes = this.colisoes[Math.round(obj.x)];

		if (obj.x < -7 || obj.x > 7){
			for (var i = 1; i < posicoes.length; i += 2){
				if (posicoes[i] > posicoes[i-1]){
					if (obj.z < posicoes[i] && obj.z > posicoes[i-1]){
						return false;
					}

				} else {
					if (obj.z < posicoes[i-1] && obj.z > posicoes[i]){
						return false;
					}
				}
			}

			return true;
		}
	}

	colisaoObstaculos(obj){
		for (var i = 0; i < this.obstaculos.length; i++){
			if (this.obstaculos[i].colisao(obj)){
				return true;
			}
		}

		return false;
	}
}