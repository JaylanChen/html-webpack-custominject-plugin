'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlWebpackCustomInjectPlugin {
  apply(compiler) {
    // html-webpack-plugin 4.x
    if (HtmlWebpackPlugin.getHooks) {
      compiler.hooks.compilation.tap('HtmlWebpackCustomInject', function (compilation) {
        HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync('HtmlWebpackCustomInject', function (htmlPluginData, callback) {
          let htmlWebpackPluginOptions = htmlPluginData.plugin.options;

          const { htmlTagObjectToString } = require('html-webpack-plugin/lib/html-tags');

          const styleHtmlStr = htmlPluginData.headTags.reduce((styleTagHtml, assetTagObject) => styleTagHtml + htmlTagObjectToString(assetTagObject, htmlWebpackPluginOptions.xhtml), '');
          const scriptHtmlStr = htmlPluginData.bodyTags.reduce((scriptTagHtml, assetTagObject) => scriptTagHtml + htmlTagObjectToString(assetTagObject, htmlWebpackPluginOptions.xhtml), '');

          customInjectAsset(htmlPluginData, { styleHtmlStr, scriptHtmlStr }, callback);
        });
      });
    } else {
      // html-webpack-plugin 3.2
      compiler.hooks.compilation.tap('HtmlWebpackCustomInject', function (compilation) {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('HtmlWebpackCustomInject', function (htmlPluginData, callback) {

          let styleHtmlStr = htmlPluginData.assets.css.reduce((styleTagHtml, styleAsset) => styleTagHtml + '<link rel="stylesheet" href="' + styleAsset + '"/>', '');
          let scriptHtmlStr = htmlPluginData.assets.js.reduce((scriptTagHtml, scriptAsset) => scriptTagHtml + '<script src="' + scriptAsset + '"></script>', '');

          customInjectAsset(htmlPluginData, { styleHtmlStr, scriptHtmlStr }, callback);
        });
      });
    }
  }

}

/**
 * Custom inject assets
 */
function customInjectAsset(htmlPluginData, assetsData, callback) {
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
  if (assetsData.styleHtmlStr) {
    htmlPluginData.html = htmlPluginData.html.replace(htmlWebpackPluginOptions.styleplaceholder, assetsData.styleHtmlStr);
  }

  // Custom inject scripts
  if (assetsData.scriptHtmlStr) {
    htmlPluginData.html = htmlPluginData.html.replace(htmlWebpackPluginOptions.scriptplaceholder, assetsData.scriptHtmlStr);
  }
  if (callback) {
    return callback(null);
  } else {
    return;
  }
};

module.exports = HtmlWebpackCustomInjectPlugin;