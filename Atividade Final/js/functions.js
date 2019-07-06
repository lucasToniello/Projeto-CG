// Função para criar novo plano
function novoPlano(pts){
	var geometry = new THREE.PlaneGeometry(pts[0], pts[1], pts[2]);
	var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
	var plano = new THREE.Mesh(geometry, material);

	plano.rotation.x = THREE.Math.degToRad(90);
	plano.position.y -= 1

	return plano;
}

function addCurvas(curvas){
	for (var i = 0; i < 7; i += 0.01){
		p1 = [-i, 0, 0];
		p2 = [-30-i, 30+i, 0];
		p3 = [30+i, 30+i, 0];
		p4 = [i, 0, 0];
		curvas.add(novaCurva([p1, p2, p3, p4]))
	}
}

function novoObstaculo(){
	var geometry = new THREE.BoxGeometry(3, 3, 3);
	var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	var obstaculo = new THREE.Mesh(geometry, material);
	
	return obstaculo
}