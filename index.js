function LODTriangleGeometry(edgeSteps) {
	THREE.Geometry.call(this);

	//        /
	//		 /  
	//      / /\ v
	//     / /  \ \
	//    / /    \ \
	//   u|/______\ \
	//  --+-------w  \
	//    |           \

	var rotThird = Math.PI * 2 / 3;
	var uAngle = Math.PI + rotThird * .5;
	var vAngle = uAngle + rotThird;
	var wAngle = vAngle + rotThird;
	var length = .05;
	edgeSteps = edgeSteps === undefined ? 3 : edgeSteps;
	edgeSteps = Math.pow(2, edgeSteps);
	console.log(edgeSteps);
	var u = new THREE.Vector2(Math.cos(uAngle), Math.sin(uAngle));
	var v = new THREE.Vector2(Math.cos(vAngle), Math.sin(vAngle));
	var w = new THREE.Vector2(Math.cos(wAngle), Math.sin(wAngle));
	u.multiplyScalar(length);
	v.multiplyScalar(length);
	w.multiplyScalar(length);
	var uStep = u.clone();
	var vStep = v.clone();
	var wStep = w.clone();
	var stepLength = 1 / edgeSteps;
	uStep.multiplyScalar(stepLength);
	vStep.multiplyScalar(stepLength);
	wStep.multiplyScalar(stepLength);

	var cursor = new THREE.Vector2();
	cursor.sub(v.clone().multiplyScalar(1/3)).add(w.clone().multiplyScalar(1/3));
	var sideWaysLeft = wStep;
	var sideWaysRight = wStep.clone().multiplyScalar(-1);
	var sideWays = sideWaysLeft;
	var upLeft = vStep;
	var upRight = uStep.clone().multiplyScalar(-1);
	var up = upLeft;

	this.vertices.push(new THREE.Vector3(cursor.x, 0, cursor.y));
	for (var iRowLength = edgeSteps; iRowLength >= 0; iRowLength--) {
		sideWays = sideWays === sideWaysRight ? sideWaysLeft : sideWaysRight;
		up = up === upRight ? upLeft : upRight;
		for (var i = iRowLength; i > 0; i--) {
			cursor.add(sideWays);
			this.vertices.push(new THREE.Vector3(cursor.x, 0, cursor.y));
		};
		// cursor.add(sideWays);
		// this.vertices.push(new THREE.Vector3(cursor.x, 0, cursor.y));
		cursor.add(up);
		if(iRowLength > 0) {
			this.vertices.push(new THREE.Vector3(cursor.x, 0, cursor.y));
		}
	}

	var cursor = 0;
	for (var iRowLength = edgeSteps; iRowLength >= 0; iRowLength--) {
		cursor += iRowLength;
		// console.log(iRowLength, cursor);
		var row = [];
		var lastRow;

		for (var iFace = iRowLength; iFace > 0; iFace--) {
			var d = cursor + iFace - iRowLength * 2 - 2;
			var c = cursor + iFace;
			var b = cursor - iFace+1;
			var a = cursor - iFace;
			if(a >= 0 && a < this.vertices.length && 
				b >= 0 && b < this.vertices.length
			) {
				if((edgeSteps-iRowLength) % 2 == 0) {
					var temp = a;
					a = b;
					b = temp;
				}
				if(c >= 0 && c < this.vertices.length) {
					this.faces.push(new THREE.Face3(a, b, c));
				}
				if(d >= 0 && d < this.vertices.length) {
					this.faces.push(new THREE.Face3(b, a, d));
				}
				// console.log(a, b, c);
			}
		};
		cursor++;
	};
}


LODTriangleGeometry.prototype = Object.create(THREE.Geometry.prototype);

module.exports = LODTriangleGeometry;