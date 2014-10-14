function generateTriangleUVWVectors(stepLength){
	stepLength = stepLength || 1;
	var rotThird = Math.PI * 2 / 3;
	var uAngle = 0;
	var vAngle = uAngle - rotThird;
	var wAngle = vAngle - rotThird;
	var u = new THREE.Vector2(Math.cos(uAngle), Math.sin(uAngle));
	var v = new THREE.Vector2(Math.cos(vAngle), Math.sin(vAngle));
	var w = new THREE.Vector2(Math.cos(wAngle), Math.sin(wAngle));
	u.multiplyScalar(stepLength);
	v.multiplyScalar(stepLength);
	w.multiplyScalar(stepLength);
	return {
		u: u,
		v: v,
		w: w
	}
}

module.exports = generateTriangleUVWVectors;