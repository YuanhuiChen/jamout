/**
 * To display modals (UI Bootstrap)
 * Please note that $modalInstance represents a modal window (instance) dependency.
 * It is not the same as the $modal service used above.
 * @fileoverview
 */

goog.provide('jamout.controllers.ModalController');

/**
 *
 * @param $scope
 * @param $window
 * @constructor
 */
jamout.controllers.ModalController = function($scope, $window) {
     

    /**
    * @expose
    */
    $scope.showModal = false;
    /**
    * @expose
    */
    $scope.buttonClicked = "";
    /**
    * @expose
    */
    $scope.toggleModal = function(btnClicked){
        $window.console.log('inside modal controller');
        $scope.buttonClicked = btnClicked;
        $scope.showModal = !$scope.showModal;
    };

}

jamout.controllers.ModalController.INJECTS = ['$scope', '$window', jamout.controllers.ModalController];


