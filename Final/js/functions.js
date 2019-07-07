// Função para criar novo plano
function novoPlano(pts){
	var geometry = new THREE.PlaneGeometry(pts[0], pts[1], pts[2]);
	var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
	var plano = new THREE.Mesh(geometry, material);

	plano.rotation.x = THREE.Math.degToRad(90);
	plano.position.y -= 1

	return plano;
}

r0 = new Reta(0, 0, -1, Math.tan(0));
r1 = new Reta(-30, 30, -1, Math.tan(Math.PI/4));
r2 = new Reta(30, 30, 1, Math.tan(Math.PI/4));
r3 = new Reta(0, 0, 1, Math.tan(0));

pista.adicionaTracado(r0, r1, r2, r3);