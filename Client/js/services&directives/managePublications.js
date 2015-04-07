webapp.service('managePublications', function($location, appData, $http) {

//----------------------------------------------------------------------------------------------------------------------//
    //@Pieter : dit wordt gebruikt in de publications card. Wanneer de status op corrupt staat moet je in die card efjes een lading screen tonen omdat de library niet juist is. Je moet wel oppassen want de user mag niet nog is op delete clicken wanneer een delete al bezig is ! Dit geld in het algemeen voor elke functie met een status!
    //@Pieter Omdat al deze elementen bij een card behoren en niet iets laten tonen afhankelijk van hun status (behoren allemaal tot dezelfde card die hellemaal corrupt is wanneer een element fout is) --> geen unactive en initial.
    var ui_PUBLICATIONS_STATUS = {
        CORRUPT: 0,
        UPTODATE: 1};
    var ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
    var publications;
    var libName;
    var librariesNames;
    this.ui_publications_corrupt = function(){return ui_publication_status == ui_PUBLICATIONS_STATUS.CORRUPT;};
    this.ui_publications_change_library = function(name){getUserPublications(name);};
    this.ui_publications_addToLibrary = function(name, publicationID){addPublications(libName, publicationId);};
    this.ui_publications_deleteFromLibrary = function(name, publicationID){deletePublication(libName, publicationID)};
    this.ui_publications_currentLibName = function(){return libName;};
    this.ui_publications_currentLib = function(){return publications;};
    this.ui_publications_librariesNames = function(){return librariesNames;};
    this.ui_publications_addLibrary = function(name){createLib(name);};
    this.ui_publications_deleteLibrary = function(name){deleteLib(name);};

    function getUserLibraries() {
        ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library');
        var getUserLibrariesRequest = $http.get(url, config);
        getUserLibrariesRequest.success(function(data, status, headers, config) {
            librariesNames = data;
            ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;
        });
        getUserLibrariesRequest.error(function(data, status, headers, config) {
            getUserLibraries();
            toast("Failed to get your libraries, try again later.", 4000);
        });
    };


    function getUserPublications(libraryName) {
        ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
        var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName);
        var getUserPublicationsRequest = $http.get(url, config);
        getUserPublicationsRequest.success(function(data, status, headers, config) {
            publictions = data;
            libName = libraryName;
            ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;
        });
        getUserPublicationsRequest.error(function(data, status, headers, config) {
            getUserPublications(libraryName);
            toast("Failed to get your publications, try again later.", 4000);
        });
    };

    function addPublications(libraryName, publicationID) {
        ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
        var url =  serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var addPublicationsRequest = $http.put(url, config);
        addPublicationsRequest.success(function(data, status, headers, config) {
            if(libraryName.equals(libName))
            {getUserPublications(libName);}
            else{ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;};
            toast("Publication added to library.", 4000);
        });
        getUserPublicationsRequest.error(function(data, status, headers, config) {
            ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;
            toast("Failed to add library, try again later.", 4000);
        });
    }

    function deletePublication(libraryName, publicationID) {
        ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var deletePublicationsRequest = $http.put(url, config);
        deletePublicationsRequest.success(function(data, status, headers, config) {
            if(libraryName.equals(libName))
            {getUserPublications(libName);}
            else{ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;};
            toast("Publication removed from library.", 4000);
        });
        deletePublicationsRequest.error(function(data, status, headers, config) {
            ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;
            toast("Failed to remove publication, try again later.", 4000);
        });
    }

    function createLib(libName) {
        ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
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

    function deleteLib(libName) {
        ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libName);
        var createRequest = $http.delete(url, config);
        createRequest.success(function(data, status, headers, config) {
            getUserLibraries();
            var messageToToast = "Library ".concat(libName).concat(" deleted.");
            toast(messageToToast, 4000);
        });
        createRequest.error(function(data, status, headers, config) {
            ui_publication_status = ui_PUBLICATIONS_STATUS.UPTODATE;
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

    //function to download a file
    function deleteCurrentFile() {
        currentFile = null;
    }
    var currentFile = null;

    function getFile = function(publicationID) {
        ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.DOWNLOADING;
        var url = serverApi.concat('/publications/').concat(publicationID).concat('?download=true');
        var getFileRequest = $http.get(url, config);

        getFileRequest.success(function(data, status, headers, config) {
            ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.SUCCES_DOWNLOADING;
            currentFile = data;
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
    var metaData;

    this.metaData = function(){return metaData;};
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
            metaData = data;
        });
        getMetaDataRequest.error(function(data, status, headers, config) {
            ui_getMeta_status = ui_GETMETA_STATUS.INITIAL;
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
    var scrapeData;

    this.scrapeData = function(){return scrapeData;};
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
            ui_getMeta_status = ui_GETMETA_STATUS.SUCCES_SCRAPING;
            scrapeData = data;
        });
        scrapingRequest.error(function(data, status, headers, config) {
            ui_getMeta_status = ui_GETMETA_STATUS.INITIAL;
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
            url = serverApi.concat('publications?q=').concat(keywordMod).concat('&external=true');
        } else {
            url = serverApi.concat('publications?q=').concat(keywordMod);
        }

        var requestSearchPublication = $http.get(url);

        requestSearchPublication.success(function(data, status, headers, config) {
           searchResult = data;
           ui_search_status = ui_SEARCH_STATUS.SUCCES_SEARCHING;
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
            searchResult = data;
            ui_search_status = ui_SEARCH_STATUS.SUCCES_SEARCHING;
        });
        requestSearchPublication.error(function(data, status, headers, config) {
            toast("Failed to search publication, try again later.", 4000);
            ui_search_status = ui_SEARCH_STATUS.INITIAL;
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
    this.ui_modifyMeta = function(publicationID){modifyMeta(publicationID, meta);}

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
    //@Pieter eerst scrapen en later manual aanpassen --> SUCCES_MANUAL = algemeen succes !
    var ui_UPLOAD_STATUS = {
        UNACTIVE: -1,
        INITIAL: 0,
        WAITING_SCRAPING: 1,
        WAITING_MANUAL: 2,
        SUCCES_SCRAPING: 4,
        SUCCES_MANUAL: 5
    }
    var ui_upload_status = ui_UPLOAD_STATUS.UNACTIVE;

    this.ui_upload_active = function() {return ui_upload_status != ui_UPLOAD_STATUS.UNACTIVE;}
    this.ui_upload_initialStatus = function() {return ui_upload_status == ui_UPLOAD_STATUS.INITIAL;}
    this.ui_upload_waitingScraping = function() {return ui_upload_status == ui_UPLOAD_STATUS.WAITING_SCRAPING;}
    this.ui_upload_waitingManual = function() {return ui_upload_status == ui_UPLOAD_STATUS.WAITING_MANUAL;}
    this.ui_upload_succesManual = function() {return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_MANUAL;}
    this.ui_upload_succesScraping = function() {return ui_upload_status == ui_UPLOAD_STATUS.SUCCES_SCRAPING;}
    this.ui_upload_activate = function() {ui_upload_status = ui_UPLOAD_STATUS.INITIAL;}
    this.ui_upload_deActivate = function() {ui_upload_status = ui_UPLOAD_STATUS.UNACTIVE;}
//----------------------------------------------------------------------------------------------------------------------//

});