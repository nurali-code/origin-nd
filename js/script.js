$(document).ready(function () {
    $(window).on('scroll', function () {
        const headerHeight = $('header').outerHeight();
        const scrollTop = $(this).scrollTop();
        const $headerFixed = $('.header-fixed');
        var $scrollbarWidth = window.innerWidth - $(document).width();
        $($headerFixed).css('padding-right', $scrollbarWidth);

        if (scrollTop > headerHeight) {
            $headerFixed.addClass('active');
        }
        else {
            $headerFixed.removeClass('active');
        }
    });
});

$(document).ready(function () {
    $('.info').on('mouseenter', function () {
        const $info = $(this).addClass('--show');
        const $tooltip = $info.find('.info__text');

        // Сброс позиции
        $tooltip.css({
            left: '',
            right: '',
            top: '100%',
            bottom: '',
            position: 'absolute'
        });

        // Считаем координаты
        const rect = $tooltip[0].getBoundingClientRect();
        const winW = $(window).width();
        const winH = $(window).height();

        let offsetLeft = 0;
        let offsetTop = 0;

        const overflowX = rect.right - winW;
        const overflowY = rect.bottom - winH;

        if (overflowX > 0) {
            offsetLeft = -overflowX - 20; // 10px запас от края
        }

        
        if (overflowY > 0) {
            offsetTop = -overflowY - $('header .navbar').outerHeight();;
        }

        // Получаем текущее значение left и top в числах
        const currentLeft = parseFloat($tooltip.css('left')) || 0;
        const currentTop = parseFloat($tooltip.css('top')) || 0;

        // Смещаем
        $tooltip.css({
            left: currentLeft + offsetLeft + 'px',
            top: currentTop + offsetTop + 'px'
        });
    });

    $('.info').on('mouseleave', function () {
        $(this).removeClass('--show');
    });
});


$(document).on('click', '[data-toggle]', function (e) {
    e.preventDefault();
    const $this = $(this);
    if ($this.data('toggle') == 'next') {
        $this.toggleClass('active').next().slideToggle(300);
    }
});

$(document).on('click', '[data-hiding]', function (e) {
    e.preventDefault();
    $(this).hide()
    $(`[data-hiding-item="${$(this).data('hiding')}"]`).addClass('--show')
});

// custom select 
$(document).ready(function () {
    $('select').each(function () {
        const $this = $(this).hide().wrap('<div class="select-wrap"></div>');
        $this.parent().addClass($this.attr('class'));

        const defaultOption = $this.find('option').eq(0);
        const defaultText = defaultOption.text();

        const $customSelect = $('<div class="select"></div>')
            .addClass($this.attr('class'))
            .insertAfter($this)
            .html(`<span>${defaultText}</span> <svg class="ic ic-lg"><use href="img/ic.svg#arrow-down"></use></svg>`);

        const $optionlist = $('<ul class="select-options"></ul>').insertAfter($customSelect);

        $this.children('option').each(function () {
            $('<li />', {
                text: $(this).text(),
                rel: $(this).val(),
                class: $(this).attr('hidden'),
                selected: $(this).attr('selected')
            }).appendTo($optionlist);
        });

        $customSelect.click(function (e) {
            e.stopPropagation();
            $('.select-wrap').css('z-index', '');
            $('.select.active').not(this).removeClass('active').next('.select-options').slideUp(300);
            $(this).toggleClass('active').next('.select-options').slideToggle(300);
        });

        $optionlist.on('click', 'li', function (e) {
            e.stopPropagation();
            $customSelect.find('span').html($(this).text());
            $this.val($(this).attr('rel')).trigger('change');
            $customSelect.removeClass('active');
            $optionlist.slideUp(300);
        });

        $(document).click(function (e) {
            if (!$(e.target).closest($optionlist).length) {
                $customSelect.removeClass('active');
                $optionlist.slideUp(300);
            }
        });

        $this.on('reset-happened', function () {
            const defaultText = $this.find('option').eq(0).text();
            $this.val('');
            $customSelect.find('span').html(defaultText);
        });
    });

    $('form').on('reset', function () {
        const $thisform = $(this)
        setTimeout(function () {
            $thisform.find('select').each(function () {
                $(this).trigger('reset-happened');
            });
        }, 0);
    });
});

// Вывод имени файла и расширения в .inp-file__label с добавлением иконки закрытия
$(document).on('change', '.inp-file input[type="file"]', function () {
    const file = this.files && this.files[0];
    const $label = $(this).siblings('.inp-file__label');
    const $clearIcon = $('<svg class="ic inp-file__clear"><use href="img/ic.svg#close"></use></svg>');

    if (file) {
        $label.children('span').text(file.name);
        $label.after($clearIcon);
    } else { $label.text(`Прикрепить файл`); }

    $clearIcon.on('click', (e) => {
        e.stopPropagation();
        $(this).val('');
        $label.children('span').text(`Прикрепить файл`);
        $clearIcon.remove();
    });
});

