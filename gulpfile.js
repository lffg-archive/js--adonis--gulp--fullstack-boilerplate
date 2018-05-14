'use strict'

/**
 * ---------------------------------------------------------------------
 * Dependencies
 * ---------------------------------------------------------------------
 */

const gulp       = require('gulp')
const rename     = require('gulp-rename')
const plumber    = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const babel      = require('gulp-babel')
const concat     = require('gulp-concat')
const uglify     = require('gulp-uglify')
const sass       = require('gulp-sass')
const prefixer   = require('gulp-autoprefixer')
const path       = require('path')

/**
 * ---------------------------------------------------------------------
 * Paths & options
 * ---------------------------------------------------------------------
 */

const SRC_PATHS = {
  js           : path.join(__dirname, 'resources', 'assets', 'js', '**', '*.js'),
  vendorScripts: path.join(__dirname, 'resources', 'assets', 'vendor', 'js', '**', '*.js'),
  styles       : path.join(__dirname, 'resources', 'assets', 'scss', 'index.scss')
}

const DEST_PATHS = {
  js           : path.join(__dirname, 'public', 'js'),
  vendorScripts: path.join(__dirname, 'public', 'js', 'vendor'),
  styles       : path.join(__dirname, 'public', 'css')
}

const WATCH = {
  js           : path.join(__dirname, 'resources', 'assets', 'js', '**', '*.js'),
  styles       : path.join(__dirname, 'resources', 'assets', 'scss', '**', '*.scss')
}

/**
 * ---------------------------------------------------------------------
 * Gulp Tasks
 * ---------------------------------------------------------------------
 */

function js (done) {
  gulp.src(SRC_PATHS.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST_PATHS.js))

  done()
}

function vendorScripts (done) {
  gulp.src(SRC_PATHS.vendorScripts)
    .pipe(plumber())
    .pipe(concat('vendor-bundle.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(DEST_PATHS.vendorScripts))

  done()
}

function styles (done) {
  gulp.src(SRC_PATHS.styles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(prefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST_PATHS.styles))

  done()
}

function watch () {
  gulp.watch(WATCH.js, js)
  gulp.watch(WATCH.styles, styles)
}

exports.js = js
exports.vendorScripts = vendorScripts
exports.styles = styles

var build = gulp.series(gulp.parallel(styles, js, vendorScripts))
var dev = gulp.series(gulp.parallel(watch, styles, js, vendorScripts))

gulp.task('build', build)
gulp.task('default', dev)
