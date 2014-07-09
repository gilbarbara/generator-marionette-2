/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

var ModuleGenerator = scriptBase.extend({
  constructor: function () {
    scriptBase.apply(this, arguments);

    var dirPath = '../templates';
    this.sourceRoot(path.join(__dirname, dirPath));

    var testOptions = {
      as: 'module',
      args: [this.name],
      options: {
        ui: this.config.get('ui')
      }
    };

    if (this.generateTests()) {
      this.hookFor('backbone-mocha', testOptions);
    }
  },

  createControllerFiles: function () {

    // todo: create directory

    this.writeTemplate('module', path.join(this.env.options.appPath + '/scripts/modules', this.name));

    this.addScriptToIndex('modules/' + this.name);
  }
});

module.exports = ModuleGenerator;
