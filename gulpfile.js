const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const less = require('gulp-less');
const stylus = require('gulp-stylus');

const imagemin = require('gulp-imagemin');

var htmlclean = require('gulp-htmlclean');

// css
const cssFiles = [
  './src/css/main.css',
  './src/css/media.css'
]

// scss & sass
const sassFiles = [
  './src/scss/global.sass',
  './src/scss/main.scss',
  './src/scss/media.scss'
]

// less
const lessFiles = [
  './src/less/global.less',
  './src/less/main.less',
  './src/less/media.less'
]


const jsFiles = [
  './src/js/lib.js',
  './src/js/main.js'
]

// // css
// const styles = () => (
//   gulp.src(cssFiles)
//   .pipe(concat('styles.css'))
//   .pipe(autoprefixer({cascade: false}))
//   .pipe(cleanCSS({level: 2}))
//   .pipe(gulp.dest('build/css'))
//   .pipe(browserSync.stream())
// )

// // sass & scss
// const styles = () => (
//   gulp.src(sassFiles)
//   .pipe(sourcemaps.init())
//   .pipe(sass())
//   .pipe(concat('styles.css'))
//   .pipe(autoprefixer({cascade: false}))
//   .pipe(cleanCSS({level: 2}))
//   .pipe(sourcemaps.write('./'))
//   .pipe(gulp.dest('build/css'))
//   .pipe(browserSync.stream())
// )

// less
const styles = () => (
  gulp.src(lessFiles)
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(concat('styles.css'))
  .pipe(autoprefixer({cascade: false}))
  .pipe(cleanCSS({level: 2}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream())
)

const scripts = () =>(
  gulp.src(jsFiles)
  .pipe(concat('script.js'))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify({
    toplevel: true
  }))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.stream())
)

const clean = () => (
  del(['build/*'])
)

const minimazeImage = () => (
  gulp.src('./src/img/**')
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(gulp.dest('./build/img'))
);

const html = () => (
  gulp.src('./*.html')
  .pipe(htmlclean())
  .pipe(gulp.dest('./build'))
);

const fonts = () => (
  gulp.src('./src/fonts/*{ttf,woff,woff2,svg,eot}')
  .pipe(gulp.dest('./build/fonts'))
);

const watch = () => {
  browserSync.init({
    server: {
        baseDir: "./"
    }
  });

  //html
  gulp.watch('./*.html').on('change', browserSync.reload);
 
  // css
  //gulp.watch('./src/css/**/*.css', styles);

  // // scss & sass
  // gulp.watch('./src/scss/**/*.scss', styles);
  // gulp.watch('./src/scss/**/*.sass', styles);

  // less
  gulp.watch('./src/less/**/*.less', styles);

  //script
  gulp.watch('./src/js/**/*.js', scripts);

  // img
  gulp.watch('./src/img/**', minimazeImage);

  // fonts
  fulp.watch('./src/fonts', fonts);

}  

// gulp.task('style', styles);
// gulp.task('script', scripts);
// gulp.task('del', clean);
// gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, minimazeImage, html, fonts)));
gulp.task('default', gulp.series('build', watch));

