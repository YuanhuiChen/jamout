/**
 * This file defines the basic structure for response and request messages. Also provide params validate function
 * I only define Signup and Login request messages, u may need to do the rest of them.
 */
var util = require('util');

/**
 * Response message structure.
 * @param stat
 * @param msg
 * @param d
 * @constructor
 */
var ResponseMessage = function(stat, msg, d) {
    /**
     * Status Code
     * @type {number}
     */
    this.status = stat || 0;
    /**
     * Response Message
     * @type {string}
     */
    this.message = msg || "";

    /**
     * Response Data
     * @type {*}
     */
    this.data = d || null ;
}

exports.ResponseMessage = ResponseMessage;


/**
 * Response Status Code
 * @type {}
 */
var RESPONSE_CODE = {
    OK : {CODE:0, MSG: "OK"},
    DEFAULT_ERROR: {CODE:1, MSG:"Default Error"},
    AUTH_FAILED : {CODE :2, MSG: "Authorization Failed"},
    INVALID_PARAMS: {CODE:3, MSG:"Invalid Params"},
    DATABASE_ERROR: {CODE:5, MSG:"Database Error"}

};

/**
 * The basic class for request messages
 * @param reqFields
 * @param optFields
 * @constructor
 */
var RequestMessage = function(reqFields, optFields) {
    /**
     * Required Fields
     * @type {Array}
     */
    this.requiredFields = reqFields || [];

    /**
     *
     * @type {Array}
     */
    this.optionalFields = optFields || [];
}

RequestMessage.prototype.validateRequest = function(request, response) {
    //check required fields
    var propLen = this.requiredFields.length;
    var body = request.body;
    for(var i = 0; i < propLen; i++) {
        if(!!!body[this.requiredFields[i]]) {
            response.isValidParams = false;
            return response.status(200).json(new ResponseMessage(
                RESPONSE_CODE.INVALID_PARAMS.CODE,
                'Field Missing'
            ));
        }
    }
}


/**
 * Login Request
 * @param email
 * @param psw
 * @constructor
 */
var LoginRequestMessage = function(email, psw) {
    /**
     *
     * @type {string}
     */
    this.email = email || "";

    /**
     *
     * @type {string}
     */
    this.password = psw || "";


    this.requiredFields = ["email", "password"];
}

LoginRequestMessage.requiredFields = ["email", "password"];
util.inherits(LoginRequestMessage, RequestMessage);


LoginRequestMessage.prototype.validateRequest = function(request, response) {
//    RequestMessage.prototype.validateRequest.call(this, request, response);

    response.isValidParams = true;
    var body = request.body;
    var propLen = this.requiredFields.length;
    for(var i = 0; i < propLen; i++) {
        if(!!!body[this.requiredFields[i]]) {
            response.isValidParams = false;
            return response.status(401).end();
        }
    }
}

/**
 * Signup Request
 * @constructor
 */
var SignupRequestMessage = function(email, password, passwordConfirmation) {
   

    /**
     *
     * @type {Array}
     */
    this.requiredFields = ["email", "password", "passwordConfirmation"];
}

SignupRequestMessage.requiredFields = ["email", "password", "passwordConfirmation"];
util.inherits(SignupRequestMessage, RequestMessage);
SignupRequestMessage.prototype.validateRequest = function(request, response) {
    response.isValidParams = true;
    //validate
    RequestMessage.prototype.validateRequest.call(this, request, response);
    var body = request.body;
    if(body.password != body.passwordConfirmation) {
        response.isValidParams = false;
        return response.status(200).json(new ResponseMessage(
            RESPONSE_CODE.INVALID_PARAMS.CODE,
            'Input Passwords Different '
        ));
    }

}

 /**
 * Profile Update Request
 * @param username
 * @param about
 * @param location
 * @param url
 * @constructor
 */
var ProfileEditRequestMessage = function(username, about, location, url) {
    /**
     *
     * @type {string}
     */
    this.username = username || "";

    /**
     *
     * @type {string}
     */
    this.about = about || "";

    /**
     *
     * @type {string}
     */
    this.location = location || "";

    /**
     *
     * @type {string}
     */
    this.url = url || "";

    /**
    *
    * @type {Array}
    */
    this.optionalFields = ["username","about","location","url"];
    this.requiredFields = [];
}

ProfileEditRequestMessage.requiredFields = [];
ProfileEditRequestMessage.optionalFields = ["username","about","location","url"];
util.inherits(ProfileEditRequestMessage, RequestMessage);


ProfileEditRequestMessage.prototype.validateRequest = function(request, response) {
//    RequestMessage.prototype.validateRequest.call(this, request, response);

    response.isValidParams = true;
    var body = request.body;
    var propLen = this.requiredFields.length;
    for(var i = 0; i < propLen; i++) {
        if(!!!body[this.requiredFields[i]]) {
            response.isValidParams = false;
            return response.status(401).end();
        }
    }
}

 /**
 * Room Create Request
 * @param title
 * @constructor
 */
var RoomCreateRequestMessage = function(title) {
    /**
     *
     * @type {string}
     */
    this.title = title || "";

    /**
    *
    * @type {Array}
    */
    this.requiredFields = ["title"];
}

RoomCreateRequestMessage.requiredFields = ["title"];
util.inherits(RoomCreateRequestMessage, RequestMessage);


RoomCreateRequestMessage.prototype.validateRequest = function(request, response) {
//    RequestMessage.prototype.validateRequest.call(this, request, response);

    response.isValidParams = true;
    var body = request.body;
    var propLen = this.requiredFields.length;
    for(var i = 0; i < propLen; i++) {
        if(!!!body[this.requiredFields[i]]) {
            response.isValidParams = false;
            return response.status(401).end();
        }
    }
}

/**
 * Valid Middleware
 * @param RequestMessage
 * @returns {Function}
 */
var validateParams = function(RequestMessage) {
    return function(req, res, next) {
        if(typeof RequestMessage !== 'object' || !('validateRequest' in RequestMessage)) {
            next();
        } else {
            RequestMessage.validateRequest(req, res);
            next();
        }
    }
}


/** Request Messages***/
exports.RequestMessage = RequestMessage;
exports.LoginRequestMessage = LoginRequestMessage;
exports.SignupRequestMessage =SignupRequestMessage;
exports.ProfileEditRequestMessage =ProfileEditRequestMessage;
exports.RoomCreateRequestMessage =RoomCreateRequestMessage;

/**Response Messages**/
exports.ResponseMessage = ResponseMessage;
exports.RESPONSE_CODE = RESPONSE_CODE;


exports.validateParams = validateParams;

