// Новый каталог в мобильном меню (без конфликтов со старыми классами)
$(document).ready(function () {
    function setNdcPos($ndc, pos) {
        if (!$ndc || !$ndc.length) return;
        if (!pos || pos === 'menu') {
            $ndc.removeAttr('data-ndc-pos');
            return;
        }
        $ndc.attr('data-ndc-pos', pos);
    }

    $(document).on('click', '[data-ndc-open]', function (e) {
        e.preventDefault();
        const $ndc = $(this).closest('[data-ndc]');
        setNdcPos($ndc, 'catalog');
    });

    $(document).on('click', '[data-ndc-back]', function (e) {
        e.preventDefault();
        const $ndc = $(this).closest('[data-ndc]');
        const to = $(this).attr('data-ndc-back');
        setNdcPos($ndc, to);
    });

    $(document).on('click', '[data-ndc-cat-btn]', function (e) {
        e.preventDefault();
        const $btn = $(this);
        const $ndc = $btn.closest('[data-ndc]');
        const $item = $btn.closest('.ndc-cat__item');
        const $srcList = $item.find('.ndc-cat__sub').first();
        const $targetList = $ndc.find('[data-ndc-sublist]').first();
        const $subtitle = $ndc.find('[data-ndc-subtitle]').first();

        const title = $btn.clone().children().remove().end().text().trim();
        $subtitle.text(title);
        const $firstLink = $srcList.find('a').first();
        const hrefForTitle = ($firstLink.attr('href')) || '#';
        $subtitle.attr('href', hrefForTitle);

        $targetList.empty();
        $srcList.children('li').each(function () {
            const $li = $(this);
            const $a = $li.find('a').first();
            if (!$a.length) return;
            const href = $a.attr('href') || '#';
            const text = $a.text();
            $targetList.append(`<li class="ndc-sub__item"><a href="${href}" class="ndc-sub__link">${text}</a></li>`);
        });

        setNdcPos($ndc, 'sub');
    });
});