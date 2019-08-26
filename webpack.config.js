const webpack = require('webpack');
const path = require('path'); 
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    watchContentBase: true,
    compress: true,
    progress: true,
    hot: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader",
            "css-loader",
            "sass-loader"
        ]
      },
      {
        test: /\.svg$/,
        loader: "url-loader?mimetype=image/svg+xml"
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV) 
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ],
};
