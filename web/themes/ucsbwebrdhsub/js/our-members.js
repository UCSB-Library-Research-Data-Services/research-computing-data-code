/**
 * @file
 * Redirect tag clicks to custom URLs for Our Members page.
 */

(function ($) {
    $(document).ready(function() {
        console.log("check")
        // Mapping of tag names to their respective target URLs.
        const tagMapping = {
            "Data Curation": "/rdc/our-members?field_member_tag_target_id=184",
            "Data Management": "/rdc/our-members?field_member_tag_target_id=183",
            "Data Policy": "/rdc/our-members?field_member_tag_target_id=186",
            "Data Science Curriculum Development": "/rdc/our-members?field_member_tag_target_id=197",
            "Data Science Education": "/rdc/our-members?field_member_tag_target_id=192",
            "Environmental Data Science": "/rdc/our-members?field_member_tag_target_id=207",
            "Extramural Funding": "/rdc/our-members?field_member_tag_target_id=203",
            "Proposal Development": "/rdc/our-members?field_member_tag_target_id=202",
            "Reproducibility": "/rdc/our-members?field_member_tag_target_id=208",
            "Research IT": "/rdc/our-members?field_member_tag_target_id=187",
            "Research Team Support": "/rdc/our-members?field_member_tag_target_id=205",
            "Scientific Computing": "/rdc/our-members?field_member_tag_target_id=200"
        };        

        // Find tags within the specified block or section.
        const tagBlocks = $('.views-field-field-member-tag'); 

        tagBlocks.find('a').each(function() {
            let tagName = $(this).text();
            let targetUrl = tagMapping[tagName];

            // If a mapping exists, update the href attribute.
            if (targetUrl) {
                $(this).attr('href', targetUrl);
            }
        });
    });
})(jQuery);
