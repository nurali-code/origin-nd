$(function () {
    var $basketAside = $('.basket-aside');
    var $header = $('.header-fixed');
    if (!$basketAside.length || window.innerWidth < 1200) { return; }

    function updateBasketTop() {
        var headerHeight = $header.outerHeight();
        $basketAside.find('.basket-nav').css('top', headerHeight + 16 + 'px');
    } updateBasketTop();
});