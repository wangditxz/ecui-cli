(function () {
    ecui.esr.headers = {};
    ecui.esr.onready = function () {
        return {
            // model: [''],
            // main: 'main',
            // view: 'content',
            // children: ['index'],
            onbeforerequest: function () {
            },
            onbeforerender: function () {},
            onafterrender: function () {}
        };
    };

    document.write('<script type="text/javascript" src="_include/index.controls.js"></script>');
    document.write('<script type="text/javascript" src="_include/filter.js"></script>');
})();
