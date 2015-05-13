

webapp.directive('graphDirective', function (appData) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element) {


            //show textual replacement for the graph
            scope.$on("Graph_Failed", function(){

                d3.select(element[0]).append("p")
                    .text('No network to display.')
                    .attr("font-family", "Roboto");

            });


            // create a visualisation of the graph
            scope.$on("Graph_Ready", function () {

              //the order of the statements (defining bahaviour, algorithm, defining attributes, ...) influences the outcome. 

                var cardElement = d3.select('.networkCard');
                var width = cardElement[0][0].clientWidth;
                var height = 0.8 * width;//width = 800,

                var circleWidth = width/50;
                var fontSize = width/1000;

                var circleWidthSelected = circleWidth + width/200;
                var fontSizeSelected = width/800;

                var skriblColor =  "#4A60B6"; // skribl-primary
                var grey = "#999";

                var authorColor = grey;
                var userColor = skriblColor; 
                
                var selectedNodeColor = "#EF5350";
                var centerNodeColor = "#EF5350";

                var linkColor = grey;
                var selectedLinkColor = selectedNodeColor;

                var svg = d3.select(element[0]).append("svg")
                    .attr("class", "svg-network")
                    .attr("width", width)
                    .attr("height", height);

                //force layout algorithm 
                var force = d3.layout.force()
                    .charge(-4000)
                    .linkDistance(width/12)
                    .size([width, height]);


                //add links and define interactivity -> other attributes below    
                var link = svg.selectAll(".link")
                    .data(scope.graphData.coAuthors)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke", linkColor)
                    .style("stroke-width", 3)
                    .style("stroke-opacity", .6)

                    .on("mouseover", function(d,i) {
                      d3.select(this)//.selectAll('.link')
                          .transition()
                          .duration(250)
                          .style("stroke",selectedLinkColor)
                          .style("stroke-width", 8)
                          .style("stroke-opacity", 1)
                    })

                    .on("mouseout", function(d,i) {
                      d3.select(this)//.selectAll('.link')
                          .transition()
                          .duration(250)
                          .style("stroke",linkColor)
                          .style("stroke-width", 3)
                          .style("stroke-opacity", .6)
                    })

                    .on("click", function(d, i) { 
                      showPublications(d); //defined below
                    });


                //add nodes and define interactivity -> other attributes below  
                var node = svg.selectAll("circle.node")
                    .data(scope.graphData.authors)
                    .enter()
                    .append("g")
                    .attr("class", "node")

                    .on("click", function(d, i) { 
                      if (i>=0)
                        showProfile(d);
                    })

                    .on("mouseover", function(d,i) {
                        //if (i>0) {
                          //CIRCLE
                          d3.select(this).selectAll("circle")
                          .transition()
                          .duration(250)
                          .style("cursor", "none")     
                          /*.attr("r",  function(d, i){
                            return circleWidthSelected * d.weight/10;})*/
                          .style("fill",selectedNodeColor);

                          //TEXT
                          d3.select(this).select("text")
                          .transition() 
                          .duration(250)
                          .style("cursor", "none")     
                          .attr("font-size",fontSizeSelected + "em")
                          .style("fill",selectedNodeColor)
                          //.attr("x", circleWidthSelected )
                          .attr("y", 5 )
                       /* } else {
                          //CIRCLE
                          d3.select(this).selectAll("circle")
                          .style("cursor", "none")     

                          //TEXT
                          d3.select(this).select("text")
                          .style("cursor", "none")     
                        }*/
                      })

                      //MOUSEOUT
                      .on("mouseout", function(d,i) {
                        //if (i>0) {
                          //CIRCLE
                          d3.select(this).selectAll("circle")
                          .transition()
                          .duration(250)
                          /*.attr("r", function(d, i){
                            return circleWidth * d.weight/10;})*/
                          .style("fill",function(d,i){
                              if (d.username) // known user 
                                return userColor;
                              else 
                                return authorColor; //author but not a user 
                          });

                          //TEXT
                          d3.select(this).select("text")
                          .transition()
                          .duration(250)
                          .attr("font-size",fontSize + "em")
                          .style("fill",skriblColor)
                          .attr("x", function (d, i) {
                            return circleWidth * d.weight/10 + 5;
                          })
                          .attr("y", 5 )
                        //}
                      })

                      .call(force.drag);


                //feed data to fore layout algorithm       
                force
                    .nodes(scope.graphData.authors)
                    .links(scope.graphData.coAuthors)
                    .start();

                force.on("tick", function () {
                    link.attr("x1", function (d) {
                        return d.source.x;
                    })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });

          
                     node.attr("transform", function(d, i) {     
                            return "translate(" + d.x + "," + d.y + ")"; 
                        });

                });

  

                node.append("svg:circle")
                    .attr("r", function(d, i){
                      return circleWidth * d.weight/10; 
                    })
                    .style("fill", function(d,i){
                      if (d.username) // known user 
                        return userColor;
                      else 
                        return authorColor; //author but not a user 
                    })
                    .style("stroke",  function(d,i){
                      if (isNetworkOwner(d)) // known user 
                        return "#2c3a6e";
                    })
                    .style("stroke-width",  function(d,i){
                      if (isNetworkOwner(d)) // known user 
                        return (circleWidth * d.weight/10)/3 ;
                    })
                    
                node.append("text")
                    .text(function (d, i) {
                        return d.firstName + " " + d.lastName;
                    })
                    .attr("x", function (d, i) {
                        return circleWidth * d.weight/10 + 5;
                    })
                    .attr("y", function (d, i) {
                      return  5;
                    })
                    .attr("font-family", "Roboto")
                    .style("fill", skriblColor)
                    .attr("font-size", function (d, i) {
                        return fontSize + "em";
                    })
                    .attr("text-anchor", function (d, i) {
                       return "beginning";
                    })


            })

                var isNetworkOwner = function(d){
                  return d.id === appData.currentNetworkAuthor.authorId;
                }

                var showProfile = function(clickedNode){
                    appData.data.currentProfileData.lastName = clickedNode.lastName;
                    appData.data.currentProfileData.firstName = clickedNode.firstName;
                    appData.data.currentProfileData.authorId = clickedNode.id;
                    appData.data.currentProfileData.username = clickedNode.username; // can be undefined
                    scope.$digest();
                }

                //returns a list of the publications two authors have in common 
                var listPublications = function(authorIndex1, authorIndex2){
                  var list = [];
                  for (j = 0; j < scope.graphData.coAuthors.length; j++) {
                    if (scope.graphData.coAuthors[j].target.index == authorIndex1 && scope.graphData.coAuthors[j].source.index == authorIndex2)
                      list.push(scope.graphData.coAuthors[j].publication);
                     if (scope.graphData.coAuthors[j].source.index == authorIndex1 && scope.graphData.coAuthors[j].target.index == authorIndex2)
                      list.push(scope.graphData.coAuthors[j].publication);
                  }
                  return list;
                }

                var showPublications = function(clickedLink){
                  scope.linkClicked = true;
                  appData.currentPubInCommon = {
                    author1: clickedLink.target,
                    author2: clickedLink.source,
                    publications: listPublications(clickedLink.target.index, clickedLink.source.index)
                  }
                  scope.$digest();
                }

        }
    }});



