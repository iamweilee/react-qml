/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * @flow
 */
/* eslint-disable no-param-reassign */

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const webpack = require('webpack');

const path = require('path');

const AssetResolver = require('../resolvers/AssetResolver');
const getBabelConfig = require('./getBabelConfig');
const haulProgressBar = require('./haulProgressBar');
const createQrc = require('./createQrc');

const PLATFORMS = ['macos', 'windows'];

type ConfigOptions = {
  root: string,
  dev: boolean,
};

type WebpackPlugin = {
  apply: (typeof webpack) => void,
};

type WebpackEntry = string | Array<string> | Object;

type WebpackConfig = {
  entry: WebpackEntry,
  output: {
    path: string,
    filename: string,
  },
  name?: string,
  plugins: WebpackPlugin[],
};

type WebpackConfigFactory =
  | ((ConfigOptions, WebpackConfig) => WebpackConfig)
  | WebpackConfig;

/**
 * Returns default config based on environment
 */
const getDefaultConfig = ({
  platform,
  root,
  dev,
  minify,
  port,
}): WebpackConfig => {
  process.env.NODE_ENV = dev ? 'development' : 'production';

  const devServerHost = process.env.DEV_SERVER_HOST || 'localhost';

  // Getting Minor version
  const platformProgressBar = haulProgressBar(platform);
  const jsExcludePattern = /((node_modules(\/|\\)(?!react|@expo|pretty-format|react-qml|react-qml-cli|react-qml-renderer|qt-react))|qt-react|react-qml-renderer)/;
  return {
    context: root,
    entry: [],
    output: {
      path: path.join(root, 'dist'),
      filename: `${platform}.bundle.js`,
      library: 'Bundle',
      publicPath: `http://localhost:${port}/`,
    },
    module: {
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.js$/,
          exclude: jsExcludePattern,
          use: [
            {
              loader: require.resolve('thread-loader'),
            },
            {
              loader: require.resolve('babel-loader'),
              options: Object.assign({}, getBabelConfig(root), {
                /**
                 * to improve the rebuild speeds
                 * This enables caching results in ./node_modules/.cache/babel-loader/
                 * This is a feature of `babel-loader` and not babel
                 */
                cacheDirectory: dev,
              }),
            },
          ],
        },
        {
          test: /^(.+).qml$/,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                publicPath: '/',
                name: () => {
                  if (dev) {
                    return '[path][name].[ext]?[hash]';
                  }
                  return '[path][name].[ext]';
                },
              },
            },
          ],
        },
        {
          test: /\.(ttf)$/,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                publicPath: '/',
                name: () => {
                  if (dev) {
                    return '[path][name].[ext]?[hash]';
                  }
                  return '[path][name].[ext]';
                },
              },
            },
          ],
        },
        {
          test: /\.(bmp|gif|jpg|jpeg|png|psd|svg|webp|m4v|aac|aiff|caf|m4a|mp3|wav|html|pdf)$/,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                publicPath: '/',
                name: () => {
                  if (dev) {
                    return '[path][name].[ext]?[hash]';
                  }
                  return '[path][name].[ext]';
                },
              },
            },
          ],
        },
        {
          test: /runtime\.js$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /GeneratorFunctionPrototype\.constructor = GeneratorFunction;/gi,
                replacement: () => {
                  return `Object.defineProperty(GeneratorFunctionPrototype, 'constructor', { value: GeneratorFunction });`;
                },
              },
            ],
          }),
        },
        {
          test: /rxjs(\/|\\).*\.js$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /this\.constructor = d;/gi,
                replacement: () => {
                  return `Object.defineProperty(this, 'constructor', { value: d });`;
                },
              },
            ],
          }),
        },
        {
          test: /(invariant|invariant(\/|\\)browser)\.js$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /error\.name =/gi,
                replacement: () => {
                  return `// error.name =`;
                },
              },
            ],
          }),
        },
        {
          test: /connected-react-router.*\.js$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern:
                  '_RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;',
                replacement: () => {
                  return '_RewireModuleId__ = globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;';
                },
              },
            ],
          }),
        },
      ],
    },
    plugins: [
      /**
       * MacOS has a case insensitive filesystem
       * This is needed so we can error on incorrect case
       */
      new CaseSensitivePathsPlugin(),

      new webpack.ProgressPlugin(perc => {
        platformProgressBar(platform, perc);
      }),

      new webpack.DefinePlugin({
        /**
         * Various libraries like React rely on `process.env.NODE_ENV`
         * to distinguish between production and development
         */
        'process.env.NODE_ENV': dev ? '"development"' : '"production"',
        'process.env.DEV_SERVER_HOST': JSON.stringify(devServerHost),
        'process.env.DEV_SERVER_ORIGIN': JSON.stringify(
          `ws://${devServerHost}:${port}`
        ),
        'process.env.__REACT_DEVTOOLS_HOST__':
          process.env.__REACT_DEVTOOLS_HOST__ || JSON.stringify(devServerHost),
        'process.env.__REACT_DEVTOOLS_PORT__':
          process.env.__REACT_DEVTOOLS_PORT__,
        __DEV__: dev,
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: !!minify,
        debug: dev,
      }),
      new StringReplacePlugin(),
    ]
      .concat(
        dev
          ? [
              new webpack.HotModuleReplacementPlugin(),
              // new webpack.SourceMapDevToolPlugin({
              //   test: /\.(js|css|(js)?bundle)($|\?)/i,
              //   filename: '[file].map',
              // }),
              // new webpack.EvalSourceMapDevToolPlugin({
              //   module: true,
              // }),
              new webpack.NamedModulesPlugin(),
            ]
          : [
              /**
               * By default, sourcemaps are only generated with *.js files
               * We need to use the plugin to configure *.bundle (Android, iOS - development)
               * and *.jsbundle (iOS - production) to emit sourcemap
               */
              // new webpack.SourceMapDevToolPlugin({
              //   test: /\.(js|css|(js)?bundle)($|\?)/i,
              //   filename: '[file].map',
              // }),
              new webpack.optimize.ModuleConcatenationPlugin(),
              new GenerateAssetPlugin({
                filename: 'bundle.qrc',
                fn: (compilation, cb) => {
                  cb(null, createQrc(compilation));
                },
              }),
            ]
      )
      .concat(
        minify
          ? [
              new webpack.optimize.UglifyJsPlugin({
                /**
                 * By default, uglify only minifies *.js files
                 * We need to use the plugin to configure *.bundle (Android, iOS - development)
                 * and *.jsbundle (iOS - production) to get minified.
                 * Also disable IE8 support as we don't need it.
                 */
                test: /\.(js|(js)?bundle)($|\?)/i,
                sourceMap: true,
                compress: {
                  screw_ie8: false,
                  warnings: false,
                },
                mangle: {
                  screw_ie8: false,
                },
                output: {
                  comments: false,
                  screw_ie8: false,
                },
              }),
            ]
          : []
      ),
    resolve: {
      plugins: [
        /**
         * This is required by asset loader to resolve extra scales
         * It will resolve assets like image@1x.png when image.png is not present
         */
        new AssetResolver({ platform }),
      ],
      /**
       * Match what React Native packager supports
       * First entry takes precendece
       */
      mainFields: ['react-native', 'browser', 'main'],
      extensions: [`.${platform}.js`, '.native.js', '.js'],
    },
    /**
     * Set target to webworker as it's closer to RN environment than `web`.
     */
    target: 'webworker',
  };
};

