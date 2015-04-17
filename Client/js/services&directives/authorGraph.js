


webapp.directive('authorGraphDirective', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element) {

            scope.$on("Graph_Ready", function () {

                /*var selection = d3.select(element[0]);
                width = selection[0][0].clientWidth;
                console.log("width of the parent: " + width);*/

               var width = 400,
                   height = 1.2 * width;

                var circleWidth = width/100;

                var skriblColor =  "#4A60B6"; // skribl-primary


                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height);

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
                    .append("circle");
                    //.on("click", function(d) { showProfile(d) } )
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


            })

        }
    }});



