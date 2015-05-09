/* IMPORTS */

const recommender = require('../modules/recommender.js');
const errors = require('./routeErrors.js');
const serverError = errors.serverError;
const userError = errors.userError;


/* --- ADD TO USER LIBRARY --- */

const __FAV_LIB__ = 'Favorites';

/**
  * Add a publication to a user's library
  * @param {Object} req - HTTP-request with user/library and publication id
  * @param {Object} res - HTTP-response with confirmation status-code or error
  * @param {Object} context - server context with extra configurations and external objects
*/
function addToLibrary(req, res, context) {

  //get user/library/publication-id
  var usr = req.params['username'];
  var lib = req.params['libname'];
  var pubId = req.params['id'];
  var database = context.db;
  
  //add to library
  database.addToLibrary(usr, lib, pubId, function(err) {
    if(err)
      serverError(res, err.toString());
    else {
      res.status(200).end();
      //try to train classifier as well
      if (lib === __FAV_LIB__)
        database.getPublication(pubId, function(err, pub) {
          if(!err) //don't bother with errors
            recommender.rate(usr, pub, true, nop);
      });
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
addToLibrary.auth = function(auth, req, context, clb) {
  clb(null, auth && auth.getUsername() === req.params['username']);
}


/* --- REMOVE FROM USER LIBRARY --- */

/**
  * Remove a publication from a user's library
  * @param {Object} req - HTTP-request with user/library and publication id
  * @param {Object} res - HTTP-response with confirmation status-code or error
  * @param {Object} context - server context with extra configurations and external objects
*/
function removeFromLibrary(req, res, context) {

  //get user/library/publication-id
  var usr = req.params['username'];
  var lib = req.params['libname'];
  var pubId = req.params['id'];

  //remove publication from library
  context.db.removeFromLibrary(usr, lib, pubId, function(err) {
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
removeFromLibrary.auth = function(auth, req, context, clb) {
  clb(null, auth && auth.getUsername() === req.params['username']);
}

/* --- EXPORTS --- */

//fix for starting # in publication id's
exports.preprocess = function(req, res, context, next) {
  req.params['id'] = '#' + req.params['id']; 
  next();
}

exports.path = '/user/:username/library/:libname/:id';
exports.put = addToLibrary;
exports.delete = removeFromLibrary;