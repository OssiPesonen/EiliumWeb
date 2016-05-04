function templatePlay() {
    $('#box').removeClass().addClass('animationMoveInFromRight');
    $('#boxContent').removeClass().addClass('animationFadeIn');

    setInterval(function() {
        var $active = $('#boxContent div.active');
        var $next = $active.next();
        $next.addClass('active');
        $active.removeClass('active');
        setTimeout(function() {
            $active.appendTo('#boxContent');
        }, 1000);
    },  5000);
}

function templateStop() {
    $('#box').removeClass().addClass('animationMoveOutFromRight');
    $('#boxContent').removeClass().addClass('animationFadeOut');
}