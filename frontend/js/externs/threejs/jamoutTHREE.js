
/**
* @constructor
*/ 
var jamoutTHREEJS = function () {};

/**
* init
* @expose
*/
jamoutTHREEJS.prototype.init = function () {}

/**
* Control the camera
* @expose
*/
jamoutTHREEJS.prototype.camera = function () {}

/**
* Constrol the rotation
* @expose
*/
jamoutTHREEJS.prototype.rotation = function () {}

/**
* Control the renderer
* @expose
*/
jamoutTHREEJS.prototype.renderer = function (){}

/**
* Properties of a 3d cube
* @expose
*/
jamoutTHREEJS.prototype.createcube = function (){}

/**
* Multiply and create cubes
* @param {number} x position
* @param {number} y position
* @param {number} z position
* @param {number} cubes # of horizontal cubes
*/
jamoutTHREEJS.prototype.addShape = function (x, y, z, cubes){}

/**
* Redraw the screen on resize
* @expose
*/
jamoutTHREEJS.prototype.onWindowResize = function () {}

/**
* Render everything
* @expose
*/
jamoutTHREEJS.prototype.render = function render() {}