// custom select 
$('select').each(function () {
    const $this = $(this).hide().wrap('<div class="select-wrap"></div>');
    const $wrapper = $this.parent();
    $wrapper.addClass($this.attr('class'));

    const $selectedOption = $this.find('option[selected]');
    const hasSelected = $selectedOption.length > 0;
    const defaultOption = hasSelected ? $selectedOption : $this.find('option').eq(0);
    const defaultText = defaultOption.text();
    const defaultClass = hasSelected ? '' : 'c-gray';
    const $customSelect = $('<div class="select"></div>')
        .addClass($this.attr('class'))
        .insertAfter($this)
        .html(`<span class="${defaultClass}">${defaultText}</span> <svg class="ic"><use href="#arrow-down"></use></svg>`);
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
        const $parent = $(this).parent();
        $('.select-wrap').css('z-index', '');
        $('.select.active').not(this).removeClass('active').next('.select-options').hide();
        $(this).toggleClass('active').next('.select-options').slideToggle(300);
    });
    $optionlist.on('click', 'li', function (e) {
        e.stopPropagation();
        $customSelect.find('span').html($(this).text());
        $customSelect.removeClass('active');
        $this.val($(this).attr('rel')).trigger('change');
        $optionlist.hide();
    });
    $(document).click(function () {
        $customSelect.removeClass('active');
        $optionlist.hide();
    });
});

// Вывод имени файла и расширения в .inp-file__label с добавлением иконки закрытия
$(document).on('change', '.inp-file input[type="file"]', function () {
    const file = this.files && this.files[0];
    const $label = $(this).siblings('.inp-file__label');
    const $clearIcon = $('<svg class="ic inp-file__clear"><use href="#close"></use></svg>');

    if (file) {
        const fileName = file.name;
        $label.children('span').text(fileName);
        $label.after($clearIcon);
    } else { $label.text(`Прикрепить файл`); }

    $clearIcon.on('click', (e) => {
        e.stopPropagation();
        $(this).val('');
        $label.children('span').text(`Прикрепить файл`);
        $clearIcon.remove();
    });
});


function showModal(id) {
    hideModals()
    compensateForScrollbar()
    $(id).addClass('active');
    $('body').addClass('overflow')
}

function hideModals() {
    $('.modal.active').removeClass('active');
    $('body').removeClass('overflow')
    compensateForScrollbar(0)
};

function compensateForScrollbar(inst) {
    var scrollbarWidth = window.innerWidth - $(document).width();
    if (inst == 0) { $('body').css('margin-right', ''); }
    else if (scrollbarWidth > 0) { $('body').css('margin-right', scrollbarWidth + 'px'); }
}

$(function () {
    $('a[href*="#modal-"]').on('click', function (e) {
        e.preventDefault()
        showModal($(this).attr("href"));
    });

    $('.modal-close, [data-modal-close]').on('click', () => { hideModals(); });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.modal-content, .btn, .btn-link, .mod-link').length && $('body').closest('.overflow').length) {
            hideModals();
        }
    });
});

$(document).on('click input', '.amaunt-subtract, .amaunt-add, .amaunt-input', function (e) {
    e.preventDefault();
    const $amaunt = $(this).closest('.amaunt');
    const $input = $amaunt.find('.amaunt-input');
    const hasDataAttributes = $amaunt.is('[data-change][data-price-val]');
    let currentValue = parseInt($input.val(), 10) || 0;
    
    if ($(this).hasClass('amaunt-add')) currentValue++;
    if ($(this).hasClass('amaunt-subtract') && currentValue > 0) currentValue--;
    if ($(this).is('.amaunt-input') && currentValue < 0) currentValue = 0;

    $input.val(currentValue);

    if (hasDataAttributes) {
        const $priceElement = $(`[data-price="${$amaunt.data('change')}"]`);
        const pricePerUnit = parseFloat($amaunt.data('price-val').replace(' ₽', ''));
        $priceElement.text((currentValue * pricePerUnit).toFixed(2) + ' ₽');
    }
    
    console.log($amaunt.data('card-amaunt'), currentValue);
    if ($amaunt.is('[data-card-amaunt]') && currentValue === 0) {
        
        const $cardAction = $amaunt.closest('[data-card-catcher]');
        $cardAction.find('[data-card-add]').show(); // Show the "add" button
        $amaunt.removeClass('active'); // Remove the "active" class from "amaunt"
    }
});


$('.card-slider').slick({
    infinite: false,
    slidesToShow: 5,
    arrows: true,
    // swipeToSlide: true,
    prevArrow: '<button type="button" class="slick-prev"><svg class="ic"><use href="#arrow-right"></use></svg></button>',
    nextArrow: '<button type="button" class="slick-next"><svg class="ic"><use href="#arrow-right"></use></svg></button>',
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1400,
            settings: { slidesToShow: 4, }
        },
        {
            breakpoint: 992,
            settings: { slidesToShow: 3, }
        },
        {
            breakpoint: 768,
            settings: { slidesToShow: 2, arrows: false, }
        }
    ]
});

$(document).on('click', '[data-card-add]', function (e) {
    e.preventDefault();
    const $cardAction = $(this).closest('[data-card-catcher]');
    $(this).hide(); 
    $cardAction.find('[data-card-amaunt]').addClass('active').find('.amaunt-input').val(1); 
});

function applySlickFilter() {
    const activeFilterId = $('button[data-slick-filter].active').data('slick-filter') || '*';
    $('.card-slider').slick('slickUnfilter');
    $('.card-slider').slick('slickFilter', '[data-slick-filter="' + activeFilterId + '"]');
}

$('button[data-slick-filter]').on('click', function () {
    $('button[data-slick-filter]').removeClass('active');
    $(this).addClass('active');
    applySlickFilter();
});

$('.card-slider').on('afterChange', function () { applySlickFilter(); });