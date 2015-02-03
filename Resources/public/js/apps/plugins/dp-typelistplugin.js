/*
 * Copyright (C) Damien Pobel. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('dp-typelistplugin', function (Y) {
    /**
     * Provides the type list plugin
     *
     * @module dp-typelistplugin
     */
    Y.namespace('DP.Plugin');

    /**
     * The type list plugin. It adds the type list view and route to the
     * application.
     *
     * @namespace DP.Plugin
     * @class TypeListPlugin
     * @constructor
     * @extends Plugin.Base
     */
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
                service: Y.DP.TypeListViewService,
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
