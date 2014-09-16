/**
 * @fileoverview
 */

goog.provide('jamout.factory.AuthenticationService');

/**
 * @constructor
 */



jamout.factory.AuthenticatoinService = function() {
		var auth = {
			isLogged : false
		}

		return auth;
	};

// /**
//  * @param $http 
//  * @constructor
//  */


//  jamout.factory.UserService = function($http){
// 			return {
// 		logIn: function(email, password) {
// 			return $http.post(options.api.base_url + '/login', {email: email, password: password});
// 		},

// 		logOut: function() {

// 		}
// 	}

// 	};



/**
 * @param $q
 * @param $window
 * @param AuthenticationService 
 * @constructor
 */


// jamout.factory.TokenInterceptor = function ($q, $window, AuthenticationService) {
// 	return {
// 		  request: function(config) {
// 		  	config.headers = config.headers || {};
// 		  	if ($window.sessionStorage.token) {
// 		  		config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
// 		  	}
// 		  	return config;
// 		  },

// 		  response: function (response) {
// 		  	return response || $q.when(response);
// 		  }
// 		};
// 	};



jamout.factory.AuthenticationService.INJECTS = jamout.factory.AuthenticationService;
