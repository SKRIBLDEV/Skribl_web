

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


                 //----------visualisation 

                var width = 600,
                    height = 1 * width;

                var circleWidth = width/100;

                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height);


                var skriblColor =  "#4A60B6"; // skribl-primary


                var force = d3.layout.force()
                    .charge(-1000)
                    .linkDistance(width/5)
                    .size([width, height]);

                force
                    .nodes(scope.graphData.authors)
                    .links(scope.graphData.coAuthors)
                    .start();

                var link = svg.selectAll(".link")
                    .data(scope.graphData.coAuthors)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", 1);

                var node = svg.append("g").selectAll(".node")
                    .data(scope.graphData.authors)
                    .enter()
                    .append("circle")
                    .on("click", function(d) { showProfile(d) } )
                    //.on("mouseover", function(d) {console.log("noticed!")});
                //.on("mouseout",  function(d) { highlightGraphNode(d, false); });


                var nodeAttributes = node
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
                    });


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

                    node.attr("cx", function (d) {
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
                        });

                });

                //----------interactivity

               var showProfile = function(element){
                console.log(element);
               }


            })

        }
    }});



