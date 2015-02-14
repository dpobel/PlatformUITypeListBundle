YUI.add('dp-typelistoptionsviewservice-tests', function (Y) {
    var getViewParametersTest,
        loadTest,
        Mock = Y.Mock,
        Assert = Y.Assert;

    getViewParametersTest = new Y.Test.Case({
        name: "Type list options view service getViewParameters test",

        setUp: function () {
            this.service = new Y.DP.TypeListOptionsViewService();
        },

        tearDown: function () {
            this.service.destroy();
            delete this.service;
        },

        "Should return the content type groups": function () {
            var groups = [],
                params;

            this.service._set('contentTypeGroups', groups);
            params = this.service.getViewParameters();

            Assert.isObject(params, "The view parameters should be an object");
            Assert.areSame(
                groups, params.contentTypeGroups,
                "The view parameters should contain the content type groups"
            );
            Assert.areEqual(
                1, Y.Object.keys(params).length,
                "The view parameters should contain only the content type groups"
            );
        },
    });

    loadTest = new Y.Test.Case({
        name: "Type list options view service load test",

        setUp: function () {
            this.capi = new Mock();
            this.typeService = new Mock();
            this.service = new Y.DP.TypeListOptionsViewService({
                capi: this.capi,
            });

            this.responseGroups = {
                "ContentTypeGroupList": {
                    "_media-type": "application\/vnd.ez.api.ContentTypeGroupList+json",
                    "_href": "\/api\/ezp\/v2\/content\/typegroups",
                    "ContentTypeGroup": [
                        {
                            "_media-type": "application\/vnd.ez.api.ContentTypeGroup+json",
                            "_href": "\/api\/ezp\/v2\/content\/typegroups\/1",
                            "id": 1,
                            "identifier": "Content",
                            "created": "2002-09-05T11:08:48+02:00",
                            "modified": "2002-10-06T18:35:06+02:00",
                            "ContentTypes": {
                                "_media-type": "application\/vnd.ez.api.ContentTypeInfoList+json",
                                "_href": "\/api\/ezp\/v2\/content\/typegroups\/1\/types"
                            }
                        },
                        {
                            "_media-type": "application\/vnd.ez.api.ContentTypeGroup+json",
                            "_href": "\/api\/ezp\/v2\/content\/typegroups\/2",
                            "id": 2,
                            "identifier": "Users",
                            "created": "2002-09-05T11:09:01+02:00",
                            "modified": "2002-10-06T18:35:13+02:00",
                            "ContentTypes": {
                                "_media-type": "application\/vnd.ez.api.ContentTypeInfoList+json",
                                "_href": "\/api\/ezp\/v2\/content\/typegroups\/2\/types"
                            }
                        }
                    ]
                }
            };
            this.responseTypes = {
                "ContentTypeInfoList": {
                    "_media-type": "application\/vnd.ez.api.ContentTypeInfoList+json",
                    "_href": "\/api\/ezp\/v2\/content\/typegroups\/2\/types",
                    "ContentType": [
                        {
                            "_media-type": "application\/vnd.ez.api.ContentTypeInfo+json",
                            "_href": "\/api\/ezp\/v2\/content\/types\/3",
                            "id": 3,
                            "status": "DEFINED",
                            "identifier": "user_group",
                            "names": {
                                "value": [
                                    {
                                        "_languageCode": "eng-GB",
                                        "#text": "User group"
                                    }
                                ]
                            },
                            "creationDate": "2002-06-18T11:21:38+02:00",
                            "modificationDate": "2003-03-24T09:32:23+01:00",
                            "Creator": {
                                "_media-type": "application\/vnd.ez.api.User+json",
                                "_href": "\/api\/ezp\/v2\/user\/users\/14"
                            },
                            "Modifier": {
                                "_media-type": "application\/vnd.ez.api.User+json",
                                "_href": "\/api\/ezp\/v2\/user\/users\/14"
                            },
                            "Groups": {
                                "_media-type": "application\/vnd.ez.api.ContentTypeGroupRefList+json",
                                "_href": "\/api\/ezp\/v2\/content\/types\/3\/groups"
                            },
                            "Draft": {
                                "_media-type": "application\/vnd.ez.api.ContentType+json",
                                "_href": "\/api\/ezp\/v2\/content\/types\/3\/draft"
                            },
                            "remoteId": "25b4268cdcd01921b808a0d854b877ef",
                            "urlAliasSchema": null,
                            "nameSchema": "<name>",
                            "isContainer": true,
                            "mainLanguageCode": "eng-GB",
                            "defaultAlwaysAvailable": true,
                            "defaultSortField": "PATH",
                            "defaultSortOrder": "ASC"
                        }
                    ]
                }
            };

        },

        tearDown: function () {
            this.service.destroy();
            delete this.service;
            delete this.capi;
            delete this.typeService;
            delete this.responseGroups;
            delete this.responseTypes;
        },

        "Should load the content type groups once": function () {
            var callbackCalled = false,
                groups = [];

            Mock.expect(this.capi, {
                method: 'getContentTypeService',
                callCount: 0,
            });

            this.service._set('contentTypeGroups', groups);
            this.service.load(function () {
                callbackCalled = true;
            });
            Mock.verify(this.capi);
            Assert.isTrue(
                callbackCalled,
                "The load callback should have been called"
            );
        },

        "Should load the content type groups and content types": function () {
            var ts = this.typeService,
                groups,
                callbackCalled = false,
                responseGroups = this.responseGroups,
                responseTypes = this.responseTypes;

            Mock.expect(this.capi, {
                method: 'getContentTypeService',
                returns: ts,
            });
            Mock.expect(ts, {
                method: 'loadContentTypeGroups',
                args: [Mock.Value.Function],
                run: function (callback) {
                    callback(false, {document: responseGroups});
                },
            });
            Y.Mock.expect(ts, {
                method: 'loadContentTypes',
                args: [Y.Mock.Value.String, Y.Mock.Value.Function],
                run: function (id, callback) {
                    callback(false, {document: responseTypes});
                }
            });

            this.service.load(Y.bind(function () {
                groups = this.service.get('contentTypeGroups');

                Y.Assert.areEqual(
                    this.responseGroups.ContentTypeGroupList.ContentTypeGroup.length,
                    groups.length,
                    "The groups should be loaded in the view service"
                );

                Y.Array.each(this.responseGroups.ContentTypeGroupList.ContentTypeGroup, function (groupInfo, i) {
                    Y.Assert.areEqual(
                        groupInfo._href,
                        groups[i].get('id'),
                        "The content type groups should be parsed"
                    );
                    Y.Assert.areEqual(
                        groupInfo.identifier,
                        groups[i].get('identifier'),
                        "The content type groups should be parsed"
                    );
                    Y.Assert.areEqual(
                        responseTypes.ContentTypeInfoList.ContentType.length,
                        groups[i].get('contentTypes').length,
                        "THe content types should be loaded"
                    );
                });
                callbackCalled = true;
            }, this));
            Assert.isTrue(callbackCalled, "The load callback should have been called");
        },
    });

    Y.Test.Runner.setName("Type list options view service");
    Y.Test.Runner.add(getViewParametersTest);
    Y.Test.Runner.add(loadTest);
}, '', {
    requires: ['test', 'dp-typelistoptionsviewservice']
});
