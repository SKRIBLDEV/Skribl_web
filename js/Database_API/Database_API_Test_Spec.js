

describe('Database API Tests', 
	function(){
		var dAPI=require('Database_API');

		var db=dAPI.newDatabase('localhost', 2424, 'skribl_database', 'skribl', 'skribl');
		db.createUser('Randy', 'Random', 'asdfghj', 'qwertyui', 'lkjhgf@vub.ac.be', 'english', callBack)

		function callBack(result){
			if (result===true){
			console.log('insert successful')
			}
			else{
			console.log('insert unsuccessful')
			}
		}
		it('connecting to database', function(){expect(db).toBeDefined();})
		it('creating user and getting user', function(){ 
												function checkUser(firstName, lastName, username, email, language){
													expect(firstName).tobe('Randy');
													expect(lastName).tobe('Random');
													expect(username).tobe('asdfghj');
													expect(email).tobe('lkjhgf@vub.ac.be');
													expect(language).tobe('english');
													}
												function notExist(){it('creating user', function(){expect(false).tobe(true);})}
												db.getUser('asdfghj', checkUser, notExist)
												}
		)
		it('check credentials', function(){
									db.checkCredentials('asdfghj', 'qwertyui', function(){expect(true).tobe(true);}, function(){expect(false).tobe(true);}, function(){expect(false).tobe(true);})
									db.checkCredentials('false', 'not true', function(){expect(false).tobe(true);}, function(){expect(true).tobe(true);}, function(){expect(true).tobe(true);})
								}
		)
		
		it('delete user', function(){
							db.deleteUser('asdfghj', function(dummyArg){
															db.getUser('asdfghj', function(firstName, lastName, username, email, language){expect(false).tobe(true);}, function(){expect(true).tobe(true);})
															})
							}
			)
	}
)