var gulp          = require('gulp'),
    sass          = require('gulp-sass')(require('sass')),
    cssmin        = require('gulp-cssmin'),
    rename        = require('gulp-rename'),
    autoprefixer  = require('gulp-autoprefixer'),
    sourcemaps    = require('gulp-sourcemaps'),
    purify        = require('gulp-purifycss'),
    uncss         = require('gulp-uncss'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),

    notify        = require('gulp-notify');

var assetsDir = 'src',
    coreDir = '../public_html/core/elements/',
    pagesSrc = coreDir+'**/*.html',
    chunkSrc = coreDir+'**/*.html'
    productionDir = '../public_html/assets/project_files';

//----------------------------------------------------Compiling

gulp.task('sass', function () {
    return gulp.src([assetsDir + '/sass/**/*.scss', '!' + assetsDir + '/sass/**/_*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
        .pipe(autoprefixer(['last 5 versions']))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(productionDir + '/css/'))
});

gulp.task('jsBuild', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        'node_modules/swiper/swiper-bundle.js',
        'node_modules/typed.js/lib/typed.js',
        'node_modules/jquery/dist/jquery.js',
        assetsDir + '/js/**/*.js',
        '!'+assetsDir + '/js/**/*.min.js'])
        .pipe(uglify())
        .pipe(rename(function(path){
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest(productionDir + '/js/'))
});
// .pipe(purify([pagesSrc, chunkSrc, assetsDir+'/js/**/*']))
gulp.task('cssBuild', function () {
    return gulp.src([productionDir + '/css/**/*.css','!' + productionDir + '/css/**/*.min.css'])
        .pipe(uncss({html: [pagesSrc]}))
        .pipe(cssmin())
        .pipe(rename(function(path){
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest(productionDir + '/css/'))
});

gulp.task('default', gulp.series('sass', 'cssBuild','jsBuild'));

gulp.task('watch', function() {
    gulp.watch(assetsDir + '/js/**/*.js', gulp.series('jsBuild'));
    gulp.watch(assetsDir + '/sass/**/*.scss', gulp.series('sass', 'cssBuild'));
    gulp.watch(pagesSrc, gulp.series('sass', 'cssBuild'));
    gulp.watch(chunkSrc, gulp.series('sass', 'cssBuild'));
});

