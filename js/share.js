$(document).ready(function () {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    $('.share-vk').attr('href', `https://vk.com/share.php?url=${pageUrl}`);
    $('.share-ok').attr('href', `https://connect.ok.ru/offer?url=${pageUrl}&title=${pageTitle}`);
    $('.share-tg').attr('href', `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`);
    $('.share-wa').attr('href', `https://wa.me/?text=${pageTitle}%20${pageUrl}`);

    $(document).on('click', '[data-copy]', function () {
        navigator.clipboard.writeText(pageUrl).then(() => {
            alert('Сылка скопирована');
        });
    });

    $(document).on('click', '.share-btn', function () {
        $('.share').addClass('active')
        $('body').addClass('overflow')
    });

    $(document).click(function (e) {
        if (!$(e.target).closest('.share-btn').length) {
            $('.share').removeClass('active')
            $('body').removeClass('overflow')
        }
    });

});