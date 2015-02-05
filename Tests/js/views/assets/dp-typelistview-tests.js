YUI.add('dp-typelistview-tests', function (Y) {
    var viewTest,
        Assert = Y.Assert, Mock = Y.Mock;

    viewTest = new Y.Test.Case({
        name: "Type list view test",

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

            this.view = new Y.DP.TypeListView({
                container: '.container',
                contentTypeGroups: this.contentTypeGroups,
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
                group1Json = {
                    contentTypes: [this.type1, this.type2],
                },
                group2Json = {
                    contentTypes: []
                },
                type1Json = {}, type2Json = {};

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
                    2, Y.Object.keys(variables).length,
                    "The template should receive 2 variables"
                );
                Assert.areSame(
                    this.get('sortMethods'), variables.sortMethods,
                    "The template should receive the title"
                );
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
                Assert.areSame(
                    type1Json, group1.types[0],
                    "The types should be transformed to json object"
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

    Y.Test.Runner.setName("Type list view");
    Y.Test.Runner.add(viewTest);
}, '', {
    requires: ['test', 'dp-typelistview']
});
