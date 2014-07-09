'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');
var backboneUtils = require('../util.js');

var BackboneGenerator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('appPath', {
      desc: 'Name of application directory',
      type: 'String',
      defaults: 'app',
      banner: 'some banner'
    });

    this.option('template-framework', {
      desc: 'Choose template framework. lodash/handlebars/mustashe',
      type: 'String',
      defaults: 'lodash'
    });

    this.option('test-framework', {
      desc: 'Choose test framework. mocha/jasmine',
      type: 'String',
      defaults: 'mocha'
    });

    this.testFramework = this.options['test-framework'];
    this.templateFramework = this.options['template-framework'];

    this.argument('app_name', {
      type: String,
      required: true
    });
    this.appname = this.app_name || this.appname;

    this.env.options.appPath = this.options.appPath || 'app';
    this.config.set('appPath', this.env.options.appPath);

    this.testFramework = this.options['test-framework'] || 'mocha';
    this.templateFramework = this.options['template-framework'] || 'lodash';

    if (['backbone:app', 'backbone'].indexOf(this.options.namespace) >= 0) {
      this.hookFor(this.testFramework, {
        as: 'app',
        options: {
          'skip-install': this.options['skip-install'],
          'ui': this.options.ui
        }
      });
    }

    this.config.defaults({
      appName: this.appname,
      ui: this.options.ui,
      testFramework: this.testFramework,
      templateFramework: this.templateFramework,
      compassBootstrap: this.compassBootstrap
    });

    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  },

  prompting: function () {
    var cb = this.async();

    // welcome message
    this.log(this.yeoman);
    this.log('Out of the box I include HTML5 Boilerplate, jQuery, Backbone.js Marionette 2 and Modernizr.');

    var prompts = [
      {
        name: 'appname',
        message: 'What do you want to call your application?'
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'What more would you like?',
        choices: [
          {
            name: 'Twitter Bootstrap for Sass',
            value: 'compassBootstrap',
            checked: true
          }
        ]
      }
    ];

    this.prompt(prompts, function (answers) {
      this.appname = answers.appname || this.appname;


      var features = answers.features;

      function hasFeature(feat) {
        return features.indexOf(feat) !== -1;
      }

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.compassBootstrap = hasFeature('compassBootstrap');
      this.config.set('compassBootstrap', this.compassBootstrap);

      cb();
    }.bind(this));
  },

  writing: {

    git: function () {
      this.template('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },

    bower: function () {
      this.copy('_bower.json', 'bower.json');
    },

    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },

    jscs: function () {
      this.copy('jscsrc', '.jscsrc');
    },

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    gruntfile: function () {
      this.template('Gruntfile.js');
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    mainStylesheet: function () {
      var contentText = [
        'body {\n    background: #fafafa;\n}',
        '\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 300px;\n}'
      ];
      var ext = '.css';
      if (this.compassBootstrap) {
        this.template('main.scss', this.env.options.appPath + '/styles/main.scss');
      }
      this.write(this.env.options.appPath + '/styles/main' + ext, contentText.join('\n'));
    },

    writeIndex: function () {

      this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
      this.indexFile = this.engine(this.indexFile, this);

      var vendorJS = [
        '/jquery/dist/jquery.js',
        '/underscore/underscore.js',
        '/backbone/backbone.js',
        '/marionette/lib/backbone.marionette.js'
      ];

      if (this.templateFramework === 'handlebars') {
        vendorJS.push('/handlebars/handlebars.js');
      }

      this.indexFile = this.appendScripts(this.indexFile, '/scripts/vendor.js', vendorJS, { }, 'bower_components');

      if (this.compassBootstrap) {
        // wire Twitter Bootstrap plugins
        this.indexFile = this.appendScripts(this.indexFile, '/scripts/plugins.js', [
          '/bootstrap-sass-official/assets/javascripts/bootstrap/affix.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/alert.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/button.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/popover.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/carousel.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js',
          '/bootstrap-sass-official/assets/javascripts/bootstrap/tab.js'
        ], { }, 'bower_components');
      }

      this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        searchPath: ['.tmp', this.env.options.appPath],
        optimizedPath: 'scripts/app.js',
        sourceFileList: [
          'scripts/app.js',
          'scripts/templates.js',
          'scripts/bootstrap.js'
        ]
      });
    },

    setupEnv: function () {
      this.mkdir(this.env.options.appPath);
      this.mkdir(this.env.options.appPath + '/scripts');
      this.mkdir(this.env.options.appPath + '/scripts/vendor/');
      this.mkdir(this.env.options.appPath + '/styles');
      this.mkdir(this.env.options.appPath + '/images');
      this.copy('app/404.html', this.env.options.appPath + '/404.html');
      this.copy('app/favicon.ico', this.env.options.appPath + '/favicon.ico');
      this.copy('app/robots.txt', this.env.options.appPath + '/robots.txt');
      this.copy('app/htaccess', this.env.options.appPath + '/.htaccess');
      this.write(this.env.options.appPath + '/index.html', this.indexFile);
    },

    createAppFile: function () {
      this._writeTemplate('app', this.env.options.appPath + '/scripts/app');
    },

    createBootstrapFile: function () {
      this._writeTemplate('bootstrap', this.env.options.appPath + '/scripts/bootstrap');
    }
  },

  setSuffix: function () {
    this.scriptSuffix = '.js';
  },

  _writeTemplate: function (source, destination, data) {
    if (typeof source === 'undefined' || typeof destination === 'undefined') {
      return;
    }

    if (typeof this.scriptSuffix === 'undefined') {
      this.setSuffix();
    }

    var ext = this.scriptSuffix;
    this.template(source + ext, destination + ext, data);
  },

  install: function () {
    if (['backbone:app', 'backbone'].indexOf(this.options.namespace) >= 0) {
      this.installDependencies({ skipInstall: this.options['skip-install'] });
    }
  }
});

module.exports = BackboneGenerator;
