/*
 * Copyright (C) Damien Pobel. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('dp-typelistviewservice', function (Y) {
    /**
     * Provides the type list plugin
     *
     * @module dp-typelistplugin
     */
    Y.namespace('DP');

    /**
     * The type list view service.
     *
     * @namespace DP
     * @class TypeListViewService
     * @constructor
     * @extends eZ.ViewService
     */
    Y.DP.TypeListViewService = Y.Base.create('dpTypeListViewService', Y.eZ.ViewService, [], {});
});
