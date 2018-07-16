Custom injection extension for the HTML Webpack Plugin
========================================

Enhances [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)
functionality by adding the `{custominject: true|false, styleplaceholder: 'style_placeholder_string', scriptplaceholder: 'script_placeholder_string'}` option.

This is an extension plugin for the [webpack](http://webpack.github.io) plugin [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) - a plugin that simplifies the creation of HTML files to serve your webpack bundles.

Installation
------------
You must be running webpack on node

Install the plugin with npm:
```shell
$ npm install --save-dev html-webpack-custominject-plugin
```

Basic Usage
-----------
Require the plugin in your webpack config:

```javascript
var HtmlWebpackCustomInjectPlugin = require('html-webpack-custominject-plugin');
```

Add the plugin to your webpack config as follows:

```javascript
plugins: [
  new HtmlWebpackPlugin(),
  new HtmlWebpackCustomInjectPlugin()
]  
```
The above configuration will actually do nothing due to the configuration defaults.

As soon as you now set `custominject` to `true`, `inject` to `false`, `styleplaceholder`, `scriptplaceholder` and template contain style_placeholder_string and script_placeholder_string, the generated output of the HtmlWebpackPlugin will
inject styles and scripts in specific location(by replace the placeholder_string). This is very useful if you want to custom inject style and scripts.
```javascript
plugins: [
  new HtmlWebpackPlugin({
		inject: false,
		custominject: true,
		styleplaceholder: 'style_placeholder_string',
		scriptplaceholder: 'script_placeholder_string'
	}),
  new HtmlWebpackCustomInjectPlugin()
]  
```
Even if you generate multiple files make sure that you add the HtmlWebpackHarddiskPlugin **only once**:

```javascript
plugins: [
  new HtmlWebpackPlugin({
		inject: false,
		custominject: true,
		styleplaceholder: 'style_placeholder_string',
		scriptplaceholder: 'script_placeholder_string'
	}),
  new HtmlWebpackPlugin({
		filename: 'demo.html',
		inject: false,
		custominject: true,
		styleplaceholder: 'style_placeholder_string',
		scriptplaceholder: 'script_placeholder_string'
	}),
  new HtmlWebpackPlugin({
		filename: 'test.html',		
		inject: false,
		custominject: true,
		styleplaceholder: 'style_placeholder_string',
		scriptplaceholder: 'script_placeholder_string'
	}),
  new HtmlWebpackCustomInjectPlugin()
]  
```

This plugin does not actually perform custom injection in the following cases.

1.It will do nothing if the plugin configuration didn't set `custominject` to true or set `inject` true
2.It will do nothing if the plugin configuration didn't set `styleplaceholder` or `scriptplaceholder`, then will use html-webpack-plugin default inject

If you didn't set `styleplaceholder` or `scriptplaceholder` placeholder string in you temeplates, actually unable to implement custom injection.
