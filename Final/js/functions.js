// Função para criar novo plano
function novoPlano(pts){
	var geometry = new THREE.PlaneGeometry(pts[0], pts[1], pts[2]);
	var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
	var plano = new THREE.Mesh(geometry, material);

	plano.rotation.x = THREE.Math.degToRad(90);
	plano.position.y -= 1

	return plano;
}