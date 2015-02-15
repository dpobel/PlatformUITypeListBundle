/*
 * Copyright (C) Damien Pobel. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('dp-typelistnavigationplugin', function (Y) {
    /**
     * @module dp-typelistnavigationplugin
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
    Y.DP.Plugin.TypeListNavigationPlugin = Y.Base.create('dpTypeListNavigationPlugin', Y.eZ.Plugin.ViewServiceBase, [], {
        initializer: function () {
            var service = this.get('host');

            service.addNavigationItem({
                Constructor: Y.eZ.NavigationItemView,
                config: {
                    title: "Contents by types",
                    identifier: "contents-by-types",
                    route: {
                        name: "dpTypeList",
                        params: {
                            typeIdentifier: "folder",
                            sortMethod: "modified",
                            sortOrder: "descending",
                        }
                    }
                }
            }, 'platform');
        },
    }, {
        NS: 'dpTypeListNavigation',
    });

    Y.eZ.PluginRegistry.registerPlugin(
        Y.DP.Plugin.TypeListNavigationPlugin, ['navigationHubViewService']
    );
});
