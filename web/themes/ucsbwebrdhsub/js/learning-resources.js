/**
 * @file
 * Overrride UI behaviors
 */


(function ($) {
    $(document).ready(function() {

        const tagBlocks = document.querySelectorAll('.learning-resource-tags');
        tagBlocks.forEach((tagBlock) => {

            const tags = tagBlock.querySelectorAll('a');
            tags.forEach((tag) => {
                let tagName = tag.innerText.trim();
                tag.href = "/learning-resources?field_learningresourcestags_target_id=" + encodeURIComponent(tagName);
            })
        })
        
    });

})(jQuery);
