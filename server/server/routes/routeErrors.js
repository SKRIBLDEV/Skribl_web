/* --- ERRORS --- */

/**
  * Auto-generates error that indicates a server error
  * @param {Object} res - HTTP response to output error to
  * @param {String} reason - description of the error
  * @private
 */
function serverError(res, reason) {
	res.status(500);
	res.end('SERVER ERROR: ' + reason);
}

/**
  * Auto-generates error that indicates a user error
  * @param {Object} res - HTTP response to output error to
  * @param {String} reason - description of the error
  * @private
 */
function userError(res, reason) {
	res.status(400);
	res.end('ERROR: ' + reason);
}

exports.serverError = serverError;
exports.userError = userError;