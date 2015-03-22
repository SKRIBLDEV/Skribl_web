var Oriento = require('oriento');

function Keyword(db) {
	var self = this;
	this.addKeyword = function(keyword, trx, clb) {
		db.select().from('Keyword').where('keyword = ' + keyword).all()
		.then(function(res) {
			if(res.length) {
				trx.let(keyword, function(s) {
					s.select().from('Keyword').where('keyword = ' + keyword);
				})
				clb(null, true);
			}
			else {
				trx.let(keyword, function(s) {
					s.create('vertex', 'Keyword')
					.set({
						keyword: keyword
					});
				});
				clb(null, true);
			}
		});
	}

	this.addKeywords = function(keywords, trx, callback) {
		var ctr = 0;
		for (var i = 0; i < keywords.length; i++) {
			self.addKeyword(keywords[i], trx, function(error, res) {
				trx.let('keywordEdge', function(s) {
					s.create('edge', 'HasKeyword')
					.from('$publication')
					.to('$' + keywords[i])
				});
				if(ctr == keywords.length) {
					callback(null, true);
				}
			})
		};
	}

}
exports.Keyword = Keyword;