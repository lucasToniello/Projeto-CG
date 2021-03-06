function rotacionar(camera, angulo){
	//transforma graus em Radianos
	var anguloRadianos = (angulo) * Math.PI / 180
	//Define as rotações da câmera de acordo com o valor recebido nos eixos x e z
	//O eixo Y é constante neste trecho
	var a = Math.sin(anguloRadianos) * camera.position.x * -1
	var b = Math.cos(anguloRadianos) * camera.position.z
	var c = Math.cos(anguloRadianos) * camera.position.x
	var d = Math.sin(anguloRadianos) * camera.position.z
	//Define a nova posição da câmera nos eixos x e z utilizando as rotações calculadas a cima
	camera.position.x = c + d
	camera.position.z = a + b
	//Camera "olhando" para o objeto, que é representado por um vetor (X,Y,Z)
	camera.lookAt(scene.position);
	//faz o update da visão do objeto (Matriz)
	camera.updateProjectionMatrix()
}
//Função cria nova câmera e recebe dois vetores 3D
function novaCamera(pi, pv){
	//Cria uma nova Câmera utilizando a biblioteca THREE
	//fov — Campo de visão vertical da câmera
	//aspect — Tamanho da tela em pixels
	//near — Camera frustum near plane.
	//far — Camera frustum far plane.
	//In 3D computer graphics, the view frustum is the region of space in the modeled world that may appear on the screen; it is the field of view of the notional camera
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 500);
	//Define a posição inicial da câmera
	camera.position.set(pi[0], pi[1], pi[2]);
	//Define o ponto para o qual a câmera está voltada
	camera.lookAt(pv[0], pv[1], pv[2]);
	//retorna a nova câmera criada
	return camera
}
//Função para inicializar câmera e o cenário
function init() {
	//Cria uma noca cena
	scene = new THREE.Scene();
	//Cria uma noca câmera
	camera = novaCamera([0, 0, 10], [0, 0, 0])
	//cria um div no HTML
	container = document.createElement('div');
	//Chama o reindenizador do WebGL
	renderer = new THREE.WebGLRenderer();

	//Cria no HTML o objeto de saída
	//Cria um container
	document.body.appendChild(container);
	//cria o <canvas>
	container.appendChild(renderer.domElement);
	//Define o tamanho da janela
	renderer.setSize(window.innerWidth, window.innerHeight);
	//Adiciona a câmera
	scene.add(camera);
	//Define a iluminação do ambiente (cor = Branca , intensidade = mais forte que o padrão)
	scene.add(new THREE.AmbientLight(0xffffff, 2));

	//Adiciona os arquivos necessários para a reindenização
	THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
	//Faz o carregamento da imagem a ser utilizada (eyeball)
	new THREE.MTLLoader().setPath('../res/eyeball/').load('eyeball.mtl', function(materials){
		materials.preload();
		new THREE.OBJLoader().setMaterials(materials).setPath('../res/eyeball/')
		.load('eyeball.obj', function(object){
			//Adiciona o obejto carregado na cena
			scene.add(object);
		});
	});

}

//Atualiza a imagem da tela
function animate() {
	//função do navegador window.requestAnimationFrame avisa o browser que se deseja realizar uma atualização na imagem
	requestAnimationFrame(animate);
	//Rotaciona a câmera já existente em -1 grau
	rotacionar(camera, -0.5)
	//Reindeniza a imagem
	renderer.render(scene, camera);
}

//Cria as variáveis
var camera, scene, container, renderer;
//inicializa a imagem
init();
//rotaciona a imagem
animate();
