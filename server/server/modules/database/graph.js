

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

	this.getAuthorGraph = function(authId, depth, clb) {
		var newDepth = depth + depth;
		db.query('select $path, traversedVertex(-3).firstName as firstName1, traversedVertex(-3).lastName as lastName1, traversedVertex(-1).firstName as firstName2, traversedVertex(-1).lastName as lastName2, traversedVertex(-2).title as title, traversedVertex(-2).@class as class from (traverse in(\'AuthorOf\'), out(\'AuthorOf\')  from ' + authId + ') where $depth <= ' + newDepth + ' and @class = \'Author\' and @rid <> ' + authId).all()
		.then(function(res) {
			if(res.length) {
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