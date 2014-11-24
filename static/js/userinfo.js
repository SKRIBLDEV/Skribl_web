/**
 * 
 */

var userinfo = (function() {
  
  function _user(first, last, email, field, group, dep, fac, inst, username) {
	    this.firstName = first;
	    this.lastName = last;
	    this.email = email;
	    this.field = field;
	    this.group = group;
	    this.department = dep;
	    this.faculty = fac;
	    this.institution = inst;
	    this.username = username;   
	    
	    this.getFirstName = function(){
	        return this.firstName;
	    };
	}
  
  
//attribute getters & setters
  

  
  
// 
  
  var loadUser = function(username, db, clbUserLoaded){
	  db.getUser(username, function (first, last, email, field, group, dep, fac, inst, username){ //callback data fetching
		  clbUserLoaded(new _user(first, last, email, field, group, dep, fac, inst, username));
	  });
  }
  
 
  var createUser = function(first, last, email, field, group, dep, fac, inst, username, clbUserCreated) {	
	  
	  //validation of attributes + exception handling  
	  
	db.createUser(first, last, email, field, group, dep, fac, inst, username, function (){
		clbUserCreated();
	})
	
	/* ? or rather something of the form:
	 db.createUser(first, last, email, field, group, dep, fac, inst, username, function (succeeded?){
	 	if (succeeded?)
	 		clbUserCreated();
		else 
			throw ...
	})
	
	//Then the database interface method *createUser* could be implemented as follows:
		var createUser = function(first, last, email, É, callback){
		//... try to create user in database...
		if (succes) 
			callback(true)
		else 
			callback(false)
		//of course this can be written more elegantly : )
		}
	
	 */
  }
  
  
  
  
  return {
    loadUser: loadUser,
    createUser: createUser,
    getUsername: getUsername,
    getEmail: getEmail,
    //...
    save: save,
    remove: remove, 
    exists: exists
  };

})();

/*
- Model dat informatie over gebruiker voorstelt
- Bevat alle nodige velden (buiten wachtwoord) zoals in database schema
- Maak misschien best de echte constructor (die met 'new') private aan de module...
- ... en exporteer onderstaande custom ctor's/factory methods (of hoe dat ook heet)...
- Gebruikt de INTERFACE van bovenstaande database
- INTERFACE:
      * (CTOR 1) loadUser(username, db, callback)
          // laadt user met gebruikersnaam username uit db
            // db implementeert database-interface van hierboven
        // callback wordt opgeroepen met resultaat (asynchroon) 
      * (CTOR 2) createUser(username, password, email, ...)
          // voor alle attributen, zie db-schema
          // valideert ook deze attributen  ... 
          // ... en throwt gepaste exceptions indien ongeldig
      * getters voor de user-attributen 
          // vb: getUsername(), getEmail(), É
      * save(db)
          // sla gebruiker op in database
          // db implementeert opnieuw de interface van hierboven
      * remove(db) 
          // verwijder deze gebruiker uit de db
      * exists(db, callback)
          // kijk of gebruiker al bestaat in db
        // roep de callback op met true/false
*/