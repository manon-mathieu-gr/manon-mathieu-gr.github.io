document.addEventListener("DOMContentLoaded", function () {
    // Initialize Justified Gallery
    $(".gallery").justifiedGallery({
        rowHeight: 180,  // Adjust to the height of each image in the gallery
        lastRow: 'center',
        margins: 10,     // Spacing between images
        captions: false, // Disable captions if not needed
        random: true
    });

  // Initialize lightGallery for the gallery items

    // Initialize lightGallery for the grid
    document.querySelectorAll('.gallery').forEach(function (el) {
        lightGallery(el, {
            selector: 'a',
            plugins: [lgZoom, lgThumbnail],
            speed: 500,
            download: false,
            zoom: false,
            hideBarsDelay: 2000,
            showBarsAfter: 2000,
            mobileSettings: {
            controls: true,
            hideScrollbar: true
            }
        });
    });
});