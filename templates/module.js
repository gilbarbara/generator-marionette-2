(function () {
  'use strict';

  <%= _.camelize(appname) %>.Collections.<%= _.classify(name) %> = Backbone.Collection.extend({

  model: <%= _.camelize(appname) %>.Models.<%= _.classify(name) %>

  });

  })();


  <%= _.camelize(appname) %>.module("ContactsApp", function(ContactsApp, <%= _.camelize(appname) %>, Backbone, Marionette, $, _){
  ContactsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "contacts(/filter/criterion::criterion)": "listContacts"
    }
  });

  var API = {
    listContacts: function(criterion){
      ContactsApp.List.Controller.listContacts(criterion);
    }
  };

  <%= _.camelize(appname) %>.on("contacts:list", function(){
    <%= _.camelize(appname) %>.navigate("contacts");
    API.listContacts();
  });

  <%= _.camelize(appname) %>.addInitializer(function(){
    new ContactsApp.Router({
      controller: API
    });
  });
});
