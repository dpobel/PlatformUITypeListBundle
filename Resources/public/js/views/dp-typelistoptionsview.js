/*
 * Copyright (C) Damien Pobel. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('dp-typelistoptionsview', function (Y) {
    /**
     * Provides the type list view
     *
     * @module dp-typelistoptionsview
     */
    Y.namespace('DP');

    /**
     * The type list view.
     *
     * @namespace DP
     * @class TypeListOptionsView
     * @constructor
     * @extends eZ.TemplateBasedView
     */
    Y.DP.TypeListOptionsView = Y.Base.create('dpTypeListOptionsView', Y.eZ.TemplateBasedView, [], {
        render: function () {
            this.get('container').setHTML(this.template({
                groups: this._groupsToJson(),
                sortMethods: this.get('sortMethods'),
            }));
            return this;
        },

        /**
         * Transforms the content type groups object to an object structure
         * suitable for the view template.
         *
         * @method _groupsToJson
         * @return Array
         */
        _groupsToJson: function () {
            var res = [];

            Y.Array.each(this.get('contentTypeGroups'), function (group) {
                var struct = group.toJSON();

                struct.types = [];
                Y.Array.each(struct.contentTypes, function (type, key) {
                    struct.types.push(type.toJSON());
                });
                delete struct.contentTypes;

                res.push(struct);
            });
            return res;
        },
    }, {
        ATTRS: {
            /**
             * The list of content type groups in the repository. Each group
             * should have loaded its content types.
             *
             * @attribute contentTypeGroups
             * @type Array
             */
            contentTypeGroups: {},

            /**
             * Stores the available sort methods.
             *
             * @attribute sortMethods
             * @type Array
             * @readOnly
             */
            sortMethods: {
                value: [
                    {identifier: 'depth', name: 'Depth'},
                    {identifier: 'name', name: 'Name'},
                    {identifier: 'path', name: 'Path'},
                    {identifier: 'path_string', name: 'Path string'},
                    {identifier: 'priority', name: 'Priority'},
                    {identifier: 'modified', name: 'Modified'},
                    {identifier: 'published', name: 'Published'},
                    {identifier: 'section', name: 'Section'},
                ],
                readOnly: true,
            },
        }
    });
});
