/**
 * To provide the chatMessage template
 * @fileoverview
 */
goog.provide('jamout.directives.chatMessage');
goog.require('jamout.templates.chatMessage'); 


/** 
* @param 
* @constructor
*/
jamout.directives.chatMessage= function () {

    return {
      restrict: 'E',
      template: jamout.templates.chatMessage.frame()
    };

}

jamout.directives.chatMessage.INJECTS = [ jamout.directives.chatMessage];