/**
 * Creates an array of configs based on changing `env` for every
 * platform and returns
 */
function makeReactQMLConfig(
  userWebpackConfig: WebpackConfigFactory,
  options: ConfigOptions
): [Array<WebpackConfig>, typeof PLATFORMS] {
  const configs = PLATFORMS.map(platform => {
    const env = Object.assign({}, options, { platform });
    const defaultWebpackConfig = getDefaultConfig(env);
    const polyfillPath = require.resolve('./polyfillEnvironment.js');

    const userConfig =
      typeof userWebpackConfig === 'function'
        ? userWebpackConfig(env, defaultWebpackConfig)
        : userWebpackConfig;

    const config = Object.assign({}, defaultWebpackConfig, userConfig, {
      entry: injectPolyfillIntoEntry(userConfig.entry, polyfillPath),
      name: platform,
    });

    return config;
  });

  return [configs, PLATFORMS];
}

/*
 * Takes user entries from react-qml.config.js,
 * change them to multi-point entries
 * and injects polyfills
 */
function injectPolyfillIntoEntry(
  userEntry: WebpackEntry,
  polyfillPath: string
): WebpackEntry {
  if (typeof userEntry === 'string') {
    return [polyfillPath, userEntry];
  }
  if (Array.isArray(userEntry)) {
    return [polyfillPath, ...userEntry];
  }
  if (typeof userEntry === 'object') {
    const chunkNames = Object.keys(userEntry);
    return chunkNames.reduce((entryObj: Object, name: string) => {
      // $FlowFixMe
      const chunk = userEntry[name];
      if (typeof chunk === 'string') {
        entryObj[name] = [polyfillPath, chunk];
        return entryObj;
      } else if (Array.isArray(chunk)) {
        entryObj[name] = [polyfillPath, ...chunk];
        return entryObj;
      }
      return chunk;
    }, {});
  }
  return userEntry;
}

module.exports = { makeReactQMLConfig, injectPolyfillIntoEntry };
