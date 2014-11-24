exports.path = '/test/:id';

exports.get = function(req, res, context, next) {

	res.json({message: 'Your id was ' + req.param('id')});
}

exports.get.auth = function(auth, req, context) {

	return auth == 'noah';
}