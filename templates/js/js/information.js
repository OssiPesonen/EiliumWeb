function templatePlay() {
    $('#box').removeClass().addClass('animationMoveIn');
    $('#boxContent').removeClass().addClass('animationFadeIn');

    setTimeout(function() {
        $('#boxContent').children('*').each(function() {
            $(this).css('minWidth',$(this).outerWidth());
        });
    }, 100);
}

function templateStop() {
    $('#box').removeClass().addClass('animationMoveOut');
    $('#boxContent').removeClass().addClass('animationFadeOut');
}