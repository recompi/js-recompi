const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

var configs_ = [
  {
    entry: './src/recompi.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'recompi.js',
      clean: true,
      library: {
        name: 'RecomPI',
        type: 'umd',
      },
    },
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        vm: require.resolve('vm-browserify'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process-nextick-args/'),
      },
    },
    mode: 'development',
    plugins: [new webpack.ProvidePlugin({ process: 'process/browser' })],
  },
]

var config_

// minified config
configs_.push(JSON.parse(JSON.stringify(configs_[0])))
config_ = configs_[1]
delete config_.output.clean
config_.plugins = configs_[0].plugins
config_.output.filename = 'recompi.min.js'
config_.mode = 'production'
config_.devtool = false
config_.node = {
  global: true,
  __filename: true,
  __dirname: true,
}
config_.optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
          passes: 3,
        },
        format: {
          comments: false,
        },
      },
      extractComments: false,
    }),
  ],
}
config_.externals = {
  axios: 'axios',
}

// standalone config
configs_.push(JSON.parse(JSON.stringify(configs_[1])))
config_ = configs_[2]
config_.plugins = configs_[1].plugins
config_.output.filename = 'recompi.stl.js'
config_.optimization = configs_[1].optimization
delete config_.externals

module.exports = configs_
