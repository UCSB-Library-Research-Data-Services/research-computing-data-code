document.addEventListener('DOMContentLoaded', function () {
    // get the all images from the content and add the captions
    NodeList.prototype.forEach = Array.prototype.forEach;
    var images = document.querySelectorAll(".ssis-news .content img").forEach(function (img) {
        var ImageFloat = img.style.cssFloat,
            imageCaption = img.getAttribute("alt");
        var emptyCaption = imageCaption.length === 0 || !imageCaption.trim();

        if (imageCaption.length != 0) {
            var imgWidth = img.offsetWidth;

            var imageCaptionBlock = '<figcaption class="img-caption"><p class="caption">' + imageCaption + '</p></figcaption>'
            var imageFigureHTML = '<figure class="img-float-' + ImageFloat + '" style="max-width:' + imgWidth + 'px;">' + img.outerHTML + imageCaptionBlock + '</figure>';

            img.outerHTML = imageFigureHTML;
        }

    });

}, false);

