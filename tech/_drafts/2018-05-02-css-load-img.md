
```html
<style>
    div {
        height: 960px;
    }
    .background-image-placholder {
        background-image: url(/img/最美劳作.jpg) !important;
        /*background-image: none !important;*/
    }
    .background {
        background: url(/img/云雾缭绕.jpg) no-repeat;
    }

    .no-use {
        background: url(/img/最美劳作.jpg) no-repeat;
    }

    .no-display {
        display: none;
        background: url(/img/渔舟唱晚.jpg) no-repeat;
    }

    .next-screen {
        background: url(/img/目标前方.jpg) no-repeat;
    }

    .opacity0 {
        opacity: 0;
        background: url(/img/安安静静.jpg) no-repeat;
    }

    .hidden {
        visibility: hidden;
        background: url(/img/直通天际.jpg) no-repeat;
    }
</style>
<div class="background">background</div>
<div class="next-screen">next screen</div>
<div class="no-display">no display</div>
<div class="opacity0"></div>
<div class="hidden background-image-placholder"></div>
```

上例中的几个细节：
1. style中的背景图片，只有未使用的类不会引用，其他（无论是在下一屏、display:none、opacity:0、visibility:hidden这4种情况）都会加载图片；
2. 如果要做延迟加载，需要将图片的background-image属性覆盖掉（注意Android4.2中background-image属性在background-size之后的bug）。
