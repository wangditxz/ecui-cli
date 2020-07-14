(function() {
    ecui.esr.onready = function() {
        return {
            // model: [''],
            // main: 'main',
            // view: 'content',
            // children: ['index'],
            onbeforerequest: function() {
                console.log('1111');
            },
            onbeforerender: function(context) {},
            onafterrender: function() {}
        };
    };
})();
