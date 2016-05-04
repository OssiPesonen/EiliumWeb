function templatePlay() {
    $('#box').removeClass().addClass('animationMoveIn');
    $('#boxContent').removeClass().addClass('animationFadeIn');
    setTimeout(function() {
        $('#boxContent span, #boxContent time').addClass('show');
    }, 1000);
}

function templateStop() {
    $('#box').removeClass().addClass('animationMoveOut');
    $('#boxContent').removeClass().addClass('animationFadeOut');
}

function updateClock () {
 	var currentTime = new Date ( );
  	var currentHours = currentTime.getHours ( );
  	  	currentHours = ( currentHours < 10 ? "0" : "" ) + currentHours;
  	var currentMinutes = currentTime.getMinutes ( );
  	currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;

  	var currentTimeString = currentHours + "." + currentMinutes;
   	$("time").html(currentTimeString);
 }

 $(function() {
    setInterval('updateClock()', 1000);
 });