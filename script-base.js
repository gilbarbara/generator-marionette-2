'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var backboneUtils = require('./util.js');

var ScriptBase = yeoman.generators.NamedBase.extend({
	constructor: function (name) {
		yeoman.generators.NamedBase.apply(this, arguments);

		this.appname = this.config.get('appName') || path.basename(process.cwd());
		this.env.options.appPath = this.config.get('appPath') || 'app';

		this._.mixin({ 'classify': backboneUtils.classify });
	},
	addScriptToIndex: function (script) {
		try {
			var appPath = this.env.options.appPath;
			var fullPath = path.join(appPath, 'index.html');

			backboneUtils.rewriteFile({
				file: fullPath,
				needle: '<!-- endbuild -->',
				splicable: [
					'<script src="scripts/' + script + '.js"></script>'
				]
			});
		} catch (e){
			this.log('\nUnable to find '.yellow + fullPath + '. Reference to '.yellow + script + '.js ' + 'not added.\n'.yellow);
		}
	},

	setupSourceRootAndSuffix: function () {
		var sourceRoot = '/templates';
		this.scriptSuffix = '.js';

		this.sourceRoot(path.join(__dirname, sourceRoot));
	},

	writeTemplate: function (source, destination, data) {
		this.setupSourceRootAndSuffix();
		var ext = this.scriptSuffix;
		this.template(source + ext, destination + ext, data);
	},

	generateTests: function () {
		return this.config.get('testFramework') === 'mocha';
	}
});

module.exports = ScriptBase;
