# Marionette2 generator [![Build Status](https://secure.travis-ci.org/gilbarbara/generator-marionette-2.svg?branch=master)](http://travis-ci.org/gilbarbara/generator-marionette-2) [![Coverage Status](https://coveralls.io/repos/gilbarbara/generator-marionette-2/badge.png?branch=master)](https://coveralls.io/r/gilbarbara/generator-marionette-2?branch=master)

A Marionette 2 generator for Yeoman that provides a functional boilerplate Marionette 2 app out of the box. You also get access to a number of sub-generators which can be used to easily create individual models, views, collections and so on.

Optional RequireJS (AMD) support has recently been added as a prompt when using the generator on new projects.


## Usage

Install: `npm install -g generator-marionette-2`

Make a new directory and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo marionette-2`

## Generators

Available generators:

- marionette-2:model
- marionette-2:view
- marionette-2:collection
- marionette-2:router
- marionette-2:all

## Typical workflow

```
yo marionette-2 # generates your application base and build workflow
yo marionette-2:model blog
yo marionette-2:collection blog
yo marionette-2:router blog
yo marionette-2:view blog
grunt serve
```


## Options

* `--appPath`

  Generate scaffold into a custom directory.

* `--requirejs`

  Generate scaffolds using RequireJS (AMD) Loader. By default check if project uses RequireJS.

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after
  scaffolding has finished.

* `--test-framework=[framework]`

  Defaults to `mocha`. Can be switched for
  another supported testing framework like `jasmine`.

* `--template-framework=[framework]`

  Defaults to `lodash` templating with grunt-contrib-jst.
  `handlebars` and `mustache` are also supported.

## A note regarding JST templates and strict mode

If you use strict mode in your app and JST templates the default grunt-jst implementation will cause your app to error out as the templates will be precompiled using a 'with' statement.

This can be addressed by changing the jst grunt task as follows:

```
jst: {
    compile: {
        options:
        {
            templateSettings:
            {
                variable: 'data'
            }
        },
        files: {
            '.tmp/scripts/templates.js': ['<%= yeoman.app %>/scripts/templates/*.ejs']
        }
    }
}
```
A result of this change is that your template variable definitions must also be updated from `<%= templateVariable %>` to `<%= data.templateVariable %>`. More information on this can be found in the [Underscore documentation](http://underscorejs.org/#template).

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
