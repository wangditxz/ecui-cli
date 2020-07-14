(function () {
    ecui.esr.headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'customReferer': window.location.href
    };
    ecui.esr.onready = function () {
        ecui.esr.DEFAULT_PAGE = '/demo/list';
        return {
            model: [],
            main: 'main',
            view: 'content',
            onbeforerender: function (context) {
                context.menuList = [
                    {
                        name: 'demo',
                        sub: [
                            {
                                name: 'demo-list',
                                route: '#/demo/list'
                            },
                            {
                                name: 'demo-detail',
                                route: '#/demo/detail'
                            }
                        ]
                    }
                ];
            },
            onafterrender: function () {}
        };
    };

    document.write('<script type="text/javascript" src="_include/filter.js"></script>');
    document.write('<script type="text/javascript" src="_include/index.controls.js"></script>');
})();
