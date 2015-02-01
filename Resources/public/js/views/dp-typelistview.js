YUI.add('dp-typelistview', function (Y) {
    Y.namespace('DP');

    Y.DP.TypeListView = Y.Base.create('dpTypeListView', Y.eZ.TemplateBasedView, [], {
        render: function () {
            this.get('container').setHTML(this.template());
            return this;
        },
    });
});
