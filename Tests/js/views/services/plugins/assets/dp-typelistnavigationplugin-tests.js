YUI.add('dp-typelistnavigationplugin-tests', function (Y) {
    var registerTest,
        pluginTest,
        Assert = Y.Assert, Mock = Y.Mock;

    pluginTest = new Y.Test.Case({
        name: "Type list navigation plugin tests",
        
        setUp: function () {
            var that = this;

            this.navigationItemConfig = {};
            this.zone = '';
            Y.eZ.NavigationItemView = function () {};
            this.service = new Mock();
            Mock.expect(this.service, {
                method: 'addNavigationItem',
                args: [Mock.Value.Object, Mock.Value.String],
                run: function (config, zone) {
                    that.navigationItemConfig = config;
                    that.zone = zone;
                }
            });
            this.plugin = new Y.DP.Plugin.TypeListNavigationPlugin({
                host: this.service,
            });
        },

        tearDown: function () {
            this.plugin.destroy();
            delete this.plugin;
            delete this.service;
            delete Y.eZ.NavigationItemView;
        },

        "Should add the navigation item for the type list route": function () {
            var config = this.navigationItemConfig;

            Mock.verify(this.service);
            Assert.areEqual(
                'platform', this.zone,
                "The navigation item should be added in the platform zone"
            );
            Assert.areSame(
                Y.eZ.NavigationItemView, config.Constructor,
                "The constructor should be the default navigation item view"
            );
            Assert.areEqual(
               "dpTypeList", config.config.route.name,
               "The navigation item should link to the dpTypeList route"
            );
        },
    });

    registerTest = new Y.Test.Case(Y.eZ.Test.PluginRegisterTest);
    registerTest.name = "Type list navigation plugin register test";
    registerTest.Plugin = Y.DP.Plugin.TypeListNavigationPlugin;
    registerTest.components = ['navigationHubViewService'];

    Y.Test.Runner.setName("Type list navigation plugin");
    Y.Test.Runner.add(pluginTest);
    Y.Test.Runner.add(registerTest);
}, '', {
    requires: ['test', 'ez-pluginregister-tests', 'dp-typelistnavigationplugin']
});
