/*
 * Copyright (C) Damien Pobel. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('dp-typelistoptionsviewservice', function (Y) {
    /**
     * Provides the type list options view service
     *
     * @module dp-typelistoptionsviewservice
     */
    Y.namespace('DP');

    /**
     * The type list options view service.
     *
     * @namespace DP
     * @class TypeListOptionsViewService
     * @constructor
     * @extends eZ.ViewService
     */
    Y.DP.TypeListOptionsViewService = Y.Base.create('dpTypeListOptionsViewService', Y.eZ.ViewService, [], {
        initializer: function () {
            this.after('*:optionsUpdate', this._updateList);
        },

        /**
         * Navigates to the type list for the new options
         *
         * @method _updateList
         * @protected
         * @param {EventFacade} e
         */
        _updateList: function (e) {
            this.get('app').navigateTo('dpTypeList', e.listOptions);
        },

        _load: function (callback) {
            if ( this.get('contentTypeGroups') ) {
                callback();
                return;
            }
            this._loadContentTypes(callback);
        },

        _getViewParameters: function () {
            var p = this.get('request').params;

            return {
                contentTypeGroups: this.get('contentTypeGroups'),
                typeIdentifier: p.typeIdentifier,
                sortMethod: p.sortMethod,
                sortOrder: p.sortOrder,
            };
        },

        /**
         * Loads all the content type groups and content types
         *
         * @method _loadContentTypes
         * @protected
         * @param {Function} callback
         */
        _loadContentTypes: function (callback) {
            var capi = this.get('capi'),
                that = this,
                typeService = capi.getContentTypeService();

            typeService.loadContentTypeGroups(function (error, response) {
                var groups = [],
                    parallel = new Y.Parallel();

                // TODO: error handling
                Y.Array.each(response.document.ContentTypeGroupList.ContentTypeGroup, function (groupHash) {
                    var group = new Y.eZ.ContentTypeGroup();

                    group.set('id', groupHash._href);
                    group.loadFromHash(groupHash);
                    groups.push(group);

                    // TODO error handling
                    group.loadContentTypes({api: capi}, parallel.add());
                });

                parallel.done(function () {
                    that._set('contentTypeGroups', groups);
                    callback();
                });
            });
        },
    }, {
        ATTRS: {
            /**
             * Stores the list of content type groups. Each group should have
             * loaded its content types.
             *
             * @attribute contentTypeGroups
             * @readOnly
             * @type Array
             * @default undefined
             */
            contentTypeGroups: {
                readOnly: true,
            },
        },
    });
});