function compensateForScrollbar(inst) {
    var scrollbarWidth = window.innerWidth - $(document).width();
    if (inst == 0) { $('body').css('margin-right', ''); }
    else if (scrollbarWidth > 0) { $('body').css('margin-right', scrollbarWidth + 'px'); }
}

$(document).ready(function () {
    const $menuContent = $('[data-menu-content]');

    $(document).on('click', '[data-menu-btn]', function () {
        $(this).addClass('active');
        compensateForScrollbar();
        $('body').addClass('overflow')
        $menuContent.addClass('active');
    });

    $(document).on('click', '[data-menu-close]', function () {
        $menuContent.removeClass('active');
        $('[data-menu-btn]').removeClass('active');
        compensateForScrollbar(0)
        $('body').removeClass('overflow')
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.menu, [data-menu-btn], .modal').length && $('.menu').hasClass('active')) {
            $('[data-menu-btn]').removeClass('active');
            $menuContent.removeClass('active');
            compensateForScrollbar(0)
            $('body').removeClass('overflow')
        }
    });
});

$(document).ready(function () {
    function showModal(id) {
        hideModals()
        compensateForScrollbar()
        $(id).addClass('active');
        $('body').attr('data-modal-show', true)
    }

    function hideModals() {
        if ($('.modal.active').length) {
            $('.modal.active, a[href*="#modal-"]').removeClass('active');
            $('body').removeAttr('data-modal-show');
            if (!$('body').hasClass('overflow')) {
                compensateForScrollbar(0);
            }
        }
    };

    $('a[href*="#modal-"]').on('click', function (e) {
        $(this).addClass('active')
        e.preventDefault()
        showModal($(this).attr("href"));

    });

    $('.modal-close, [data-modal-close]').on('click', () => { hideModals(); });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.modal-content, a[href*="#modal-"]').length && $('body').attr('data-modal-show')) {
            hideModals();
        }
    });
});

$(document).on('click input', '.amount-dec, .amount-inc, .amount-input', function (e) {
    e.preventDefault();
    const $amount = $(this).closest('.amount');
    const $input = $amount.find('.amount-input');
    const hasDataAttributes = $amount.is('[data-change][data-price-val]');
    let currentValue = parseInt($input.val(), 10) || 0;

    if ($(this).hasClass('amount-inc')) currentValue++;
    if ($(this).hasClass('amount-dec') && currentValue > 0) currentValue--;
    if ($(this).is('.amount-input') && currentValue < 0) currentValue = 0;

    $input.val(currentValue);

    if (hasDataAttributes) {
        const $priceElement = $(`[data-price="${$amount.data('change')}"]`);
        const pricePerUnit = parseFloat($amount.data('price-val').replace(' ₽', ''));
        const priceTotal = (currentValue * pricePerUnit).toFixed(2);
        if (priceTotal > pricePerUnit) {
            $priceElement.text(priceTotal + ' ₽');
        } else {
            $priceElement.text(pricePerUnit.toFixed(2) + ' ₽');
        }
    }

    if ($amount.is('[data-card-amount]') && currentValue === 0) {
        const $cardAction = $amount.closest('[data-card-catcher]');
        $cardAction.find('[data-card-add]').show();
        $amount.removeClass('active');
    }
});

$(document).ready(function () {
    $(document).on('mouseenter', '[data-catalog-hover] .catalog-list__btn', function () {
        if (window.innerWidth >= 992) {
            $(this).parent().addClass('active').siblings().removeClass('active');
        }
    });
    $(document).on('click', '[data-catalog-hover] .catalog-list__btn', function () {
        $(this).parent().addClass('active').siblings().removeClass('active');
    });

    $(document).on('click', '.catalog-underlist__item--back', function () {
        $(this).parents('.catalog-list__item').removeClass('active');
    });
})

