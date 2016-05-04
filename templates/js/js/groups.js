function templatePlay() {
    $('#box').removeClass().addClass('animationFadeIn');
    $('#boxContent').removeClass().addClass('animationFadeIn');

    setTimeout(function() {
        $('#boxContent').children('*').each(function() {
            $(this).css('minWidth',$(this).outerWidth());
        });
    }, 100);
}

function templateStop() {
    $('#box').removeClass().addClass('animationFadeOut');
    $('#boxContent').removeClass().addClass('animationFadeOut');
}