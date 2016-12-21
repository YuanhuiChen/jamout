/**
 * @fileoverview
 */
goog.provide('jamout.directives.VideoPlayer');


/** 
* @param {angular.$sce} $sce
* @param {angular.$window} $window
* @constructor
*/
jamout.directives.VideoPlayer= function ($sce, $window) {

	return {
      template: '<div><video class="fullScreen" ng-src="[[trustSrc()]]" autoplay></video></div>',
      restrict: 'E',
      replace: true,
      scope: {
        vidSrc: '@'
      },

    /**
    * @param {*} $scope
    * @constructor
    */  
    link: function ($scope) {
        // $window.console.log('Initializing video-player');
        $scope.trustSrc = function () {
          if (!$scope.vidSrc) {
            return undefined;
          }
           // $window.console.log('setting resource url', $scope.vidSrc);
          return $sce.trustAsResourceUrl($scope.vidSrc);
        };
      }
    };

}

jamout.directives.VideoPlayer.INJECTS = ['$sce','$window', jamout.directives.VideoPlayer];