/**
 * @fileoverview
 */

goog.provide('jamout.models.Room');


/**
 * @constructor
 */
jamout.models.Room = function() {

   /**
     * @export
     * @type {String}
     */
    this.id = '';

    /**
     * @export
     * @type {String}
     */
    this.username = '';


    /**
     * @export
     * @type {Boolean}
     */
    this.creator = false;


    /**
     * @export
     * @type {String}
     */
    this.socket_room_id = '';

        /**
     * @expose
     * @type {Object}
     */
    this.peer_stream = '';

    /**
     * @expose
     * @type {String}
     */
    this.title = '';

    /**
     * @expose
     * @type {String}
     */
    this.location = '';

    /**
     * @export
     */
    this.viewers = '';

    /**
     * @export
     * @type {Array}
     */
    this.peers = [];



     /**
     * @expose
     * @type {String}
     */
    this.created = '';


     /**
     * @expose
     * @type {*}
     */
    this.stream = '';
};

