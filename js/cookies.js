// Окошко cookies
if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => { $('.cookies').addClass('active') }, 2500);
}

$('.cookies button').on('click', function () {
    $('.cookies').removeClass('active');
    $(this).hasClass('btn-primary') ? localStorage.setItem('cookiesAccepted', 'true') : false;
});