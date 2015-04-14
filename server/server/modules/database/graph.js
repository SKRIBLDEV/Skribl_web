

function Graph(db) {

	this.getAuthorGraph = function(clb) {
		db.query('select $path, traversedVertex(-3).firstName as firstName1, traversedVertex(-3).lastName as lastName1, traversedVertex(-1).firstName as firstName2, traversedVertex(-1).lastName as lastName2, traversedVertex(-2).title as title, traversedVertex(-2).@class as class from (traverse in(\'AuthorOf\'), out(\'AuthorOf\')  from Author) where $depth = 2').all()
		.then(function(res) {
			clb(null, true);
		});
	}

}

exports.Graph = Graph;