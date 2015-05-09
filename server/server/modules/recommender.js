/* --- DEPENDENCIES --- */

const LRUcache = require('lru-cache');
const natural = require('natural');

var db;
function useDatabase(database) {
	db = database;
}

/* --- CACHE OF CLASSIFIERS --- */

const __CACHE_SIZE_LIMIT__ = 20; //max #classifiers
const __CACHE_TIME_LIMIT__ = 3600 * 1000; //in ms
const cache = new LRUcache({
	max: __CACHE_SIZE_LIMIT__,
	maxAge: __CACHE_TIME_LIMIT__,
	dispose: saveClassifier
});

function resetCache() { 
	console.log("Saving classifiers...");
	cache.reset();
}

process.on('exit', resetCache);
process.on('SIGINT', resetCache);
process.on('UncaughtException', resetCache);

function saveClassifier(usr, classifier) {
	db.saveClassifier(usr, JSON.stringify(classifier));
}

function getClassifier(usr, clb) {
	var cls = cache.get(usr); 
	if(cls)
		clb(null, cls);
	else {
		db.loadClassifier(usr, function(err, data) {
			if(err)
				clb(err);
			else {
				var cls;
				if(data)
					cls = natural.BayesClassifier.restore(JSON.parse(data))
				else
					cls = new natural.BayesClassifier(null, 0.1);
				cache.set(usr, cls);
				clb(null, cls);
			}
		});
	}
}

function dropClassifier(usr) {
	cache.del(usr);
}

/* --- PUBLICATION CLASSIFICATION --- */

/** Convert a publication to String format with it's most important text features
  * @param publications {Object} - publication to covert
  * @returns {String} resulting text encoding
*/
function encode(publication) {

	var info = [publication.title];

	var abstract = publication.abstract;
	if (abstract) info.push(abstract);

	var keywords = publication.keywords;
	if (keywords) info.push(keywords);

	var authors = publication.authors;
	if (authors) {
		var len = authors.length;
		for(var i = 0; i < len; ++i) {
			var current = authors[i];
			info.push([current.firstName,
					   current.lastName]);
		}
	}

	switch(publication.type) {

		case 'journal':
			var journal = publication.journal;
			var publisher = publication.publisher;
			if(journal) info.push(journal);
			if(publisher) info.push(publisher);
			break;

		case 'proceeding':
			var booktitle = publication.booktitle;
			var organisation = publication.organisation;
			if(booktitle) info.push(booktitle);
			if(organisation) info.push(organisation);
			break;
	}

	return info.toString().replace(/,/g, ' ');
}

const __LIKE_STR__ = '+';
const __DISLIKE_STR__ = '-';

/** Register a user's rating for a publications
  * @param user {String} - username of SKRIBL-account
  * @param publication {Object} - publication to rate
  * @param value {Boolean} - positive or negative rating
  * @param clb {Function} - callback (possibly with error)
  */
function rate(user, publication, value, clb) {

	var rating = (value? __LIKE_STR__ : __DISLIKE_STR__);
	getClassifier(user, function(err, cls) {
		if(err)
			clb(err);
		else {
			var pub = encode(publication);
			cls.addDocument(pub, rating);
			cls.train();
			clb();
		}
	});
}


/* --- RECOMMENDATION ALGORITHM --- */

/** Recommends publications to a user
  * @param user - username for SKRIBL-account
  * @param limit - maximum amount of publications to search for
  * @param clb - callback with error or PublicationArray sorted by rank
 */
function recommend(user, limit, clb) {

	//sorted by depth
	db.nearbyPublications(user, limit, function(err, pubs) {
		if(err)
			clb(err);
		else
			//filtered by classifier
			getClassifier(user, function(err, cls) {
				if(err)
					clb(err);
				else 
					clb(null, pubs.filter(function(pub) {
							var enc = encode(pub);
							return (cls.classify(enc) === '+');
						}));
			});
	});
}


/* --- EXPORTS --- */

exports.useDatabase = useDatabase;
exports.recommend = recommend;
exports.rate = rate;

/* --- TESTING --- 

function nop() {}

//testdata
var testdata = require('./database/testData/publicationData_noAbstract.js');
var pub1 = testdata[0];
var pub2 = testdata[1];
var pub3 = testdata[2];
var pub4 = testdata[3];
var pub5 = testdata[4];
var pub6 = testdata[5];
delete pub1.abstract;
delete pub2.abstract;
delete pub3.abstract;
delete pub4.abstract;
delete pub5.abstract;
delete pub6.abstract;

//phony database
var datastore = Object.create(null);
function path(str) {
	var prefix = './testcls/';
	var suffix = '.json';
	return prefix+str+suffix;
}

var fakeDb = {
	nearbyPublications: function(u, l, clb) {
		clb(null, testdata);
	},
	saveClassifier: function(usr, enc) {
		datastore[usr] = enc;
	},
	loadClassifier: function(usr, clb) {
		clb(null, datastore[usr] || '');
	}
}
useDatabase(fakeDb);

//simulation
rate('wdmeuter', pub1, false, nop);
rate('wdmeuter', pub2, false, nop);
rate('wdmeuter', pub4, true, nop);
rate('wdmeuter', pub5, false, nop);
rate('wdmeuter', pub6, false, nop);
recommend('wdmeuter', 5, function(err, data) {
	console.log(data.map(function(pub) { return pub.title }));
});
var cls;
getClassifier('wdmeuter', function(err, d) {
	cls = d;
});
exports.try = function(str) { return cls.classify(str) }
*/