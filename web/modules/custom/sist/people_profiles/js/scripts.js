/**
 * @file
 * Overrride UI behaviors
 */

(function ($, Drupal) {

    'use strict';
    $(function () {
        $('body').equalHeightPeopleProfiles();
    })

    $(document).ready(function () {
        $('body').equalHeightPeopleProfiles();
    })

    $(window).on('load', function () {
        $('body').equalHeightPeopleProfiles();
    });

    $(window).on('resize', function () {
        $('body').equalHeightPeopleProfiles();
    });

    $.fn.equalHeightPeopleProfiles = function () {
        var maxHeight = 0;

        $('.view-people-profiles .equal-height').each(function () {
            $(this).removeAttr('style');
            maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
        })
            .height(maxHeight);


        $('.view-custom-container .equal-height').each(function () {
            $(this).removeAttr('style');
            maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
        })
            .height(maxHeight);
    }


})(jQuery, Drupal);