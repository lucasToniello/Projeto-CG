function controler(e){
	key = String.fromCharCode(e.which);

	if (key == "W"){
		car.movimentoFrente()

	} else if (key == "S"){
		car.movimentoRe()

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
	pista = new Pista()
	camera2 = new Camera([-40, 40, 10], [0, 0, 5]);
	plano = novoPlano([500, 500, 500]);

	// Inicialização do ambiente
	container = document.createElement('div');
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild(container);
	container.appendChild(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.addEventListener('keydown', controler);

	p1 = pista.novaCurva([7, 0, 0], [80, 10, 0], [40, 50, 0], [100, 45, 0]); scene.add(p1);
	p2 = pista.novaCurva([100, 45, 0], [140, 50, 0], [140, 90, 0], [100, 120, 0]); scene.add(p2);

	obs = new Obstaculo(1, 1, 0, 10);
	
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
	// car.velocidade -= 0.5;
	obs.move(0.1);
}

var car;
var curva, curva2, curvaInicio, plano, container, renderer;

init();
animate();	