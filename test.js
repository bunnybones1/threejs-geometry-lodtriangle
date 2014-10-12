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
			stats:true
		});

		view.camera.position.x = 0;
		view.camera.position.y = 1;
		view.camera.position.z = 0;
		view.camera.lookAt(new THREE.Vector3());
		view.camera.near = .0001;
		//lights
		var light = new THREE.PointLight(0xffffff, 3);
		view.scene.add(light);
		var hemisphereLight = new THREE.HemisphereLight(0x7f6f5f, 0x7f0000);
		view.scene.add(hemisphereLight);


		var spin = new THREE.Object3D();
		view.scene.add(spin);
		new Pallette('assets/pallette.png', function(pallettes) {

			var colors = pallettes[~~(pallettes.length * Math.random())];
			// view.renderer.setClearColor(new THREE.Color(colors.splice(0, 1)[0]), 1);
			var cursor = new THREE.Vector3();
			// var mat = new THREE.MeshPhongMaterial();
			for (var i = 2; i >= 0; i--) {
				var steps = i;
				var lodTriangleGeometry = new LODTriangleGeometry(steps);
				var lodTriangle = new THREE.Mesh(
					lodTriangleGeometry,
					new THREE.MeshBasicMaterial({
						wireframe: true,
						opacity: .5,
						// transparent: true,
						color: colors[i]
					})
				);
				lodTriangle.materialID = i;
				lodTriangle.scale.set(10, 10, 10);
				lodTriangle.position.copy(cursor);
				spin.add(lodTriangle);

				var lodTrianglePCGeometry = new LODTriangleGeometry(steps);
				var lodTrianglePC = new THREE.PointCloud(
					lodTrianglePCGeometry,
					new THREE.PointCloudMaterial({
						size: .01 * (colors.length-i),
						opacity: .5,
						// transparent: true,
						color: colors[i]
					})
				);
				lodTrianglePC.materialID = i;
				lodTrianglePC.scale.set(10, 10, 10);
				lodTrianglePC.position.copy(cursor);
				spin.add(lodTrianglePC);

				cursor.y += .001;
			}
		});

		function onEnterFrame() {

			spin.rotation.y += .01;
		}
		view.renderManager.onEnterFrame.add(onEnterFrame);
	}
)