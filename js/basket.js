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
    // Кэшируем основные элементы
    const $basketSelectAll = $('#select-all');
    const $basketDalivery = $('.tab-toggler input[name="delivery"]');
    const $basketDaliveryVal = $('[data-basket-delivery]');
    const $basketSubmit = $('[data-basket-submit]');
    const $basketBtnAll = $('[data-basket-all]');
    const $basketItemsClear = $('[data-basket-clear]');
    const $basketBtnUnavailable = $('[data-basket-unavailable]');
    const $basketDeleted = $('[data-basket-deleted]');
    const $basketSelectedCount = $('.basket [data-basket-selected-count]');
    const $basketCount = $('.basket [data-basket-count]');
    const $basketUnavailableCount = $('[data-basket-unavailable-count]');
    const $basketTotal = $('.basket [data-basket-total]');
    const $basketItemsWrap = $('.basket-items');

    const $basketEmptyBlock = $(`
        <div class="basket-empty c-gray">
            <svg class="ic basket-empty__icon"><use href="img/ic.svg#cart"></use></svg>
            <p class="basket-empty__descr">Ваша корзина пуста</p>
            <a href="./main.html" class="btn btn-primary">Вернуться к покупкам</a>
        </div>
    `);

    // ---------- Вспомогательные функции ----------
    function getBasketItems() {
        return $('.basket-table tr').not('.basket--unavailable');
    }

    function getCheckedItems() {
        return getBasketItems().find('input[type="checkbox"]:checked');
    }

    function countWord(amount) {
        amount = Math.abs(amount) % 100;
        const n = amount % 10;
        if (amount > 10 && amount < 20) return `${amount} товаров`;
        if (n > 1 && n < 5) return `${amount} товара`;
        if (n === 1) return `${amount} товар`;
        return `${amount} товаров`;
    }

    function updateSubmitState(enabled) {
        $basketSubmit
            .toggleClass('btn-primary', enabled)
            .toggleClass('btn-disabled', !enabled);
    }

    function totalCounter() {
        const $basketItems = getBasketItems();
        const $basketUnavailable = $('.basket--unavailable');

        // Количество
        $basketSelectedCount.text(countWord(getCheckedItems().length));
        $basketUnavailableCount.text($basketUnavailable.length);
        $basketCount.text(countWord($('.basket-table tr').length));

        // Доступность кнопки "показать недоступные"
        $basketBtnUnavailable.prop('disabled', !$basketUnavailable.length);

        // Пустая корзина
        if ($basketItems.length > 0) {
            $basketSelectAll.prop('disabled', false);
            $basketEmptyBlock.remove();
        } else {
            $basketSelectAll.prop({ checked: false, disabled: true });
            $basketUnavailable.length === 0
                ? $basketItemsWrap.before($basketEmptyBlock)
                : $basketEmptyBlock.remove();
        }

        // Кнопка "оформить"
        updateSubmitState(getCheckedItems().length > 0);

        // Подсчёт суммы
        let total = 0;
        getCheckedItems().each(function () {
            const $row = $(this).closest('tr');
            const amount = parseFloat($row.find('.amount-input').val()) || 0;
            const price = parseFloat(
                $row.find('.amount-input').parent().data('price-val')
                    .toString().replace(' ₽', '').replace(',', '.')
            ) || 0;
            total += amount * price;
        });
        $basketDalivery.filter(':checked').val() == 'Курьером' ? total+= 1000 : false;
        $basketTotal.text(total.toFixed(2) + ' ₽');
    }

    // ---------- Слушатели ----------
    $basketDalivery.on('change', function () {
        const isPickup = $(this).val() === 'Самовывоз';
        $basketDaliveryVal.html(isPickup
            ? 'Бесплатно'
            : `От 1000 ₽
                <div class="info">
                    <svg class="ic ic-md"><use href="img/ic.svg#info"></use></svg>
                    <div class="info__text">
                        Стоимость и срок доставки уточнит менеджер при подтверждении заказа
                    </div>
                </div>`
        );
        totalCounter();
    });

    $basketBtnUnavailable.on('click', () => getBasketItems().hide());
    $basketBtnAll.on('click', () => $('.basket-table tr').show());
    $basketItemsClear.on('click', () => {
        $('.basket-table tr, .basket-deleted').remove();
        totalCounter();
    });

    $('.basket-items').on('change', '.amount-input', totalCounter);

    $('[data-basket-remove]').on('click', function () {
        const $tr = $(this).closest('tr');
        const productTitle = $tr.find('.basket-item__heading a').text().trim();
        const $clone = $tr.clone(true, true);

        $tr.remove();
        const deletedBlock = $(`
            <div class="basket-deleted">
                <p class="basket-deleted__text">
                    <span class="c-gray">${productTitle}</span> удалён из корзины.
                </p>
                <button class="basket-btn c-danger basket-restore">Восстановить</button>
                <button class="basket-deleted__dell">
                    <svg class="ic ic-md"><use href="img/ic.svg#close"></use></svg>
                </button>
            </div>
        `);

        $basketDeleted.append(deletedBlock);
        totalCounter();

        deletedBlock.on('click', '.basket-restore', function () {
            $('table tbody').prepend($clone);
            deletedBlock.remove();
            totalCounter();
        });

        deletedBlock.on('click', '.basket-deleted__dell', function () {
            deletedBlock.remove();
            totalCounter();
        });
    });

    $basketSelectAll.on('change', function () {
        $('.basket-item input[type="checkbox"]').prop('checked', this.checked);
        totalCounter();
    });

    $('.basket-table').on('change', 'input[type="checkbox"]', function () {
        const $allCheckboxes = getBasketItems().find('input[type="checkbox"]');
        $basketSelectAll.prop('checked', $allCheckboxes.length === $allCheckboxes.filter(':checked').length);
        totalCounter();
    });

    // Первичный подсчёт
    totalCounter();
});
