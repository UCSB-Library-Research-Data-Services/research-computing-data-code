/**minicalendar
 * @file
 * Overrride UI behaviors
 */

(function ($, Drupal) {
    Drupal.behaviors.communitiesFlip = {
      attach: function (context, settings) {
        $('.fa-info-circle', context).once('communitiesFlip').on('click', function () {
          $(this).closest('.card').toggleClass('flip-card');
        });
      }
    };
})(jQuery, Drupal);