'use strict';

var Funnel = require('broccoli-funnel');
var htmlReplace = require('../html-replace');
var jsReplace = require("../js-replace");
var path = require('path');
var stew = require('broccoli-stew');

import compileWithTypescript from '../broccoli-typescript';
import destCopy from '../broccoli-dest-copy';
import flatten from '../broccoli-flatten';
import mergeTrees from '../broccoli-merge-trees';
import replace from '../broccoli-replace';
import {default as transpileWithTraceur, TRACEUR_RUNTIME_PATH} from '../traceur/index';


var projectRootDir = path.normalize(path.join(__dirname, '..', '..', '..', '..'));


const kServedPaths = [
  // Relative (to /modules) paths to benchmark directories
  'benchmarks/src',
  'benchmarks/src/change_detection',
  'benchmarks/src/compiler',
  'benchmarks/src/costs',
  'benchmarks/src/di',
  'benchmarks/src/element_injector',
  'benchmarks/src/largetable',
  'benchmarks/src/naive_infinite_scroll',
  'benchmarks/src/tree',
  'benchmarks/src/static_tree',

  // Relative (to /modules) paths to external benchmark directories
  'benchmarks_external/src',
  'benchmarks_external/src/compiler',
  'benchmarks_external/src/largetable',
  'benchmarks_external/src/naive_infinite_scroll',
  'benchmarks_external/src/tree',
  'benchmarks_external/src/tree/react',
  'benchmarks_external/src/static_tree',

  // Relative (to /modules) paths to example directories
  'examples/src/benchpress',
  'examples/src/model_driven_forms',
  'examples/src/template_driven_forms',
  'examples/src/person_management',
  'examples/src/order_management',
  'examples/src/gestures',
  'examples/src/hello_world',
  'examples/src/http',
  'examples/src/jsonp',
  'examples/src/key_events',
  'examples/src/routing',
  'examples/src/sourcemap',
  'examples/src/todo',
  'examples/src/zippy_component',
  'examples/src/async',
  'examples/src/material/button',
  'examples/src/material/checkbox',
  'examples/src/material/dialog',
  'examples/src/material/grid_list',
  'examples/src/material/input',
  'examples/src/material/progress-linear',
  'examples/src/material/radio',
  'examples/src/material/switcher',
  'examples/src/message_broker',
  'examples/src/web_workers/kitchen_sink',
  'examples/src/web_workers/todo'
];


module.exports = function makeBrowserTree(options, destinationPath) {
  var modulesTree = new Funnel('modules', {
    include: ['**/**'],
    exclude: [
      '**/*.cjs',
      'benchmarks/e2e_test/**',
      // Exclude ES6 polyfill typings when tsc target=ES6
      'angular2/traceur-runtime.d.ts',
      'angular2/typings/es6-promise/**'
    ],
    destDir: '/'
  });

  var scriptPathPatternReplacement = {
    match: '@@FILENAME_NO_EXT',
    replacement: function(replacement, relativePath) {
      return relativePath.replace(/\.\w+$/, '').replace(/\\/g, '/');
    }
  };

  modulesTree = replace(modulesTree, {
    files: ["examples*/**/*.js"],
    patterns: [{match: /\$SCRIPTS\$/, replacement: jsReplace('SCRIPTS')}]
  });

  // Use TypeScript to transpile the *.ts files to ES6
  var es6Tree = compileWithTypescript(modulesTree, {
    allowNonTsExtensions: false,
    declaration: true,
    emitDecoratorMetadata: true,
    mapRoot: '',  // force sourcemaps to use relative path
    noEmitOnError: false,
    rootDir: '.',
    sourceMap: true,
    sourceRoot: '.',
    target: 'ES6'
  });

  // Call Traceur to lower the ES6 build tree to ES5
  var es5Tree = transpileWithTraceur(es6Tree, {
    destExtension: '.js',
    destSourceMapExtension: '.js.map',
    traceurOptions: {modules: 'instantiate', sourceMaps: true}
  });

  // Now we add a few more files to the es6 tree that Traceur should not see
  ['angular2', 'rtts_assert'].forEach(function(destDir) {
    var extras = new Funnel('tools/build', {files: ['es5build.js'], destDir: destDir});
    es6Tree = mergeTrees([es6Tree, extras]);
  });

  var vendorScriptsTree = flatten(new Funnel('.', {
    files: [
      'node_modules/zone.js/dist/zone-microtask.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/systemjs/lib/extension-register.js',
      'node_modules/systemjs/lib/extension-cjs.js',
      'node_modules/rx/dist/rx.js',
      'node_modules/reflect-metadata/Reflect.js',
      'tools/build/snippets/runtime_paths.js',
      path.relative(projectRootDir, TRACEUR_RUNTIME_PATH)
    ]
  }));

  var vendorScripts_benchmark =
      new Funnel('tools/build/snippets', {files: ['url_params_to_form.js'], destDir: '/'});
  var vendorScripts_benchmarks_external =
      new Funnel('node_modules/angular', {files: ['angular.js'], destDir: '/'});

  // Get scripts for each benchmark or example
  let servingTrees = kServedPaths.reduce(getServedFunnels, []);
  function getServedFunnels(funnels, destDir) {
    let options = {srcDir: '/', destDir: destDir};
    funnels.push(new Funnel(vendorScriptsTree, options));
    if (destDir.indexOf('benchmarks') > -1) {
      funnels.push(new Funnel(vendorScripts_benchmark, options));
    }
    if (destDir.indexOf('benchmarks_external') > -1) {
      funnels.push(new Funnel(vendorScripts_benchmarks_external, options));
    }
    return funnels;
  }

  var htmlTree = new Funnel(modulesTree, {include: ['*/src/**/*.html'], destDir: '/'});
  htmlTree = replace(htmlTree, {
    files: ['examples*/**/*.html'],
    patterns: [
      {match: /\$SCRIPTS\$/, replacement: htmlReplace('SCRIPTS')},
      scriptPathPatternReplacement
    ]
  });


  htmlTree = replace(htmlTree, {
    files: ['benchmarks/**'],
    patterns: [
      {match: /\$SCRIPTS\$/, replacement: htmlReplace('SCRIPTS_benchmarks')},
      scriptPathPatternReplacement
    ]
  });

  htmlTree = replace(htmlTree, {
    files: ['benchmarks_external/**'],
    patterns: [
      {match: /\$SCRIPTS\$/, replacement: htmlReplace('SCRIPTS_benchmarks_external')},
      scriptPathPatternReplacement
    ]
  });

  var assetsTree =
      new Funnel(modulesTree, {include: ['**/*'], exclude: ['**/*.{html,ts,dart}'], destDir: '/'});

  var scripts = mergeTrees(servingTrees);
  var polymerFiles = new Funnel('.', {
    files: [
      'bower_components/polymer/lib/polymer.html',
      'tools/build/snippets/url_params_to_form.js'
    ]
  });
  var polymer = stew.mv(flatten(polymerFiles), 'benchmarks_external/src/tree/polymer');

  var reactFiles = new Funnel('.', {files: ['node_modules/react/dist/react.min.js']});
  var react = stew.mv(flatten(reactFiles), 'benchmarks_external/src/tree/react');

  htmlTree = mergeTrees([htmlTree, scripts, polymer, react]);

  es5Tree = mergeTrees([es5Tree, htmlTree, assetsTree]);
  es6Tree = mergeTrees([es6Tree, htmlTree, assetsTree]);

  var mergedTree = mergeTrees([stew.mv(es6Tree, '/es6'), stew.mv(es5Tree, '/es5')]);

  return destCopy(mergedTree, destinationPath);
};
