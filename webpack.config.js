module.exports = {
  resolve: {
    root: [
      __dirname + "/dist/js/dev/es5",
      __dirname + "/node_modules"
    ]
  },
  entry: [
    "@reactivex/Rx.js",
    "zone.js/dist/zone-microtask.js",
    "reflect-metadata/Reflect",
    "angular2/angular2"
  ],
  output: {
    filename: "webpackapp/angular2/angular2.js",
		libraryTarget: 'var',
    library: 'angular2'
  },
  loaders: []
}