module.exports = {
  resolve: {
    root: __dirname,
    extensions: ['.ts', '.js']
  },
  entry: ["webpackapp"],
  output: {filename: "webappapp_bundle.js"},
  externals: {'angular2/angular2': "angular2"},
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}