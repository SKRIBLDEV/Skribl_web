/**
* Initialisation of the appdata with the empty object
*/
webapp.service('managePublications', function($location, appData, $http) {
    //@Pieter : dit wordt gebruikt in de publications card. Wanneer de status op corrupt staat moet je in die card efjes een lading screen tonen omdat de library niet juist is. Je moet wel oppassen want de user mag niet nog is op delete clicken wanneer een delete al bezig is !
    var ui_PUBLICATIONS_STATUS = {
        CORRUPT: 0,
        UPTODATE: 1};
    var ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
    var publications;
    var libName;
    this.ui_publications_change_library = function(name){getUserPublications(name);};
    this.ui_publications_addToLibrary = function(name, publicationID){addPublications(libName, publicationId);};
    this.ui_publications_deleteFromLibrary = function(name, publicationID){deletePublication(libName, publicationID)
    this.ui_publications_currentLibName = function(){return libName;};
    this.ui_publications_currentLib = function(){return currentLib;};


function getUserPublications(libraryName) {
    ui_publication_status = ui_PUBLICATIONS_STATUS.CORRUPT;
    var url = serverApi.concat('/user/').concat(appData.currentUser.username).concat('/library/').concat(libraryName);
    var getUserPublicationsRequest = $http.get(url, config);
    getUserPublicationsRequest.success(function(data, status, headers, config) {
        publictions = data;
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
//----------------------------------------------------------------------------------------------------------------------//
  $scope.addPublications = function(libraryName, publicationID) {
        $scope.busy = true;
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var addPublicationsRequest = $http.put(url, config);
        addPublicationsRequest.success(function(data, status, headers, config) {
            toast("Publication added to library.", 4000);
            $scope.busy = false;
        });
        getUserPublicationsRequest.error(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Failed to add library, try again later.", 4000);
        });
    }

    $scope.deletePublications = function(libraryName, publicationID) {
        $scope.busy = true;
        var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName).concat('/').concat(publicationID);
        var deletePublicationsRequest = $http.put(url, config);
        deletePublicationsRequest.success(function(data, status, headers, config) {
            toast("Publication removed from library.", 4000);
            $scope.busy = false;
        });
        deletePublicationsRequest.error(function(data, status, headers, config) {
            $scope.busy = false;
            toast("Failed to remove publication, try again later.", 4000);
        });
    }                                                                          

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
//----------------------------------------------------------------------------------------------------------------------//
        var ui_MODIFYMETA_STATUS = {
            UNACTIVE: -1,
            INITIAL: 0,
            MODIFYING: 1,
            SUCCES_MODIFYING: 2}
        var ui_modifyMeta_status = ui_MODIFY_STATUS.UNACTIVE;

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
        var ui_GETMETA_STATUS = {
            UNACTIVE: -1,
            INITIAL: 0,
            GETTING :1,
            SUCCES_GETTING: 2}
        var ui_getMeta_status = ui_GETMETA_STATUS.UNACTIVE;
        var metaData;

        this.metaData = function(){return metaData;}
        this.ui_getMeta = function(publicationID){getMetaData(publicationID);}
        this.ui_getMeta_activate = function() {ui_getMeta_status = ui_GETMETA_STATUS.INITIAL;}
        this.ui_getMeta_deActivate = function() {ui_getMeta_status = ui_GETMETA_STATUS.UNACTIVE;}
        this.ui_getMeta_active = function() {return ui_getMeta_status != ui_GETMETA_STATUS.UNACTIVE;}
        this.ui_getMeta_initialStatus = function() {return ui_getMeta_status == ui_GETMETA_STATUS.INITIAL;}
        this.ui_getMeta_getting = function(){return ui_getMeta_status == ui_GETMETA_STATUS.GETTING;}
        this.ui_getMeta_succes = function(){ return ui_getMeta_status == ui_GETMETA_STATUS.SUCCES_GETTING;}

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
        var ui_DOWNLOADFILE_STATUS = {
            UNACTIVE: -1,
            INITIAL: 0,
            DOWNLOADING :1,
            SUCCES_DOWNLOADING: 2}
        var ui_downloadFile_status = ui_GETMETA_STATUS.UNACTIVE;

        this.ui_downloadFile = function(publicationID){getFile(publicationID);};
        this.ui_downloadFile_getFile = function(){return currentFile;};
        this.ui_downloadFile_deleteFile = function(){deleteCurrentFile();};
        this.ui_downloadFile_activate = function() {ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.INITIAL;};
        this.ui_downloadFile_deActivate = function() {ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.UNACTIVE;};
        this.ui_downloadFile_active = function() {return ui_downloadFile_status != ui_DOWNLOADFILE_STATUS.UNACTIVE;};
        this.ui_downloadFile_initialStatus = function() {return ui_downloadFile_status == ui_DOWNLOADFILE_STATUS.INITIAL;};
        this.ui_downloadFile_downloading = function(){return ui_downloadFile_status == ui_DOWNLOADFILE_STATUS.DOWNLOADING;};
        this.ui_downloadFile_succes = function(){ return ui_downloadFile_status == ui_DOWNLOADFILE_STATUS.SUCCES_DOWNLOADING;};

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
//-------------------------------------------------------------------------------------------------------------------// 
        var ui_DOWNLOADFILE_STATUS = {
            UNACTIVE: -1,
            INITIAL: 0,
            DOWNLOADING :1,
            SUCCES_DOWNLOADING: 2}
        var ui_downloadFile_status = ui_GETMETA_STATUS.UNACTIVE;

        this.ui_downloadFile = function(publicationID){getFile(publicationID);};
        this.ui_downloadFile_getFile = function(){return currentFile;};
        this.ui_downloadFile_deleteFile = function(){deleteCurrentFile();};
        this.ui_downloadFile_activate = function() {ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.INITIAL;};
        this.ui_downloadFile_deActivate = function() {ui_downloadFile_status = ui_DOWNLOADFILE_STATUS.UNACTIVE;};
        this.ui_downloadFile_active = function() {return ui_downloadFile_status != ui_DOWNLOADFILE_STATUS.UNACTIVE;};
        this.ui_downloadFile_initialStatus = function() {return ui_downloadFile_status == ui_DOWNLOADFILE_STATUS.INITIAL;};
        this.ui_downloadFile_downloading = function(){return ui_downloadFile_status == ui_DOWNLOADFILE_STATUS.DOWNLOADING;};
        this.ui_downloadFile_succes = function(){ return ui_downloadFile_status == ui_DOWNLOADFILE_STATUS.SUCCES_DOWNLOADING;};

        //function to get the publications of a certain user.
        $scope.getUserPublications = function(libraryName) {
            $scope.busy = true;
            var url = serverApi.concat('/user/').concat($scope.username).concat('/library/').concat(libraryName);
            var getUserPublicationsRequest = $http.get(url, config);
            getUserPublicationsRequest.success(function(data, status, headers, config) {
                appData.currentUser.publications = data;
                $scope.busy = false;
            });
            getUserPublicationsRequest.error(function(data, status, headers, config) {
                $scope.busy = false;
                toast("Failed to get publications, try again later.", 4000);
            });
        };



        */
    });

