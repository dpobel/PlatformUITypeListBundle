/*
 * Copyright (C) Damien Pobel. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('dp-typelistoptionsview', function (Y) {
    /**
     * Provides the type list options view
     *
     * @module dp-typelistoptionsview
     */
    Y.namespace('DP');

    /**
     * The type list options view.
     *
     * @namespace DP
     * @class TypeListOptionsView
     * @constructor
     * @extends eZ.TemplateBasedView
     */
    Y.DP.TypeListOptionsView = Y.Base.create('dpTypeListOptionsView', Y.eZ.TemplateBasedView, [], {
        events: {
            '.dp-typelist-option-list': {
                'change': '_updateOption',
            },
        },

        initializer: function () {
            this.after(
                ['typeIdentifierChange', 'sortMethodChange', 'sortOrderChange'],
                this._optionsUpdate
            );
        },

        /**
         * Attribute change event handler. It fires the optionsUpdate event if
         * the attribute change was done because of an action in the UI
         *
         * @method _optionsUpdate
         * @protected
         * @param {EventFacade} e
         */
        _optionsUpdate: function (e) {
            if ( e.src !== "UI" ) {
                return;
            }
            /**
             * Fired when a list option is changed. it provides all the options
             * in the event facade
             *
             * @event optionsUpdate
             * @param listOptions {Object}
             * @param listOptions.typeIdentifier {String}
             * @param listOptions.sortMethod {String}
             * @param listOptions.sortOrder {String}
             */
            this.fire('optionsUpdate', {
                listOptions: {
                    typeIdentifier: this.get('typeIdentifier'),
                    sortMethod: this.get('sortMethod'),
                    sortOrder: this.get('sortOrder'),
                }
            });
        },

        /**
         * Change event handler, it updates the corresponding attribute value
         *
         * @method _updateOption
         * @protected
         * @param {EventFacade} e
         */
        _updateOption: function (e) {
            this.set(
                e.target.getAttribute('name'),
                e.target.get('value'),
                {src: "UI"}
            );
        },

        render: function () {
            this.get('container').setHTML(this.template({
                groups: this._groupsToJson(),
                sortMethods: this._sortMethods(),
                sortOrders: this._sortOrders(),
            }));
            return this;
        },

        /**
         * Builds a list of object suitable for the template.
         *
         * @private
         * @method _buildList
         * @param {String} attrList
         * @param {String} attrValue
         * @return {Array}
         */
        _buildList: function (attrList, attrValue) {
            var res = [],
                value = this.get(attrValue);

            Y.Array.each(this.get(attrList), function (obj) {
                var o = Y.merge(obj);

                o.selected = (value === o.identifier);
                res.push(o);
            });
            return res;

        },

        /**
         * Builds the order list for the template
         *
         * @method _sortOrders
         * @protected
         * @return {Array}
         */
        _sortOrders: function () {
            return this._buildList('sortOrders', 'sortOrder');
        },

        /**
         * Builds the method list for the template
         *
         * @method _sortMethods
         * @protected
         * @return {Array}
         */
        _sortMethods: function () {
            return this._buildList('sortMethods', 'sortMethod');
        },

        /**
         * Transforms the content type groups object to an object structure
         * suitable for the view template.
         *
         * @method _groupsToJson
         * @return Array
         */
        _groupsToJson: function () {
            var res = [],
                selectedIdentifier = this.get('typeIdentifier');

            Y.Array.each(this.get('contentTypeGroups'), function (group) {
                var struct = group.toJSON();

                struct.types = [];
                Y.Array.each(struct.contentTypes, function (type, key) {
                    var t = type.toJSON();

                    t.selected = (t.identifier === selectedIdentifier);
                    struct.types.push(t);
                });
                delete struct.contentTypes;

                res.push(struct);
            });
            return res;
        },
    }, {
        ATTRS: {
            /**
             * The selected type identifier to filter on
             *
             * @attribute typeIdentifier
             * @type {String}
             */
            typeIdentifier: {
                value: "",
            },

            /**
             * The selected sort method
             *
             * @attribute sortMethod
             * @type {String}
             */
            sortMethod: {
                value: "",
            },

            /**
             * The selected sort order
             *
             * @attribute sortOrder
             * @type {String}
             */
            sortOrder: {
                value: "",
            },

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

            /**
             * Stores the available sort orders
             *
             * @attribute sortOrders
             * @type Array
             * @readOnly
             */
            sortOrders: {
                value: [
                    {identifier: 'ascending', name: 'Ascending'},
                    {identifier: 'descending', name: 'Descending'},
                ],
                readOnly: true,
            },
        }
    });
});