// Слайдеры
$(document).ready(function () {
    const slickArrows = {
        prevArrow: '<button class="slick-prev"><svg class="ic"><use href="img/ic.svg#arrow-right"></use></svg></button>',
        nextArrow: '<button class="slick-next"><svg class="ic"><use href="img/ic.svg#arrow-right"></use></svg></button>',
    };

    $('.product-slider').slick({
        infinite: false,
        speed: 300,
        arrows: false,
        dots: false,
        swipeToSlide: true,
        slidesToShow: 1,
        asNavFor: '.product-nav',
        touchThreshold: 9,
        fade: true,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    fade: false,
                    infinite: true,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    fade: false,
                    dots: true,
                }
            }
        ]
    });

    $('.product-nav').slick({
        vertical: true,
        infinite: false,
        draggable: true,
        swipeToSlide: () => {
            $('.product-nav-item').lenght >= 4 ? ret = true : ret = false;
            return ret;
        },
        dots: false,
        focusOnSelect: true,
        verticalSwiping: true,
        prevArrow: '<button class="slick-next"><svg class="ic"><use href="img/ic.svg#arrow-up"></use></svg></button>',
        nextArrow: '<button class="slick-prev"><svg class="ic"><use href="img/ic.svg#arrow-down"></use></svg></button>',
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.product-slider',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    verticalSwiping: false,
                    // ...slickArrows,
                    slidesToShow: 4,
                    vertical: false,
                }
            },
            {
                breakpoint: 767,
                settings: "unslick"
            }
        ]
    });

    $('.hero-slider').slick({
        slidesToShow: 1,
        infinite: false,
        dots: true,
        arrows: false,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToScroll: 1,
    });

    $('.hero-features').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        ...slickArrows,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 767,
                settings: "unslick"

            },
        ]
    });

    $('.info-slider').slick({
        slidesToShow: 1,
        arrows: true,
        swipeToSlide: true,
        ...slickArrows,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    infinite: false,
                    arrows: false,
                    dots: true,
                }
            },
        ]
    });

    $('.card-slider').slick({
        infinite: false,
        slidesToShow: 5,
        arrows: true,
        ...slickArrows,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1400,
                settings: { slidesToShow: 4, }
            },
            {
                breakpoint: 991,
                settings: { slidesToShow: 3, }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2, arrows: false, }
            }
        ]
    });

    $('.card-slider--md').slick({
        infinite: false,
        slidesToShow: 6,
        arrows: true,
        ...slickArrows,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1400,
                settings: { slidesToShow: 5, }
            },
            {
                breakpoint: 991,
                settings: { slidesToShow: 4, }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2, }
            }
        ]
    });
})

$(document).ready(function () {
    const $defaultTab = $('[data-tab-active]');
    if ($defaultTab.length) {
        $defaultTab.each(function () {
            const $this = $(this);
            const thisId = $this.data('tab-active');
            const targetTab = $this.find(`[data-tab].${thisId}`).data('tab');
            const $targetContent = $(`[data-tab-content="${targetTab}"]`);
            $targetContent.addClass('active');
            if ($targetContent.hasClass('card-slider')) {
                $targetContent.slick('setPosition');
            }

            // Remove active state on mobile if data-tab-mob="none"
            if (window.innerWidth < 991.99 && $this.data('tabMob') === 'none') {
                $this.find(`[data-tab].${thisId}`).removeClass(thisId);
                $targetContent.removeClass('active');
            }
        });
    }

    $(document).on('click', '[data-tab]', function () {
        const $this = $(this);
        const activeClass = $this.parents('[data-tab-active]').data('tab-active');
        const targetTab = $this.data('tab');
        $this.addClass(activeClass).siblings().removeClass(activeClass);
        // Сначала ищем родителя с data-tab-parent, если нет — section
        const $parent = $this.closest('[data-tab-parent]').length
            ? $this.closest('[data-tab-parent]')
            : $this.parents('section');
        $parent.find('[data-tab-content]').removeClass('active');

        if (targetTab === 'all') {
            $this.parents('section').find('[data-tab-content]').addClass('active');
        } else {
            const $targetContent = $(`[data-tab-content="${targetTab}"]`);
            $targetContent.addClass('active');
            if ($targetContent.hasClass('card-slider')) {
                $targetContent.slick('setPosition');
            }
        }
    });
});

$(document).on('click', '[data-shop]', function (e) {
    e.preventDefault();
    const $this = $(this);
    $this.toggleClass('active');
    if ($this.hasClass('active')) {
        setTimeout(() => { alert('Добавили в корзину'); }, 1500);
    } else { alert('Убрали из корзины'); }
});

$(document).on('click', '[data-card-add]', function (e) {
    e.preventDefault();
    const $cardAction = $(this).closest('[data-card-catcher]');
    $(this).hide();
    $cardAction.find('[data-card-amount]').addClass('active').find('.amount-input').val(1);
});

$(document).ready(function () {
    $('input[type="tel"]').mask("+7-(999)-999-99-99", { placeholder: "+7-(___)-___-__-__" });
})

$(document).ready(function () {
    function setBodyPaddingForNavbar() {
        if (window.innerWidth < 992) {
            const navbarHeight = $('header .navbar').outerHeight();
            $('body').css('padding-bottom', navbarHeight);
        } else { $('body').css('padding-bottom', ''); }
    }

    setBodyPaddingForNavbar();
    $(window).on('resize', setBodyPaddingForNavbar);
});

function badgeCounter(badge, action) {
    $(`[data-badge="${badge}"]`).each(function () {
        let count = parseInt($(this).text(), 10) || 0;
        if (action === 'add') { count += 1; }
        else { count -= 1; }
        $(this).text(count);

        if (count === 0) { $(this).hide(); }
        else { $(this).show(); }
    });
}

$(document).on('click', '.product-fav', function (e) {
    e.preventDefault();
    const $btn = $(this);
    const $icon = $btn.find('use');
    if ($btn.attr('data-fav') === 'add') {
        $btn.attr('data-fav', 'remove');
        $icon.attr('href', 'img/ic.svg#fav-fill');
        badgeCounter('fav', 'add')
    } else {
        $btn.attr('data-fav', 'add');
        $icon.attr('href', 'img/ic.svg#fav');
        badgeCounter('fav', 'remove')
    }
});