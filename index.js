var generateTriangleSteps = require('./generateTriangleUVWVectors');
var indexLimit = Math.pow(2, 16);
var maxRows = 2;
var rowLength = 2;
var cursor = 3 + 1;	//save one for hidden faces
while(cursor <= indexLimit) {
	var temp = cursor + rowLength;
	if(temp > indexLimit) break;
	cursor = temp;
	maxRows++;
	rowLength++;
}

var resultingRows = 2;
var maxSudivisions = 0;
var theoreticalFaces = 1;
var theoreticalVertices = cursor;
var rowLength = 2;
while(resultingRows < maxRows) {
	var temp = (resultingRows - 1) * 2 + 1;
	theoreticalFaces*=4;

	if(temp > maxRows) break;
	resultingRows = temp;
	maxSudivisions++;
	console.log(maxSudivisions, resultingRows, theoreticalVertices, theoreticalFaces);
}
var vertexFarFarAway = new THREE.Vector3(0, 10000, 0);
var nullColor = new THREE.Color(0, 0, 0);
function nullPositionSampler(x, y) {
	return new THREE.Vector3(x, 0, y);
}

function nullColorSampler(x, y) {
	return new THREE.Color(0, 1, 0);
}
var StandardBufferGeometry = require('./StandardBufferGeometry');
function LODTriangleGeometry(edgeSteps, positionSampler, colorSampler){
	StandardBufferGeometry.call(this);
	this.dynamic = false;
	//        /
	//		 /  
	//      / /\ v
	//     / /  \ \
	//    / /    \ \
	//   u|/______\ \
	//  --+-------w  \
	//    |           \

	edgeSteps = edgeSteps === undefined ? 1 : edgeSteps;
	edgeSteps = Math.pow(2, edgeSteps);
	this.positionSampler = positionSampler || nullPositionSampler;
	this.colorSampler = colorSampler || nullColorSampler;

	var stepLength = this.stepLength = 1 / edgeSteps;

	var recenteruvwSteps = generateTriangleSteps(1);
	var uvwSteps = generateTriangleSteps(stepLength);
	var u = uvwSteps.u;
	var v = uvwSteps.v;
	var w = uvwSteps.w;
	this.startCoord = new THREE.Vector2();
	this.startCoord.sub(recenteruvwSteps.u.multiplyScalar(1/3)).add(recenteruvwSteps.w.multiplyScalar(1/3));
	var cursor = this.startCoord.clone();
	var sideWaysLeft = -stepLength;
	var sideWaysRight = stepLength;
	var upLeft = v;
	var upRight = w.clone().multiplyScalar(-1);
	var up = upRight;
	this.vertices.push(vertexFarFarAway);
	this.colors.push(nullColor);
	this.vertices.push(this.positionSampler(cursor.x, cursor.y));
	this.colors.push(this.colorSampler(cursor.x, cursor.y));
	this.totalRows = edgeSteps+1;
	for (var iRowLength = this.totalRows; iRowLength > 0; iRowLength--) {
		for (var i = iRowLength-1; i > 0; i--) {
			cursor.x += sideWaysRight;
			this.vertices.push(this.positionSampler(cursor.x, cursor.y));
			this.colors.push(this.colorSampler(cursor.x, cursor.y));
		};
		cursor.x += sideWaysLeft * (iRowLength-1);
		cursor.add(upRight);
		if(iRowLength > 1) {
			this.vertices.push(this.positionSampler(cursor.x, cursor.y));
			this.colors.push(this.colorSampler(cursor.x, cursor.y));
		}
	}

	this.initBuffers(theoreticalVertices, theoreticalFaces);

	var hiddenFace = new THREE.Face3(0, 0, 0);
	for (var i = 0; i < theoreticalFaces; i++) {
		this.addFace(0, 0, 0);
	};


	this.updateFaces();
	this.updateBuffers();
}

LODTriangleGeometry.prototype = Object.create(StandardBufferGeometry.prototype);
LODTriangleGeometry.prototype.updateFaces = function() {

	var cursor = 1;
	var faceCursor = 0;
	for (var iRowLength = this.totalRows-1; iRowLength >= 0; iRowLength--) {
		var row = [];
		var lastRow;

		for (var iFace = iRowLength-1; iFace >= 0; iFace--) {
			var a = cursor + iFace;
			var b = cursor + iFace + 1;
			var c = cursor + iFace + iRowLength+1;
			this.setFace(faceCursor, a, b, c);
			faceCursor++;
			if(iRowLength-1 > iFace) {
				var d = cursor + iFace + iRowLength+2;
				this.setFace(faceCursor, d, c, b);
				faceCursor++;
			}
		};
		cursor++;
		cursor += iRowLength;
	};

}


LODTriangleGeometry.prototype.subdivide = function(iterations) {
	iterations = iterations === undefined ? 1 : iterations;
	var oldVertices = this.vertices;
	var oldColors = this.colors;

	this.stepLength *= .5;

	var uvwSteps = generateTriangleSteps(this.stepLength);
	var u = uvwSteps.u;
	var v = uvwSteps.v;
	var w = uvwSteps.w;
	var upRight = w.clone().multiplyScalar(-1);
	var sideWaysLeft = -this.stepLength;

	var cursor = this.startCoord.clone();

	this.totalRows = this.totalRows * 2 -1;

	var vertices = [vertexFarFarAway];
	var colors = [nullColor];
	var oldCursor = 1;
	for (var iRowLength = this.totalRows; iRowLength > 0; iRowLength--) {
		var isRowEmpty = iRowLength%2 == 1;
		if(isRowEmpty) {
			for (var i = 0; i < iRowLength; i++) {
				var alreadyExists = i%2 == 0;
				if(alreadyExists) {
					vertices.push(oldVertices[oldCursor]);
					colors.push(oldColors[oldCursor]);
					oldCursor++;
				} else {
					vertices.push(this.positionSampler(cursor.x, cursor.y));
					colors.push(this.colorSampler(cursor.x, cursor.y));
				}
				cursor.x += this.stepLength;
			}
		} else {
			for (var i = 0; i < iRowLength; i++) {
				vertices.push(this.positionSampler(cursor.x, cursor.y));
				colors.push(this.colorSampler(cursor.x, cursor.y));
				cursor.x += this.stepLength;
			}
		}
		cursor.x += iRowLength * sideWaysLeft;
		cursor.add(upRight);
	};

	var total = this.vertices.length;
	for (var i = cursor; i < total; i++) {
		this.vertices[i] = oldVertices[i];
		this.colors[i] = oldColors[i];
	};

	this.vertices = vertices;
	this.colors = colors;

	iterations--;
	if(iterations > 0) this.subdivide(iterations);
	else {
		this.updateFaces();
		this.updateBuffers();
	}
};
module.exports = LODTriangleGeometry;