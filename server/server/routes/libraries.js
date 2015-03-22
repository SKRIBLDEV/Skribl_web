/* --- IMPORTS --- */

const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;


/* --- ADD A NEW LIBRARY --- */

/**
  * Allows to create a new library for a user
  * @param {Object} req - HTTP-request with user/library in its URL
  * @param {Object} res - HTTP-response with publication id's in that library
  * @param {Object} context - server context with extra configurations and external objects
*/
function addUserLibrary(req, res, context) {

  var usr = req.params['username'];
  var lib = req.params['libname'];

  context.db.addLibrary(usr, lib, function(err, data) {
    if(err)
      serverError(res, err.toString());
    else {
      res.status(201).end();
    }
  });
}

/**
  * Checks if authenticated user has privilege to create new library
  * @param {Object} auth - user that has (successfully) authenticated itself
  * @param {Object} req - HTTP-request sent to the server
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
*/
addUserLibrary.auth = function(auth, req, context, clb) {
  clb(null, auth && auth.getUsername() === req.params['username']);
}


/* --- REMOVE AN EXISTING LIBRARY --- */

/**
  * Allows to remove a certain library
  * @param {Object} req - HTTP-request with user/library in its URL
  * @param {Object} res - HTTP-response with publication id's in that library
  * @param {Object} context - server context with extra configurations and external objects
*/
function removeUserLibrary(req, res, context) {

  var usr = req.params['username'];
  var lib = req.params['libname'];

  context.db.removeLibrary(usr, lib, function(err, data) {
    if(err)
      serverError(res, err.toString());
    else {
      res.status(204).end();
    }
  });
}

/**
  * Checks if authenticated user has privilege to remove his/her library
  * @param {Object} auth - user that has (successfully) authenticated itself
  * @param {Object} req - HTTP-request sent to the server
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
*/
removeUserLibrary.auth = function(auth, req, context, clb) {
  clb(null, auth && auth.getUsername() === req.params['username']);
}


/* --- LOAD USER LIBRARY --- */

/**
  * Load a user's library
  * @param {Object} req - HTTP-request with user/library in its URL
  * @param {Object} res - HTTP-response with publication id's in that library
  * @param {Object} context - server context with extra configurations and external objects
*/
function loadUserLibrary(req, res, context) {

  var usr = req.params['username'];
  var lib = req.params['libname'];

  context.db.loadLibrary(usr, lib, function(err, pubs) {
    if (err)
       serverError(res, err.toString());
    } else {
       res.status(200);
       res.json(pubs);
    }
  });
}

/**
  * Checks if authenticated user is the legitimate owner of the library
  * @param {Object} auth - user that has (successfully) authenticated itself
  * @param {Object} req - HTTP-request sent to the server
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
*/
loadUserLibrary.auth = function(auth, req, context, clb) {
  clb(null, auth && auth.getUsername() === req.params['username']);
}


/* --- EXPORTS --- */

exports.path = '/user/:username/library/:libname';
exports.get = loadUserLibrary;
exports.put = addUserLibrary;
exports.delete = removeUserLibrary;