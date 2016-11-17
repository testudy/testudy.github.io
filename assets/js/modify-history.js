(function (global, document) {
    'use strict';

    function ModifyHistory(hrefs) {

        if (!this instanceof ModifyHistory) {
            return new ModifyHistory(hrefs);
        }

        if (!this.verifyUrls(hrefs)) {
            throw new Error('传入一个href的数组列表');
        }

        this.hrefs = hrefs;

        global.addEventListener('popstate', this.popstate.bind(this), false);
    }

    ModifyHistory.prototype = {
        constructor: ModifyHistory,

        verifyUrls: function (hrefs) {
            var URL_RE = /^https?:/i,
                i,
                len;

            if (hrefs && typeof hrefs === 'object' &&
                    hrefs.hasOwnProperty('length') &&
                    typeof hrefs.length === 'number') {

                for (i = 0, len = hrefs.length; i < len; i += 1) {
                    if (!URL_RE.test(hrefs[i])) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        },

        correctUrl: function (href) {
            return href.replace(/^https?:/i, global.location.protocol);
        },

        modify: function () {
            var hrefs = this.hrefs,
                i,
                href;

            this.datas = [];
            this.datas.push({
                action: 'popstate-for-href',
                index: hrefs.length,
                title: document.title,
                href: global.location.href
            });

            for (i = hrefs.length - 1; i >= 0; i -= 1) {
                href = this.correctUrl(hrefs[i]);
                if (!this.hasContained(href)) {
                    this.datas.unshift({
                        action: 'popstate-for-href',
                        index: i,
                        title: '',
                        href: href
                    });
                }
            }

            this.insert();
        },

        init: function () {
            if (!document.referrer || document.referrer.indexOf(global.location.host) === -1) {
                if (document.readyState === 'complete') {
                    setTimeout(this.modify.bind(this), 0);
                } else {
                    global.addEventListener('load', this.modify.bind(this), false);
                }
            }
        },

        hasContained: function (href) {
            var i;
            for (i = this.datas.length - 1; i >= 0; i -= 1) {
                if (this.datas[i].href === href) {
                    return true;
                }
            }
            return false;
        },

        insert: function () {
            var i,
                len,
                data;

            for (i = 0, len = this.datas.length; i < len; i += 1) {
                data = this.datas[i];
                if (i === 0) {
                    global.history.replaceState(data, data.title, data.href);
                } else {
                    global.history.pushState(data, data.title, data.href);
                }
            }
        },

        popstate: function (event) {
            var state = event.state;
            if (state.action === 'popstate-for-href') {
                global.location.replace(global.location.href);
            }
        }
    };

    try {
        var modifyHistory = new ModifyHistory([
            global.location.protocol + '//' + global.location.host + '/',
        ]);
        modifyHistory.init();
    } catch (ex) {
        global.console.log(ex);
    }

}(this, this.document));
