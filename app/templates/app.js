var <%= _.camelize(appname) %> = new Marionette.Application();

<%= _.camelize(appname) %>.addRegions({
  mainRegion: "#main-region"
});

<%= _.camelize(appname) %>.on("start", function (options) {
  if (Backbone.history) {
    Backbone.history.start();
  }

  console.log("Hello From <%= _.camelize(appname) %> Marionette App");
});
