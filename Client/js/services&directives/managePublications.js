webapp.service('managePublications', function($location, appData, $http, $rootScope) {

    var self = this;
//----------------------------------------------------------------------------------------------------------------------//
    //CODE USED IN THE PUBLICATIONS CARD
    
    //ui_publication_status --> current publication data corrupt or not
    //ui_PUBLICATIONS_STATUS reference of all possible status
    var ui_PUBLICATIONS_STATUS = {
        CORRUPT: 0,
        UPTODATE: 1};
    var ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
    
    this.ui_publications_corrupt = function(){return ui_publication_status == ui_PUBLICATIONS_STATUS.CORRUPT;};
    this.showLibraryCard = true;
    this.toggleLibraryCard = function(){self.showLibraryCard = ! self.showLibraryCard;}
    function corrupt(){ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;};
    function upToDate(){ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;};

    this.getUserLibraries = function() { 
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library');
        var authorization = appData.Authorization;
        var getUserLibrariesRequest = $http.get(url, authorization);
        
        getUserLibrariesRequest.success(function(data, status, headers, config) {
            appData.data.userLibrariesNames = data;
            upToDate();
        });
        getUserLibrariesRequest.error(function(data, status, headers, config) {
            getUserLibraries();
            toast("Failed to get your libraries, try again later.", 4000);
        });
    };

    //get alle the publications of a certain user in a certain library
    function getUserPublications(libraryName) {
        corrupt();
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName);
        var authorization = appData.Authorization;
        var getUserPublicationsRequest = $http.get(url, authorization);
        
        getUserPublicationsRequest.success(function(data, status, headers, config) {
            appData.data.publications = data;
            appData.data.currentLibraryName = libraryName;
            upToDate();
        });
        getUserPublicationsRequest.error(function(data, status, headers, config) {
            getUserPublications(libraryName);
            toast("Failed to get your publications, try again later.", 4000);
        });
    };

    //add a certain publication to a certain library of a user
    function addPublications(libraryName, publicationID) {
        corrupt();
        var url =  serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var addPublicationsRequest = $http.put(url, config);
        
        addPublicationsRequest.success(function(data, status, headers, config) {
            if(libraryName.equals(libName))
            {getUserPublications(libName);}
            else{upToDate();};
            toast("Publication added to library.", 4000);
        });
        getUserPublicationsRequest.error(function(data, status, headers, config) {
            upToDate();
            toast("Failed to add library, try again later.", 4000);
        });
    }

    //delete a certain publication of a certain library of a user
    function deletePublication(libraryName, publicationID) {
        corrupt();
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var deletePublicationsRequest = $http.put(url, config);
        
        deletePublicationsRequest.success(function(data, status, headers, config) {
            if(libraryName.equals(libName))
            {getUserPublications(libName);}
            else{upToDate();};
            toast("Publication removed from library.", 4000);
        });
        deletePublicationsRequest.error(function(data, status, headers, config) {
           upToDate();
            toast("Failed to remove publication, try again later.", 4000);
        });
    }

    //Create a new library for a user 
    function createLib(libName) {
        corrupt();
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libName);
        var createRequest = $http.put(url, config);
        
        createRequest.success(function(data, status, headers, config) {
            getUserLibraries();
            var messageToToast = "Library ".concat(libName).concat(" created.");
            toast(messageToToast, 4000);
        });
        createRequest.error(function(data, status, headers, config) {
            ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;
            toast("Failed to create library, try again later.", 4000);
        });
    }

    //Delete a library of a user
    function deleteLib(libName) {
        corrupt();
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libName);
        var createRequest = $http.delete(url, config);
        
        createRequest.success(function(data, status, headers, config) {
            getUserLibraries();
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
    //@Pieter is geen apparte card --> geen unactive, wel initial om te kunnen zien wanneer downloading bezig is
    //@Pieter zou ook kunnen met maar 2 statussen
    var ui_DOWNLOADFILE_STATUS = {
        INITIAL: 0,
        DOWNLOADING :1,
        SUCCES_DOWNLOADING: 2}
    var ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.INITIAL;

    this.ui_downloadFile = function(publicationID){getFile(publicationID);};
    this.ui_downloadFile_getFile = function(){return currentFile;};
    this.ui_downloadFile_deleteFile = function(){deleteCurrentFile();};
    this.ui_downloadFile_downloading = function(){return ui_downloadFile_status == ui_DOWNLOADFILE_STATUS.DOWNLOADING;};
    this.ui_downloadFile_succes = function(){ return ui_downloadFile_status == ui_DOWNLOADFILE_STATUS.SUCCES_DOWNLOADING;};
    this.ui_downloadFile_reset = function(){ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.INITIAL;};

    function getFile(publicationID) {
        ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.DOWNLOADING;
        var url = serverApi.concat('/publications/').concat(publicationID).concat('?download=true');
        var getFileRequest = $http.get(url, config);

        getFileRequest.success(function(data, status, headers, config) {
            ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.SUCCES_DOWNLOADING;
            appData.data.currentFile = data;
        });
        getFileRequest.error(function(data, status, headers, config) {
            ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.INITIAL;
            toast("Failed to download file, please try again later.", 4000);
        });
    }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    //@Pieter get metadata word alleen maar gebruikt door andere functies namelijk search en de viewer ofzo --> geen unactive.
    //@Pieter zou ook kunnen met maar 2 statussen
    var ui_GETMETA_STATUS = {
        INITIAL: 0,
        GETTING :1,
        SUCCES_GETTING: 2}
    var ui_getMeta_status = ui_GETMETA_STATUS.INITIAL;

    this.ui_getMeta_metaData = function(){return metaData;};
    this.ui_getMeta = function(publicationID){getMetaData(publicationID);};
    this.ui_getMeta_initialStatus = function() {return ui_getMeta_status == ui_GETMETA_STATUS.INITIAL;};
    this.ui_getMeta_getting = function(){return ui_getMeta_status == ui_GETMETA_STATUS.GETTING;};
    this.ui_getMeta_succes = function(){ return ui_getMeta_status == ui_GETMETA_STATUS.SUCCES_GETTING;};
    this.ui_getMeta_reset = function(){ui_getMeta_status = ui_GETMETA_STATUS.INITIAL;};

    //@Pieter geeft geen toast terug want word gebruikt door andere functies
    function getMetaData(publicationID) {
        ui_getMeta_status = ui_GETMETA_STATUS.GETTING;
        var url = serverApi.concat('/publications/').concat(publicationID);
        var getMetaDataRequest = $http.get(url, config);

        getMetaDataRequest.success(function(data, status, headers, config) {
            ui_getMeta_status = ui_GETMETA_STATUS.SUCCES_GETTING;
            appData.data.currentMetaData = data;
        });
        getMetaDataRequest.error(function(data, status, headers, config) {
            ui_getMeta_status = ui_GETMETA_STATUS.INITIAL;
        });
    }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
        var ui_MODIFYMETA_STATUS = {
            UNACTIVE: -1,
            INITIAL: 0,
            MODIFYING: 1,
            SUCCES_MODIFYING: 2}
        var ui_modifyMeta_status = ui_MODIFYMETA_STATUS.UNACTIVE;

    this.ui_modifyMeta_activate = function() {ui_modifyMeta_status = ui_MODIFYMETA_STATUS.INITIAL;}
    this.ui_modifyMeta_deActivate = function() {ui_modifyMeta_status = ui_MODIFYMETA_STATUS.UNACTIVE;}
    this.ui_modifyMeta_active = function() {return ui_modifyMeta_status != ui_MODIFYMETA_STATUS.UNACTIVE;}
    this.ui_modifyMeta_initialStatus = function() {return ui_modifyMeta_status == ui_MODIFYMETA_STATUS.INITIAL;}
    this.ui_modifyMeta_modifying = function(){return ui_modifyMeta_status == ui_MODIFYMETA_STATUS.MODIFYING;}
    this.ui_modifyMeta_succes = function(){return ui_modifyMeta_status == ui_MODIFYMETA_STATUS.SUCCES_MODIFYING;}
    this.ui_modifyMeta = function(publicationID, meta){modifyMeta(publicationID, meta);}

    function modifyMeta(publicationID, meta) {
        
        ui_modifyMeta_status = ui_MODIFYMETA_STATUS.MODIFYING;
        var url = serverApi.concat('/publications/').concat(publicationID);
        var authorization = appDataK.Authorization;
        var setMetaDataRequest = $http.post(url, authorization);

        setMetaDataRequest.success(function(data, status, headers, config) {
            ui_modifyMeta_status = ui_MODIFYMETA_STATUS.SUCCES_MODIFYING;
            toast("The meta data of the publication has been changed.",4000);
        });
        setMetaDataRequest.error(function(data, status, headers, config) {
            ui_modifyMeta_status = ui_MODIFYMETA_STATUS.INITIAL;
            toast("Failed to get information about publication, try again later.", 4000);
        });
    }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    //@Pieter scraping word alleen maar gebruikt door andere functies namelijk search en de viewer ofzo --> geen unactive.
    //@Pieter zou ook kunnen met maar 2 statussen
    var ui_SCRAPING_STATUS = {
        INITIAL: 0,
        SCRAPING :1,
        SUCCES_SCRAPING: 2}
    var ui_scraping_status = ui_SCRAPING_STATUS.INITIAL;

    this.ui_scrape_scrapeData = function(){return scrapeData;};
    this.ui_scrape = function(publicationID){scrape(publicationID);};
    this.ui_scraping_initialStatus = function() {return ui_scraping_status == ui_SCRAPING_STATUS.INITIAL;};
    this.ui_scraping_getting = function(){return ui_scraping_status == ui_SCRAPING_STATUS.SCRAPING;};
    this.ui_scraping_succes = function(){ return ui_scraping_status == ui_SCRAPING_STATUS.SUCCES_GETTING;};
    this.ui_scraping_reset = function(){ui_scraping_status = ui_SCRAPING_STATUS.INITIAL;};

    //@Pieter geeft geen toast terug want word gebruikt door andere functies
    function scrape(publicationID) {
        ui_scraping_status = ui_SCRAPING_STATUS.SCRAPING;
        var url = serverApi.concat('/publications/').concat(publicationID).concat('?extract=true');
        var scrapingRequest = $http.get(url, config);

        scrapingRequest.success(function(data, status, headers, config) {
            appData.data.currentMetaData = data;
            ui_scraping_status = ui_SCRAPING_STATUS.SUCCES_SCRAPING;
            ui_scraping_status = ui_SCRAPING_STATUS.INITIAL;
            ui_upload_status = ui_UPLOAD_STATUS.WAITING_EDITING; //@Pieter dit status doet de edit mode open MODIFYMETA kan u hier bij helpen
        });
        
        scrapingRequest.error(function(data, status, headers, config) {
            ui_scraping_status = ui_SCRAPING_STATUS.INITIAL;
            toast("Failed to find information about the given publication.");
            ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
        });
    }
//----------------------------------------------------------------------------------------------------------------------//

//----------------------------------------------------------------------------------------------------------------------//
    var ui_SEARCH_STATUS = {
        UNACTIVE: -1,
        INITIAL: 0,
        SEARCHING: 1,
        SUCCES_SEARCHING: 2}
    var ui_search_status = ui_SEARCH_STATUS.UNACTIVE;

    this.ui_search_activate = function() {ui_search_status = ui_SEARCH_STATUS.INITIAL;}
    this.ui_search_deActivate = function() {ui_search_status = ui_SEARCH_STATUS.UNACTIVE;}
    this.ui_search_active = function() {return ui_search_status != ui_SEARCH_STATUS.UNACTIVE;}
    this.ui_search_initialStatus = function() {return ui_search_status == ui_SEARCH_STATUS.INITIAL;}
    this.ui_search_searching = function(){return ui_search_status == ui_SEARCH_STATUS.SEARCHING;}
    this.ui_search_succes = function(){return ui_search_status == ui_SEARCH_STATUS.SUCCES_SEARCHING;}
    this.ui_search = function(keyword, external){search(keyword, external);}
    this.ui_searchMultiple = function(data){searchMultiple(data);};
    this.ui_searchResult = function(){return searchResult;};
    
    var searchResult;
    function replaceSpace(toReplace){
        return toReplace.replace(/ /g, "+");
    }
    
    function search(keyword, external) {
        ui_search_status = ui_SEARCH_STATUS.SEARCHING;
        var url;
        var keywordMod = replaceSpace(keyword);
        if (external) {
            url = serverApi.concat('/publications?q=').concat(keywordMod).concat('&external=true');
        } else {
            url = serverApi.concat('/publications?q=').concat(keywordMod);
        }

        var requestSearchPublication = $http.get(url);

        requestSearchPublication.success(function(data, status, headers, config) {
           appData.data.searchResult = data;
           ui_search_status = ui_SEARCH_STATUS.SUCCES_SEARCHING;
           toast("No results found for your search");
        });
        requestSearchPublication.error(function(data, status, headers, config) {
            toast("Failed to search publication, try again later.", 4000);
            ui_search_status = ui_SEARCH_STATUS.INITIAL;
        });
    }

    function searchMultiple(searchData) {
        ui_search_status = ui_SEARCH_STATUS.SEARCHING;
        var url = serverApi.concat('/publications');
        var requestSearchPublication = $http.post(url, searchData);

        requestSearchPublication.success(function(data, status, headers, config) {
            appData.data.searchResult = data;
            ui_search_status = ui_SEARCH_STATUS.SUCCES_SEARCHING;
        });
        requestSearchPublication.error(function(data, status, headers, config) {
            toast("Failed to search publication, try again later.", 4000);
            ui_search_status = ui_SEARCH_STATUS.INITIAL;
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
    var ui_UPLOAD_STATUS = {
        UNACTIVE: -1,
        INITIAL: 0,
        EXISTS:1,
        UPLOADING: 2,
        WAITING_SCRAPING: 3,
        WAITING_EDITING: 4,
        SUCCES_EDITING: 5,
        SUCCES_UPLOADING: 6}
    var ui_upload_status = ui_UPLOAD_STATUS.INITIAL; //change this to unactive

    this.ui_upload_active = function() {return ui_upload_status != ui_UPLOAD_STATUS.UNACTIVE;}
    this.ui_upload_initialStatus = function() {return ui_upload_status == ui_UPLOAD_STATUS.INITIAL;}
    this.ui_upload_checkForExisting = function() {return ui_upload_status == ui_UPLOAD_STATUS.EXISTS;}
    this.ui_upload_uploading = function(){return ui_upload_status == ui_UPLOAD_STATUS.UPLOADING;}
    this.ui_upload_waitingScraping = function() {return ui_upload_status == ui_UPLOAD_STATUS.WAITING_SCRAPING;}
    this.ui_upload_succesScraping = function() {return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_SCRAPING;}
    this.ui_upload_waitingEditing = function() {return ui_upload_status == ui_UPLOAD_STATUS.WAITING_EDITING;}
    this.ui_upload_succesEditing = function() {return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_EDITING;}
    this.ui_upload_succesUploading = function() {return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_UPLOADING;}
    this.ui_upload_activate = function() {ui_upload_status = ui_UPLOAD_STATUS.INITIAL;}
    this.ui_upload_deActivate = function() {ui_upload_status = ui_UPLOAD_STATUS.UNACTIVE;}
    
    this.ui_upload_set_exists = function() {return ui_upload_status == ui_UPLOAD_STATUS.EXISTS;}
    this.ui_upload_set_succes_editing = function() {return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_EDITING;}
    this.ui_upload_set_succes_uploading = function() {return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_UPLOADING;} 

    this.ui_upload_searchExcisting = function(){
        search(appData.uploadData.title, false);
        ui_upload_status = ui_UPLOAD_STATUS.EXISTS;
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
            
            ui_upload_status = ui_UPLOAD_STATUS.WAITING_SCRAPING;
            console.log(currentPublicationID);
            scrape(appData.uploadData.currentPublicationID);
        })
            .error(function() {
            ui_upload_status = ui_UPLOAD_STATUS.INITIAL;
            toast("Failed to upload file, try again later", 4000)
        });
    }

    //preparation for the uploadPublication function
    this.uploadFile = function() {

        ui_upload_status = ui_UPLOAD_STATUS.UPLOADING;
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
