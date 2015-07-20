/**
* @fileoverview
*/

goog.provide('jamout.services.VideoStream');

/**
* @param {angular.$q} $q
* @param {angular.$window} $window
* @constructor
*/
 jamout.services.VideoStream = function($q, $window) 
 {

    /** @expose */
   this.q_ = $q;
    /** @expose */
   this.window_ = $window;

   /** @expose */
   this.stream_ 

   /** @expose */
   this.constraints_ =  {
            video: 
              {
                mandatory: {
                    maxWidth: 1280,
                    maxHeight: 720,
                    minWidth: 640,
                    minHeight: 480
                    }
              },   
            audio: true
          }
    /** @expose */
    this.viewerConstraints_ = {
            video: true,
            audio: true
    }      


 }


 jamout.services.VideoStream.prototype.get = function () 
 {

      /**
      * @expose
      */
    if (this.stream_) {
          return this.q_.when(this.stream_);
        } else {

         /**
         * @const
         */
          var d = this.q_.defer();

             // if (this.window_.sessionStorage['creatorStatus'] == 'true') 
             // {
                
                  this.window_.navigator.getUserMedia(this.constraints_, function (s) {
                  stream = s;
                  d.resolve(stream);
                  }, function (e) {
                    d.reject(e);
                  });

              // } else {
              //     d.resolve();
              // }

          return d.promise;
        }
  
}




jamout.services.VideoStream.INJECTS = ['$q', '$window', jamout.services.VideoStream];