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
	var curva = new THREE.Line(geometry, material);
	curva.rotation.x = THREE.Math.degToRad(90);

	return curva
}

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