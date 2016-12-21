/**
 * @fileoverview
 */
goog.provide('jamout.directives.Modal');


/** 
* @param 
* @constructor
*/
jamout.directives.Modal= function ($timeout) {

    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title" ng-bind="modalHeader"></h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      /**
      * @param scope
      * @param element
      * @param attrs
      */
      link: function postLink(scope, element, attrs) {
  // anything you want can go here and will safely be run on the next digest.
      $timeout(function() {
         scope.$watch(attrs.visible, function(value){
         if(value == true)
           $(element).modal('show');
          else
           $(element).modal('hide');
        });
      })

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };

}

jamout.directives.Modal.INJECTS = ['$timeout', jamout.directives.Modal];