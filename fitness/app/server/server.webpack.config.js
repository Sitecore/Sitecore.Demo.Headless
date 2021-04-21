const path = require('path');
const env = require('@babel/preset-env');
const reactApp = require('babel-preset-react-app');
const webpack = require('webpack');

// Webpack build configuration to build the SSR bundle.
// Invoked by build:server.

module.exports = {
  // BEGIN DEMO CUSTOMIZATION - To use TypeScript
  devtool: 'cheap-eval-source-map',
  // END DEMO CUSTOMIZATION
  mode: 'production',
  entry: path.resolve(__dirname, './server.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'server.bundle.js',
    libraryTarget: 'this',
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    // BEGIN DEMO CUSTOMIZATION - To use Firebase in the server build
    mainFields: [ 'main', 'module', 'browser' ],
    // END DEMO CUSTOMIZATION
    // BEGIN DEMO CUSTOMIZATION - To use TypeScript
    extensions: ['.js', '.jsx', '.ts', '.tsx']
    // END DEMO CUSTOMIZATION
  },
  module: {
    rules: [
      {
        // BEGIN DEMO CUSTOMIZATION - To use TypeScript
        test: /\.(tsx?|m?jsx?)?$/,
        // END DEMO CUSTOMIZATION
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [env, reactApp],
          },
        },
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: { loader: 'html-loader' },
      },
      {
        // BEGIN DEMO CUSTOMIZATION - To use TypeScript
        // anything not JS, TS, or HTML, we load as a URL
        // this makes static image imports work with SSR
        test: /\.(?!js|mjs|jsx|ts|tsx|html|graphql$)[^.]+$/,
        // END DEMO CUSTOMIZATION
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        // BEGIN DEMO CUSTOMIZATION - To use TypeScript
        // anything in node_modules that isn't js and TS,
        // we load as null - e.g. imported css from a module,
        // that is not needed for SSR
        test: /\.(?!js|mjs|jsx|ts|tsx|html|graphql$)[^.]+$/,
        // END DEMO CUSTOMIZATION
        include: /node_modules/,
        use: {
          loader: 'null-loader',
        },
      },
    ],
  },
  plugins: [
    // BEGIN DEMO CUSTOMIZATION - To use TypeScript
    new webpack.NormalModuleReplacementPlugin(
      /\/iconv-loader$/, require.resolve('node-noop')
    ),
    new webpack.ProvidePlugin({
      "React": "react",
    })
    // END DEMO CUSTOMIZATION
  ],
};
