

webapp.directive('graphDirective', function () {
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


                // @Pieter: this is some code to get the width of the parent container of the directive
                // it could be used to scale the svg dynamically
                // however, this returns a width = 0, which is probably due to using materialize 'col' ?

                /*var selection = d3.select(element[0]);
                 width = selection[0][0].clientWidth;
                 console.log("width of the parent: " + width);*/


                var width = 800,
                    height = 1 * width;

                var circleWidth = width/100;

                var svg = d3.select(element[0]).append("svg")
                    .attr("class", "stage")
                    .attr("width", width)
                    .attr("height", height);


                var skriblColor =  "#4A60B6"; // skribl-primary
                var selectedNodeColor = "#e51c23"; // skribl red


                var force = d3.layout.force()
                    .charge(-1000)
                    .linkDistance(width/5)
                    .size([width, height]);


                var link = svg.selectAll(".link")
                    .data(scope.graphData.coAuthors)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", 1);


                var node = svg.selectAll("circle.node")
                    .data(scope.graphData.authors)
                    .enter()
                    .append("g")
                    .attr("class", "node")

                    .on("click", function(d) { showProfile(d) } )

                    .on("mouseover", function(d,i) {
                        console.log("noticed");
                        if (i>0) {
                          //CIRCLE
                          d3.select(this).selectAll("circle")
                          .transition()
                          .duration(250)
                          .style("cursor", "none")     
                          .attr("r", circleWidth+3)
                          .style("fill",selectedNodeColor);

                          //TEXT
                          d3.select(this).select("text")
                          .transition() 
                          .duration(250)
                          .style("cursor", "none")     
                          .attr("font-size","1.5em")
                          .style("fill",selectedNodeColor)
                          .attr("x", 15 )
                          .attr("y", 5 )
                        } else {
                          //CIRCLE
                          d3.select(this).selectAll("circle")
                          .style("cursor", "none")     

                          //TEXT
                          d3.select(this).select("text")
                          .style("cursor", "none")     
                        }
                      })

                      //MOUSEOUT
                      .on("mouseout", function(d,i) {
                        if (i>0) {
                          //CIRCLE
                          d3.select(this).selectAll("circle")
                          .transition()
                          .duration(250)
                          .attr("r", circleWidth)
                          .style("fill",skriblColor);

                          //TEXT
                          d3.select(this).select("text")
                          .transition()
                          .duration(250)
                          .attr("font-size",".8em")
                          .style("fill",skriblColor)
                          .attr("x", 8 )
                          .attr("y", 4 )
                        }
                      })

                      .call(force.drag);

                      
                //.on("mouseout",  function(d) { highlightGraphNode(d, false); });

                node.append("svg:circle")
                    .attr("r", circleWidth)
                    .style("fill", skriblColor);
                    
                node.append("text")
                    .text(function (d, i) {
                        return d.firstName + " " + d.lastName;
                    })
                    .attr("x", function (d, i) {
                        return circleWidth + 5;
                    })
                    .attr("y", function (d, i) {
                        if (i > 0) {
                            return circleWidth + 0
                        } else {
                            return 8
                        }
                    })
                    .attr("font-family", "Roboto")
                    .style("fill", skriblColor)
                    .attr("font-size", function (d, i) {
                        return ".8em";
                    })
                    .attr("text-anchor", function (d, i) {
                        if (i > 0) {
                            return "beginning";
                        } else {
                            return "end"
                        }
                    });

                force
                    .nodes(scope.graphData.authors)
                    .links(scope.graphData.coAuthors)
                    .start();



                /*var nodeAttributes = node
                    .attr("class", "node")
                    .attr("r", circleWidth)
                    .style("fill", skriblColor)
                    .call(force.drag);

                var text = svg.append("g").selectAll(".text")
                    .data(scope.graphData.authors)
                    .enter()
                    .append("text");

                var textLabels = text
                    .text(function (d, i) {
                        return d.firstName + " " + d.lastName;
                    })
                    .attr("x", function (d, i) {
                        return circleWidth + 5;
                    })
                    .attr("y", function (d, i) {
                        if (i > 0) {
                            return circleWidth + 0
                        } else {
                            return 8
                        }
                    })
                    .attr("font-family", "Roboto")
                    .attr("fill", function (d, i) {
                        return skriblColor;
                    })
                    .attr("font-size", function (d, i) {
                        return ".6em";
                    })
                    .attr("text-anchor", function (d, i) {
                        if (i > 0) {
                            return "beginning";
                        } else {
                            return "end"
                        }
                    });*/


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

                    /*node.attr("cx", function (d) {
                        return d.x;
                    })
                        .attr("cy", function (d) {
                            return d.y;
                        });

                    text.attr("x", function (d, i) {
                        return d.x + circleWidth + 5;
                    })
                        .attr("y", function (d, i) {
                            return d.y + circleWidth;
                        });*/
                     node.attr("transform", function(d, i) {     
                            return "translate(" + d.x + "," + d.y + ")"; 
                        });

                });

                var showProfile = function(element){
                    console.log(element.lastName + ", id: " + element.id)
                }


            })

        }
    }});



