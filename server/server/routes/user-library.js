/* --- IMPORTS --- */

const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;


/* --- LOAD USER'S LIBRARY's --- */

/**
  * Load the names of all the user's libraries
  * @param {Object} req - HTTP-request with user/library and publication id
  * @param {Object} res - HTTP-response with confirmation status-code or error
  * @param {Object} context - server context with extra configurations and external objects
*/
function loadLibraries(req, res, context) {

  var usr = req.params['username'];

  context.db.loadLibraries(usr, function(err, libs) {
    if(err)
      serverError(res, err.toString());
    else {
      res.status(200);
      res.json(libs);
    }
  });
}

/**
  * Checks if user has succesfully authenticated to load his libraries
  * @param {Object} auth - user that has (successfully) authenticated itself
  * @param {Object} req - HTTP-request sent to the server
  * @param {Object} context - server context with extra configurations and external objects
  * @param {Function} clb - callback; to be called with boolean to indicate authentication success/failure
*/
loadLibraries.auth = function(auth, req, context, clb) {
  clb(null, auth && auth.getUsername() === req.params['username']);
}


/* --- EXPORTS --- */

exports.path = '/user/:username/library';
exports.get = loadLibraries;