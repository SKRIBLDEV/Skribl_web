var UM = require('././modules/user.js');

function getUserInfo(req, res, context) {

		





}

function deleteUserInfo(req, res, context, ) {



}

function createUser(req, res) {





}


/* ---- EXPORT ROUTE ---- */

exports.path = '/users/:username';
exports.get = getUserInfo;
exports.put = createUser;
exports.delete = deleteUserInfo;