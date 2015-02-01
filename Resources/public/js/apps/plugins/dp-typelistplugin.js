YUI.add('dp-typelistplugin', function (Y) {
    Y.namespace('DP.Plugin');

    Y.DP.Plugin.TypeListPlugin = Y.Base.create('dpTypeListPlugin', Y.Plugin.Base, [], {
        initializer: function () {
            var app = this.get('host');

            app.views.dpTypeListView = {
                type: Y.DP.TypeListView,
            };
            app.route({
                name: 'dpTypeList',
                path: '/dp/typelist',
                view: 'dpTypeListView',
                sideViews: {'navigationHub': true},
                callbacks: ['open', 'checkUser', 'handleSideViews', 'handleMainView'],
            });
        },
    }, {
        NS: 'dpTypeList',
    });

    Y.eZ.PluginRegistry.registerPlugin(
        Y.DP.Plugin.TypeListPlugin, ['platformuiApp']
    );
});
