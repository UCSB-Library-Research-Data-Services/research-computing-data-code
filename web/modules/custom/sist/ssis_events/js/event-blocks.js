document.addEventListener('DOMContentLoaded', function () {
    var eventBlocks = document.getElementsByClassName('event-blocks-article');
    var width = eventBlocks[0].offsetWidth;

    for (let i = 0; i < eventBlocks.length; i++) {
        eventBlocks[i].style.height = width + 'px';
    }
}, false);