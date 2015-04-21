//Every status can represent ONE 'transaction' impossible to multiple upload, ... at the same time !! Some status needs other one's be carefull with that.
webapp.service('managePublications', function($location, appData, $http, pdfDelegate, userService) {

    var self = this;
//----------------------------------------------------------------------------------------------------------------------//
    //CODE USED IN THE PUBLICATIONS CARD
    
    //publication_status --> current publication data corrupt or not
    //PUBLICATIONS_STATUS reference of all possible status
    var PUBLICATIONS_STATUS = {
        CORRUPT: 0,
        UPTODATE: 1};
        var publication_status = PUBLICATIONS_STATUS.CORRUPT;

        this.publications_corrupt = function(){return publication_status == PUBLICATIONS_STATUS.CORRUPT;};

        this.showLibraryCard = true;
        this.toggleLibraryCard = function(){self.showLibraryCard = ! self.showLibraryCard;}
        function corrupt(){publication_status = PUBLICATIONS_STATUS.CORRUPT;};
        function upToDate(){publication_status = PUBLICATIONS_STATUS.UPTODATE;};

        this.toggleLibraryCard = function(){ self.showLibraryCard = !self.showLibraryCard;};

    //Get all the libraries of the current user
    var error_ctr_userLib = 0;
    this.getUserLibraries = function() {
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library');
        var authorization = {headers: 
           {'Content-type' : 'application/json',
           'Authorization': appData.Authorization}};
           var getUserLibrariesRequest = $http.get(url, authorization);

           getUserLibrariesRequest.success(function(data, status, headers, config) {
            error_ctr_userLib = 0;
            appData.data.userLibrariesNames = data;
            upToDate();
            console.log(data);
        });
           getUserLibrariesRequest.error(function(data, status, headers, config) {
               if(error_ctr_userLib < 4){error_ctr_userLib = error_ctr_userLib + 1;
                 self.getUserLibraries()}
                 else{toast("SKRIBL encoutered a problem please try again later.", 4000);
                 userService.logout();
                 self.getUserLibraries();};
             });
       };

    //get alle the publications of a certain user in a certain library
    var error_ctr_userPub = 0;
    this.getUserPublications = function(libraryName, displayToast) {

        displayToast = (typeof displayToast !== 'undefined') ? displayToast : true;
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName);
        var authorization = {headers: 
           {'Content-type' : 'application/json',
           'Authorization': appData.Authorization}};
           var getUserPublicationsRequest = $http.get(url, authorization);
           getUserPublicationsRequest.success(function(data, status, headers, config) {
            error_ctr_userPub = 0;
            appData.data.publications = data;
            console.log(data);

            self.pdfDelegate.$getByHandle('my-pdf-container').load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf');
            appData.pdf.url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';    

            appData.data.currentLibraryName = libraryName;
            upToDate();
            if (displayToast){
                toast("Sucesfully Loaded \"" + libraryName + "\" library", 4000);    
            }
        });
           getUserPublicationsRequest.error(function(data, status, headers, config) {
               if(error_ctr_userPub < 4){error_ctr_userPub = error_ctr_userPub + 1;
                 self.getUserPublications()}
                 else{toast("SKRIBL encoutered a problem please try again later.", 4000);
                 userService.logout();
                 self.getUserPublications();};
             });
       };

    //add a publication to a certan library of a user
    this.addPublications = function(libraryName, publicationID) {
        publicationID = stripHashtag(publicationID);

        corrupt();
        var url =  serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var authorization = {headers: 
           {'Content-type' : 'application/json',
           'Authorization': appData.Authorization}};
           var addPublicationsRequest = $http.put(url, {}, authorization);

           addPublicationsRequest.success(function(data, status, headers, config) {
            if(libraryName === appData.data.currentLibraryName)
                {self.getUserPublications(appData.data.currentLibraryName);}
            else{upToDate();};
            var toToast ="Publication added to library ".concat(libraryName).concat(".");
            toast(toToast, 4000);
        });
           addPublicationsRequest.error(function(data, status, headers, config) {
            upToDate();
            if(status == 500)
                {toast("Publication is already in the library.", 4000);}
            else {toast("Failed to add library, try again later.", 4000)};
        });
       }

       this.canLibBeDeleted = function(libraryName){
        return ["Uploaded", "Portfolio", "Favorites"].indexOf(libraryName) !== -1;
    }

    //delete a certain publication of a certain library of a user
    this.deletePublication = function(libraryName, publicationID) {
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var authorization = {headers: 
           {'Content-type' : 'application/json',
           'Authorization': appData.Authorization}};
           var deletePublicationsRequest = $http.delete(url, authorization);

           deletePublicationsRequest.success(function(data, status, headers, config) {
            if(libraryName === appData.data.currentLibraryName)
                {self.getUserPublications(appData.data.currentLibraryName);}
            else{upToDate();};
            var toToast ="Publication removed from library ".concat(libraryName).concat(".");
            toast(toToast, 4000);
        });
           deletePublicationsRequest.error(function(data, status, headers, config) {
            upToDate();
            toast("Failed to remove publication, try again later.", 4000);
        });
       }

    //change publication from a library to an other
    this.switchFromLib = function(oldLibName, newLibName, publicationID){
        self.addPublications(newLibName, publicationID);
        self.deletePublication(oldLibName, publicationID);
    }

    //Create a new library for a user 
    this.createLib = function(libName) {
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libName);
        var authorization = {headers: 
           {'Content-type' : 'application/json',
           'Authorization': appData.Authorization}};
           var createRequest = $http.put(url, {}, authorization);

           createRequest.success(function(data, status, headers, config) {
            self.getUserLibraries();
            var messageToToast = "Library ".concat(libName).concat(" created.");
            toast(messageToToast, 4000);
        });
           createRequest.error(function(data, status, headers, config) {
            upToDate();
            toast("Failed to create library, try again later.", 4000);
        });
       }

    //Delete a library of a user
    this.deleteLib = function(libName) {
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libName);
        var authorization = {headers: 
           {'Content-type' : 'application/json',
           'Authorization': appData.Authorization}};
           var createRequest = $http.delete(url, authorization);

           createRequest.success(function(data, status, headers, config) {
            self.getUserLibraries();
            var messageToToast = "Library ".concat(libName).concat(" deleted.");
            toast(messageToToast, 4000);
        });
           createRequest.error(function(data, status, headers, config) {
             upToDate();
             toast("Failed to delete library, try again later.", 4000);
         });
       }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    //Used to download a certain file of the db
    //@Pieter hier moet jij reseten na dat de file download gedaan is via html, ik heb hem in appData.currentFile gestoken
    var DOWNLOADFILE_STATUS = {
        INITIAL: 0,
        DOWNLOADING: 1,
        SUCCES_DOWNLOADING: 2}
        var downloadFile_status = DOWNLOADFILE_STATUS.INITIAL;

        this.downloadFile_initialStatus = function() {return downloadFile_status == DOWNLOADFILE_STATUS;};
        this.downloadFile_downloading = function(){return downloadFile_status == DOWNLOADFILE_STATUS.DOWNLOADING;};
        this.downloadFile_succes = function(){ return downloadFile_status == DOWNLOADFILE_STATUS.SUCCES_DOWNLOADING;};
        this.downloadFile_reset = function(){downloadFile_status = DOWNLOADFILE_STATUS.INITIAL; appData.deleteCurrentFile();};

        this.getFile = function(publicationID) {
            self.downloadFile_downloading();
            var url = serverApi.concat('/publications/').concat(publicationID).concat('?download=true');
            var getFileRequest = $http.get(url, config);

            getFileRequest.success(function(data, status, headers, config) {
                self.downloadFile_succes();
                appData.data.currentFile = data;
                console.log(appData.data.currentFile);
            });
            getFileRequest.error(function(data, status, headers, config) {
             self.downloadFile_reset();
             toast("Failed to download file, please try again later.", 4000);
         });
        }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    //Used to get the meta data of a certain publication
    //@Pieter hier moet jij reseten na dat de metaData gebruikt werd en verwijderd mag worden
    var GETMETA_STATUS = {
        INITIAL: 0,
        GETTING :1,
        SUCCES_GETTING: 2}
        var getMeta_status = GETMETA_STATUS.INITIAL;

        this.showPublicationViewer = false;
        this.disablePublicationViewer = function(){ 
            self.showPublicationViewer = false;
        // self.getMeta_reset();
    };
    this.publicationViewerEnabled = function(){ return self.showPublicationViewer;};
    
    this.displayPDF = false;

    this.toggleDisplayPDF = function(){
        self.displayPDF = !self.displayPDF;
    }


    this.loadPublicationInViewer = function(publicationID){
        self.getMetaData(publicationID);
        self.showPublicationViewer = true;
    }

    this.getMeta_initialStatus = function() {return ui_getMeta_status == ui_GETMETA_STATUS.INITIAL;};
    this.getMeta_getting = function(){return ui_getMeta_status == ui_GETMETA_STATUS.GETTING;};
    this.getMeta_succes = function(){ return ui_getMeta_status == ui_GETMETA_STATUS.SUCCES_GETTING;};
    this.getMeta_reset = function(){ui_getMeta_status = ui_GETMETA_STATUS.INITIAL; appData.data.currentMetaData = null;};

    function stripHashtag(publicationID){
        console.log(publicationID);
        
        if (publicationID.charAt(0) === '#'){
            publicationID = publicationID.substr(1);
        }
        return publicationID;        
    }

    function changePDFURL(newURL){
        pdfDelegate.$getByHandle('my-pdf-container').load(newURL);

    }

    this.togglePotential = function(author){        
        author.potentialEnabled = !author.potentialEnabled;
    }



    this.addAuthorToMetaData = function(){
        appData.data.currentMetaData.authors.push({
            firstName: "?",
            lastName: "?",
            potentialEnabled : false,
            allowSet : false,
            potential : [],
            searchFirst : "",
            searchLast : ""});
    }

    this.removeAuthorFromMetaData = function(idx){
        if (idx > -1){
            appData.data.currentMetaData.authors.splice(idx, 1);
            toast("author removed", 4000);
        } 
    }


    this.getMetaData = function(publicationID) {

        publicationID = stripHashtag(publicationID);

        
        getMeta_status = GETMETA_STATUS.GETTING;
        var url = serverApi.concat('/publications/').concat(publicationID);

        var authorization = {headers: 
           {'Content-type' : 'application/json',
           'Authorization': appData.Authorization}};

           var getMetaDataRequest = $http.get(url, authorization);

           getMetaDataRequest.success(function(data, status, headers, config) {
            getMeta_status = GETMETA_STATUS.SUCCES_GETTING;
            data.id = publicationID;
            //this can be simplified when we are finished
            data.download = (typeof data.download !== 'undefined') ? data.download : "http://fzs.sve-mo.ba/sites/default/files/dokumenti-vijesti/sample.pdf";

            data.authors = (typeof data.authors !== 'undefined') ? data.authors : [{firstName: "?", lastName: "?"}];

            function modifyMetaAuthors(){
                data.authors.forEach(function(entry) {
                    entry.potentialEnabled = false;
                    entry.allowSet = false;
                    entry.potential = [];
                    entry.searchFirst = "";
                    entry.searchLast = "";
                });
            }

            data.researchDomains = (typeof data.researchDomains !== 'undefined') ? data.researchDomains : [];
            data.keywords = (typeof data.keywords !== 'undefined') ? data.keywords : [];

            modifyMetaAuthors(data);
            changePDFURL(data.download);

            appData.data.currentMetaData = data;



            console.log(data);
        });
getMetaDataRequest.error(function(data, status, headers, config) {
    getMeta_status = GETMETA_STATUS.INITIAL;
});
}
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    //Used to modify the meta data of a certain publication
    //@Pieter wordt gebruikt in de edit mode + werkt (geen errors ) maar ik zie geen verandering aan de meta data als ik nog is get oproep op dezelfde publicatie... 
    var MODIFYMETA_STATUS = {
        UNACTIVE: -1,
        INITIAL: 0,
        MODIFYING: 1,
        SUCCES_MODIFYING: 2}
        var modifyMeta_status = MODIFYMETA_STATUS.UNACTIVE;

        this.modifyMeta_activate = function() {modifyMeta_status = MODIFYMETA_STATUS.INITIAL;}
        this.modifyMeta_deActivate = function() {modifyMeta_status = MODIFYMETA_STATUS.UNACTIVE;}
        this.modifyMeta_active = function() {return modifyMeta_status != MODIFYMETA_STATUS.UNACTIVE;}
        this.modifyMeta_initialStatus = function() {return modifyMeta_status == MODIFYMETA_STATUS.INITIAL;}
        this.modifyMeta_modifying = function(){return modifyMeta_status == MODIFYMETA_STATUS.MODIFYING;}
        this.modifyMeta_succes = function(){return modifyMeta_status == MODIFYMETA_STATUS.SUCCES_MODIFYING;}

        this.modifyMeta = function(publicationID, meta) {
            publicationID = stripHashtag(publicationID);

            modifyMeta_status = MODIFYMETA_STATUS.MODIFYING;
            var url = serverApi.concat('/publications/').concat(publicationID);
            var authorization = {headers: 
               {'Content-type' : 'application/json',
               'Authorization': appData.Authorization}};
               var setMetaDataRequest = $http.post(url, meta, authorization);

               setMetaDataRequest.success(function(data, status, headers, config) {
                modifyMeta_status = MODIFYMETA_STATUS.SUCCES_MODIFYING;
                toast("The meta data of the publication has been changed.",4000);
            });
               setMetaDataRequest.error(function(data, status, headers, config) {
                modifyMeta_status = MODIFYMETA_STATUS.INITIAL;
                toast("Failed to change the informations about the publication, try again later.", 4000);
            });
           }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//


