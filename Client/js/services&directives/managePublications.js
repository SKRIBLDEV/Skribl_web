webapp.service('managePublications', function($location, appData, $http) {

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
    this.getUserLibraries = function() {
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library');
        var authorization = {headers: 
                             {'Content-type' : 'application/json',
                              'Authorization': appData.Authorization}};
        var getUserLibrariesRequest = $http.get(url, authorization);
        
        getUserLibrariesRequest.success(function(data, status, headers, config) {
            appData.data.userLibrariesNames = data;
            upToDate();
            console.log(data);
        });
        getUserLibrariesRequest.error(function(data, status, headers, config) {
            self.getUserLibraries();
            toast("Failed to get your libraries, try again later.", 4000);
        });
    };

    //get alle the publications of a certain user in a certain library
    this.getUserPublications = function(libraryName) {
        
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName);
        var authorization = {headers: 
                             {'Content-type' : 'application/json',
                              'Authorization': appData.Authorization}};
        var getUserPublicationsRequest = $http.get(url, authorization);
        
        getUserPublicationsRequest.success(function(data, status, headers, config) {
            appData.data.publications = data;
            appData.data.currentLibraryName = libraryName;
            upToDate();
            console.log(data);
        });
        getUserPublicationsRequest.error(function(data, status, headers, config) {
            self.getUserPublications(libraryName);
            toast("Failed to get your publications, try again later.", 4000);
        });
    };

    //add a publication to a certan library of a user
    this.addPublications = function(libraryName, publicationID) {
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
            toast("Publication added to library.", 4000);
        });
        addPublicationsRequest.error(function(data, status, headers, config) {
            upToDate();
            if(status == 500)
            {toast("Publication is already in the library.", 4000);}
            else {toast("Failed to add library, try again later.", 4000)};
        });
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
            toast("Publication removed from library.", 4000);
        });
        deletePublicationsRequest.error(function(data, status, headers, config) {
            upToDate();
            toast("Failed to remove publication, try again later.", 4000);
        });
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
    this.disablePublicationViewer = function(){ self.showPublicationViewer = false;};
    this.publicationViewerEnabled = function(){ return self.showPublicationViewer;};

    this.loadPublicationInViewer = function(publicationID){
        self.getMetaData(publicationID);
        self.showPublicationViewer = true;}

    this.getMeta_initialStatus = function() {return ui_getMeta_status == ui_GETMETA_STATUS.INITIAL;};
    this.getMeta_getting = function(){return ui_getMeta_status == ui_GETMETA_STATUS.GETTING;};
    this.getMeta_succes = function(){ return ui_getMeta_status == ui_GETMETA_STATUS.SUCCES_GETTING;};
    this.getMeta_reset = function(){ui_getMeta_status = ui_GETMETA_STATUS.INITIAL; appData.data.currentMetaData = null;};

    this.getMetaData = function(publicationID) {
        
        getMeta_status = GETMETA_STATUS.GETTING;
        var url = serverApi.concat('/publications/').concat(publicationID);
        var getMetaDataRequest = $http.get(url, config);

        getMetaDataRequest.success(function(data, status, headers, config) {
            getMeta_status = GETMETA_STATUS.SUCCES_GETTING;
            appData.data.currentMetaData = data;
            console.log(appData.data.currentMetaData);
        });
        getMetaDataRequest.error(function(data, status, headers, config) {
            getMeta_status = GETMETA_STATUS.INITIAL;
        });
    }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    //Used to modify the meta data of a certain publication
    //@Pieter wordt gebruikt in de edit mode. 
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
    //Used to scrape data while uploading a publication
    //Needs to manually reset when the metaData has been used.
    var SCRAPING_STATUS = {
        INITIAL: 0,
        SCRAPING :1,
        SUCCES_SCRAPING: 2}
    var scraping_status = SCRAPING_STATUS.INITIAL;

    this.scraping_initialStatus = function() {return scraping_status == SCRAPING_STATUS.INITIAL;};
    this.scraping_getting = function(){return scraping_status == SCRAPING_STATUS.SCRAPING;};
    this.scraping_succes = function(){ return scraping_status == SCRAPING_STATUS.SUCCES_GETTING;};
    this.scraping_reset = function(){scraping_status = SCRAPING_STATUS.INITIAL; appData.data.currentMetaData = null;};

    this.scrape = function(publicationID) {
        
        scraping_status = SCRAPING_STATUS.SCRAPING;
        var url = serverApi.concat('/publications/').concat(publicationID).concat('?extract=true');
        var scrapingRequest = $http.get(url, config);

        scrapingRequest.success(function(data, status, headers, config) {
            appData.data.currentMetaData = data;
            scraping_status = SCRAPING_STATUS.SUCCES_SCRAPING;
            upload_status = UPLOAD_STATUS.WAITING_EDITING; //@Pieter kan de edit mode 'aan' zetten
            console.log(appData.data.currentMetaData);
        });
        
        scrapingRequest.error(function(data, status, headers, config) {
            scraping_status = SCRAPING_STATUS.INITIAL;
            toast("Failed to find information about the given publication.");
            upload_status = UPLOAD_STATUS.INITIAL;
        });
    }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
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
    
    this.search = function(keyword, external) {
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
           appData.data.searchResult = data;
           console.log(data); 
           succes();
           if (data.internal.length === 0) {toast("No results found for your search")};
        });
        requestSearchPublication.error(function(data, status, headers, config) {
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
            appData.data.searchResult = data;
            console.log(data);
            succes();
            if (data.internal.length === 0) {toast("No results found for your search")};
        });
        requestSearchPublication.error(function(data, status, headers, config) {
            toast("Failed to search publication, try again later.", 4000);
            self.search_activate();
        });
    }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    //@Pieter je moet eerste checken dat scraping niet gebruikt word voor upload mag beginnen anders conflicten met de statussen !!
    // ?? -> ik denk dat je dat zelf moet resolven door een melding te geven via "toast"
    
    /*@Pieter stappen : 
    -User vult titel en journal of proceeding aan en de file INITIAL
    -Gebruik de search en de titel om aan de gebruiker te vragen of publicatie al niet bestaat (met external op false) EXISTS
    -Indien niet bestaat upload de file adhv ui_upload -> gaat scrapen en in WAITING_EDITING belanden
    -Gebruik MODIFYMETA om de meta data door te sturen en gebruik SUCCES_EDITING EN SUCCES_UPLOADING STATUSSEN om juiste elementen te tonen
    -done
    */
    var UPLOAD_STATUS = {
        UNACTIVE: -1,
        INITIAL: 0,
        EXISTS:1,
        UPLOADING: 2,
        WAITING_SCRAPING: 3,
        WAITING_EDITING: 4,
        SUCCES_EDITING: 5,
        SUCCES_UPLOADING: 6}
    var upload_status = UPLOAD_STATUS.INITIAL; //change this to unactive

    this.ui_upload_active = function() {return upload_status != UPLOAD_STATUS.UNACTIVE;}
    this.ui_upload_initialStatus = function() {return upload_status == UPLOAD_STATUS.INITIAL;}
    this.ui_upload_checkForExisting = function() {return upload_status == UPLOAD_STATUS.EXISTS;}
    this.ui_upload_uploading = function(){return upload_status == UPLOAD_STATUS.UPLOADING;}
    this.ui_upload_waitingScraping = function() {return upload_status == UPLOAD_STATUS.WAITING_SCRAPING;}
    this.ui_upload_succesScraping = function() {return upload_status == UPLOAD_STATUS.SUCCES_SCRAPING;}
    this.ui_upload_waitingEditing = function() {return upload_status == UPLOAD_STATUS.WAITING_EDITING;}
    this.ui_upload_succesEditing = function() {return upload_status == UPLOAD_STATUS.SUCCES_EDITING;}
    this.ui_upload_succesUploading = function() {return upload_status == UPLOAD_STATUS.SUCCES_UPLOADING;}
    this.ui_upload_activate = function() {upload_status = UPLOAD_STATUS.INITIAL;}
    this.ui_upload_deActivate = function() {upload_status = UPLOAD_STATUS.UNACTIVE;}
    
    this.ui_upload_set_exists = function() {return upload_status == UPLOAD_STATUS.EXISTS;}
    this.ui_upload_set_succes_editing = function() {return upload_status == UPLOAD_STATUS.SUCCES_EDITING;}
    this.ui_upload_set_succes_uploading = function() {return upload_status == UPLOAD_STATUS.SUCCES_UPLOADING;} 

    this.ui_upload_searchExcisting = function(){
        search(appData.uploadData.title, false);
        upload_status = UPLOAD_STATUS.EXISTS;
        // make sure you can select
    }

   function uploadPublication(file, url, authorization) {

        var fd = new FormData();
        fd.append('inputFile', file); //link the file to the name 'inputFile'
        $http.put(url, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'Authorization': authorization
            }
        })
            .success(function(data, status, headers, config) {
            appData.uploadData.currentPublicationID = data.id.substring(1);
            //when publication is added to database 
            //metadata of publication needs to be send/updated (currently empty)
            
            upload_status = UPLOAD_STATUS.WAITING_SCRAPING;
            console.log(currentPublicationID);
            scrape(appData.uploadData.currentPublicationID);
        })
            .error(function() {
            upload_status = UPLOAD_STATUS.INITIAL;
            toast("Failed to upload file, try again later", 4000)
        });
    }

    //preparation for the uploadPublication function
    this.uploadFile = function() {

        upload_status = UPLOAD_STATUS.UPLOADING;
        var url = serverApi.concat('/publications?title=').concat(appData.uploadData.title).concat('&type=').concat(appData.uploadData.type);
        var authorization = appData.Authorization.headers.Authorization;
        uploadPublication(appData.uploadData.file, url, authorization);
    };
