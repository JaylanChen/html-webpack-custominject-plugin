'use strict';

function HtmlWebpackCustomInjectPlugin() {}

HtmlWebpackCustomInjectPlugin.prototype.apply = function (compiler) {
  var self = this;

  if (compiler.hooks) {
    // webpack 4 support
    compiler.hooks.compilation.tap('HtmlWebpackCustomInject', function (compilation) {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('HtmlWebpackCustomInject', function (htmlPluginData, callback) {
        self.customInjectAsset(htmlPluginData, callback);
      });
    });
  } else {
    // Hook into the html-webpack-plugin processing
    compiler.plugin('compilation', function (compilation) {
      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
        self.customInjectAsset(htmlPluginData, callback);
      });
    });
  }
};

/**
 * Custom inject assets
 */
HtmlWebpackCustomInjectPlugin.prototype.customInjectAsset = function (htmlPluginData, callback) {
  let htmlWebpackPluginOptions = htmlPluginData.plugin.options;
  // Skip if the plugin configuration didn't set `custominject` to true or `inject` true
  if (!htmlWebpackPluginOptions.custominject || htmlWebpackPluginOptions.inject) {
    if (callback) {
      return callback(null);
    } else {
      return;
    }
  }

  // Skip if the plugin configuration didn't set `styleplaceholder` or `scriptplaceholder`, then use html-webpack-plugin default inject
  if (!htmlWebpackPluginOptions.styleplaceholder || !htmlWebpackPluginOptions.scriptplaceholder) {
    htmlWebpackPluginOptions.inject = true;
    if (callback) {
      return callback(null);
    } else {
      return;
    }
  }

  // Custom inject styles
  if (htmlPluginData.assets.css && htmlWebpackPluginOptions.styleplaceholder) {
    var styleRegexp = new RegExp(htmlWebpackPluginOptions.styleplaceholder);
    if (styleRegexp.test(htmlPluginData.html)) {
      let styleStr = '';
      htmlPluginData.assets.css.forEach(function (item) {
        styleStr += '<link rel="stylesheet" href="' + item + '"/>';
      });
      htmlPluginData.html = htmlPluginData.html.replace(htmlWebpackPluginOptions.styleplaceholder, styleStr);
    }
  }

  // Custom inject scripts
  if (htmlPluginData.assets.js && htmlWebpackPluginOptions.scriptplaceholder) {
    var scriptRegexp = new RegExp(htmlWebpackPluginOptions.scriptplaceholder);
    if (scriptRegexp) {
      let scriptStr = '';
      htmlPluginData.assets.js.forEach(function (item) {
        scriptStr += '<script src="' + item + '"></script>'
      });
      htmlPluginData.html = htmlPluginData.html.replace(htmlWebpackPluginOptions.scriptplaceholder, scriptStr);
    }
  }
  if (callback) {
    return callback(null);
  } else {
    return;
  }
};

module.exports = HtmlWebpackCustomInjectPlugin;