// Customizations

import 'jquery';

$(document).ready(function() {

    // Better sidebar collapse toogle
    // ---------------------------------------------------------------------------
    $('.collapse-trigger').on("click", function() {
        if ($(this).hasClass('opened-nav')) {
            $('#sidebar-wrapper').find('.side-nav-bar.can-hide').addClass('moved');
            $('#layout').addClass('moved');
            $(this).css("display", "none");
            $('#sidebar-wrapper').find('.expand-trigger').css("display", "block");
        }
    });

    $('.expand-trigger').on("click", function() {
        if ($(this).hasClass('hidden-nav')) {
            $('#sidebar-wrapper').find('.side-nav-bar.can-hide').removeClass('moved');
            $('#layout').removeClass('moved');
            $('#sidebar-wrapper').find('.expand-trigger').css("display", "none");
            $('#sidebar-wrapper').find('.collapse-trigger').css("display", "block");
        }
    });
});