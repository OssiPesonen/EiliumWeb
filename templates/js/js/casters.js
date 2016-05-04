function templatePlay() {
    $('#left').removeClass().addClass('animationMoveInFromLeft');
    $('#right').removeClass().addClass('animationMoveInFromRight');

    // Let's not show third caster unless it has text
    if($('#center #f6').text() != '') {
        $('#center').removeClass().addClass('animationMoveInFromBottom');
    }

    $('#left-content, #right-content, #center-content').removeClass().addClass('animationFadeIn');

    setTimeout(function() {
        $('#left-content, #right-content, #center-content').children('*').each(function() {
            $(this).css('minWidth',$(this).outerWidth());
        });
    }, 100);
}

function templateStop() {
    $('#left').removeClass().addClass('animationMoveOutFromLeft');
    $('#right').removeClass().addClass('animationMoveOutFromRight');

    // Let's not hide third caster unless it has text
    if($('#center #f6').text() != '') {
        $('#center').removeClass().addClass('animationMoveOutFromBottom');
    }

    $('#left-content, #right-content, #center-content').removeClass().addClass('animationFadeOut');
}