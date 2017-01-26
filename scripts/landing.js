var animatePoints = function() {
 
                 var points = document.getElementsByClassName('point');
                 
    
                 var revealPoint = function(a) {
                     points[a].style.opacity = 1;
                     points[a].style.transform = "scaleX(1) translateY(0)";
                     points[a].style.msTransform = "scaleX(1) translateY(0)";
                     points[a].style.WebkitTransform = "scaleX(1) translateY(0)";
                 };
                     
 
                 for(var i = 0; i<points.length;i++){
                     revealPoint(i);
                 }
 
             };
        