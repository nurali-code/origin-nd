$(document).ready(function () {
    var $basketAside = $('.basket-aside');
    var $header = $('.header-fixed');
    if (!$basketAside.length || window.innerWidth < 1200) { return; }

    function updateBasketTop() {
        var headerHeight = $header.outerHeight();
        $basketAside.find('.basket-nav').css('top', headerHeight + 16 + 'px');
    } updateBasketTop();
});


$(document).ready(function () {
    var $basketTotal = $('.basket [data-basket-total]');

    function countWord(amount) {
        amount = Math.abs(amount) % 100;
        let n = amount % 10;

        if (amount > 10 && amount < 20) { return amount + ' товаров'; }
        if (n > 1 && n < 5) { return amount + ' товара'; }
        if (n === 1) { return amount + ' товар'; }
        return amount + ' товаров';
    }


    function totalCounter() {
        var $basketCount = $('.basket [data-basket-count]');
        $($basketCount).text(countWord($('.basket-item').length))
        var $basketAmounts = $('.basket-items .amount-input');
        var total = 0;
        $basketAmounts.each(function () {
            var $inp = $(this);
            var amount = parseFloat($inp.val()) || 0;
            var price = parseFloat($inp.parent().data('price-val').toString().replace(' ₽', '').replace(',', '.')) || 0;
            total += amount * price;
        });
        $basketTotal.text(total.toFixed(2) + ' ₽');
    } totalCounter()

    $('.basket-items .amount-input').on('change', function () {
        totalCounter()
    });

    var removeBtn = $('[data-basket-remove]')

    removeBtn.on('click', function () {
        let $tr = $(this).closest('tr');       // строка товара
        let productTitle = $tr.find('.basket-item__heading a').text().trim();
        let $clone = $tr.clone(true, true);    // копия для восстановления
        let $basketDeleted = $('[data-basket-deleted]'); // внешний контейнер

        // убираем товар из таблицы
        $tr.remove();

        // создаём HTML карточки удалённого товара
        let deletedBlock = $(`
            <div class="basket-deleted">
                <p class="basket-deleted__text">
                    <span class="c-gray">${productTitle}</span> удалён из корзины.
                </p>
                <button class="basket-btn c-danger basket-restore">Восстановить</button>
                <button class="basket-deleted__dell"><svg class="ic ic-md">
                    <use href="img/ic.svg#close"></use>
                </svg></button>
            </div>
        `);

        // добавляем блок внутрь внешнего контейнера
        $basketDeleted.append(deletedBlock);

        totalCounter();

        // восстановить товар
        deletedBlock.find('.basket-restore').on('click', function () {
            // возвращаем товар обратно в таблицу (например, в начало tbody)
            $('table tbody').prepend($clone);
            deletedBlock.remove();
            totalCounter();
        });

        // удалить окончательно
        deletedBlock.find('.basket-deleted__dell').on('click', function () {
            deletedBlock.remove();
            totalCounter();
        });
    });



});