/**
 * @file
 * Sidebarnav header link
 */

 (function ($, Drupal) {

    $(document).ready(function(){
        // Check for viewport smaller than or equal to 768
        if ($(window).width() <= 768) {
            // Get and wrap the content from the sidebar nav h2
            var content = $('h2#block-mainnavigation-menu').html();
            content = '<a id="sidebarnavtitlelink" data-toggle="collapse" data-parent="#accordion" aria-expanded="false" href="#collapse-sidebarnav" aria-controls="collapse-sidebarnav" class="collapsed">' + content + '</a>';

            // Reinsert the content into the sidebar nav h2
            $('h2#block-mainnavigation-menu').html( content );

            // Add collapse attributes and classes to main sidebarnav ul
            // output for ul - <ul id="collapse-sidebarnav" class="lelando ft_sidebar_nav panel-collapse collapse" aria-labelledby="block-mainnavigation-menu">

            $("ul.left_sidebar_nav").attr("id", "collapse-sidebarnav");
            $("ul.left_sidebar_nav").attr("aria-labelledby", "block-mainnavigation-menu");
            $("ul.left_sidebar_nav").addClass('panel-collapse');
            $("ul.left_sidebar_nav").addClass('collapse');

        }

        // Check for viewport larger than or equal to 768
        if ($(window).width() >= 769) {

            // Remove collapse attributes and classes to main sidebarnav ul

            $("ul.left_sidebar_nav").removeAttr("id", "collapse-sidebarnav");
            $("ul.left_sidebar_nav").removeAttr("aria-labelledby", "block-mainnavigation-menu");
            $("ul.left_sidebar_nav").removeClass('panel-collapse');
            $("ul.left_sidebar_nav").removeClass('collapse');
            $("h2#block-mainnavigation-menu").find("a.sidebarnavtitlelink").contents().unwrap();


        }

        // Also apply all of the above on resize
        $(window).on('resize', function () {

          // Check for viewport smaller than or equal to 768
          if ($(window).width() <= 768) {
              // Get and wrap the content from the sidebar nav h2
              var content = $('h2#block-mainnavigation-menu').html();
              content = '<a id="sidebarnavtitlelink" data-toggle="collapse" data-parent="#accordion" aria-expanded="false" href="#collapse-sidebarnav" aria-controls="collapse-sidebarnav" class="collapsed">' + content + '</a>';

              // Reinsert the content into the sidebar nav h2 only if it hasn't been placed already
              if ($("a#sidebarnavtitlelink").length == 0) {
                  $('h2#block-mainnavigation-menu').html( content );
              }

              // Add collapse attributes and classes to main sidebarnav ul
              // output for ul - <ul id="collapse-sidebarnav" class="lelando ft_sidebar_nav panel-collapse collapse" aria-labelledby="block-mainnavigation-menu">

              $("ul.left_sidebar_nav").attr("id", "collapse-sidebarnav");
              $("ul.left_sidebar_nav").attr("aria-labelledby", "block-mainnavigation-menu");
              $("ul.left_sidebar_nav").addClass('panel-collapse');
              $("ul.left_sidebar_nav").addClass('collapse');

          }

          // Check for viewport larger than or equal to 768
          if ($(window).width() >= 769) {

              // Remove collapse attributes and classes to main sidebarnav ul

              $("ul.left_sidebar_nav").removeAttr("id", "collapse-sidebarnav");
              $("ul.left_sidebar_nav").removeAttr("aria-labelledby", "block-mainnavigation-menu");
              $("ul.left_sidebar_nav").removeClass('panel-collapse');
              $("ul.left_sidebar_nav").removeClass('collapse');
              $("h2#block-mainnavigation-menu").find("a.sidebarnavtitlelink").contents().unwrap();

          }
        });
    })

})(jQuery, Drupal);
