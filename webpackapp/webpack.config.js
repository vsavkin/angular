module.exports = {
  resolve: {
    root: __dirname,
    extensions: ['.ts', '.js']
  },
  entry: ["webpackapp"],
  output: {
    filename: "webappapp_bundle.js"
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}