



/*
Custom service that allows smooth scrolling on a page.
// adapted from http://jsfiddle.net/brettdewoody/y65G5/
 */
webapp.service('anchorSmoothScroll', function(){
    
    /**
     * The raison d'etre of this service: scrools the viewport to the elment residing in the eID
     * @param  {function} eID the ID of the relement to which the viewport should scroll to
     */
    this.scrollTo = function(eID) {
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 0.001);
        if (speed >= 2) speed = 2;
        var step = Math.round(distance / 150);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        /**
         * Retuns the current position in the viewframe
         * @return {Number} the current position in the viewFrame
         */
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        /**
         * Returns hte position of the element (eID) in the viewframe
         * @param  {[type]} eID the element which we'll require the position of
         * @return {[type]}     the position of eID in the viewFrame
         */
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }
    };
});

