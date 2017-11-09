// Определяем зависимости в переменных
var gulp = require('gulp'),
cache = require('gulp-cache'),
clean = require('gulp-clean'),
size = require('gulp-size'),
jshint = require('gulp-jshint'),
concat = require('gulp-concat'),
minifyCSS = require('gulp-clean-css'),
rename = require('gulp-rename');
var sass = require('gulp-sass');
var gutil = require('gulp-util')
var minify = require('gulp-minify');
var babel = require('gulp-babel');

gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
        //    exclude: ['tasks'],
            ignoreFiles: ['.min.js']
        }))
        .pipe(gulp.dest('dist/js'));
});

// Проверка ошибок в скриптах
gulp.task('lint', function() {
    return gulp.src(['src/js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
    return gulp.src(['src/css/*.css'])
        .pipe(concat('style.min.css'))
        .pipe(minifyCSS({
            keepBreaks: true
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('src/css'));
  });

gulp.task('watch', function() {
    gulp.watch('src/js/script.js', ['lint', 'js']);
    gulp.watch('src/css/*.css', ['css']);
});

gulp.task('sass:watch', function () {
    gulp.watch('src/scss/*.scss', ['sass']);
  });


// Выполняем по-умолчанию (вначале очистка и ребилд директории назначения, а потом выполнение остальных задач)
gulp.task('default', function() {
    gulp.start('sass', 'js');
});
