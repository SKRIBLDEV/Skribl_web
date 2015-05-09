

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

                var cardElement = d3.select('.networkCard');
                var width = cardElement[0][0].clientWidth;
                var height = 1 * width;//width = 800,

                var circleWidth = width/100;
                var fontSize = width/1000;

                var circleWidthSelected = circleWidth + width/200;
                var fontSizeSelected = width/800;

                var skriblColor =  "#4A60B6"; // skribl-primary
                var selectedNodeColor = "#EF5350"; //"#e51c23"; // skribl red
                var centerNodeColor = "#EF5350"; 

                //function used to color the nodes, e.g., different for the author whom's network is displayed
                var setColor = function(i){
                  if(i == 1)
                    return centerNodeColor;
                  else 
                    return skriblColor;
                };


                var svg = d3.select(element[0]).append("svg")
                    .attr("class", "stage")
                    .attr("width", width)
                    .attr("height", height);


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

                    .on("click", function(d, i) { 
                      if (i>0)
                        showProfile(d);
                    })

                    .on("mouseover", function(d,i) {
                        //if (i>0) {
                          //CIRCLE
                          d3.select(this).selectAll("circle")
                          .transition()
                          .duration(250)
                          .style("cursor", "none")     
                          .attr("r", circleWidthSelected)
                          .style("fill",selectedNodeColor);

                          //TEXT
                          d3.select(this).select("text")
                          .transition() 
                          .duration(250)
                          .style("cursor", "none")     
                          .attr("font-size",fontSizeSelected + "em")
                          .style("fill",selectedNodeColor)
                          .attr("x", circleWidthSelected )
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
                          .attr("r", circleWidth)
                          .style("fill",skriblColor);

                          //TEXT
                          d3.select(this).select("text")
                          .transition()
                          .duration(250)
                          .attr("font-size",fontSize + "em")
                          .style("fill",skriblColor)
                          .attr("x", circleWidth )
                          .attr("y", 5 )
                        //}
                      })

                      .call(force.drag);

  

                node.append("svg:circle")
                    .attr("r", circleWidth)
                    .style("fill", function(d,i){
                      if(i == 1)
                        return centerNodeColor;
                      else 
                        return skriblColor;
                    });
                    
                node.append("text")
                    .text(function (d, i) {
                        return d.firstName + " " + d.lastName;
                    })
                    .attr("x", function (d, i) {
                        return circleWidth + 5;
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
                    });

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

                var showProfile = function(element){
                    console.log(element.lastName + ", id: " + element.id)
                }


            })

        }
    }});



