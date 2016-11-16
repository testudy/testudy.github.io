// misc junk
$(function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var doc = $(document);

    // scrolling links
    var added;
    doc.scroll(function(e) {
        if (doc.scrollTop() > 5) {
            if (added) return;
            added = true;
            $('body').addClass('scroll');
        } else {
            $('body').removeClass('scroll');
            added = false;
        }
    })
});

$(function () {
    if ($('#menu').length) {
        return;
    }
    
    var $content = $('#content');

    function random() {
        return '_menu' + (Math.random() * 10000 >> 0);
    }

    function menu() {
        var result = [];

        result.push('<ul id="menu">');

        $content.find('h2').each(function (el) {
            var $this = $(this),
                items = [],
                id = random();

            $this.attr('id', id);

            items.push('<li>');
            items.push('<a href="#' + id + '">' + $this.text() + '</a>');
            items.push('<ul>');
            $this.nextUntil('h2', 'h3').each(function (el) {
                var $this = $(this),
                    id = random();

                $this.attr('id', id);
                items.push('<li><a href="#' + id + '">' + $this.text() + '</a></li>');
            });
            items.push('</ul>');
            items.push('</li>');

            result.push.apply(result, items);
        });

        result.push('</ul>');

        return result.join('');
    }

    $content.append(menu());

    $content.on('click', '#menu a', function () {
        $(window).scrollTop($($(this).attr('href')).offset().top);
        return false;
    });
});

// active menu junk
$(function() {
    var prev;
    var n = 0;

    var headings = $('h3').map(function(i, el) {
        return {
            top: $(el).offset().top,
            id: el.id
        }
    });

    function closest() {
        var h;
        var top = $(window).scrollTop();
        var i = headings.length;
        while (i--) {
            h = headings[i];
            if (top >= h.top) return h;
        }
    }

    $(document).scroll(function() {
        var h = closest();
        if (!h) return;

        if (prev) {
            prev.removeClass('active');
            prev.parent().parent().removeClass('active');
        }

        var a = $('a[href="#' + h.id + '"]');
        a.addClass('active');
        a.parent().parent().addClass('active');

        prev = a;
    })
});
