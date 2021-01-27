//Change Year
const date = new Date();
document.querySelector('.year').innerHTML = date.getFullYear();

// Navbar Scroll transparent
$(window).scroll(function () {
  if ($(window).scrollTop() >= 50) {
      $('#mainNav').css('background-color', 'rgba(17, 62, 111, 0.6)');
  } else {
      $('#mainNav').css('background-color', 'transparent');
  }
});
