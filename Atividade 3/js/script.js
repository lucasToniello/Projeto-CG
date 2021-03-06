// Função de controle do carro e da câmera
function controler(e){
	key = String.fromCharCode(e.which);

	if (key == "W"){
		car.position.z += Math.cos(car.rotation.y)
		car.position.x += Math.sin(car.rotation.y)
		camera1.position.z += Math.cos(car.rotation.y)
		camera1.position.x += Math.sin(car.rotation.y)

	} else if (key == "S"){
		car.position.z -= Math.cos(car.rotation.y)
		car.position.x -= Math.sin(car.rotation.y)
		camera1.position.z -= Math.cos(car.rotation.y)
		camera1.position.x -= Math.sin(car.rotation.y)

	} else if (key == "A"){
		car.rotation.y += THREE.Math.degToRad(3);

	} else if (key == "D"){
		car.rotation.y += THREE.Math.degToRad(-3);
		
	} else if (key == "1"){
		cameraSelector = true;

	} else if (key == "2"){
		cameraSelector = false;
	}

	console.log(car.rotation.y % Math.PI)
}

// Função para criar nova câmera
function novaCamera(pi, pv){
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
	camera.position.set(pi[0], pi[1], pi[2]);
	camera.lookAt(pv[0], pv[1], pv[2]);
	return camera
}

// Função para criar nova curva de bezier
function novaCurva(pontosControle){
	p0 = pontosControle[0]; p1 = pontosControle[1]; p2 = pontosControle[2]; p3 = pontosControle[3]

	var curve = new THREE.CubicBezierCurve(
		new THREE.Vector3(p0[0], p0[1], p0[2]),
		new THREE.Vector3(p1[0], p1[1], p1[2]),
		new THREE.Vector3(p2[0], p2[1], p2[2]),
		new THREE.Vector3(p3[0], p3[1], p3[2])
	)

	var points = curve.getPoints(50);
	var geometry = new THREE.BufferGeometry().setFromPoints(points);
	var material = new THREE.LineBasicMaterial({ color : 0x000000 });
	var curveObject = new THREE.Line(geometry, material);

	return curveObject
}

// Função para criar novo plano
function novoPlano(pts){
	var geometry = new THREE.PlaneGeometry(pts[0], pts[1], pts[2]);
	var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
	var plane = new THREE.Mesh(geometry, material);

	return plane;
}

function init(){

	// Inicialização das variáveis
	scene = new THREE.Scene();
	camera1 = novaCamera([-40, 40, 10], [0, 0, 0])
	camera2 = novaCamera([-40, 40, 10], [0, 0, 5])
	curva = novaCurva([[0, 0, 0], [-30, 30, 0], [30, 30, 0], [0, 0, 0]])
	curva2 = novaCurva([[-7, 0, 0], [-35, 35, 0], [35, 35, 0], [7, 0, 0]])
	curva3 = novaCurva([[-7, 0, 0], [-7, -14, 0], [7, -14, 0], [7, 0, 0]])
	plano = novoPlano([100, 100, 50]);

	// Inicialização do ambiente
	container = document.createElement('div');
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild(container);
	container.appendChild(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.addEventListener('keydown', controler);

	scene.add(camera1);
	scene.add(camera2);
	scene.add(curva);  curva.rotation.x = THREE.Math.degToRad(90);
	scene.add(curva2);  curva2.rotation.x = THREE.Math.degToRad(90);
	scene.add(curva3);  curva3.rotation.x = THREE.Math.degToRad(90);
	scene.add(plano); plano.rotation.x = THREE.Math.degToRad(90); plano.position.y -= 1
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

   			car.add(object);
			scene.add(car);
			car.position.z = -5;
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
	if (cameraSelector){
		renderer.render(scene, camera1);
	} else {
		renderer.render(scene, camera2);
	}
}

var scene, camera1, camera2, curva, curva2, curva3, plano, container, renderer;

var car = new THREE.Object3D();
var road = new THREE.Object3D();

init();
animate();	