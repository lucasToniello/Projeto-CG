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
	r2.setParametros(-50, -20, 0, 0, 1, 0);   r3.setParametros(-15, 0, 0, 0, 1, 0);
	pista.adicionaTracado(r0, r1, r2, r3);

	scene.add(plano);
	scene.add(new THREE.AmbientLight(0xffffff, 2));

	new THREE.MTLLoader().setPath('../res/car/').load('car.mtl', function(materials){
		new THREE.OBJLoader().setMaterials(materials).setPath('../res/car/')
		.load('car.obj', function(object){
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

		carBox = car.getBox();

		for (var i = 0; i < 4; i++){
			if(pista.colisao(carBox[i])){
				car.velocidade = 0;
				checkpoints.atual = 0;
				car.origem();
			}

			if (pista.colisaoObstaculos(carBox[i])){
				car.velocidade = 0;
			}
		}
			
		if (verificaCheckPoint(car.object.position, checkpoints)){
			checkpoints.atual += 1;
		}

		if (checkpoints.atual > 3){
			Jogo = false;
			clock.stop();
			document.getElementById("status").innerHTML = "Tempo final: " + clock.getElapsedTime();
		}

		car.movimento();
		pista.moveObstaculos(0.1);
	}
}

var car, plano, container, renderer;
var star = new THREE.Object3D();

init();
animate();