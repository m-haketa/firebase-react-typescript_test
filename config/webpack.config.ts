import * as webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import path from 'path';

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/client/index.html',
  filename: './index.html',
});

const config: webpack.Configuration = {
  entry: './src/client/index.tsx',
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?modules'],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [htmlWebpackPlugin /*, new BundleAnalyzerPlugin()*/],
};

export default config;
