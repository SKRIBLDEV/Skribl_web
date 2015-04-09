/**
 * Initialisation of the appdata with the empty object
 */
webapp.service('appData', function() {
    var self = this;
    
    this.currentUser = null;
    this.userinput = {};
    this.data ={
        publications: null,
        currentLibraryName: null,
        userLibrariesNames: null,
        currentFile: null,
        currentMetaData: null,
        searchResult: null,
        searchAuthorsResult: null
    };
    this.uploadData = {
        file: null,
        title: "",
        type: "",
        currentPublicationID: null
    };
    
    this.deleteCurrentFile(){self.data.currentFile = null;};
    
});