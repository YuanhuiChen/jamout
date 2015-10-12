/**
 * @fileoverview
 */

goog.provide('jamout.services.AudioVisualService');

/**
 * @param $window
 * @constructor
 */

jamout.services.AudioVisualService = function($window)
{
    this.window_ = $window;
    /**
     * User Privileges Info, like whether user is admin
     * @type {null}
     */
    this.privileges = null;

    /**
    * Get canvas id for audio rendering
    * @expose
    */
	this.canvas = $("#canvas").get()[0].getContext("2d");

	/**
	* extending it, hmmm how can we improve this
	* @expose
	*/
	jamout.services.AudioVisualService.CANVAS2D = this.canvas;
}


/**
 * @param stream
 * @constructor
 */
jamout.services.AudioVisualService.prototype.setupAudioNode= function(stream)
{   
    console.log("Setting up audio node");
     this.window_.AudioContext = this.window_.AudioContext || this.window_.webkitAudioContext;
	  /** 
	  * Create context for Web Audio 
	  * @constructor
	  */
	  var audioContext = new AudioContext();
	  /**
	  * Create analyser to get access to the audio data
	  * @expose
	  */
	  var analyser = audioContext.createAnalyser();
	  analyser['fftSize'] = analyser.frequencyBinCount;
	  analyser['smoothingTimeConstant'] = 0.3;

	  // Create an AudioNode from the incoming stream.
	  var audioMediaStreamSource = audioContext.createMediaStreamSource(stream);

	  /**
	  * 
	  * @expose
	  */  
	  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
	  // connect to destination, else it isn't called
	  javascriptNode.connect(audioContext.destination);
	 

		// when the javascript node is called
		// we use information from the analyzer node
		// to draw the volume
		javascriptNode.onaudioprocess = function() {

		    // get the average, bincount is fftsize / 2
		    var array =  new Uint8Array(analyser.frequencyBinCount);
		    analyser.getByteFrequencyData(array);
		    var average = jamout.services.AudioVisualService.prototype.getAverageVolume(array)

			if (jamout.services.AudioVisualService.CANVAS2D) {			    
			    // // clear the current state
			    jamout.services.AudioVisualService.CANVAS2D.clearRect(0, 0, 60, 130);
			    

			     // create a gradient for the fill. Note the strange
			    // offset, since the gradient is calculated based on
			    // the canvas, not the specific element we draw
			    /** @export */
			    var gradient = jamout.services.AudioVisualService.CANVAS2D.createLinearGradient(0,0,0,130);
			    gradient.addColorStop(1,'#000000');
			    gradient.addColorStop(0.75,'#FF93FF');
			    gradient.addColorStop(0.25,'#95FFFF');
			    gradient.addColorStop(0,'#ffffff');
			    // // set the fill style
			    jamout.services.AudioVisualService.CANVAS2D.fillStyle=gradient;

			    // // create the meters
			    jamout.services.AudioVisualService.CANVAS2D.fillRect(0,130-average,25,130);
		    }
		}

	  // Connect the AudioNode to the Analyser
	  audioMediaStreamSource.connect(analyser);
	  // Connect the Audionode to the Javascript Node
	  analyser.connect(javascriptNode);


	  console.log("Analyser : ", analyser);
	  if (!analyser) {
	    console.log("Web audio not supported")
	  }


}


/**
* @param array
* @constructor
*/
jamout.services.AudioVisualService.prototype.getAverageVolume = function(array) {
         var values = 0;
        var average;
 
        var length = array.length;
 
        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }
 
        average = values / length;
        return average;
}




jamout.services.AudioVisualService.INJECTS = ['$window', jamout.services.AudioVisualService];
