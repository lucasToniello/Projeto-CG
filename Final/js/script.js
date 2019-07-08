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

function init(){

	// Inicialização das variáveis
	pista = new Pista();
	camera2 = new Camera([-40, 40, 10], [0, 0, 5]);
	plano = novoPlano([500, 500, 500]);

	// Inicialização do ambiente
	container = document.createElement('div');
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild(container);
	container.appendChild(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.addEventListener('keydown', controler);

	r0 = new Reta(7, 0, 0, 1);
	r1 = new Reta(80, 10, -1, 1);
	r2 = new Reta(40, 50, -1, 1);
	r3 = new Reta(100, 45, 0, 1);

	pista.adicionaTracado(r0, r1, r2, r3);

	r0.setParametros(100, 45, 0, 1);
	r1.setParametros(140, 50, -1, 1);
	r2.setParametros(140, 90, -1, -1);
	r3.setParametros(100, 120, -1, -1);
	pista.adicionaTracado(r0, r1, r2, r3);

	r0.setParametros(100, 120, -1, -1);
	r1.setParametros(-20, 120, 0, -1);
	r2.setParametros(-20, 80, 0, -1);
	r3.setParametros(-70, 80, 0, -1);
	pista.adicionaTracado(r0, r1, r2, r3);

	r0.setParametros(-70, 80, 0, -1);
	r1.setParametros(-150, 70, 1, -1);
	r2.setParametros(-150, 40, 1, 0);
	r3.setParametros(-130, 10, 1, 0);
	pista.adicionaTracado(r0, r1, r2, r3);

	r0.setParametros(-130, 10, 1, 0);
	r1.setParametros(-100, -20, 0, 1.5);
	r2.setParametros(-50, -20, 0, 1.5);
	r3.setParametros(-7, 0, 0, 1);
	pista.adicionaTracado(r0, r1, r2, r3);

	obs = new Obstaculo(1, 1, 0, 10);

	p1 = penis([7, 0, 0], [80, 10, -1], [40, 50, -1], [100, 45, 0]);
	
	scene.add(plano);
	scene.add(new THREE.AmbientLight(0xffffff, 2));

	// Função para carregar o objeto, após o carregamento, aplicamos a iluminação Phong ao objeto
	new THREE.MTLLoader().setPath('../res/car/').load('car.mtl', function(materials){
		new THREE.OBJLoader().setMaterials(materials).setPath('../res/car/')
		.load('car.obj', function(object) {
		    object.traverse(function (child){
		        if (child instanceof THREE.Mesh) {
		            child.material = new THREE.MeshPhongMaterial({
		                color:     0xff000f, 
		                specular:  0xff000f,
		                shininess: 25,
		                side:      THREE.DoubleSide
		            });
		        }
   			});

   			car = new Car(object)
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

	//Função que controla os obstáculos da pista

	if (key){
		key = null;
	} else {
		car.idle();
	}

	car.movimento();
}

var car, plano, container, renderer;

init();
animate();