var loadAndRunScripts = require('loadandrunscripts');
var ManagedView = require('threejs-managed-view');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js',
		'lib/stats.min.js',
		'lib/threex.rendererstats.js'
	],
	function() {
		var LODTriangleGeometry = require('./');
		var Pallette = require('imagecolorpallette');
		var view = new ManagedView.View({
			stats:true,
			renderSettings: {
				logarithmicDepthBuffer: true
			}
		});

		view.camera.position.x = 0;
		view.camera.position.y = 2;
		view.camera.position.z = 15;
		view.camera.lookAt(new THREE.Vector3());
		view.camera.near = .0001;
		//lights
		var light = new THREE.PointLight(0xffffff, 1);
		light.position.x = 100;
		light.position.y = 10;
		view.scene.add(light);
		var hemisphereLight = new THREE.HemisphereLight(0x7f6f5f, 0x7f0000);
		view.scene.add(hemisphereLight);

		function positionSampler(x, y) {
			return new THREE.Vector3(x, Math.sin(x * 100) * .005 + Math.sin(y * 100) * .005, y);
		}

		function colorSampler(x, y) {
			// return new THREE.Color(0, 1, 0);
			var r = Math.sin(x * 100) * .25 + .75;
			var g = Math.sin(y * 100) * .25 + .75;
			var b = 1;
			return new THREE.Color(r, g, b);
		}

		var spin = new THREE.Object3D();
		view.scene.add(spin);
		// view.renderer.setClearColor(new THREE.Color(colors.splice(0, 1)[0]), 1);
		var cursor = new THREE.Vector3();
		// var mat = new THREE.MeshPhongMaterial();
		var lodTriangleGeometry = new LODTriangleGeometry(0, positionSampler, colorSampler);
		var subdivisions = 8;
		setInterval(function() {
			if(subdivisions > 0) {
				lodTriangleGeometry.subdivide(1);
				subdivisions--;
			}
			console.log(subdivisions);
		}, 1000)
		var lodTriangle = new THREE.Mesh(
			lodTriangleGeometry,
			new THREE.MeshPhongMaterial({
				// wireframe: true,
				// opacity: .5,
				// transparent: true,
				vertexColors: THREE.VertexColors,
				color: 0xffffff,
				// side: THREE.DoubleSide
			})
		);
		lodTriangle.materialID = 0;
		lodTriangle.scale.set(100,100,100);
		lodTriangle.position.copy(cursor);
		spin.add(lodTriangle);

		spin.rotation.y = Math.PI * .5;

		function onEnterFrame() {

			spin.rotation.y += .01;
		}
		view.renderManager.onEnterFrame.add(onEnterFrame);
	}
)