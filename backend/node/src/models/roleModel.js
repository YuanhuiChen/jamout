 /**
 * To verify a users role on the server side allow access to api and pages
 */


/**
* @param {Array} roles e.g ['admin, 'user']
* @constructor
*/
 var verifyUserRole = function(roles) {

  return function (req, res, next) {
      // console.log('inside verify user role', roles);
      // console.log('users role is', req.session.role);
      var paramLength = roles.length;
      var approved = false;
     for (i = 0; i < paramLength; i++) {

      if (req.session.role === roles[i]) {
        // console.log(roles[i], 'success');
        approved = true;
        next();
      }

      if (!req.session.role) {
         if (roles[i] === 'guest') {
            // console.log('GUEST success');
            approved = true;
           next();
           } 
           
      }  

    }
    // console.log('session', req.session);
    // console.log('approved status', approved);
       if (!approved) {
           return res.status(403).end();
        }
  
  }
}

 exports.verifyUserRole = verifyUserRole;