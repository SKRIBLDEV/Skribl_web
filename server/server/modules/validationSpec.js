/**
 * 
 */



var VAL = require("./validation.js");

describe('Form Validation Test: ',function(){


	describe("email input", function(){
		var correctEmail = "hvbian@vub.ac.be";
		var notCorrect1 = "notaCorrectEmailAdress";
		var notCorrect2 = "(naam@((gmail.com";

		it(", a correct emailadress", function() {
			expect(VAL.isEmailAdress(correctEmail)).toEqual(true);
		});
		it(", with no at sign", function() {
			expect(VAL.isEmailAdress(notCorrect1)).toEqual(false);
		});
		it(", with non allowed characters ", function() {
			expect(VAL.isEmailAdress(notCorrect2)).toEqual(false);
		});
	});

	describe("password input", function(){
		var correct = "9Ghh17!ac";
		var notCorrect1 = "9Ghh1"; // too short
		var notCorrect2 = "hdhHohaa"; //no number
		var notCorrect3 = "hd999°aa"; //° not allowed

		it(", correct password", function() {
			expect(VAL.isPassword(correct)).toEqual(true);
		});
		it(", too short ", function() {
			expect(VAL.isPassword(notCorrect1)).toEqual(false);
		});
		it(", without number", function() {
			expect(VAL.isPassword(notCorrect2)).toEqual(false);
		});
		it(", ° is not allowed", function() {
			expect(VAL.isPassword(notCorrect3)).toEqual(false);
		});
	})

	describe("username input", function(){ // only letters, numbers and underscores
		var correct = "hpinson_94";
		var notCorrect1 = "hpinson&&"; 
		
		it(", correct username", function() {
			expect(VAL.isUsername(correct)).toEqual(true);
		});
		it(", with non allowed characters ", function() {
			expect(VAL.isUsername(notCorrect1)).toEqual(false);
		});
	})

	describe("general name input", function(){ // only letters, numbers and underscores
		var correct1 =	"Van Es";
		var correct2 = "André la çour"; 
		var correct3 =  "Kungliga Tekniska högskolan";
		var notCorrect1 = "@nna";
		var notCorrect2 = "999";

		
		it(", correct Belgian name", function() {
			expect(VAL.isGeneralName(correct1)).toEqual(true);
		});
		it(", correct French name", function() {
			expect(VAL.isGeneralName(correct2)).toEqual(true);
		});
		it(", correct Scandinavian institution", function() {
			expect(VAL.isGeneralName(correct3)).toEqual(true);
		});
		it(", with non allowed characers", function() {
			expect(VAL.isGeneralName(notCorrect1)).toEqual(false);
		});
		it(", with numbers", function() {
			expect(VAL.isGeneralName(notCorrect2)).toEqual(false);
		});
	});

});


