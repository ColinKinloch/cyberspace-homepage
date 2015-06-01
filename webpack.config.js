var path = require('path')
module.exports = {
  entry: {
    main: ['./app/script/main.js']
  },
  output: {
    path: path.join(__dirname, 'dist/scripts'),
    publicPath: '/scripts/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  resolve: {
    alias: {}
  },
  module: {
    loaders: [
    ]
  }
}
