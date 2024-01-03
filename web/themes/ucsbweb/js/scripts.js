/**
 * @file
 * UI behaviors
 */

 (function ($, Drupal) {

  'use strict';

  var $triggered_times = 0;
  var header_original_height = $('header').height();
  var lastScrollTop = 0;
  var logoHeight = $('.logo svg').height();
  var originalLogoHeight = logoHeight;
  var scrolledLogoHeight = Math.round(logoHeight * 0.6666667);
  var secondaryNavHeight =  $('.secondary-navigation nav').outerHeight();


  $(window).on('load', function(){
    var secondaryHeaderHeight = $('.secondary-navigation').outerHeight();
    $('.secondary-navigation, .region-secondary-navigation').attr('style', 'height: ' + secondaryHeaderHeight + 'px;');
    $('body').subMenuFixed();
    $('body').logoSize();
    $('body').leftPosition();
    $('body').setActiveMenuItem();
    $('body').secondaryNav();
    $('body').menuColumns();
    $('body').quickLinks();
    $('body').searchForm();
    $('body').resetEybrowStuff();
    $('body').masonryGrid();
    $('body').fnfItem();
    $('body').gridItemHeight();
    $('body').equalHeightColumns();
    $('body').equalHeightSlides();
    $('body').initializeCarousel();
    $('body').menuScrollTop();
    $('body').eventFormat();
    $('body').alertMobile();
    $('body').alertControl();
    $('body').topOffset();
    $('body').offsiteLink();
    $('body').jumplink();
    $('body').closeMenus();
    $('body').populateSearch();
    $('body').blogTopicFilter();
    $('body').blogFeatureArticle();
    $('body').blogTopicBreadcrumbFix();
    $('video').prop("controls",true);
  });

  $(window).on('resize', function(){
    $('.secondary-navigation, .region-secondary-navigation').removeAttr('style').attr('style', 'height: ' + $('.secondary-navigation').outerHeight() + 'px;');
    $('body').resetEybrowStuff();
    $('body').equalHeightColumns();
    $('body').leftPosition();
    $('body').gridItemHeight();
    $('body').equalHeightSlides();
    $('body').alertMobile();
    $('body').alertControl();
    $('body').topOffset();
  });

  $(window).on('scroll', function() {
    $('body').logoSize();
  });

  $(document).on('keyup',function(evt) {
    if (evt.keyCode == 27) {
      //alert('Esc key pressed.');
      $.closeStuff();
    }
  });

  $.fn.leftPosition = function() {
    $('body:not(.toolbar-tray-open) ul.nav > li.dropdown' ).each(function() {
      var thing = $(this);
      var offset = thing.offset();
      $(this).children('.dropdown-menu').css('padding-left', offset.left);
    });
  }

  $.fn.offsiteLink = function() {
    $('*:not(.nav.menu) a.offsite' ).each(function() {
      $(this).after("<svg width='16px' height='16px' viewBox='0 0 16 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><path d='M12.7807612,2.3 L10.45,2.3 C10.0910149,2.3 9.8,2.00898509 9.8,1.65 C9.8,1.29101491 10.0910149,1 10.45,1 L14.35,1 C14.7089851,1 15,1.29101491 15,1.65 L15,5.55 C15,5.90898509 14.7089851,6.2 14.35,6.2 C13.9910149,6.2 13.7,5.90898509 13.7,5.55 L13.7,3.21923882 L7.65961941,9.25961941 C7.40577862,9.5134602 6.99422138,9.5134602 6.74038059,9.25961941 C6.4865398,9.00577862 6.4865398,8.59422138 6.74038059,8.34038059 L12.7807612,2.3 Z M11.75,8.15 C11.75,7.79101491 12.0410149,7.5 12.4,7.5 C12.7589851,7.5 13.05,7.79101491 13.05,8.15 L13.05,12.05 C13.05,13.1269553 12.1769553,14 11.1,14 L3.95,14 C2.87304474,14 2,13.1269553 2,12.05 L2,4.9 C2,3.82304474 2.87304474,2.95 3.95,2.95 L7.85,2.95 C8.20898509,2.95 8.5,3.24101491 8.5,3.6 C8.5,3.95898509 8.20898509,4.25 7.85,4.25 L3.95,4.25 C3.59101491,4.25 3.3,4.54101491 3.3,4.9 L3.3,12.05 C3.3,12.4089851 3.59101491,12.7 3.95,12.7 L11.1,12.7 C11.4589851,12.7 11.75,12.4089851 11.75,12.05 L11.75,8.15 Z' fill='#005aa3'></path></svg>");
    });
    $('a.offsite-quick-link' ).each(function() {
      $(this).append("<svg width='16px' height='16px' viewBox='0 0 16 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><path d='M12.7807612,2.3 L10.45,2.3 C10.0910149,2.3 9.8,2.00898509 9.8,1.65 C9.8,1.29101491 10.0910149,1 10.45,1 L14.35,1 C14.7089851,1 15,1.29101491 15,1.65 L15,5.55 C15,5.90898509 14.7089851,6.2 14.35,6.2 C13.9910149,6.2 13.7,5.90898509 13.7,5.55 L13.7,3.21923882 L7.65961941,9.25961941 C7.40577862,9.5134602 6.99422138,9.5134602 6.74038059,9.25961941 C6.4865398,9.00577862 6.4865398,8.59422138 6.74038059,8.34038059 L12.7807612,2.3 Z M11.75,8.15 C11.75,7.79101491 12.0410149,7.5 12.4,7.5 C12.7589851,7.5 13.05,7.79101491 13.05,8.15 L13.05,12.05 C13.05,13.1269553 12.1769553,14 11.1,14 L3.95,14 C2.87304474,14 2,13.1269553 2,12.05 L2,4.9 C2,3.82304474 2.87304474,2.95 3.95,2.95 L7.85,2.95 C8.20898509,2.95 8.5,3.24101491 8.5,3.6 C8.5,3.95898509 8.20898509,4.25 7.85,4.25 L3.95,4.25 C3.59101491,4.25 3.3,4.54101491 3.3,4.9 L3.3,12.05 C3.3,12.4089851 3.59101491,12.7 3.95,12.7 L11.1,12.7 C11.4589851,12.7 11.75,12.4089851 11.75,12.05 L11.75,8.15 Z' fill='#005aa3'></path></svg>");
    });
  }

  // Set active main nav item
  $.fn.setActiveMenuItem = function() {
    $.each($('#body:not(.localist-body) #navbar').find('li'), function() {
      $(this).toggleClass('active',
          window.location.pathname.indexOf($(this).find('a').attr('href')) > -1);
    });
  }

  // Create multiple uls for the main nav dropdown
  $.fn.menuColumns = function() {
    $('body:not(.toolbar-tray-open) ul.nav > li.dropdown .dropdown-menu > ul > li:nth-child(1)').each(function() {
      var overviewItem = $(this);
      var currentList = overviewItem.closest('ul');
      var newList = $('<ul>');
      newList.insertBefore(currentList);
      newList.append(overviewItem);
    });
    $('body:not(.toolbar-tray-open) ul.nav > li.dropdown .dropdown-menu > ul').each(function() {
      var secontList = $(this);
      var listLength = $(this).children().length;
      var halfLength = Math.round(listLength / 2);
      var firstHalf = $(this).children().slice(0,halfLength);
      var anotherList = $('<ul>');
      anotherList.insertBefore(secontList);
      anotherList.append(firstHalf);
    });
  }
  // Put the search form in the eybrow menu
  $.fn.resetEybrowStuff = function() {
    var $window = $(window);
    var windowsize = $window.width();
    var searchFormRegion = $('.block-search-form-block');
    var quicklinksRegion = $('.quick-links ul.menu.nav');
    if (windowsize < 768) {
      $('.block-search-form-block input.form-search').attr("placeholder", "Search...");
      if ($('.block-search-form-block input.form-search').is(':focus')) {
        e.preventDefault();
      }
      $('#eyebrow .search').removeClass('expanded');
      $('#eyebrow .quick-links').removeClass('expanded');
      $('#navbar-collapse .region-navigation-collapsible').prepend(searchFormRegion);
      $('#block-quicklinks').append(quicklinksRegion);
    } else {
      $('.block-search-form-block input.form-search').attr("placeholder", "Type keywords and press enter...");
    }
  }

  // Put the quicklinks in the eyebrow menu
  $.fn.quickLinks = function() {
    var quicklinksRegion = $('.region-navigation-quicklinks ul.menu.nav');
    $('#eyebrow .quick-links a, #eyebrow .quick-links svg').click(function( e ) {
      e.preventDefault();
      if ($('#eyebrow .quick-links').hasClass('expanded')) {
        $('#eyebrow .quick-links').removeClass('expanded');
        $('#eyebrow').removeClass('quick-links-expanded');
        $('#block-quicklinks').append(quicklinksRegion);
      } else {
        $('#eyebrow .search').removeClass('expanded');
        $('#eyebrow .quick-links').addClass('expanded');
        $('#eyebrow').addClass('quick-links-expanded');
        $('#eyebrow').removeClass('search-expanded');
        $('#eyebrow .quick-links').append(quicklinksRegion);
      }
    });
  }

  $.fn.searchForm = function() {
    $('#search-block-form #edit-actions').attr('id','block-edit-actions');
    $('.block-search-form-block input.form-search').attr("placeholder", "Type keywords and press enter...");
    var searchFormRegion = $('.block-search-form-block');
    $('#eyebrow .search svg').click(function( e ) {
      e.preventDefault();
      if ($('#eyebrow .search').hasClass('expanded')) {
        $('#eyebrow .search').removeClass('expanded');
        $('#eyebrow').removeClass('search-expanded');
        $('#navbar-collapse .region-navigation-collapsible').prepend(searchFormRegion);
      } else {
        $('#eyebrow .quick-links').removeClass('expanded');
        $('#eyebrow .search').addClass('expanded');
        $('#eyebrow').addClass('search-expanded');
        $('#eyebrow').removeClass('quick-links-expanded');
        $('#eyebrow .search').append(searchFormRegion);
        $( "#edit-keys" ).focus();
      }
    });
  }

  $.fn.closeMenus = function() {
    $('main, header .container-fluid').click(function( e ){
      $.closeStuff();
    });
  }

  $.closeStuff = function () {
    if ($('#eyebrow .quick-links').hasClass('expanded')) {
      $('#eyebrow .quick-links').removeClass('expanded');
      $('#eyebrow').removeClass('quick-links-expanded');
      $('#block-quicklinks').append(quicklinksRegion);
    }
    if ($('#eyebrow .search').hasClass('expanded')) {
      $('#eyebrow .search').removeClass('expanded');
      $('#eyebrow').removeClass('search-expanded');
      $('#navbar-collapse .region-navigation-collapsible').prepend(searchFormRegion);
    }
  }

  $.fn.masonryGrid = function() {
    $('.count-4 .grid').masonry({
      itemSelector: '.grid-item',
      columnWidth: 300
    });
    $('.count-3 .grid').masonry({
      itemSelector: '.grid-item',
      columnWidth: 400
    });
  }

  $.fn.fnfItem = function() {
    $('.grid .grid-item.read-more').click(function( e ) {
      e.preventDefault();
      if ($(this).hasClass('open')) {
        $(this).removeClass('open');
      } else {
        $(this).addClass('open');
      }
    });
  }

  // Set grid item bottom margin
  $.fn.gridItemHeight = function() {
    $.each($('.grid-item.has-footer'), function() {
      var footerHeight = $(this).children('.item-footer').height();
      $(this).css('margin-bottom', footerHeight+'px');
    });
  }

  $.fn.equalHeightColumns = function() {
    $('.paragraph--type--blade.equal-height .columns').each(function() {
      var maxHeight = 0;
      var elems = $(this).find('.paragraph--type--column .inner');
      elems.each(function() {
        $(this).removeAttr('style');
        maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
      })
          .height(maxHeight);
    });
    // var divs = $('.views-view-grid.horizontal .views-col');
    // for(var i = 0; i < divs.length; i+=3) {
    //   divs.slice(i, i+3).wrapAll('<div class="wrapper"></div>');
    // }
  }

  $.fn.equalHeightSlides = function() {
    $('.carousel').each(function() {
      var imgHeight = $(this).find('.active img').height();
      imgHeight = Math.floor(imgHeight);
      var imgHalf = (imgHeight / 2);
      imgHalf = Math.floor(imgHalf);
      imgHeight = (imgHeight + 10);
      var controls = $(this).find('.carousel-control');
      controls.each(function() {
        $(this).attr('style', 'top: '+imgHalf+'px;');
      });
      var indicators = $(this).find('.carousel-indicators');
      indicators.each(function() {
        $(this).attr('style', 'top: '+imgHeight+'px;');
      });
      var maxHeight = 0;
      var elems = $(this).find('.item');
      elems.each(function() {
        maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
      })
          .height(maxHeight);
    });
  }

  $.fn.initializeCarousel = function() {

    $('.carousel-static').find('.carousel').each(function () {
      $(this).carousel({
        pause: true,
        interval: false
      });
    });

    $('.carousel-autoscroll').find('.carousel').each(function () {
      $(this).carousel();
    });

  }

  $.fn.logoSize = function() {
    var y_scroll_pos = window.pageYOffset;
    var scroll_pos_test = 150;
    if(y_scroll_pos > scroll_pos_test && $('body').is(':not(.scroll)')) {
      $('body').addClass('scroll');
    }
    if(y_scroll_pos < scroll_pos_test && $('body').hasClass('scroll')) {
      $('body').removeClass('scroll');
    }
    var secondaryHeaderHeight = $('.secondary-navigation').outerHeight();
    var target_height = secondaryHeaderHeight;
    var snavHtml = $('.region-secondary-navigation');
    if (y_scroll_pos > target_height) {
      if ($(window).width() > 767) {
        $('header.navbar').addClass('has-secondary-nav');
        $('header.navbar').append(snavHtml);
      }
    }
    if (y_scroll_pos <= target_height) {
      if ($(window).width() > 767) {
        $('header.navbar').removeClass('has-secondary-nav');
        $('.secondary-navigation').append(snavHtml);
        $('.secondary-navigation, .region-secondary-navigation').removeAttr('style').attr('style', 'height: ' + $('.secondary-navigation').outerHeight() + 'px;');
      }
    }
  }

  $.fn.subMenuFixed = function() {
    $('body').addClass('no-menu');
    $('.navbar-toggle').click(function() {
      if ($('body').hasClass('no-menu')) {
        $('body').removeClass('no-menu');
        $('body').addClass('mobile-menu');
      } else {
        $('body').addClass('no-menu');
        $('body').removeClass('mobile-menu');
      }
    });
  }

  $.fn.topOffset = function() {
    var viewportWidth = $(window).width();
    var alertHeight =  $('.region-alert').height();
    if (viewportWidth < 768 && $('body').hasClass('no-menu')) {
      var headerHeight = $('.secondary-navigation').height() + 16;
      $('.content-header').attr('style', 'margin-top: ' + headerHeight + 'px;');
    }
    if (viewportWidth < 768 && alertHeight > 0) {
      var headerHeight = $('.navbar-header').height();
      $('#body').attr('style', 'margin-top: ' + headerHeight + 'px;');
      var toolbar = parseInt($('#toolbar-administration #toolbar-bar').outerHeight());
      $('.navbar-header').css('margin-top', toolbar);
    } else if (alertHeight > 0) {
      var headerHeight = $('header.navbar').height();
      $('#body').attr('style', 'margin-top: ' + headerHeight + 'px;');
    } else {
      var headerHeight = $('header.navbar').height();
    }
    if (viewportWidth < 768 && $('.secondary-navigation').height() > 0) {
      var headerHeight = ($('.navbar-header').height() + $('.secondary-navigation').height());
    }
    $('a.anchor').each(function() {
      $(this).attr('style','padding-top:' + headerHeight + 'px; margin-top: -' + headerHeight + 'px;');
    });
  }

  $.fn.alertMobile = function() {
    var alertHtml = $('.region-alert');
    var viewportWidth = $(window).width();
    if (viewportWidth < 767) {
      $('.navbar-header').prepend(alertHtml);
    } else {
      $('.navbar.navbar-fixed-top').prepend(alertHtml);
    }
  }

  $.fn.alertControl = function() {
    var viewportWidth = $(window).width();
    var alertHeight = $('.region-alert').height();
    $('.region-alert').addClass('loaded');
    if (viewportWidth < 767) {
      var headerHeight = $('.navbar-header').height();
    } else {
      var headerHeight = $('header.navbar').height();
    }
    var cookieValue = $.cookie('ucsb_alert')
    if (cookieValue == 'collapsed') {
      $('.alert').addClass('collapsed');
    }
    $('.region-alert .alert .close').click(function(e) {
      e.preventDefault();
      $('.alert').addClass('collapsed');
      $('body').topOffset();
      $.cookie('ucsb_alert', 'collapsed', { expires: 1 });
    });

  }

  $.fn.blogTopicFilter = function() {
    var pathname = window.location.pathname;
    var args = pathname.split('/');
    $('#topic-select option').each(function() {
      if ($(this).val() == args[3]) {
        $(this).attr('selected', 'selected');
      }
    });
    $('#blog-topic-filter').submit(function(e) {
      e.preventDefault();
      var stub = $('#topic-select').val();
      var url = '/blog/' + args[2] + '/' + stub;
      window.location.href = url;
    });
  }

  $.fn.blogFeatureArticle = function() {
    var nid = $('.view-blog-main .featured-post article').attr('data-history-node-id');
    $('.view-blog-main-rows .views-row').each(function() {
      var tid = $(this).find('article').attr('data-history-node-id');
      if (tid == nid) {
        $(this).remove();
      }
    });
  }


  $.fn.eventFormat = function() {
    $('#lw .lwn span.lwn0').each(function() {
      var theDate = ($(this).text().trim().split(' '));
      $(this).html('<div class="month">' + theDate[0] + '</div><div class="day">' + theDate[1].replace(",","") + '</div>');
    });
    $('#lw li.lwe').each(function() {
      var imgSrc = $(this).find('img').attr('src');
      var itemLink = $(this).find('a').attr('href');
      $(this).attr('style','background-image: url("' + imgSrc + '")');
      $(this).click(function() {
        window.location.href = itemLink;
      });
    });
  }

  $.fn.secondaryNav = function() {
    $('.region-navigation-collapsible nav ul.nav a.dropdown-toggle').click(function() {
      if ($(this).attr('aria-expanded') == 'true') {
        $('header#navbar').removeClass('submenu-open');
      } else {
        $('header#navbar').addClass('submenu-open');
      }
    });
    $('.region-secondary-navigation').each(function() {
      var toggleButton = '<span class="subnav-toggle"></span>';
      $(this).children('.block').prepend(toggleButton);
    });
    $('.secondary-navigation .subnav-toggle').click(function() {
      var secondaryHeaderHeight = $('.secondary-navigation').outerHeight();
      if ($('.secondary-navigation').hasClass('expanded')) {
        $(this).removeClass('open');
        $('.secondary-navigation').removeClass('expanded');
        $('.secondary-navigation').attr('style', 'height: ' + secondaryHeaderHeight + 'px;');
      } else {
        $(this).addClass('open');
        $('.secondary-navigation').addClass('expanded');
        $('.secondary-navigation').removeAttr('style');
      }
    });
    $('.secondary-navigation ul.menu.nav>li>a').click(function() {
      if ($('.secondary-navigation').hasClass('expanded')) {
        $('.secondary-navigation .subnav-toggle').removeClass('open');
        $('.secondary-navigation').removeClass('expanded');
        $('.secondary-navigation').attr('style', 'height: ' + secondaryHeaderHeight + 'px;');
      }
    });
  }
  $.fn.jumplink = function() {
    var viewportWidth = $(window).width();
    var alertHeight =  $('.region-alert').height();
    if (viewportWidth < 768 && $('body').hasClass('no-menu')) {
      var headerHeight = $('.secondary-navigation').height() + 16;
    }
    if (viewportWidth < 768 && alertHeight > 0) {
      var headerHeight = $('.navbar-header').height();
    } else if (alertHeight > 0) {
      var headerHeight = $('header.navbar').height();
    } else {
      var headerHeight = $('header.navbar').height();
    }
    if (viewportWidth < 768 && $('.secondary-navigation').height() > 0) {
      var headerHeight = ($('.navbar-header').height() + $('.secondary-navigation').height());
    }

    $('a[href*="#"]:not([href="#"],[href*="#collapse-"],[href*="#carousel-"])').click(function() {
      var target = $(this.hash);
      $('html,body').stop().animate({scrollTop: target.offset().top -headerHeight}, 'slow');
    });

    var hash= window.location.hash;
    if ( hash == '' || hash == '#' || hash == undefined ) return false;
    var target = $(hash);
    target = target.length ? target : $('[name=' + hash.slice(1) +']');
    if (target.length) {
      $('html,body').stop().animate({scrollTop: target.offset().top -headerHeight}, 'slow');
    }
  }

  $.fn.menuScrollTop = function() {
    $('.navbar-header .navbar-toggle').addClass('collapsed');
    $('.navbar-header .navbar-toggle.collapsed').click(function() {
      $("html, body").animate({ scrollTop: 0 }, "fast");
    });
  }

  $.fn.blogTopicBreadcrumbFix = function() {
    $('.breadcrumb>li>a').each(function() {
      if ($(this).attr('href') == '/blog/topic') {
        $(this).parent('li').remove();
      }
    });
    var viewTitle = $('h1.page-header').text();
    if (viewTitle.startsWith("Blog Topic:")) {
      var newTitle = viewTitle.replace('Blog Topic:','Topic:');
      $('.breadcrumb>li:last-child').text(newTitle);
    }
  }

  $.fn.populateSearch = function() {
    var getUrlParameter = function getUrlParameter(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
        }
      }
    };

    var searchTerms = getUrlParameter('q');

    $('.content .form-search').attr('value', searchTerms);

    $('.gsc-results-wrapper-nooverlay').prepend('<h2>Search Results</h2>')

  }

 $(function (){
   $("iframe").each(function (){
     var iframe = $(this);

     //remove the width HTML attribute
     iframe.removeAttr("width");
     iframe.removeAttr("frameborder");
     //set a CSS width attribute
     iframe.css("width","100%");
     if ((iframe.attr("title") == undefined) || (iframe.attr("title") == "")) {

       var url = iframe.prop("src");
       var hostname = $('<a>').prop('href', url).prop('hostname');
       var title ="";

       if (url.includes("statuspage.io")) {
         title = "System Status Announcements";
       } else if (url.includes("google.com/maps")) {
         title = "Google Map";
       } else if (url.includes("calendar.google.com")) {
         title = "Google Calendar";
       } else if (url.includes("youtube.com")) {
         title = "YouTube Video";
       } else if (url.includes("facebook.com")) {
         title = "Facebook";
       } else if (url.includes("twitter.com")) {
         title = "Twitter";
       } else if (url.includes("instagram.com")) {
         title = "Instagram";
       } else if (url.includes("issuu.com")) {
         title = "Issuu";
       } else if (url.includes("vimeo.com")) {
         title = "Vimeo Video";
       } else if (url.includes("ucsb.dserec.com")) {
         title = "Recreation";
       }

       iframe.attr("title",title);
     }
   });
 });

})(jQuery, Drupal);


//event listener: DOM ready
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}
