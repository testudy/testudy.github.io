/**
 * iOS限制：
 * Canvas area exceeds the maximum limit (width * height > 16777216).
 **/

(function (global, document, location, containerSelector) {
    'use strict';

    var canvas = document.createElement('canvas'),
        container = document.querySelector(containerSelector),
        canvasHeight;

    if (container) {
        canvasHeight = container.scrollHeight;
    } else {
        container = document.body;
        canvasHeight = Math.max(container.scrollHeight, window.innerHeight);
    }

    // 如果只有一张图片，默认为图片
    function center() {
        var re = /\.(jpg|jpeg|png)$/,
            href = location.href,
            img = document.body.children[0];

        if (re.test(href) || (img && img.tagName === 'IMG')) {
            img.style.opacity = 0;
            global.scrollTo(0, 0);
            document.body.setAttribute('style', 'margin: 0; padding: 0; overflow-x: hidden; background: url(' + img.src + ') no-repeat 50% 0');
        }
    }

    function reset(canvasWidth) {
        var ctx = canvas.getContext('2d');

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (canvasWidth * canvasHeight > 16777216) {
            alert('Canvas area exceeds the maximum limit (width * height > 16777216).');
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = 'rgba(86, 254, 255, 1)';
        ctx.lineWidth = 1;

    }

    function vertical(canvasWidth, column, width, gutter) {
        gutter = gutter || 0;

        var ctx,
            i;

        ctx = canvas.getContext('2d');

        ctx.beginPath();

        // 左参考线
        if (width === gutter) {
            ctx.moveTo(-0.5, 0);
            ctx.lineTo(-0.5, canvasHeight);
        } else {
            ctx.moveTo(0.5, 0);
            ctx.lineTo(0.5, canvasHeight);
        }

        // 右参考线
        ctx.moveTo(canvasWidth - 0.5, 0);
        ctx.lineTo(canvasWidth - 0.5, canvasHeight);

        ctx.closePath();
        ctx.stroke();

        for (i = 0; i < column; i += 1) {
            if (!gutter && i % 2) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            } else {
                ctx.fillStyle = 'rgba(255, 0, 0, .15)';
            }
            if (width === gutter) {
                ctx.fillRect(i * (width + gutter), 0, width, canvasHeight);
            } else {
                ctx.fillRect(i * (width + gutter) + 1, 0, width, canvasHeight);
            }
        }

        ctx.fill();
    }

    function horizontal(canvasWidth, lineHeigth) {

        var ctx,
            i;

        ctx = canvas.getContext('2d');

        ctx.beginPath();

        for (i = 0; i <= canvasHeight; i += lineHeigth) {
            ctx.moveTo(0, i);
            ctx.lineTo(canvasWidth, i);
        }

        ctx.closePath();
        ctx.stroke();
    }

    function draw(canvasWidth, column, width, gutter, lineHeight) {
        canvasWidth += 2;
        reset(canvasWidth);
        vertical(canvasWidth, column, width, gutter);
        horizontal(canvasWidth, lineHeight);
    }

    function layout() {
        var div = document.createElement('div');

        function clickHandler(e) {
            if (e.target !== div && e.target !== canvas) {
                return;
            }
            div.removeEventListener('click', clickHandler, false);
            container.removeChild(div);
        }

        div.style.cssText = 'position: absolute; top: 0; left: 0; z-index: 100000; width: 100%; height: ' + String(canvasHeight) + 'px';
        canvas.style.cssText = 'display: block; margin: 0 auto;';
        div.appendChild(canvas);

        div.addEventListener('click', clickHandler, false);

        return div;
    }

    function createForm(div) {
        var form = document.createElement('form'),
            html =
                '<fieldset style="background: rgba(255, 255, 255, .6);">' +
                '<legend>Grid</legend>' +
                '<label style="cursor: pointer;"><input type="radio" name="grid" value="1190,30,30,10" /> 1190</label><br />' +
                '<label style="cursor: pointer;"><input type="radio" name="grid" value="990,25,30,10" /> 990</label><br />' +
                '<label style="cursor: pointer;"><input type="radio" name="grid" value="960,24,30,10" /> 960</label><br />' +
                '<label style="cursor: pointer;"><input type="radio" name="grid" value="950,24,30,10" /> 950</label><br />' +
                '<label style="cursor: pointer;"><input type="radio" name="grid" value="420,42,10" checked /> 420</label><br />' +
                '<label style="cursor: pointer;"><input type="radio" name="grid" value="360,36,10" /> 360</label><br />' +
                '<label style="cursor: pointer;"><input type="radio" name="grid" value="320,32,10" /> 320</label><br />' +
                '</fieldset>';
        html +=
            '<fieldset style="background: rgba(255, 255, 255, .6);">' +
            '<legend>Line Height</legend>' +
            '<label style="cursor: pointer;"><input type="radio" name="line-height" value="21" /> 21(14 * 1.5)</label><br />' +
            '<label style="cursor: pointer;"><input type="radio" name="line-height" value="24" checked /> 24(16 * 1.5)</label><br />' +
            '<label style="cursor: pointer;"><input type="radio" name="line-height" value="27" /> 27(18 * 1.5)</label><br />' +
            '</fieldset>';
        form.innerHTML = html;

        form.style.cssText = 'position: fixed; right: 20px; bottom: 10px; z-index: 1000000;';

        form.addEventListener('change', function (e) {
            e.preventDefault();

            var parts = this.querySelector('input[name=grid]:checked').value.split(','),
                canvasWidth = parseInt(parts[0], 10),
                column = parseInt(parts[1], 10),
                width = parseInt(parts[2], 10),
                gutter = parseInt(parts[3], 10),
                lineHeight = parseInt(this.querySelector('input[name=line-height]:checked').value, 10);

            draw(canvasWidth, column, width, gutter, lineHeight);
        }, false);

        div.appendChild(form);
    }

    function show(canvasWidth, column, width, gutter, lineHeight) {
        var div;

        draw(canvasWidth, column, width, gutter, lineHeight);
        div = layout();

        createForm(div);

        container.appendChild(div);
    }

    center();
    // (420 + 10) * 30 - 10 = 1190
    show(420, 52, 8, 8, 24);

}(this, this.document, this.location));
