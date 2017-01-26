var pointsArray = document.getElementsByClassName('point');

var animatePoints = function (points) {
 

     var revealPoint = function (a) {
         points[a].style.opacity = 1;
         points[a].style.transform = "scaleX(1) translateY(0)";
         points[a].style.msTransform = "scaleX(1) translateY(0)";
         points[a].style.WebkitTransform = "scaleX(1) translateY(0)";
     };


     for (var i = 0; i < points.length; i++){
         revealPoint(i);
     }

 };

window.onload = function() {
     var sellingPoints = document.getElementsByClassName('selling-points')[0];
     var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
     if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }

    
     window.addEventListener("scroll", function(event) {
         
         
         if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);
         
         }
           
 });
}
        