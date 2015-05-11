//XXX: vermeld bron indien van toepassing, eerste deel lijkt mij niet door jezelf geschreven ;)
//XXX: plaats het eventueel ook in een andere module

const Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

}


function Classifier(db, myDB) {

    //XXX: zelfde opmerking over module als in affiliation.js

	function stringToBytes(str, clb) {

       var strLength = str.length;
		var arr = new Array(strLength);
		for(var i=0; i<strLength; i++) {
            arr[i] = str.charCodeAt(i);
		}
        clb(null, arr);
	}

	function bytesToString(arr, clb) {
       var arrLength = arr.length;
		var res = '';
		for(var i=0; i<arrLength; i++) {
			res += String.fromCharCode(arr[i]);
		}
        clb(null, res);
	}

	myDB.saveClassifier = function(usr, cls, clb) {
        db.select().from('Classifier').where({username: usr}).all()
        .then(function(res) {
            if(res.length) {
                db.update('Classifier').set({data: Base64.encode(cls)}).where({user: usr}).scalar()
                .then(function(opRes) {
                    clb(null);
                }).error(clb);
            }
            else {
                db.create('vertex', 'Classifier')
                .set({
                    user: usr,
                    data: Base64.encode(cls)
                }).one()
                .then(function(dummy) {
                    clb(null);
                }).error(clb);
            }
        }).error(clb);
	}

	myDB.loadClassifier = function(usr, clb) {
		db.select().from('Classifier').where({user: usr}).all()
		.then(function(cls) {
            if(cls.length){
			     clb(null, cls[0].data.toString());
            }
            else {
                clb(null, '');
            }
		}).error(clb);
	}
}

exports.Classifier = Classifier;
