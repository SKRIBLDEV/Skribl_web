
const RID = require('./rid.js');
function Graph(db, AUT, myDB) {

	//XXX: zie opmerking over modules...

	/**
	 * gets username of userprofile connected to given author profile
	 * @param  {String} id  author id
	 * @param  {callBack} clb 
	 * @return {String}     username
	 */
	function getUsername(id, clb) {
		db.query('select expand(in(\'IsAuthor\')) from ' + id).all()
		.then(function(res) {
			if(res.length) {
				clb(null, res[0].username)
			}
			else {
				clb(null);
			}
		}).error(clb);
	}

	function authorsIterate(authors, idx, resArray, pubObj, clb) {
		var author1 = authors[idx];
		var autLength = authors.length;
		var ctr = idx+1;
		if(ctr === autLength) {
			clb(null, true);
		}
		for (var i = idx+1; i < autLength; i++) {
			resArray.push([author1, pubObj, authors[i]]);
		};
		clb(null, true);
	}

	function constructResObjects(array, idx, resArray, clb) {
		var resObj = array[idx];
		var pubObj = {id: RID.transformRid(resObj.rid), title: resObj.title, type: resObj.class};
		AUT.getAuthorObjects(resObj.authors, function(error, autObjects) {
			if(error) {
				clb(error);
			}
			else {
				var autObjLength = autObjects.length;
				var ctr = 0;
				for (var i = 0; i < autObjLength; i++) {
					authorsIterate(autObjects, i, resArray, pubObj, function(error, res) {
						if(++ctr === autObjLength) {
							clb(null, true);
						}
					});
				};
			}
		});
	}

	/**
	 * will return edges of graph in form: [{fromAuthorObject,  publicationObject, toAuthorObject}, {...}, ...]		
	 * @param  {String} authId author id 
	 * @param  {Integer} depth  depth of search in database
	 * @param  {callBack} clb    
	 * @return {Array<Array<Object>>}        edges of graph in form: [{fromAuthorObject,  publicationObject, toAuthorObject}, {...}, ...]	
	 */
	myDB.getAuthorGraph = function(authId, depth, clb) {
		var newDepth = depth + depth;
		db.query('select $path, @rid, @class, title, in_AuthorOf.out as authors from (traverse out_AuthorOf, in, in_AuthorOf, out from ' + authId + ' while $depth <= ' + newDepth + ' strategy BREADTH_FIRST) where @class = \'Proceeding\' or @class = \'Journal\'').all()
		.then(function(res) {
			var resLength = res.length;
			if(resLength) {
				var resArray = [];
				var ctr = 0;
				for (var i = 0; i < resLength; i++) {
					constructResObjects(res, i, resArray, function(error, bool) {
						if(++ctr === resLength) {
							clb(null, resArray);
						}
					});
				};
			}
			else {
				db.record.get(authId)
				.then(function(res) {
					getUsername(authId, function(error,usrname) {
						clb(null, {firstname: res.firstName, lastName: res.lastName, id: RID.getRid(res), username: usrname});
					})
				}).error(clb);
			}
		}).error(clb);
	}
}

exports.Graph = Graph;