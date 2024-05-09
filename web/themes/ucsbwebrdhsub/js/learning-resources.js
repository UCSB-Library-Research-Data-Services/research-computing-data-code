/**
 * @file
 * Overrride UI behaviors
 */

(function ($) {
    $(document).ready(function() {

        //   Render correct tag links
        const tagBlocks = document.querySelectorAll('.dls-item-tags');
        tagBlocks.forEach((tagBlock) => {

            const tags = tagBlock.querySelectorAll('a');
            tags.forEach((tag) => {
                let tagName = tag.innerText;
                tag.href = "/learning-resources?field_learningresourcestags_target_id=" + tagName
            })
        })
        
    });

})(jQuery);