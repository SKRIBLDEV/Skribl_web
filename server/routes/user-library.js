const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;

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

  context.db.loadLibrary(usr, lib, function(err, ids) {

    if (err) {

      serverError(res, err.toString());

    } else {

      res.status(200);
      res.json(ids);

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

/* --- ADD TO USER LIBRARY --- */

/**
  * Add a publication to a user's library
  * @param {Object} req - HTTP-request with user/library and publication id
  * @param {Object} res - HTTP-response with confirmation status-code or error
  * @param {Object} context - server context with extra configurations and external objects
*/
function addToLibrary(req, res, context) {

  //get user/library
  var usr = req.params['username'];
  var lib = req.params['libname'];

  //get publication id
  var pubId = req.body['id'];
  if (!pubId)
    return userError(res, "publication id was not specified!");
  
  //add to library
  context.db.addToLibrary(usr, lib, pubId, function(err) {
    if(err)
      serverError(res, err.toString());
    else
      res.status(200).end();
  });
}

/**
  * Checks if authenticated user is the legitimate owner of the library
  * @param {Object} auth - user that has (successfully) authenticated itself
  * @param {Object} req - HTTP-request sent to the server
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
*/
addToLibrary.auth = function(auth, req, context, clb) {

  clb(null, auth && auth.getUsername() === req.params['username']);
}


/* --- EXPORTS --- */

exports.path = '/user/:username/library/:libname';
exports.get = loadUserLibrary;
exports.put = addToLibrary;