function scrape(publicationID, handler) {
    publicationID = stripHashtag(publicationID);

    var url = serverApi.concat('/publications/').concat(publicationID).concat('?extract=true');
    var scrapingRequest = $http.get(url, config);

    scrapingRequest.success(function(data, status, headers, config) {
        appData.data.currentMetaData = data;
        console.log(appData.data.currentMetaData);
        if (handler){
            handler(true);
        }
    });

    scrapingRequest.error(function(data, status, headers, config) {
        toast("Failed to find information about the given publication.");
        if (handler){
            handler(false);
        }
    });
}
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    //Used to search a certain publication in the db or external source
    var SEARCH_STATUS = {
        UNACTIVE: -1,
        INITIAL: 0,
        SEARCHING: 1,
        SUCCES_SEARCHING: 2}
        var search_status = SEARCH_STATUS.UNACTIVE;

        this.search_activate = function() {ui_search_status = ui_SEARCH_STATUS.INITIAL;}
        this.search_deActivate = function() {search_status = SEARCH_STATUS.UNACTIVE;}
        this.search_active = function() {return search_status != SEARCH_STATUS.UNACTIVE;}
        this.search_initialStatus = function() {return search_status == SEARCH_STATUS.INITIAL;}
        this.search_searching = function(){return search_status == SEARCH_STATUS.SEARCHING;}
        this.search_succes = function(){return search_status == SEARCH_STATUS.SUCCES_SEARCHING;}
        function searching(){ search_status = SEARCH_STATUS.SEARCHING;};
        function succes(){ searc_status = SEARCH_STATUS.SUCCES_SEARCHING;};


        function replaceSpace(toReplace){
            return toReplace.replace(/ /g, "+");
        }

        this.search = function(keyword, external, handler) {
            searching();
            var url;
            var keywordMod = replaceSpace(keyword);
            if (external) {
                url = serverApi.concat('/publications?q=').concat(keywordMod).concat('&external=true');
            } else {
                url = serverApi.concat('/publications?q=').concat(keywordMod);
            }
            var requestSearchPublication = $http.get(url,config);

            requestSearchPublication.success(function(data, status, headers, config) {
                appData.data.searchResult = data.internal;
                
                succes();
                if (handler){
                    handler(true, data);
                }
                if (data.internal.length === 0) {toast("No results found in our database.")};
                if(external){
                    if (data.external.length === 0) {toast("No results found from external sources.")};
                };
            });
            requestSearchPublication.error(function(data, status, headers, config) {
                if (handler){
                    handler(false, null);
                }
                toast("Failed to search publication, try again later.", 4000);
                self.search_activate();
            });
        }

    //TODO TO TEST zien met noah welke searchData moet opgestuurd worden
    this.searchMultiple = function(searchData) {
        searching();
        var url = serverApi.concat('/publications');
        var requestSearchPublication = $http.post(url, searchData, config);

        requestSearchPublication.success(function(data, status, headers, config) {
            data.
            appData.data.searchResult = data;
            console.log(data);
            succes();
            if (data.internal.length === 0) {toast("No results found in our database.")};
        });
        requestSearchPublication.error(function(data, status, headers, config) {
            toast("Failed to search publication, try again later.", 4000);
            self.search_activate();
        });
    }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    /*@Pieter stappen : 
    -User vult titel en journal of proceeding aan en de file INITIAL
    -Gebruik de search en de titel om aan de gebruiker te vragen of publicatie al niet bestaat (met external op false) EXISTS
    -Indien niet bestaat upload de file adhv ui_upload -> gaat scrapen en in WAITING_EDITING belanden
    -Gebruik MODIFYMETA om de meta data door te sturen en gebruik SUCCES_EDITING EN SUCCES_UPLOADING STATUSSEN om juiste elementen te tonen
    -Gebruik ook authors om te zien of autheur al in onze db bestaat
    -done
    */
    var UPLOAD_STATUS = {
        UNACTIVE: -1,
        INITIAL: 0,
        EXISTS:1,
        EDIT:2,
        WAITING: 7
    }
    var upload_status = UPLOAD_STATUS.INITIAL; //change this to unactive
    this.upload_waitingmsg = "";

    this.upload_active = function() {return upload_status != UPLOAD_STATUS.UNACTIVE;}
    this.upload_initialStatus = function() {return upload_status == UPLOAD_STATUS.INITIAL;}
    this.upload_pubExcist = function() {return upload_status == UPLOAD_STATUS.EXISTS;}
    this.upload_uploading = function(){return upload_status == UPLOAD_STATUS.UPLOADING;}
    this.upload_edit = function() {return upload_status == UPLOAD_STATUS.EDIT;}
    this.upload_succesUploading = function() {return upload_status == UPLOAD_STATUS.SUCCES_UPLOADING;}
    this.upload_waiting = function() { return upload_status == UPLOAD_STATUS.WAITING;}

    this.upload_activate = function() {upload_status = UPLOAD_STATUS.INITIAL;}
    this.upload_deActivate = function() {upload_status = UPLOAD_STATUS.UNACTIVE;}
    
    this.upload_content_excists = false;

    this.upload_reset = function(){
        self.upload_deActivate();
        appData.uploadData = { file: null, title: "", type: "", currentPublicationID: null };
        self.upload_waitingmsg = "";
        this.upload_content_excists = false;
    }

    function enableWaiting(msg){
        self.upload_waitingmsg = msg;
        upload_status = UPLOAD_STATUS.WAITING;
    }

    this.upload_searchExcisting = function(){
        enableWaiting("Searching for excisting publications");

        function handler(succes, data){

            if (succes) {
                self.upload_content_excists = (data.internal.length !== 0);
                upload_status = UPLOAD_STATUS.EXISTS;
            } else {
                self.upload_reset();
                toast("error encouter while uploading, try again later", 4000)
            }
        }
        self.search(appData.uploadData.title, false, handler);
        console.log(appData.uploadData);
        // make sure you can select
    }

    function uploadPublication(file, url, handler) {

        var fd = new FormData();
        fd.append('inputFile', file); //link the file to the name 'inputFile'
        $http.put(url, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'Authorization': appData.Authorization
            }
        })
        .success(function(data, status, headers, config) {
            appData.uploadData.currentPublicationID = stripHashtag(data.id);

            if(handler){
                handler(true);
            }
            
        })
        .error(function() {
            if (handler){
                handler(false);
            }
        });
    }

    this.upload_excisting = function(publicationID){
        this.addPublications('Portfolio', publicationID);
        toast("excisting publication added to 'Portfolio'");
        self.upload_reset();
    }

    //preparation for the uploadPublication function
    this.uploadFile = function() {
        function handler(succes){
            if (succes) {

                function scrapeHandler(succes){
                    if (succes) {
                        upload_status = UPLOAD_STATUS.EDIT;
                    } else {
                        //try to fill in metadata from post
                        upload_status = UPLOAD_STATUS.EDIT;
                    }
                }

                // when publication is added to database 
                // metadata of publication needs to be send/updated (currently empty)
                enableWaiting("Scraping for metadata");
                scrape(appData.uploadData.currentPublicationID, scrapeHandler);

            } else {
                self.upload_reset();
                toast("Failed to upload file, try again later", 4000)
            }
        }

        //add handler
        enableWaiting("Uploading file");
        var url = serverApi.concat('/publications?title=').concat(appData.uploadData.title).concat('&type=').concat(appData.uploadData.type);
        uploadPublication(appData.uploadData.file, url, handler);
    };
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    /*AuthorInfo ::= {  firstname: …, lastname: …, publications: <publicationArray>, profile: … }
    profile duidt hierbij op het feit of de auteur ook een gebruiker is op SKRIBL, indien dit zo is zal hier de gebruikersnaam terug te vinden zijn (en is GET /users/<username> dus mogelijk…), anders wordt dit veld niet meegegeven (maw ‘undefined’)*/
    //Used to search an author in the db

    var AUTHORS_STATUS = {
        INITIAL: 0,
        SEARCHING: 1,
        SUCCES_SEARCHING: 2}
        var authors_status = AUTHORS_STATUS.INITIAL;

        this.authors_initialStatus = function() {return authors_status == AUTHORS_STATUS.INITIAL;};
        this.authors_getting = function(){return authors_status == AUTHORS_STATUS.SCRAPING;};
        this.authors_succes = function(){ return authors_status == AUTHORS_STATUS.SUCCES_GETTING;};
        this.authors_reset = function(){authors_status = AUTHORS_STATUS.INITIAL; appData.data.searchAuthorsResult = null;};

        this.searchAuthors =function(author){

            function handler(data){
                console.log(data);

                if (data.length == 0){
                    toast("no authors were found", 4000);
                    // author.potential = [{firstName:"pot-first1", lastName:"pot-lat1"},
                    // {firstName:"pot-first2", lastName:"pot-lat2"},
                    // {firstName:"pot-first3", lastName:"pot-lat3"}];
                    
                } else {
                    toast("we found some authors", 4000);
                    author.potential = data;
                }

                var idx = 0;
                author.potential.forEach(function(entry) {
                    entry.id = idx++;
                });

                console.log(author);

                author.allowSet = true;
            }

            self.getAuthors(author.searchFirst, author.searchLast, 10, handler);
        }

        this.setAuthor = function(author){
            author.firstName = author.searchFirst;
            author.lastName = author.searchLast;
        }

        this.setPotentialAsSearch = function(author, potential){
            author.searchFirst = potential.firstName;
            author.searchLast = potential.lastName;
        }

        this.getAuthors = function(firstName, lastName, number, handler){
            authors_status = AUTHORS_STATUS.SEARCHING;
            var url = serverApi.concat('/authors?firstname=').concat(firstName).concat('&lastname=').concat(lastName).concat('&limit=').concat(number);
            var getAuthorsRequest = $http.get(url, config);

            getAuthorsRequest.success(function(data, status, headers, config) {
                handler(data);
                authors_status = AUTHORS_STATUS.SUCCES_SEARCHING;
                appData.searchAuthorsResult = data;
            })
            getAuthorsRequest.error(function(data, status, headers, config) {
                authors_status = AUTHORS_STATUS.INITIAL

            })
        }
//----------------------------------------------------------------------------------------------------------------------//
});
