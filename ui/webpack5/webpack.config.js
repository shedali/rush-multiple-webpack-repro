const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sveltePreprocess = require('svelte-preprocess');
const path = require('path');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const alias = { svelte: path.resolve('node_modules', 'svelte') };
const extensions = ['.mjs', '.js', '.ts', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];
const fileLoaderRule = {
  test: /\.(png|jpe?g|gif)$/i,
  use: ['file-loader']
};

module.exports = {
  entry: './src/index.ts',
  resolve: { alias, extensions, mainFields },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(svelte|html)$/,
        use: {
          loader: 'svelte-loader',
          options: {
            dev,
            hydratable: true,
            preprocess: sveltePreprocess(),
            hotReload: false // pending https://github.com/sveltejs/svelte/issues/2377
          }
        }
      },
      fileLoaderRule,
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },
  mode,
  plugins: [
    // pending https://github.com/sveltejs/svelte/issues/2377
    // dev && new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode)
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      templateParameters: {
        title: 'Kipling'
      },
      inject: false
    })
  ].filter(Boolean),
  devtool: dev && 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
	},
	devServer: {
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
		}  
	},

};
