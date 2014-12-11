webapp.directive('interactivelogo', ['$timeout', function(timer) {

  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element) {


      var canvas = document.querySelector('canvas');
      fitToContainer(canvas);

      function fitToContainer(canvas){
        // Make it visually fill the positioned parent
        canvas.style.height='100%';
        canvas.style.width = '100%';

        // select minimum value
        var minv = (canvas.offsetWidth < canvas.offsetHeight) ? canvas.offsetWidth : canvas.offsetHeight;

        // ...then set the internal size to match
        canvas.style.width  = minv;
        canvas.style.height = minv;
        canvas.width  = minv;
        canvas.height = minv;
      }

      /*
       * Use object to expose operations
       */
      scope.internalControl = scope.graphControl || {};
      scope.internalControl.reset = function() {
        drawGraph(element[0]);
      };

      /*
       *  initializes the graph and sets handles for "onFrame" and mouse operations
       */
      function drawGraph(element) {

        // setup the paper scope on canvas
        if (!scope.paper) {
          scope.paper = new paper.PaperScope();
          scope.paper.setup(element);
        }

        // set up variables
        // assign the global paper object
        paper = scope.paper;
        var defaultSkriblleColor = '#4A60B6' /* Skrible_default_blue*/
        var tool;
        var radius;
        var nodes           = []
        var connectionGrid  = []
        var path            = {}

        
        
        // Create a raster item using the image tag with id='mona'
        

        //var circle = new paper.Circle();
        //circle.position = raster.position;



        // access controller data
        // var controllerdata = parseInt(scope.controllerdata);

        /**
         * Creates a Node Object that has a position and a drawing object
         * @param  {function} createItem: sets the drawing object
         * @param  {function} keepInCircle: maintains the object in a circle
         * @param  {function} updatePosition: deals with another object and the force (logic)
         * @param  {function} udraw: aligns the drawing object with the position
         * @return {Node Object}               
         */
         var Node = paper.Base.extend({
          initialize: function(position){
            this.position = position
            this.createItem()
            this.udraw()
          },
          createItem: function(){
            this.circle = new paper.Shape.Ellipse({
              center: [0, 0],
              size: [13, 13],
              fillColor: defaultSkriblleColor
              });
            },

          keepInCircle: function(radius){
            var center = new paper.Point(radius, radius)

            if (center.getDistance(this.position) > radius){
              var diff = this.position.subtract(center)
              diff = diff.normalize(radius)
              diff = diff.add(center)
              this.position = diff  
              this.udraw()
              }
          },
          updatePosition: function(referencePoint, scalar){
              var diff = this.position.subtract(referencePoint)
              var length = diff.length
              diff = diff.normalize(length * scalar)
              diff = diff.add(referencePoint)
              this.position = diff
              this.keepInCircle(paper.view.bounds.width/2)
          },
            udraw: function(){
              this.circle.position = this.position
            }
          })

          var mapff = function(value, imin, imax, omin, omax){
            return ((value - imin) / (imax - imin) * (omax - omin) + omin)
          }
          
          var ranMin = function(){
            return mapff(Math.random(), 0, 1, -1, 1)
          }


        var init = function(){          
          // clear all drawing items on active layer
          paper.project.activeLayer.removeChildren();  

          tool = new paper.Tool()
          radius = paper.view.bounds.width/2
          path = new paper.Path
          path.strokeColor = defaultSkriblleColor

          // simulator
          var AMNT    = 30
          var C_RATIO = 0.09

          for (var i = 0; i < AMNT; i++) {
            var np = new Node(new paper.Point(radius, radius)) 
            np.keepInCircle(radius)
            nodes.push(np)
          };

          for (var y = 0; y < AMNT; y++){
            for (var x = 0; x < AMNT; x++){
              var value
              if (x == y){
                value = true
              } else {
                value = (Math.random()<C_RATIO)
              }
              connectionGrid[y*AMNT+x] = value
            }
          }
        }

        
        

        var setHandlers = function(){
          // on resize blocks mouse interaction
          // paper.view.onResize = function(event){
          //   fitToContainer(canvas);
          // }

          paper.view.onFrame = function(event){
            path.clear()

            var raster = new paper.Raster('mona');
          raster.position = paper.view.center

            
            var drawLine = function(pos1, pos2){
                  path.add(pos1)
                  path.add(pos2)
            }

            var MINDIST = 50
            var REPULSE_DIST = MINDIST * 2
            
            for (var y = 0; y < nodes.length; y++){
              for (var x = y+1; x < nodes.length; x++){
                var dis = nodes[y].position.getDistance(nodes[x].position)
                var connected = connectionGrid[y*nodes.length+x]

                if (dis == 0){
                  nodes[y].position.x = radius - ranMin()
                  nodes[y].position.y = radius - ranMin()
                } else if (dis < MINDIST ){
                  nodes[y].updatePosition(nodes[x].position, 1.001)
                } else if (connected){
                  nodes[y].updatePosition(nodes[x].position, 0.99)
                } else if (dis < REPULSE_DIST){
                  nodes[y].updatePosition(nodes[x].position, 1.001)
                }

                if (connected){
                  drawLine(nodes[x].position, nodes[y].position)
                }
              }
          }
            
            for (var i = 0; i < nodes.length; i++) {
              nodes[i].udraw()
            }
          }

          // placeholder for mouse interaction
          // tool.onMouseDown = function(event){}

          tool.onMouseMove = function(event){
            for (var i = 0; i < nodes.length; i++) {
              var MOUSE_DIST = 50;
              var dis = nodes[i].position.getDistance(event.point)
              if (dis < MOUSE_DIST){
                nodes[i].updatePosition(event.point, 1.1)
              }
            };
          }  
        }

        //Begin
        init()
        setHandlers()
        paper.view.draw()
      }

      timer(drawGraph(element[0]), 0);
    }
  };

}]);