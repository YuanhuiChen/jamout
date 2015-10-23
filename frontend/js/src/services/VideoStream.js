/**
* @fileoverview
*/

goog.provide('jamout.services.VideoStream');

/**
* @param {angular.$q} $q
* @param {angular.$window} $window
 * @param {jamout.services.RoomService} roomService To access the room creator initiated from the roomctrl
* @constructor
*/
 jamout.services.VideoStream = function($q, $window, roomService) 
 {

    /** @expose */
   this.q_ = $q;
    /** @expose */
   this.window_ = $window;

   /** @expose */
   this.stream_  

   this.roomService_ = roomService;

   /**
    *@type {Object}
    *@expose 
    */
   this.constraints_ =  {
            /** @expose */
            video: 
              {
                /** @expose */
                mandatory: {
                    maxWidth: 1280,
                    maxHeight: 720,
                    minWidth: 320,
                    minHeight: 180
                    }
              },   
            /** @expose */
            audio: true
          }

 }

 jamout.services.VideoStream.STREAM = '';

 jamout.services.VideoStream.prototype.get = function () 
 {
      /**
      * todo, supposed to cache the stream so that user is not requested for thew ebcam everytime. 
      * @expose
      */
    if (jamout.services.VideoStream.STREAM) {
          return this.q_.when(jamout.services.VideoStream.STREAM);
        } else {

         /**
         * @const
         */
          var d = this.q_.defer();
            // Proceed if the user is the creator so only creator is prompted to show webcam
             if (this.roomService_.roomModel.isCreator) 
             {
                
                if (this.window_.navigator.getUserMedia) 
                {
                  this.window_.navigator.getUserMedia(this.constraints_, 
                    function (s) {
                   jamout.services.VideoStream.STREAM = s;
                  d.resolve(jamout.services.VideoStream.STREAM);
                  }, function (e) {
                    d.reject(e);
                  });
                }
            
              } else {
                  d.resolve();
              }

          return d.promise;
        }
  
}




jamout.services.VideoStream.INJECTS = ['$q', '$window','roomService', jamout.services.VideoStream];