// Initialize Swiper for the hero slider on the home page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page with the Swiper element
    const heroSwiper = document.querySelector('.heroSwiper');
    if (heroSwiper) {
      new Swiper('.heroSwiper', {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  });