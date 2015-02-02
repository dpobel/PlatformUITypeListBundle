/*
 * Copyright (C) Damien Pobel. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('dp-typelistview', function (Y) {
    Y.namespace('DP');

    Y.DP.TypeListView = Y.Base.create('dpTypeListView', Y.eZ.TemplateBasedView, [], {
        render: function () {
            this.get('container').setHTML(this.template());
            return this;
        },
    });
});
