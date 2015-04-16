webapp.controller('GraphCtrl', function GraphCtrl($scope, $http) {

    $scope.graphDataReady = false;

    $http.get('temp_json/graph_data.json')
        .success(function (data) {
            $scope.graphData = data;
            $scope.graphDataReady = true; //ugly fix! -> after installment of router-UI, this could be fixed with 'resolving'
            $scope.$broadcast("Graph_Ready"); // ugly fix!
        }).error(function (data, status) {
            if (status === 404) { //to do: reflect error in view
                console.log('That repository does not exist');
            } else {
                console.log('Error: ' + status);
            }
        });

});


webapp.directive('authorGraphDirective', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element) {

            scope.$on("Graph_Ready", function () {

                var width = 960,
                    height = 600;

                var circleWidth = 5;

                var yellowgreen = "#738A05";


                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var force = d3.layout.force()
                    .charge(-1000)
                    .linkDistance(200)
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
                    .style("fill", yellowgreen)
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
                    .attr("font-family", "sans-serif")
                    .attr("fill", function (d, i) {
                        return yellowgreen;
                    })
                    .attr("font-size", function (d, i) {
                        return ".5em";
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



