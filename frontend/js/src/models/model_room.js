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
     * @type {String}
     */
    this.currentUser = '';

    /**
     * @export
     * @type {String}
     */
    this.creatorUsername = '';


    /**
     * @export
     * @type {Boolean}
     */
    this.isCreator = false;


    /**
     * @export
     * @type {String}
     */
    this.socket_room_id = '';

    /**
     * @export
     * @type {String}
     */
    this.socketSessionId = '';

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
     * @expose
     * @type {String}
     */
    this.url = '';


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

