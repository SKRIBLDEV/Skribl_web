

var RID = require('./rid.js');
function ResearchDomain(db){

		/**
	 * adds a researchdomain with given name
	 * @private
	 * @param {String}   domain
	 * @param {callBack} callback
	 */
	function addResearchDomain(domain, varName, trx, callback) {
		var domName = domain;
		db.select().from('ResearchDomain').where({Name: domName}).all()
		.then(function(domains) {
			if(domains.length) {
				trx.let('resDomain' + varName, function(s) {
					s.select().from('ResearchDomain').where({Name: domName});
				})
				callback(null, varName);
			}
			else {
				trx.let('resDomain' + varName, function(s) {
					s.create('vertex', 'ResearchDomain')
					.set({
						Name: domName
					});
				});
			callback(null, varName);
			}
		});
	}

	/**
	 * will iterate over given domains and call addResearchDomains
	 * @param {Array<String>}   domains  ResearchDomains
	 * @param {String}   userRid  
	 * @param {callBack} callback
	 */
	this.addResearchDomains = function(domains, trx, callback) {
		var counter = domains.length;
		counter--;
		function forClb(error, varName) {
				if(error) {
					callback(error);
				} 
				else {
					trx.let('domainEdge', function(s) {
						s.create('edge', 'HasResearchDomain')
						.from('$user')
						.to('$resDomain' + varName);
					});
					if(counter) {
						counter--;
					}
					else {
						callback(null, true);
					}
				}
			}

		for (var i = 0; i < domains.length; i++) {
			addResearchDomain(domains[i], i, trx, forClb);
		}
	};

	this.addPubResearchDomains = function(domains, trx, callback) {
		var ctr = 0;
		function forClb(error, varName) {
			ctr++;
			if(error) {
				callback(error);
			} 
			else {
				trx.let('domainEdge', function(s) {
					s.create('edge', 'HasResearchDomain')
					.from('$publication')
					.to('$resDomain' + varName);
				});
				if(ctr == domains.length) {
					callback(null, true);
				}
			}
		}
		if(typeof domains !== 'undefined' && domains.length) {
			for (var i = 0; i < domains.length; i++) {
				addResearchDomain(domains[i], i, trx, forClb);
			}
		}
		else {
			callback(null, true);
		}
	};

	this.getPubResearchDomains = function(pubId, clb) {
		db.select('expand( out(\'HasResearchDomain\') )').from(pubId).all()
		.then(function(resDomains) {
			if(resDomains.length) {
				var res = [];
				var ctr = 0;
				for (var i = 0; i < resDomains.length; i++) {
					res.push(resDomains[i].Name);
					ctr++;
					if(ctr == resDomains.length) {
						clb(null, res);
					}
				};	
			}
			else {
				clb(null, []);
			}

		});
	}
}

exports.ResearchDomain = ResearchDomain;