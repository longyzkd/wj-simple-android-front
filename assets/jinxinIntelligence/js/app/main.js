// main.js
jQuery(function( $ ) {
    // Banner
    (function() {
        var mySwiper = new Swiper('#swiper-banner-container', {
            pagination: '#swiper-banner-pagination',
            paginationClickable: true,
            autoplay : 2000
        });
        mySwiper.startAutoplay()
    })();
});

