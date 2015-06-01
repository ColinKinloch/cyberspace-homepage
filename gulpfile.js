(function() {
  'use strict'
  var gulp = require('gulp')
  var $ = require('gulp-load-plugins')()

  var del = require('del')
  var _ = require('lodash')

  var webpack = require('webpack')
  var webpackDevMiddleware = require('webpack-dev-middleware')
  var webpackConfig = require('./webpack.config.js')
  var webpackDevConfig = _.extend(webpackConfig, {
    debug: true,
    devtool: 'eval'
  })
  gulp.task('webpack', function(cb) {
    webpack(webpackConfig,
    function(err, stats) {
      console.log('[webpack]', stats.toString())
      cb()
    })
  })

  gulp.task('javascript', function() {
    return gulp.src('')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.size())
  })

  gulp.task('styles', function() {
    return $.rubySass('app/styles/index.scss', {
      sourcemap: true,
      style: 'expanded',
      precision: 10
    })
    .on('error', function(err) {
      console.error('Error:', err.message)
    })
    .pipe($.sourcemaps.write())
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size())
  })

  gulp.task('clean', function(cb) {
    del(['.tmp', 'dist'], cb)
  })

  gulp.task('build', ['styles', 'webpack'])

  gulp.task('default', ['clean'], function() {
    gulp.start('build')
  })

  gulp.task('watch', function() {
    gulp.start('connect')
  })

  gulp.task('connect', ['build'], function() {
    var devCompiler = webpack(webpackDevConfig)
    var express = require('express')
    var serveStatic = require('serve-static')
    var serveIndex = require('serve-index')
    var bodyParser = require('body-parser')

    $.livereload.listen(35729, function() {
      console.log('Listening on', 35729)
    })

    var app = express()
    app
    .use(bodyParser.json())
    //.use(require('connect-livereload')())
    .use(webpackDevMiddleware(devCompiler, {
      contentBase: './app/',
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true
      }
    }))
    .use(serveStatic('app'))
    .use(serveStatic('.tmp'))
    .use(serveIndex('app'))

    require('http').createServer(app)
    .listen(9000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9000')
    })
  })

  gulp.task('publish', ['build'], function() {
    var publisher = $.awspublish.create({
      params: {
        Bucket: 'colin.kinlo.ch'
      }
    })
    return gulp.src('./dist/*')
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter())
  })
})()
