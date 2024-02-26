/**
 * @file
 * Overrride UI behaviors
 */

(function ($) {
    $(document).ready(function() {

        // Make link on images open on a new page
        const dlsMediaThumbnails = document.querySelectorAll('.dls-media-thumbnail');
        dlsMediaThumbnails.forEach((thumbnail) => {
            const anchor = thumbnail.querySelector('a');

            if(anchor){
                anchor.setAttribute('target', '_blank');
                anchor.setAttribute('rel', 'noopener noreferrer');
            }


          });

        //   Render correct tag links
        const tagBlocks = document.querySelectorAll('.dls-item-tags');
        tagBlocks.forEach((tagBlock) => {

            const tags = tagBlock.querySelectorAll('a');
            tags.forEach((tag) => {
                let tagName = tag.innerText;
                tag.href = "/data-literacy-series/search-view?dls_tags_advanced_id=" + tagName
            })
        })


    });

})(jQuery);