/**minicalendar
 * @file
 * Overrride UI behaviors
 */

(function ($) {
    $(document).ready(function() {
        
        const infoCircles = document.querySelectorAll(".fa-info-circle");
        infoCircles.forEach((infoCircle) => {
            infoCircle.addEventListener("click", (e => {
                let card = e.target.closest(".card");
                if (card) {
                    card.classList.toggle(".flip-card");
                }
            })
        )});
    });

})(jQuery);