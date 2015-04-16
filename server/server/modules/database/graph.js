

function Graph(db) {

	function parsePath(path, clb) {
		var resArray = [];
		var txt = path;
		var newTxt = txt.split('(');
		for (var i = 1; i < newTxt.length; i++) {
    		resArray[i-1] = {rid: newTxt[i].split(')')[0]};
		}
		clb(null, resArray);
	}

	this.getAuthorGraph = function(authId, depth, clb) {
		db.query('select $path, traversedVertex(-3).firstName as firstName1, traversedVertex(-3).lastName as lastName1, traversedVertex(-1).firstName as firstName2, traversedVertex(-1).lastName as lastName2, traversedVertex(-2).title as title, traversedVertex(-2).@class as class from (traverse in(\'AuthorOf\'), out(\'AuthorOf\')  from ' + authId + ') where $depth <= ' + depth + ' and @class = \'Author\' and @rid <> ' + authId).all()
		.then(function(res) {
			var ctr = 0;
			for (var i = 0; i < res.length; i++) {
				parsePath(res[i].$path, function(error, newPath) {
					res[ctr].connection = newPath.slice(newPath.length-3);

					res[ctr].connection[0].firstName = res[ctr].firstName1;
					res[ctr].connection[0].lastName = res[ctr].lastName1;

					res[ctr].connection[2].firstName = res[ctr].firstName2;
					res[ctr].connection[2].lastName = res[ctr].lastName2;

					res[ctr].connection[1].title = res[ctr].title;
					res[ctr].connection[1].type = res[ctr].class;

					res[ctr] = res[ctr].connection;

					ctr++
					if(ctr == res.length) {
						clb(null, res);
					}
				});
			};
		});
	}

}

exports.Graph = Graph;