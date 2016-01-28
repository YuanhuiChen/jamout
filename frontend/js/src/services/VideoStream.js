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
            "video": 
              { "optional": 
                       [{"maxWidth": $window.screen.width > 1920 ? $window.screen.width : 1920},
                        {"maxHeight": $window.screen.height > 1080 ? $window.screen.height : 1080}],
                "mandatory": {}
              },  
            /** @expose */
            "audio": true
          }

 }

 jamout.services.VideoStream.STREAM = '';

/**
* Error handling for getusermedia
* @param {*} msg
* @param {*} error
*/
jamout.services.VideoStream.prototype.errorMsg = function (msg, error) {
        console.log('errorMsg: ', msg);
        if (typeof error !== 'undefined') {
          console.error(error);
        }
 } 


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
                
                //newer media devices implementation
               if (this.window_.navigator.mediaDevices.getUserMedia) 
                {
                  this.window_.navigator.mediaDevices.getUserMedia(this.constraints_) 
                  .then(function (s) {
                     jamout.services.VideoStream.STREAM = s;
                     // console.log('the stream is', jamout.services.VideoStream.STREAM);

                    d.resolve(jamout.services.VideoStream.STREAM);
                  }).catch(function (error) {
                    if (error.name === 'ConstraintNotSatisfiedError') {
                         jamout.services.VideoStream.prototype.errorMsg('The resolution ' + constraints.video.width.exact + 'x' + constraints.video.width.exact + ' px is not supported by your device.');
                          } else if (error.name === 'PermissionDeniedError') {
                            jamout.services.VideoStream.prototype.errorMsg('Permissions have not been granted to use your camera and ' +
                              'microphone, you need to allow the page access to your devices in ' +
                              'order for the app to work.');
                           }
                          jamout.services.VideoStream.prototype.errorMsg('getUserMedia error: ' + error.name, error);
                    d.reject(error);
                  });
                }
              } else {
                  d.resolve();
              }

          return d.promise;
        }
  
}



jamout.services.VideoStream.INJECTS = ['$q', '$window','roomService', jamout.services.VideoStream];