var key;

function controler(e){
	key = String.fromCharCode(e.which);

	if (key == "W"){
		car.acelera()

	} else if (key == "S"){
		car.desacelera();

	} else if (key == "A"){
		car.rotaciona(4);

	} else if (key == "D"){
		car.rotaciona(-4);
		
	} else if (key == "1"){
		cameraSelector = true;

	} else if (key == "2"){
		cameraSelector = false;
	}
}

function novoPlano(pts){
	var geometry = new THREE.PlaneGeometry(pts[0], pts[1], pts[2]);
	var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
	var plano = new THREE.Mesh(geometry, material);

	plano.rotation.x = THREE.Math.degToRad(90);
	plano.position.y -= 1

	return plano;
}

function colisaoPista(car, dict){
	var posicoes = dict[Math.round(car.x)];

	if (car.x < -7 || car.x > 7){
		for (var i = 1; i < posicoes.length; i += 2){
			if (posicoes[i] > posicoes[i-1]){
				if (car.z < posicoes[i] && car.z > posicoes[i-1]){
					return false;
				}

			} else {
				if (car.z < posicoes[i-1] && car.z > posicoes[i]){
					return false;
				}
			}
		}

		return true;
	}
}

function colisao(car, obj){
	if (car.x > obj[0][0] && car.x < obj[0][1]){
		if (car.z > obj[1][0] && car.z < obj[1][1]){
			return true;
		}
	}

	return false;
}

function verificaCheckPoint(car, checkpoints){
	if (Math.round(car.x) == checkpoints.points[checkpoints.atual][0]){
		if (Math.round(car.z) > checkpoints.points[checkpoints.atual][1] &&
			Math.round(car.z) < checkpoints.points[checkpoints.atual][2]){
				return true;
		}
	}

	return false;
}

function init(){

	// Inicialização das variáveis
	Jogo = true;
	clock = new THREE.Clock();
	pista = new Pista();
	plano = novoPlano([500, 500, 500]);
	checkpoints = {
		atual : 0,
		points : [[95, 45, 60], [86, 105, 120], [-75, 65, 80], [-20, -4, 7.5]]
	}

	// Inicialização do ambiente
	container = document.createElement('div');
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild(container);
	container.appendChild(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.addEventListener('keydown', controler);

	r0 = new Reta(7, 0, 0, 0, 1, 0);    r1 = new Reta(80, 10, 0, -1, 1, 0);
	r2 = new Reta(40, 50, 0, -1, 1, 0); r3 = new Reta(100, 45, 0, 0, 1, 0);
	pista.adicionaTracado(r0, r1, r2, r3);

	r0.setParametros(100, 45, 0, 0, 1, 0);    r1.setParametros(140, 50, 0, -1, 1, 0);
	r2.setParametros(140, 90, 0, -1, -1, 0);  r3.setParametros(100, 120, 0, -1, -1, 0);
	pista.adicionaTracado(r0, r1, r2, r3);

	r0.setParametros(100, 120, 0, -1, -1, 0); r1.setParametros(-20, 120, 0, 0, -1, 0);
	r2.setParametros(-20, 80, 0, 0, -1, 0);   r3.setParametros(-70, 80, 0, 0, -1, 0);
	pista.adicionaTracado(r0, r1, r2, r3);

	r0.setParametros(-70, 80, 0, 0, -1, 0);   r1.setParametros(-150, 70, 0, 1, -1, 0);
	r2.setParametros(-150, 40, 0, 1, 0, 0);   r3.setParametros(-130, 10, 0, 1, 0, 0);
	pista.adicionaTracado(r0, r1, r2, r3);

	r0.setParametros(-130, 10, 0, 1, 0, 0);   r1.setParametros(-100, -20, 0, 0, 1, 0);
	r2.setParametros(-50, -20, 0, 0, 1, 0);   r3.setParametros(-7, 0, 0, 0, 1, 0);
	pista.adicionaTracado(r0, r1, r2, r3);

	obs = new Obstaculo(new Reta(55.90, 1, 24.37, -0.74, 0, 0.688), 15);
	obs2 = new Obstaculo(new Reta(76, 1, 119.4, 0, 0, -0.877), 15);
	obs3 = new Obstaculo(new Reta(-126.5, 1, 29.50, -0.92, 0, -0.218), 15);
	
	scene.add(plano);
	scene.add(new THREE.AmbientLight(0xffffff, 2));

	new THREE.MTLLoader().setPath('../res/car/').load('car.mtl', function(materials){
		new THREE.OBJLoader().setMaterials(materials).setPath('../res/car/')
		.load('car.obj', function(object) {
   			car = new Car(object)
		});
	})

	var loader = new THREE.OBJLoader();
	loader.load('../res/star.obj', function(object){
		object.traverse(function (child){
		    if (child instanceof THREE.Mesh) {
		        child.material = new THREE.MeshPhongMaterial({
		            color:     0xfff200, 
		            specular:  0xff000f,
		            shininess: 25,
		            side:      THREE.DoubleSide,
		        });
		    }

		    star.add(object);
		    scene.add(star);
		    star.position.x = -20; star.position.y = 7; star.position.z = 2;
		    star.rotation.x = THREE.Math.degToRad(90);
		    star.rotation.z = THREE.Math.degToRad(90);
   		});
	})


}

var cameraSelector = false;

//Atualiza a imagem da tela
function animate(){
	requestAnimationFrame(animate);
	render();
}

function render(){

	// Função para atualização de câmera
	if (cameraSelector){
		renderer.render(scene, car.getCamera());
	} else {
		renderer.render(scene, car.getCameraPerspectiva());
	}

	if(Jogo){
		if (key){
			key = null;
		} else {
			car.idle();
		}

		document.getElementById("status").innerHTML = "Velocidade: " + Math.round(car.velocidade)
		+ "  -  Tempo: " + Math.round(clock.getElapsedTime());

		if(colisaoPista(car.object.position, pista.colisoesPista)){
			car.velocidade = 0;
			checkpoints.atual = 0;
			car.origem();
		}

		if (colisao(car.object.position, obs.getColisao())){
			car.velocidade = 0;
		}

		if (verificaCheckPoint(car.object.position, checkpoints)){
			checkpoints.atual += 1;
		}

		if (checkpoints.atual > 3){
			Jogo = false;
			clock.stop();
			document.getElementById("status").innerHTML = "Tempo final: " + clock.getElapsedTime();
		}

		console.log(car.object.position);
		car.movimento();
		obs.move(0.1);
		obs2.move(0.1);
		obs3.move(0.1);
	}
}

var car, plano, container, renderer;
var star = new THREE.Object3D();

init();
animate();