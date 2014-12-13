

var RID = require('./rid.js');
function ResearchDomain(db){

		/**
	 * adds a researchdomain with given name
	 * @private
	 * @param {String}   domain
	 * @param {callBack} callback
	 */
	function addResearchDomain(domain, callback) {
		var domName = domain;
		db.select().from('ResearchDomain').where({Name: domName}).all()
		.then(function(domains) {
			if(domains.length) {
				var domain = domains[0];
				var domainRid = RID.getRid(domain);
				callback(null, domainRid);
			}
			else {
				db.vertex.create({
				'@class': 'ResearchDomain',
				Name: domName})
				.then(function (ResearchDomain) {
					var domainRid = RID.getRid(ResearchDomain);
					callback(null, domainRid);
				});
			}
		});
	}

	this.addResearchDomains = function(domains, userRid, callback) {
		var counter = domains.length;
		counter--;
		function forClb(error, domainRid) {
				if(error) {
					callback(error);
				} else {
					db.edge.from(userRid).to(domainRid).create('HasResearchDomain')
					.then(function() {
						if(counter) {
							counter--;
						}
						else {
							callback(null, true);
						}
					});
				}
			}

		for (var i = 0; i < domains.length; i++) {
			addResearchDomain(domains[i], forClb);
		}
	};
}

exports.ResearchDomain = ResearchDomain;