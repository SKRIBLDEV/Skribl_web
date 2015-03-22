

var RID = require('./rid.js');
function ResearchDomain(db){

	var self = this;

		/**
	 * adds a researchdomain with given name
	 * @private
	 * @param {String}   domain
	 * @param {callBack} callback
	 */
	this.addResearchDomain = function(domain, varName, trx, callback) {
		var domName = domain;
		db.select().from('ResearchDomain').where({Name: domName}).all()
		.then(function(domains) {
			if(domains.length) {
				trx.let(varName, function(s) {
					s.select().from('ResearchDomain').where({Name: domName});
				})
				callback(null, varName);
			}
			else {
				trx.let(varName, function(s) {
					s.create('vertex', 'ResearchDomain')
					.set({
						Name: domName
					});
					callback(null, varName);
				});
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
						.to('$' + varName);
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
			self.addResearchDomain(domains[i], i, trx, forClb);
		}
	};

	this.addResearchDomainsPub = function(domains, trx, callback) {
		var counter = domains.length;
		counter--;
		function forClb(error, varName) {
				if(error) {
					callback(error);
				} 
				else {
					trx.let('domainEdge', function(s) {
						s.create('edge', 'HasResearchDomain')
						.from('$publication')
						.to('$' + varName);
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
			self.addResearchDomain(domains[i], i, trx, forClb);
		}
	};
}

exports.ResearchDomain = ResearchDomain;