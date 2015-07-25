/**
 * @fileoverview
 */

goog.provide('jamout.models.Room');


/**
 * @constructor
 */
jamout.models.Room = function() {

   /**
     * @expose
     * @type {string}
     */
    this.id = '';

    /**
     * @expose
     * @type {string}
     */
    this.username = '';


    /**
     * @expose
     * @type {boolean}
     */
    this.creator = false;


    /**
     * @expose
     * @type {string}
     */
    this.socket_room_id = '';

        /**
     * @expose
     * @type {object}
     */
    this.peer_stream = '';

    /**
     * @expose
     * @type {string}
     */
    this.title = '';

    /**
     * @expose
     * @type {string}
     */
    this.location = '';


     /**
     * @expose
     * @type {string}
     */
    this.created = '';


     /**
     * @expose
     * @type {*}
     */
    this.stream = '';
};

