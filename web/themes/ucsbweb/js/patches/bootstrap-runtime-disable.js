/**
 * @file
 * Runtime protection for Bootstrap 3.4.1 CVE vulnerabilities
 * 
 * This script provides defense-in-depth by:
 * 1. Disabling vulnerable Bootstrap components at runtime
 * 2. Monitoring for dynamic injection of vulnerable attributes
 * 3. Logging security events for monitoring
 * 
 * This complements the CVE patches and provides additional protection
 * even if patches fail or new vulnerabilities are discovered.
 */

(function($, Drupal) {
  'use strict';

  Drupal.behaviors.bootstrapSecurityHardening = {
    attach: function(context, settings) {
      
      /**
       * Disable tooltip initialization globally.
       * Since this site doesn't use tooltips, we can safely disable them.
       */
      if (typeof $.fn.tooltip !== 'undefined') {
        var originalTooltip = $.fn.tooltip;
        
        $.fn.tooltip = function(options) {
          // Log if someone tries to initialize a tooltip
          if (options !== 'destroy' && options !== 'hide') {
            console.warn(
              '[Bootstrap Security] Tooltip initialization blocked for security.',
              'Element:', this,
              'This site does not use Bootstrap tooltips.'
            );
          }
          
          // Only allow destroy and hide methods through
          if (options === 'destroy' || options === 'hide') {
            return originalTooltip.apply(this, arguments);
          }
          
          return this; // Return chainable jQuery object
        };
        
        // Preserve the Constructor for compatibility
        $.fn.tooltip.Constructor = originalTooltip.Constructor;
        $.fn.tooltip.noConflict = originalTooltip.noConflict;
      }
      
      /**
       * Disable popover initialization globally.
       * Since this site doesn't use popovers, we can safely disable them.
       */
      if (typeof $.fn.popover !== 'undefined') {
        var originalPopover = $.fn.popover;
        
        $.fn.popover = function(options) {
          // Log if someone tries to initialize a popover
          if (options !== 'destroy' && options !== 'hide') {
            console.warn(
              '[Bootstrap Security] Popover initialization blocked for security.',
              'Element:', this,
              'This site does not use Bootstrap popovers.'
            );
          }
          
          // Only allow destroy and hide methods through
          if (options === 'destroy' || options === 'hide') {
            return originalPopover.apply(this, arguments);
          }
          
          return this; // Return chainable jQuery object
        };
        
        // Preserve the Constructor for compatibility
        $.fn.popover.Constructor = originalPopover.Constructor;
        $.fn.popover.noConflict = originalPopover.noConflict;
      }
      
      /**
       * Monitor for dynamic addition of vulnerable data attributes.
       * This catches attempts to inject vulnerable patterns at runtime.
       */
      if (window.MutationObserver) {
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            
            // Check added nodes
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                  checkElementSecurity(node);
                }
              });
            }
            
            // Check attribute changes
            if (mutation.type === 'attributes') {
              checkElementSecurity(mutation.target);
            }
          });
        });
        
        /**
         * Check an element for vulnerable attributes and remove them.
         */
        function checkElementSecurity(element) {
          // CVE-2025-1647: Check for tooltip/popover with data-toggle
          if (element.hasAttribute && element.hasAttribute('data-toggle')) {
            var toggleValue = element.getAttribute('data-toggle');
            
            if (toggleValue === 'tooltip' || toggleValue === 'popover') {
              console.error(
                '[Bootstrap Security] Blocked ' + toggleValue + ' with data-toggle attribute.',
                'Element:', element,
                'CVE: CVE-2025-1647'
              );
              
              // Remove the dangerous attribute
              element.removeAttribute('data-toggle');
              
              // Also remove related attributes
              element.removeAttribute('data-content');
              element.removeAttribute('data-title');
              element.removeAttribute('data-template');
              element.removeAttribute('data-html');
            }
          }
          
          // CVE-2024-6485: Check for button state data attributes
          var buttonStateAttrs = [
            'data-loading-text',
            'data-complete-text',
            'data-reset-text'
          ];
          
          buttonStateAttrs.forEach(function(attr) {
            if (element.hasAttribute && element.hasAttribute(attr)) {
              var attrValue = element.getAttribute(attr);
              
              // Check if value contains HTML tags or script content
              if (/<[^>]*>/i.test(attrValue) || /javascript:/i.test(attrValue)) {
                console.error(
                  '[Bootstrap Security] Blocked button with dangerous ' + attr + ' attribute.',
                  'Element:', element,
                  'Value:', attrValue,
                  'CVE: CVE-2024-6485'
                );
                
                // Sanitize by removing HTML
                var sanitized = attrValue.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '');
                element.setAttribute(attr, sanitized);
              }
            }
          });
          
          // Check carousel data attributes for XSS patterns
          var carouselAttrs = [
            'data-slide',
            'data-slide-to'
          ];
          
          carouselAttrs.forEach(function(attr) {
            if (element.hasAttribute && element.hasAttribute(attr)) {
              var attrValue = element.getAttribute(attr);
              
              // data-slide should only be 'prev' or 'next'
              if (attr === 'data-slide' && attrValue !== 'prev' && attrValue !== 'next') {
                console.error(
                  '[Bootstrap Security] Invalid data-slide value detected.',
                  'Element:', element,
                  'Value:', attrValue
                );
                element.removeAttribute(attr);
              }
              
              // data-slide-to should only be numeric
              if (attr === 'data-slide-to' && !/^\d+$/.test(attrValue)) {
                console.error(
                  '[Bootstrap Security] Invalid data-slide-to value detected.',
                  'Element:', element,
                  'Value:', attrValue
                );
                element.removeAttribute(attr);
              }
            }
          });
        }
        
        // Start observing the document
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: [
            'data-toggle',
            'data-content',
            'data-title',
            'data-template',
            'data-loading-text',
            'data-complete-text',
            'data-reset-text',
            'data-slide',
            'data-slide-to'
          ]
        });
        
        console.info('[Bootstrap Security] Runtime monitoring active for CVE-2025-1647 and CVE-2024-6485');
      }
      
      // Scan existing elements on page load
      $(context).find('[data-toggle="tooltip"], [data-toggle="popover"]').each(function() {
        console.warn(
          '[Bootstrap Security] Found existing tooltip/popover element.',
          'Element:', this,
          'These components are disabled for security.'
        );
      });
      
      console.info('[Bootstrap Security] Runtime hardening initialized');
    }
  };

})(jQuery, Drupal);
