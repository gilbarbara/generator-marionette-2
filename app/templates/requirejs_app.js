/*global require*/
'use strict';

require.config({
    shim: {<% if (compassBootstrap) { %>
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }<% } %><% if (templateFramework === 'handlebars') { %>,
        handlebars: {
            exports: 'Handlebars'
        }<% } %>
    },
    paths: {
        jquery: '/jquery/dist/jquery',
        backbone: '/backbone/backbone',
        underscore: '/lodash/dist/lodash'<% if (compassBootstrap) { %>,
        bootstrap: '/bootstrap-sass-official/javascripts/bootstrap'<% } %><% if (templateFramework === 'handlebars') { %>,
        handlebars: '/handlebars/handlebars'<% } %>
    }
});

require([
    'backbone'
], function (Backbone) {
    Backbone.history.start();
});
