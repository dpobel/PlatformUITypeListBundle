YUI.add('dp-typelistoptionsview-tests', function (Y) {
    var viewTest, attrChangeTest, changeSelectTest,
        Assert = Y.Assert, Mock = Y.Mock;

    viewTest = new Y.Test.Case({
        name: "Type list options view test",

        setUp: function () {
            this.group1 = new Mock();
            this.group2 = new Mock();
            this.type1 = new Mock();
            this.type2 = new Mock();
            this.contentTypeGroups = [this.group1, this.group2];
            Mock.expect(this.group1, {
                method: 'toJSON',
                returns: {},
            });
            Mock.expect(this.group2, {
                method: 'toJSON',
                returns: {},
            });

            this.typeIdentifier = "mtb";
            this.sortMethod = "path";
            this.sortOrder = "descending";
            this.view = new Y.DP.TypeListOptionsView({
                container: '.container',
                contentTypeGroups: this.contentTypeGroups,
                typeIdentifier: this.typeIdentifier,
                sortMethod: this.sortMethod,
                sortOrder: this.sortOrder,
            });
        },

        tearDown: function () {
            this.view.destroy();
            delete this.view;
            delete this.contentTypeGroups;
        },

        "Test render": function () {
            var templateCalled = false,
                origTpl;

            origTpl = this.view.template;
            this.view.template = function () {
                templateCalled = true;
                return origTpl.apply(this, arguments);
            };
            this.view.render();
            Assert.isTrue(
                templateCalled,
                "The template should have used to render the view"
            );
        },

        "Test available variables in template": function () {
            var origTpl = this.view.template,
                that = this,
                group1Json = {
                    contentTypes: [this.type1, this.type2],
                },
                group2Json = {
                    contentTypes: []
                },
                type1Json = {identifier: this.typeIdentifier},
                type2Json = {identifier: "vtt"};

            Mock.expect(this.group1, {
                method: 'toJSON',
                returns: group1Json,
            });
            Mock.expect(this.group2, {
                method: 'toJSON',
                returns: group2Json,
            });
            Mock.expect(this.type1, {
                method: 'toJSON',
                returns: type1Json,
            });
            Mock.expect(this.type2, {
                method: 'toJSON',
                returns: type2Json,
            });
            this.view.template = function (variables) {
                var group1 = variables.groups[0],
                    group2 = variables.groups[1];

                Assert.areEqual(
                    3, Y.Object.keys(variables).length,
                    "The template should receive 3 variables"
                );
                Assert.areSame(
                    this.get('sortMethods').length, variables.sortMethods.length,
                    "The template should receive the sort methods"
                );
                Y.Array.each(this.get('sortMethods'), function (method, i) {
                    Assert.areEqual(
                        method.identifier, variables.sortMethods[i].identifier
                    );
                    Assert.areEqual(
                        method.name, variables.sortMethods[i].name
                    );
                    Assert.isBoolean(variables.sortMethods[i].selected);
                    Assert.areSame(
                        method.identifier === that.sortMethod,
                        variables.sortMethods[i].selected
                    );
                });
                Assert.areSame(
                    this.get('sortOrders').length, variables.sortOrders.length,
                    "The template should receive the sort orders"
                );
                Y.Array.each(this.get('sortOrders'), function (order, i) {
                    Assert.areEqual(
                        order.identifier, variables.sortOrders[i].identifier
                    );
                    Assert.areEqual(
                        order.name, variables.sortOrders[i].name
                    );
                    Assert.isBoolean(variables.sortOrders[i].selected);
                    Assert.areSame(
                        order.identifier === that.sortOrder,
                        variables.sortOrders[i].selected
                    );
                });

                Assert.areSame(
                    group1Json, group1,
                    "The groups should be available in the template"
                );
                Assert.areSame(
                    group2Json, group2,
                    "The groups should be available in the template"
                );
                Assert.isUndefined(group1.contentTypes);
                Assert.isUndefined(group2Json.contentTypes);
                Assert.isArray(group1.types);
                Assert.isArray(group2.types);
                Assert.areEqual(
                    2, group1.types.length,
                    "The group 1 should have 2 types"
                );
                Assert.areEqual(
                    0, group2.types.length,
                    "The group 2 should have no type"
                );
                Assert.areSame(
                    type1Json, group1.types[0],
                    "The types should be transformed to json object"
                );
                Assert.isTrue(
                    type1Json.selected,
                    "The type1 should have the selected property to true"
                );
                Assert.areSame(
                    type2Json, group1.types[1],
                    "The types should be transformed to json object"
                );
                Assert.isFalse(
                    type2Json.selected,
                    "The type2 should have the selected property to false"
                );

                return origTpl.call(this, variables);
            };
            this.view.render();
            Mock.verify(this.group1);
            Mock.verify(this.group2);
            Mock.verify(this.type1);
            Mock.verify(this.type2);
        },
    });

    attrChangeTest = new Y.Test.Case({
        name: "Type list options view attributes change test",

        setUp: function () {
            this.typeIdentifier = "mtb";
            this.sortMethod = "path";
            this.sortOrder = "descending";
            this.view = new Y.DP.TypeListOptionsView({
                container: '.container',
                typeIdentifier: this.typeIdentifier,
                sortMethod: this.sortMethod,
                sortOrder: this.sortOrder,
            });
        },

        tearDown: function () {
            this.view.destroy();
            delete this.view;
        },

        _testNotUIChange: function (attr) {
            this.view.on('optionsUpdate', function () {
                Y.fail("The optionsUpdate should have been fired");
            });
            this.view.set(attr, "whatever");
        },

        _testUIChange: function (attr) {
            var evt = false;

            this.view.on('optionsUpdate', function (e) {
                evt = true;
                Assert.areEqual(
                    this.get('typeIdentifier'), e.listOptions.typeIdentifier
                );
                Assert.areEqual(
                    this.get('sortMethod'), e.listOptions.sortMethod
                );
                Assert.areEqual(
                    this.get('sortOrder'), e.listOptions.sortOrder
                );
            });
            this.view.set(attr, "whatever", {src: "UI"});
            Assert.isTrue(evt, "The event should have been fired");
        },

        "Should fire the optionsUpdate event (typeIdentifier)": function () {
            this._testUIChange('typeIdentifier');
        },

        "Should not fire the optionsUpdate event (typeIdentifier)": function () {
            this._testNotUIChange('typeIdentifier');
        },

        "Should fire the optionsUpdate event (sortOrder)": function () {
            this._testUIChange('sortOrder');
        },

        "Should not fire the optionsUpdate event (sortOrder)": function () {
            this._testNotUIChange('sortOrder');
        },

        "Should fire the optionsUpdate event (sortMethod)": function () {
            this._testUIChange('sortMethod');
        },

        "Should not fire the optionsUpdate event (sortMethod)": function () {
            this._testNotUIChange('sortMethod');
        },
    });

    changeSelectTest = new Y.Test.Case({
        name: "Type list options view attributes change test",

        setUp: function () {
            this.typeIdentifier = "mtb";
            this.sortMethod = "path";
            this.sortOrder = "descending";
            this.view = new Y.DP.TypeListOptionsView({
                container: '.container',
                typeIdentifier: this.typeIdentifier,
                sortMethod: this.sortMethod,
                sortOrder: this.sortOrder,
            });
            this.view.render();
        },

        tearDown: function () {
            this.view.destroy();
            delete this.view;
        },

        _testAttr: function (attr) {
            var select = this.view.get('container').one("[name='" + attr + "']"),
                change = false;

            this.view.after(attr + 'Change', function (e) {
                change = true;
                Assert.areEqual(
                    "UI", e.src,
                    "The src of the event should be UI"
                );
                Assert.areEqual(
                    select.get('value'), e.newVal,
                    "The new value of the attribute should be the select value"
                );
            });
            select.simulate('change');
            Assert.isTrue(change, "The attribute should have been changed");
        },

        "Should update the attribute typeIdentifier": function () {
            this._testAttr("typeIdentifier");
        },

        "Should update the attribute sortOrder": function () {
            this._testAttr("sortOrder");
        },

        "Should update the attribute sortMethod": function () {
            this._testAttr("sortMethod");
        },
    });

    Y.Test.Runner.setName("Type list options view");
    Y.Test.Runner.add(viewTest);
    Y.Test.Runner.add(attrChangeTest);
    Y.Test.Runner.add(changeSelectTest);
}, '', {
    requires: ['test', 'node-event-simulate', 'dp-typelistoptionsview']
});
