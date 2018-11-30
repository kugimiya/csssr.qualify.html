let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sassOpts = {},

    browserSync = require('browser-sync'),
    gulpCopy = require('gulp-copy'),

    autoprefixer = require('gulp-autoprefixer'),
    autoprefixerOpts = {
        browsers: ['last 100 versions'],
        cascade: false
    },

    csso = require('gulp-csso'),
    pug = require('gulp-pug'),

    destBasePath = './../dist',
    srcBasePath = './',

    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),

    sassBuild = () => (
        gulp.src(`${srcBasePath}/styles/main.scss`)
            .pipe( sass(sassOpts).on('error', sass.logError) )
            .pipe( autoprefixer(autoprefixerOpts) )
            .pipe( csso() )
            .pipe( gulp.dest(`${destBasePath}/styles`) )
    ),

    pugBuild = () => (
        gulp.src(`${srcBasePath}/views/*.pug`)
            .pipe(pug())
            .pipe(gulp.dest(`${destBasePath}`))
    ),

    jsBuild = () => (
        gulp.src(`${srcBasePath}/js/main.js`)
            .pipe(webpackStream({
                output: {
                    filename: 'main.js',
                },
                module: {
                    rules: [
                        {
                            test: /\.(js)$/,
                            exclude: /(node_modules)/,
                            loader: 'babel-loader',
                            query: {
                                presets: ['env']
                            }
                        }
                    ]
                }
            }))
            .pipe(gulp.dest(`${destBasePath}/js`))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(`${destBasePath}/js`))
    ),

    copyAssets = () => (
        gulp.src(`${srcBasePath}/assets/**/*`)
            .pipe(gulpCopy(`${destBasePath}/assets`, { prefix: 1 }))
    );


gulp.task('sass', sassBuild);
gulp.task('sass:watch', () => (
    sassBuild()
        .pipe(browserSync.stream())
));


gulp.task('pug', pugBuild);
gulp.task('pug:watch', () => (
    pugBuild()
        .pipe(browserSync.stream())
));


gulp.task('scripts', jsBuild);
gulp.task('scripts:watch', () => {
    jsBuild()
        .pipe(browserSync.stream())
});


gulp.task('assets', copyAssets);
gulp.task('assets:watch', () => {
    copyAssets()
        .pipe(browserSync.stream())
});


gulp.task('dev:watch', () => {
    browserSync.create();
    browserSync.init({
        server: {
            baseDir: destBasePath
        }
    });

    gulp.watch(`${srcBasePath}/styles/**/*.scss`, ['sass:watch']);
    gulp.watch(`${srcBasePath}/views/**/*.pug`, ['pug:watch']);
    gulp.watch(`${srcBasePath}/js/**/*.js`, ['scripts:watch']);
    gulp.watch(`${srcBasePath}/assets/**/*`, ['assets:watch']);
    //gulp.watch(`${destBasePath}/*`).on('change', browserSync.reload);
});

gulp.task('dev', ['pug', 'sass', 'scripts', 'assets', 'dev:watch']);
gulp.task('build', ['pug', 'sass', 'scripts', 'assets']);