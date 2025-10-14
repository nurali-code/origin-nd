// Окошко cookies
if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => { $('.cookies').addClass('active') }, 2500);
}

$('.cookies-close').on('click', function () {
    $('.cookies').removeClass('active');
});

$('.cookies .btn-primary').on('click', function () {
    $('.cookies').removeClass('active');
    localStorage.setItem('cookiesAccepted', 'true');
});