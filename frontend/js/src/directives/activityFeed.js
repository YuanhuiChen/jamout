/**
 * To provide the activity's feed template
 * @fileoverview
 */
goog.provide('jamout.directives.ActivityFeed');
goog.require('jamout.templates.ActivityFeed'); 


/** 
* @constructor
*/
jamout.directives.ActivityFeed= function () {

    return {
      restrict: 'E',
      template: jamout.templates.ActivityFeed.frame()
    };

}

jamout.directives.ActivityFeed.INJECTS = [ jamout.directives.ActivityFeed];