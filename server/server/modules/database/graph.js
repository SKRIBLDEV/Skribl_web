
var RID = require('./rid.js');
function Graph(db, AUT) {

	function parsePath(path, clb) {
		var resArray = [];
		var txt = path;
		var newTxt = txt.split('(');
		for (var i = 1; i < newTxt.length; i++) {
    		resArray[i-1] = {id: newTxt[i].split(')')[0]};
		}
		clb(null, resArray);
	}

	function getUsername(id, clb) {
		db.query('select expand(in(\'IsAuthor\')) from ' + id).all()
		.then(function(res) {
			if(res.length) {
				clb(null, res[0].username)
			}
			else {
				clb(null, undefined);
			}
		}).error(function(er) {
			clb(er);
		});
	}

	function parseObject(array, idx, clb) {
		array[idx].connection[0].firstName = array[idx].firstName1;
		array[idx].connection[0].lastName = array[idx].lastName1;

		array[idx].connection[2].firstName = array[idx].firstName2;
		array[idx].connection[2].lastName = array[idx].lastName2;

		array[idx].connection[1].title = array[idx].title;
		array[idx].connection[1].type = array[idx].class;

		array[idx] = array[idx].connection;
		getUsername(array[idx][0].id, function(error, name1) {
			if(error) {
				clb(error);
			}
			array[idx][0].username = name1;
			getUsername(array[idx][2].id, function(error, name2) {
				if(error) {
					clb(error);
				}
				array[idx][2].username = name2;
				clb(null, true);
			});	
		});
	}

	function authorsIterate(authors, idx, resArray, pubObj, clb) {
		var author1 = authors[idx];
		var ctr = idx+1;
		if(ctr == authors.length) {
			clb(null, true);
		}
		for (var i = idx+1; i < authors.length; i++) {
			resArray.push([author1, pubObj, authors[i]]);
			if(++ctr == authors.length) {
				clb(null, true);
			}
		};
	}

	function constructResObjects(array, idx, resArray, clb) {
		var resObj = array[idx];
		var pubObj = {id: RID.transformRid(resObj.rid), title: resObj.title, type: resObj.class};
		AUT.getAuthorObjects(resObj.authors, function(error, autObjects) {
			if(error) {
				clb(error);
			}
			else {
				var ctr = 0;
				for (var i = 0; i < autObjects.length; i++) {
					authorsIterate(autObjects, i, resArray, pubObj, function(error, res) {
						if(++ctr == autObjects.length) {
							clb(null, true);
						}
					});
				};
			}
		});
	}

	this.getAuthorGraph = function(authId, depth, clb) {
		var newDepth = depth + depth;
		db.query('select $path, @rid, @class, title, in_AuthorOf.out as authors from (traverse out_AuthorOf, in, in_AuthorOf, out from ' + authId + ' while $depth <= ' + newDepth + ' strategy BREADTH_FIRST) where @class = \'Proceeding\' or @class = \'Journal\'').all()
		.then(function(res) {
			if(res.length) {
				var resArray = [];
				var ctr = 0;
				for (var i = 0; i < res.length; i++) {
					constructResObjects(res, i, resArray, function(error, bool) {
						if(++ctr == res.length) {
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
				}).error(function(er) {
					clb(er);
				});
			}
		}).error(function(er) {
			clb(er);
		});
	}
}

exports.Graph = Graph;