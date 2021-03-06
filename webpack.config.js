const path = require('path');

const baseConfig = {
  module: {
    rules: [
      {
        test: /(\.jsx)|(\.js)$/,
        exclude: /node-modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'example'),
    port: 9000
  },
  devtool: 'source-map'
};

const config = Object.assign({
  entry: {
    calendar: './example/calendar.js'
  },
  output: {
    path: path.resolve(__dirname, 'example'),
    filename: '[name].bundle.js'
  },
  mode: 'development'
}, baseConfig);

module.exports = config;