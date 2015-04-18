
var RID = require('./rid.js');
function Graph(db) {

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

	function constructResObject(array, idx, clb) {
		var resObj = array[idx];
		array[idx] = [{id: RID.transformRid(resObj.fromAuthor), firstName: resObj.fromFirstName, lastName: resObj.fromLastName}, 
					{id: RID.transformRid(resObj.pub), title: resObj.title, type: resObj.type}, 
					{id: RID.transformRid(resObj.toAuthor), firstName: resObj.toFirstName, lastName: resObj.toLastName}];

		clb(null, true);
	}

	this.getAuthorGraph = function(authId, depth, clb) {
		var newDepth = depth + depth;
		db.query('select $path, traversedEdge(-1).out.firstName as toFirstName, traversedEdge(-1).out.lastName as toLastName, traversedEdge(-1).out as toAuthor, traversedEdge(-1).in as pub, traversedEdge(-1).in.title as title, traversedEdge(-1).in.@class as type, traversedEdge(-2).out as fromAuthor, traversedEdge(-2).out.firstName as fromFirstName, traversedEdge(-2).out.lastName as fromLastName from (traverse out_AuthorOf, in, in_AuthorOf, out from ' + authId + ') where $depth <= ' + newDepth + ' and @class = \'AuthorOf\' and out <> ' + authId).all()
		.then(function(res) {
			if(res.length) {
				var ctr = 0;
				for (var i = 0; i < res.length; i++) {
					constructResObject(res, i, function(error, bool) {
						if(++ctr == res.length) {
							clb(null, res);
						}
					});
				};

/*
				var ctr = 0;
				var ctr2 = 0;
				for (var i = 0; i < res.length; i++) {
					parsePath(res[i].$path, function(error, newPath) {
						res[ctr].connection = newPath.slice(newPath.length-3);
						parseObject(res, ctr++, function(error, dummy) {
							if(error) {
								clb(error);
							}
							if(++ctr2 == res.length) {
								clb(null, res);
							}
						});
					});
				};
*/
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