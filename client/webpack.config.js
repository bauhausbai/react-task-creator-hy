var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'containers/styles'),
        loader: 'style!css?modules&localIdentName=[name]__[local]-[hash:base64:5]'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'components/styles'),
        loader: 'style!css?modules&localIdentName=[name]__[local]-[hash:base64:5]'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/styles'),
        loader: 'style!css'
      }
    ]
  }
}
