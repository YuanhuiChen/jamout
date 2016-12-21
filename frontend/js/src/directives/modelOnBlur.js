/**
* To prevent input field from automatically trigerring referesh on character input
* Override the default input to update on blur
* @fileoverview
*/

goog.provide('jamout.directives.ngModelOnblur');


/** 
* @constructor
*/
jamout.directives.ngModelOnblur = function () {
	 return {
        priority: 1,
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;
            
            elm.off('input keydown');
            elm.on('blur change', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });         
            });
        }
    };
}

jamout.directives.ngModelOnblur.INJECTS = [jamout.directives.ngModelOnblur];