function templatePlay() {
    $('#box').removeClass().addClass('animationMoveFromLeft');

    setTimeout(function() {
        $('#boxContent').children('*').each(function() {
            $(this).css('minWidth',$(this).outerWidth());
        });
    }, 100);
}

function templateStop() {
    $('#box').removeClass().addClass('animationMoveToLeft');
}