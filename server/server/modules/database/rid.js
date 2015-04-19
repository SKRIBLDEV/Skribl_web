var Oriento = require('oriento');

	/**
	 * returns the record id of an object as a string.
	 * @private
	 * @param  {Object} object
	 * @return {String}
	 */
	exports.getRid = getRid;
	function getRid(object) {
		var rid = object['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	exports.getORid = getORid;
	/**
	 * returns the record id of an object as an oriento rid object.
	 * @private
	 * @param  {Object} object
	 * @return {String}
	 */
	function getORid(object) {
		var rid = object['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
		var result = '#' + cluster + ':' + position;
		return Oriento.RID(result);
	}

	/**
	 * gets rid in object form and transforms it into stringform
	 * @param  {Object} data
	 * @return {String}
	 */
	exports.transformRid = transformRid;
	function transformRid(data) {
		var cluster = data.cluster;
		var position = data.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	/**
	 * takes an array of objects and uses getRid to make an array of string rid's
	 * @param  {Array<Object>} array of objects
	 * @return {Array<String>}
	 */
	exports.getRids = function(array) {
		var resArray = [];
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			resArray.push(getRid(array[i]));
			counter++
			if(counter == array.length) {
				return resArray;
			}
		};
	}

	/**
	 * takes an array of object rid's an gives back an array of string rid's
	 * @param  {Array<Object>} array object rid's
	 * @return {Array<String>}       result
	 */
	exports.transformRids = function(array) {
		var resArray = [];
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			resArray.push(transformRid(array[i]));
			counter++
			if(counter == array.length) {
				return resArray;
			}
		};
	}

	/**
	 * takes an array of objects which hava a field with name: 'rid' and gives back an array of string rid's
	 * @param  {Array<Objec>} array 
	 * @return {Array<String>}       
	 */
	exports.getFieldRids = function(array) {
		var resArray = [];
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			resArray.push(transformRid(array[i].rid));
			counter++
			if(counter == array.length) {
				return resArray;
			}
		};
	}

	/**
	 * given an array of objects, will return an array of oriento rid objects
	 * @param  {Array<object>} array 
	 * @return {Array<Object>}       
	 */
	exports.getORids = function(array) {
		var resArray = [];
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			resArray.push(getORid(array[i]));
			counter++
			if(counter == array.length) {
				return resArray;
			}
		};
	}

	/**
	 * function to compare rids
	 * @param  {String} rid1 
	 * @param  {String} rid2 
	 * @return {Int}     
	 */
	exports.compareRid = function(rid1, rid2) {
		rid1 = rid1.replace('#', '');
		rid2 = rid2.replace('#', '');
		rid1 = rid1.replace(':', '');
		rid2 = rid2.replace(':', '');
		return parseInt(rid1) - parseInt(rid2);
	}