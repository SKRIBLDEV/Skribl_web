

describe('Database API Tests', 
	function(){
		var dAPI=require('Database_API');
		var db=new dAPI.newDatabase('localhost', 2424, 'skribl_database', 'skribl', 'skribl');
		db.createUser('Randy', 'Random', 'asdfghj', 'qwertyui', 'lkjhgf@vub.ac.be', 'english', function(res){console.log(res)});
		it('connecting to database', function(){expect(db).toBeDefined();})
		
		//errors start here, WHY??
		xit('creating user and getting user', function(){ 
												function checkUser(firstName, lastName, username, email, language){
													expect(firstName).toBe('Randy');
													expect(lastName).toBe('Random');
													expect(username).toBe('asdfghj');
													expect(email).toBe('lkjhgf@vub.ac.be');
													expect(language).toBe('english');
													}
													
												function notExist(){it('creating user', function(){expect(false).toBe(true);})}
												
												db.getUser('asdfghj', checkUser, notExist)
												}
		)
		xit('check credentials', function(){
									db.checkCredentials('asdfghj', 'qwertyui', function(){expect(true).toBe(true);}, function(){expect(false).toBe(true);}, function(){expect(false).toBe(true);})
									db.checkCredentials('false', 'not true', function(){expect(false).toBe(true);}, function(){expect(true).toBe(true);}, function(){expect(true).toBe(true);})
								}
		)
		
		xit('delete user', function(){
							db.deleteUser('asdfghj', function(dummyArg){
														db.getUser('asdfghj', function(firstName, lastName, username, email, language){expect(false).toBe(true);}, function(){expect(true).toBe(true);})
															})
							}
			)
	}
)
