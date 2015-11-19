/**
* @expose
* @constructor
*/
function jamoutTHREEJS () {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
}
/**
* init
* @expose
*/
jamoutTHREEJS.prototype.init = function () {
	this.scene = new THREE.Scene();
	this.camera();
	this.renderer();
	window.addEventListener( 'resize', this.onWindowResize(), false );
	this.createcube();
	this.addShape(8,0,0,7);
    this.addShape(8,2,0,7);
    this.addShape(8,-2,0,7);
	this.render();
}
/**
* Control the camera
* @expose
*/
jamoutTHREEJS.prototype.camera = function () {
	this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000 );
	this.camera.position.set(0,0,20);

}
/**
* Constrol the rotation
* @expose
*/
jamoutTHREEJS.prototype.rotation = function () {

	this.camera.position.z = 20;
}

/**
* Control the renderer
* @expose
*/
jamoutTHREEJS.prototype.renderer = function (){
	this.renderer = new THREE.WebGLRenderer({ alpha: true });
	this.renderer.setSize ( window.innerWidth, window.innerHeight);
	this.renderer.setClearColor( 0xff67ff, 0);
	/** @expose**/
	var container = document.getElementById('Render-3D');
	    container.appendChild(this.renderer.domElement);
}
/**
* Properties of a 3d cube
* @expose
*/
jamoutTHREEJS.prototype.createcube = function (){
	this.geometry = new THREE.BoxGeometry(1.3, 1, 1);
	/** @expose**/
	var img = '/images/jamout.png';
	/** @expose**/
	var boxTexture = THREE.ImageUtils.loadTexture(img);
    this.material = new THREE.MeshBasicMaterial( { map: boxTexture, color: 0xffffff } );
}

/**
* Multiply and create cubes
* @expose
* @param {number} x position
* @param {number} y position
* @param {number} z position
* @param {number} cubes # of horizontal cubes
*/
jamoutTHREEJS.prototype.addShape = function (x, y, z, cubes){
	for (var i = 0; i < cubes ; i++) {
	    this.shape = new THREE.Mesh(this.geometry, this.material);
	    this.shape.position.set(i*2.5-x, y, z);
		    this.scene.add(this.shape);
	    }
}
/**
* Redraw the screen on resize
* @expose
*/
jamoutTHREEJS.prototype.onWindowResize = function () {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );

}
/**
* Render everything
* @expose
*/
jamoutTHREEJS.prototype.render = function render() {
  
    	requestAnimationFrame( this.render.bind(this) );
			
		 this.rotation();		

		for ( var i = 0, l = this.scene.children.length; i < l; i ++ ) {
			/** @expose**/
			var object = this.scene.children[ i ];

			object.rotation.x += 0.01;
			object.rotation.y += 0.01;

		}


			this.renderer.render(this.scene, this.camera);
	}

