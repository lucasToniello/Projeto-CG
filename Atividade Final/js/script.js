function controler(e){
	key = String.fromCharCode(e.which);

	if (key == "W"){
		car.movimentoFrente()
		// camera1.movimentoFrente()

	} else if (key == "S"){
		car.movimentoRe()
		// camera1.movimentoRe()

	} else if (key == "A"){
		car.rotaciona(3)

	} else if (key == "D"){
		car.rotaciona(-3)
		
	} else if (key == "1"){
		cameraSelector = true;

	} else if (key == "2"){
		cameraSelector = false;
	}
}

function init(){

	// Inicialização das variáveis
	curvas = new THREE.Group();  addCurvas(curvas);
	camera2 = new Camera([-40, 40, 10], [0, 0, 5]);
	curvaInicio = novaCurva([[-7, 0, 0], [-7, -14, 0], [7, -14, 0], [7, 0, 0]]);	
	plano = novoPlano([100, 100, 50]);
	obstaculo1 = novoObstaculo();  obstaculo1.position.x = 7;  obstaculo1.position.z = 16;
	obstaculo2 = novoObstaculo();  obstaculo2.position.x = -7;  obstaculo2.position.z = 16;

	scene.add(obstaculo1); scene.add(obstaculo2)
	

	// Inicialização do ambiente
	container = document.createElement('div');
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild(container);
	container.appendChild(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.addEventListener('keydown', controler);

	scene.add(curvas); scene.add(curvaInicio); scene.add(plano);
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

var cameraSelector = true

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
		renderer.render(scene, camera2.object);
	}

	//Função que controla os obstáculos da pista
	// moveObstaculos(obstaculos)
}

var car;
var curva, curva2, curvaInicio, plano, container, renderer;

init();
animate();	