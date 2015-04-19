/* --- PARSING GRAPHS --- */

/** Parses graph from database into a standardised format
  * @param dbdata {Array} - all edges in the database
  * @returns newly formatted data
 */
function parseAuthorGraph(dbdata) {

  if (dbdata instanceof Array) {

    //map<authorRid->indexInAuthorArray>
    var authorIndexOf = Object.create(null);
    var authorArray = new Array();
    var edges = new Array();

    function authorIdx(author) {

      var rid = author.id;
      var idx = authorIndexOf[rid];
      if(idx === undefined) { //not in array yet
        idx = authorArray.length;
        authorArray.push(author);
        authorIndexOf[rid] = idx;
      }
      return idx;
    }

    //loop over all entries in data
    var authorFrom, authorFromIdx;
    var authorTo, authorToIdx;
    var publication;
    dbdata.forEach(function(edge) {
      //destructure edge
      authorFrom = edge[0];
      publication = edge[1];
      authorTo = edge[2];
      //get vertex indices
      authorFromIdx = authorIdx(authorFrom);
      authorToIdx = authorIdx(authorTo);
      //add a new edge
      edges.push({
        source: authorFromIdx,
        target: authorToIdx,
        publication: publication
      });
    });

  } else {

    var authorArray = [dbdata];
    var edges = new Array();
  }

  return {
    authors: authorArray,
    coAuthors: edges 
  }
}

exports.parseAuthorGraph = parseAuthorGraph;