//----------------------------------------------------------------------------------------------------------------------//
    
//----------------------------------------------------------------------------------------------------------------------//
    /*AuthorInfo ::= {  firstname: …, lastname: …, publications: <publicationArray>, profile: … }
profile duidt hierbij op het feit of de auteur ook een gebruiker is op SKRIBL, indien dit zo is zal hier de gebruikersnaam terug te vinden zijn (en is GET /users/<username> dus mogelijk…), anders wordt dit veld niet meegegeven (maw ‘undefined’)*/

    var ui_AUTHORS_STATUS = {
        INITIAL: 0,
        SEARCHING: 1,
        SUCCES_SEARCHING: 2}
    var ui_authors_status = ui_AUTHORS_STATUS.INITIAL;

    this.getAuthors = function(firstName, lastName, number){
        ui_authors_status = ui_AUTHORS_STATUS.SEARCHING;
        var url = serverApi.concat('/authors?firstname=').concat(firstName).concat('&lastName=').concat(lastName).concat('&limit=').concat(number);
        var getAuthorsRequest = $http.get(url, config);

        getAuthorsRequest.success(function(data, status, headers, config) {
            ui_authors_status = ui_AUTHORS_STATUS.SUCCES_SEARCHING;
            appData.searchAuthorsResult = data;
        })
        getAuthorsRequest.error(function(data, status, headers, config) {
            ui_authors_status = ui_AUTHORS_STATUS.INITIAL

        })
    }



//----------------------------------------------------------------------------------------------------------------------//
});
