function StandardBufferGeometry() {
	THREE.BufferGeometry.call(this);

	this.vertices = [];
	this.colors = [];
	this.faces = [];
}


StandardBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);

StandardBufferGeometry.prototype.initBuffers = function(totalVertices, totalFaces) {
	this.bufferIndices = new Uint16Array( totalFaces * 3);
	this.faceCursor = 0;
	this.bufferPositions = new Float32Array( totalVertices * 3 );	
	this.bufferNormals = new Float32Array( totalVertices * 3 );
	this.bufferColors = new Float32Array( totalVertices * 3 );


	for ( var i3 = 0; i3 < this.bufferPositions.length; i3 += 3 ) {
		this.bufferPositions[i3] = 0;
		this.bufferNormals[i3] = 0;
		this.bufferColors[i3] = 1;
		this.bufferPositions[i3+1] = 10000;
		this.bufferNormals[i3+1] = 1;
		this.bufferColors[i3+1] = 1;
		this.bufferPositions[i3+2] = 0;
		this.bufferNormals[i3+2] = 0;
		this.bufferColors[i3+2] = 1;
	}

	this.attributeIndices = new THREE.BufferAttribute( this.bufferIndices, 1 );
	this.attributePositions = new THREE.BufferAttribute( this.bufferPositions, 3 );
	this.attributeNormals = new THREE.BufferAttribute( this.bufferNormals, 3 );
	this.attributeColors = new THREE.BufferAttribute( this.bufferColors, 3 );

	this.addAttribute( 'index', this.attributeIndices );
	this.addAttribute( 'position', this.attributePositions );
	this.addAttribute( 'normal', this.attributeNormals );
	this.addAttribute( 'color', this.attributeColors );
}

StandardBufferGeometry.prototype.updateBuffers = function() {
	var vertices = this.vertices;
	var colors = this.colors;
	for (var i = 0; i < vertices.length; i++) {
		var i3 = i * 3;
		var vert = vertices[i];
		var color = colors[i];
		this.bufferPositions[i3] = vert.x;
		this.bufferPositions[i3+1] = vert.y;
		this.bufferPositions[i3+2] = vert.z;

		this.bufferColors[i3] = color.r;
		this.bufferColors[i3+1] = color.g;
		this.bufferColors[i3+2] = color.b;
	};
	// this.computeFaceNormals();
	this.computeVertexNormals();
	// this.computeTangents();
	this.attributeIndices.needsUpdate = true;
	this.attributePositions.needsUpdate = true;
	this.attributeNormals.needsUpdate = true;
	this.attributeColors.needsUpdate = true;

}

StandardBufferGeometry.prototype.addFace = function(a, b, c) {
	this.faces[this.faceCursor] = new THREE.Face3(a, b, c);
	this.setFace(this.faceCursor, a, b, c);
	this.faceCursor ++;
}
StandardBufferGeometry.prototype.setFace = function(i, a, b, c) {
	this.faces[i] = new THREE.Face3(a, b, c);
	var i3 = i * 3;
	this.bufferIndices[i3] = a;
	this.bufferIndices[i3+1] = b;
	this.bufferIndices[i3+2] = c;
}
module.exports = StandardBufferGeometry;