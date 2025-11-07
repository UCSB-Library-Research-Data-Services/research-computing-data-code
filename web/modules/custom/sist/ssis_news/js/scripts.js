document.addEventListener('DOMContentLoaded', function () {
    // Get all images from the content and add the captions
    // SECURITY FIX: Use DOM methods instead of string concatenation to prevent XSS
    var images = document.querySelectorAll(".ssis-news .content img");
    
    images.forEach(function (img) {
        var imageCaption = img.getAttribute("alt");
        
        // Skip if no caption or empty
        if (!imageCaption || !imageCaption.trim()) {
            return;
        }
        
        var ImageFloat = img.style.cssFloat;
        var imgWidth = img.offsetWidth;
        
        // Create elements safely using DOM methods (prevents XSS)
        var figure = document.createElement('figure');
        figure.className = 'img-float-' + ImageFloat;
        figure.style.maxWidth = imgWidth + 'px';
        
        // Clone the image
        var imgClone = img.cloneNode(true);
        figure.appendChild(imgClone);
        
        // Create caption safely (textContent auto-escapes HTML)
        var figcaption = document.createElement('figcaption');
        figcaption.className = 'img-caption';
        
        var p = document.createElement('p');
        p.className = 'caption';
        p.textContent = imageCaption; // SECURITY: textContent prevents XSS
        
        figcaption.appendChild(p);
        figure.appendChild(figcaption);
        
        // Replace original image with figure
        img.parentNode.replaceChild(figure, img);
    });

}, false);
