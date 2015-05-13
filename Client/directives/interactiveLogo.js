
/*
initialisation of the interactiveLogo directive which uses paperJS for interactive vector imagery,
this directive is used to display the interactive logo, at this moment used at the home-screen.
 */
webapp.directive('interactivelogo', ['$timeout', function(timer) {

 
    return {
    restrict: 'A',
    scope: {
      mobile:'=mobile'
    },
    link: function(scope, element, mobile) {

      var canvas = document.querySelector('canvas');
      fitToContainer(canvas);

      console.log(scope.mobile);

      if (scope.mobile == true){
        console.log(mobile);
        return {};
      }
      

      function fitToContainer(canvas){
      

        // Make it visually fill the positioned parent
        canvas.style.height='100%';
        canvas.style.width = '100%';

        // select minimum value
        var minv = (canvas.offsetWidth < canvas.offsetHeight) ? canvas.offsetWidth : canvas.offsetHeight;

        // set the internal size to match the minimum value of width/height
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

          /**
           * creates the drawable item, sets the size, color and ellipse
           */
          createItem: function(){
            this.circle = new paper.Shape.Ellipse({
              center: [0, 0],
              size: [13, 13],
              fillColor: defaultSkriblleColor
              });
            },

          /**
           * keeps a node in a center
           * @param  {[type]} radius the radius to maintain a node within
           */
          keepInCircle: function(radius){
            var center = new paper.Point(radius, radius)
            var outer = radius - this.circle.size.width
            if (center.getDistance(this.position) > outer){
              var diff = this.position.subtract(center)
              diff = diff.normalize(outer)
              diff = diff.add(center)
              this.position = diff  
              this.udraw()
              }
          },

          /**
           * Updates the position of the node by use of vector operations
           * @param  {[function]} referencePoint the reference point towards a node should move to
           * @param  {[Number]} scalar         the "speed" a node should move towards the refence node
           */
          updatePosition: function(referencePoint, scalar){
              var diff = this.position.subtract(referencePoint)
              var length = diff.length
              diff = diff.normalize(length * scalar)
              diff = diff.add(referencePoint)
              this.position = diff
              this.keepInCircle(paper.view.bounds.width/2)
          },
          
          /**
           * Updates the node by setting the positon of the drawable objects to the nodes own position
           */
            udraw: function(){
              this.circle.position = this.position
            }
          })
          
          /**
           * Auwiliary function that maps a value
           * @param  {Number} value the value to be mapped
           * @param  {Number} imin  the original minimum value
           * @param  {Number} imax  the orignal maximum value
           * @param  {Number} omin  the desired minimum value
           * @param  {Number} omax  the desired maximum value
           * @return {Number}       the mapped value
           */
          var mapff = function(value, imin, imax, omin, omax){
            return ((value - imin) / (imax - imin) * (omax - omin) + omin)
          }
          
          /**
           * Returns a random value between [-1, 1]
           * @return {Number} the random value
           */
          var ranMin = function(){
            return mapff(Math.random(), 0, 1, -1, 1)
          }

        /**
         * Initializes the interactive logo
         */
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

          var svg = paper.project.importSVG(document.getElementById('svg-slogo'));
          svg.scale(0.75)
          svg.position = paper.view.center
        }


        /**
         * Sets the handlers, in this cae is only "on Frame" set, a function that gets called every time a frame is drawn to the screen
         * Also sets the tool functionality, in this case "onMouseMove"
         */
        var setHandlers = function(){

          /**
           * sets the onFrame handler of paperJS in order to draw/update the nodes and lines
           * @param  {[type]} event the draw event
           */
          paper.view.onFrame = function(event){
            path.clear()

            /**
             * Draws a simple line by adding them to the path variable
             * @param  {function} pos1 position of the starting point
             * @param  {function} pos2 position of the ending point
             */
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
                  nodes[y].position.x = radius - ranMin()*30
                  nodes[y].position.y = radius - ranMin()*30
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

          /**
           * Sets the functionality that should happen whenever a user moves its mouse in the canvas
           * @param  {function} event  the event object
           */
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