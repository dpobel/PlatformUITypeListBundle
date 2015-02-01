YUI.add('dp-typelistplugin-tests', function (Y) {
    var registerTest,
        pluginTest,
        Assert = Y.Assert, Mock = Y.Mock;

    pluginTest = new Y.Test.Case({
        name: "Type list plugin tests",
        
        setUp: function () {
            var that = this;

            this.app = new Mock();
            this.app.views = {};
            this.route = {};

            Mock.expect(this.app, {
                method: 'route',
                args: [Mock.Value.Object],
                run: function (route) {
                    that.route = route;
                },
            });
            Y.DP.TypeListView = function () {};
            this.plugin = new Y.DP.Plugin.TypeListPlugin({
                host: this.app
            });
        },

        tearDown: function () {
            this.plugin.destroy();
            delete this.plugin;
            delete this.app;
            delete Y.DP.TypeListView;
        },

        "Should add the type list route": function () {
            var route = this.route;

            Mock.verify(this.app);
            Assert.areEqual(5, Y.Object.keys(route).length);
            Assert.areEqual(
                'dpTypeList', route.name,
                "The route should be named dpTypeList"
            );
            Assert.areEqual(
                '/dp/typelist', route.path,
                "The route should have /dp/typelist as the path"
            );
            Assert.areEqual(
                'dpTypeListView', route.view,
                "The route should use the dpTypeListView view"
            );
            Assert.isTrue(
                route.sideViews.navigationHub,
                "The route should be configured to use the navigationHub"
            );
            Assert.areEqual(
                1, Y.Object.keys(route.sideViews).length,
                "The route should be configured to use the navigationHub"
            );
            Assert.areEqual(
                4, route.callbacks.length,
                "The route should use the dpTypeListView view"
            );
            Y.Test.ArrayAssert.itemsAreEqual(
                ['open', 'checkUser', 'handleSideViews', 'handleMainView'],
                route.callbacks
            );
        },

        "Should add the type list view": function () {
            Assert.areSame(
                Y.DP.TypeListView, this.app.views.dpTypeListView.type,
                "The type list view should be registered"
            );
        },
    });

    registerTest = new Y.Test.Case(Y.eZ.Test.PluginRegisterTest);
    registerTest.name = "Type list plugin register test";
    registerTest.Plugin = Y.DP.Plugin.TypeListPlugin;
    registerTest.components = ['platformuiApp'];

    Y.Test.Runner.setName("Type list plugin");
    Y.Test.Runner.add(pluginTest);
    Y.Test.Runner.add(registerTest);
}, '', {
    requires: ['test', 'ez-pluginregister-tests', 'dp-typelistplugin']
});
