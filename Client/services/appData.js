/**
 * Initialisation of the appdata with the empty object
 */


webapp.service('appData', function() {
    var self = this;
    
    this.Authorization = null;
    this.currentUser = null;
    this.userinput = {};
    this.data ={
        publications: null,
        currentLibraryName: null,
        userLibrariesNames: null,
        currentFile: null,
        currentMetaData: null,
        searchResult: null,
        searchAuthorsResult: null,
        addLibName: null,
        searchTerm: null,
        searchTerm2: null
    };
    this.uploadData = {
        file: null,
        title: "",
        type: "",
        currentPublicationID: null
    };

    this.deleteCurrentFile = function(){self.data.currentFile = null;};

    this.clearSearch = function(){
        data.searchTerm = null;
        data.searchTerm2 = null;
    }
    
});