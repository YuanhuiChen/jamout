/**
 * @fileoverview
 */

goog.provide('jamout.models.Chat');


/**
 * @constructor
 */
jamout.models.Chat = function() {

   /**
     * @expose
     * @type {String}
     */
    this.username= null;

    /**
     * @expose
     * @type {String}
     */
    this.userInput = "";

   /**
     * @expose
     * @type {Array}
     */
    this.messages = [];

};
