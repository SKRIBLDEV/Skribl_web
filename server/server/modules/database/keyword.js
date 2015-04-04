var Oriento = require('oriento');

function Keyword(db) {

	function addKeyword(keyword, trx_id, trx, clb) {
		db.select().from('Keyword').where('keyword = \'' + keyword + '\'').all()
		.then(function(res) {
			if(res.length) {
				trx.let(trx_id, function(s) {
					s.select().from('Keyword').where('keyword = \'' + keyword + '\'');
				});
			}
			else {
				trx.let(trx_id, function(s) {
					s.create('vertex', 'Keyword')
					.set({
						keyword: keyword
					});
				});
			}
			trx.let('keywordEdge', function(s) {
				s.create('edge', 'HasKeyword')
				.from('$publication')
				.to('$' + trx_id);
			});
			clb(null, true);
		}).error(function(er) {
			callback(er);
		});
	}

	this.addKeywords = function(keywords, trx, callback) {
		if(typeof authors !== 'undefined' && keywords.length) {
 			var ctr = 0;
			for (var i = 0; i < keywords.length; i++) {
				addKeyword(keywords[i], i, trx, function(error, res) {
					ctr++;
					if(ctr == keywords.length) {
						callback(null, true);
					}
				});
			};		
		}
		else {
			callback(null, true);
		}
	}

	this.getPubKeywords = function(pubId, clb) {
		db.select('expand( out(\'HasKeyword\') )').from(pubId).all()
		.then(function(resKeys) {
			if(resKeys.length) {
				var res = [];
				var ctr = 0;
				for (var i = 0; i < resKeys.length; i++) {
					res.push(resKeys[i].keyword);
					ctr++;
					if(ctr == resKeys.length) {
						clb(null, res);
					}
				};	
			}
			else {
				clb(null, []);
			}

		}).error(function(er) {
			callback(er);
		});
	}

}
exports.Keyword = Keyword;