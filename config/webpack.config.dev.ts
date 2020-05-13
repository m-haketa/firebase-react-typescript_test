import * as webpack from 'webpack';
import merge from 'webpack-merge';
import webpackConfig from './webpack.config';

const config: webpack.Configuration = merge(webpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    inline: true,
    open: true,
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        logLevel: 'debug',
      },
    },
  },
});

export default config;
