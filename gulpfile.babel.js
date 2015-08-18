/**
 * Based on Google Web Starter
 *
 * Our environment is for developing Python Web Apps with Pyramid and Angular JS, SASS:
 *
 *     ROOT
 *      |
 *      +-- client
 *      |    |
 *      |    +-- src
 *      |    |    |
 *      |    |    +-- app
 *      |    |    +-- assets                      SASS is in here, will be compiled to CSS, which also is in here
 *      |    |    +-- bower_components            3rd-party libs
 *      |    |    +-- vendor                      ditto, but they do not use bower
 *      |    |
 *      |    +-- dist                             Tree like src built by gulp's default task or serve:dist
 *      |
 *      +-- project                               Root of Python sources
 *      |
 *      ...
 */


'use strict';

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const SRC_DIR = 'client/src/';
const DIST_DIR = 'client/dist/';

/**
 * JSHint JavaScript
 *
 * Tell PyCharm to use the config file, so this task and PyCharm use the same settings.
 */
gulp.task(
    'jshint', () =>
        gulp.src(
            [
                SRC_DIR + 'app/**/*.js',
                '!' + SRC_DIR + 'app/**/*_test.js'
            ]
        )
            .pipe(reload({
                stream: true,
                once: true
            }))
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
);

/**
 * Optimize images
 */
gulp.task(
    'images', () =>
        gulp.src(SRC_DIR + 'assets/img/**/*')
            .pipe(
            $.cache(
                $.imagemin(
                    {
                        progressive: true,
                        interlaced: true
                    }
                )
            )
        )
            .pipe(gulp.dest(DIST_DIR + 'assets/img'))
            .pipe($.size({title: 'images'}))
);

/**
 * Copy static files to dist
 *
 * These are in folders `bower_components` and `vendor`.
 * Also copy the CSS file built from SASS.
 */
gulp.task(
    'copy', () => {
        gulp.src(
            [
                SRC_DIR + '*.html'
            ], {
                dot: true
            }
        ).pipe(gulp.dest(DIST_DIR));
        gulp.src(
            [
                SRC_DIR + 'bower_components/**/*'
            ], {
                dot: true
            }
        ).pipe(gulp.dest(DIST_DIR + 'bower_components'));
        gulp.src(
            [
                SRC_DIR + 'vendor/**/*'
            ], {
                dot: true
            }
        ).pipe(gulp.dest(DIST_DIR + 'vendor'));
        gulp.src(
            [
                SRC_DIR + 'assets/**/*',
                // These are handled separately
                '!' + SRC_DIR + 'assets/fonts/**/*',
                '!' + SRC_DIR + 'assets/img/**/*',
                '!' + SRC_DIR + 'assets/sass/**/*'
            ], {
                dot: true
            }
        ).pipe(gulp.dest(DIST_DIR + 'assets'))
        .pipe($.size({title: 'copy'}));
    }
);

/**
 * Copy web fonts to dist
 */
gulp.task(
    'fonts', () =>
        gulp.src([SRC_DIR + 'assets/fonts/**'])
            .pipe(gulp.dest(DIST_DIR + 'assets/fonts'))
            .pipe($.size({title: 'fonts'}))
);

/**
 * Compile and automatically prefix stylesheets
 *
 * Write built CSS file to SRC ! not DIST. We need that in devel too!
 */
gulp.task(
    'styles', () => {
        const AUTOPREFIXER_BROWSERS = [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
        ];

        // For best performance, don't add Sass partials to `gulp.src`
        return gulp.src(
            [
                SRC_DIR + 'assets/sass/**/*.{scss,css}',
                '!' + SRC_DIR + 'assets/sass/**/_*.{scss,css}'
            ]
        )
            .pipe($.changed('.tmp/styles', {extension: '.css'}))
            .pipe($.sourcemaps.init())
            .pipe(
                $.sass(
                    {
                    precision: 10
                }
                ).on('error', $.sass.logError)
            )
            .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
            .pipe(gulp.dest('.tmp'))
            // Concatenate and minify styles
            .pipe($.if('*.css', $.minifyCss()))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(SRC_DIR + 'assets/css/'))
            .pipe($.size({title: 'styles'}));
    }
);

/**
 * Concatenate and minify JavaScript
 */
gulp.task(
    'scripts', () =>
        gulp.src(
            [
                // Note: Since we are not using useref in the scripts build pipeline,
                //       you need to explicitly list your scripts here in the right order
                //       to be correctly concatenated
                SRC_DIR + 'app/_forward_declarations.js',
                SRC_DIR + 'app/app.js',
                SRC_DIR + 'app/**/*.js',
                '!' + SRC_DIR + 'app/**/*_test.js'
                // Other scripts
            ]
        )
            .pipe($.concat('main.min.js'))
            //.pipe($.uglify({preserveComments: 'some'}))
            // Output files
            .pipe(gulp.dest(DIST_DIR + 'app'))
            .pipe($.size({title: 'scripts'}))
);

/**
 * Resolve script in HTML comments.
 *
 * We use this in the default index file to discern loading scripts and CSS for development and for production.
 */
gulp.task('html-prep', function() {
  gulp.src(SRC_DIR + '**/*-preprocess.html')
    .pipe($.preprocess({context: { ENVIRONMENT: 'devel'}}))
    .pipe($.rename(function (path) {path.basename = path.basename.replace(/-preprocess/, '');}))
    .pipe(gulp.dest(SRC_DIR));
  gulp.src(SRC_DIR + '**/*-preprocess.html')
    .pipe($.preprocess({context: { ENVIRONMENT: 'prod'}}))
    .pipe($.rename(function (path) {path.basename = path.basename.replace(/-preprocess/, '');}))
    .pipe(gulp.dest(DIST_DIR));
});

/**
 * Scan your HTML for assets & optimize them
 *
 * CAVEAT: Minifying HTML seems to garble it. So its deactivated.
 */
gulp.task(
    'html', () => {
        const assets = $.useref.assets({searchPath: '{.tmp,' + SRC_DIR + '}'});

        return gulp.src(SRC_DIR + '**/*.html')
            .pipe(assets)
            // Remove any unused CSS
            // Note: If not using the Style Guide, you can delete it from
            //       the next line to only include styles your project uses.
            .pipe(
            $.if(
                '*.css', $.uncss(
                    {
                        html: [
                            SRC_DIR + 'index.html'
                        ],
                        // CSS Selectors for UnCSS to ignore
                        ignore: [
                            /.navdrawer-container.open/,
                            /.app-bar.open/
                        ]
                    }
                )
            )
        )

            // Concatenate and minify styles
            // In case you are still using useref build blocks
            .pipe($.if('*.css', $.minifyCss()))
            .pipe(assets.restore())
            .pipe($.useref())

            //// Minify any HTML
            //.pipe($.if('*.html', $.minifyHtml()))
            // Output files
            .pipe(gulp.dest(DIST_DIR))
            .pipe($.size({title: 'html'}));
    }
);

/**
 * Clean output directory
 */
gulp.task(
    'clean',
        cb => del(
        [
            '.tmp',
            DIST_DIR + '*',
            '!' + DIST_DIR + '.git',
            SRC_DIR + 'index.html'
        ],
        {dot: true},
        cb
    )
);

/**
 * Watch files for changes & reload
 *
 * For devel we proxy the pages served by Pyramid's Waitress.
 */
gulp.task(
    'serve', ['styles', 'html-prep'], () => {
        browserSync(
            {
                notify: false,
                // Customize the BrowserSync console logging prefix
                logPrefix: 'WSK',
                // Run as an https by uncommenting 'https: true'
                // Note: this uses an unsigned certificate which on first access
                //       will present a certificate warning in the browser.
                // https: true,
                //server: ['.tmp', SRC_DIR]
                proxy: 'http://localhost:6543',
                port: 3000
            }
        );

        gulp.watch([SRC_DIR + '**/*.html'], reload);
        gulp.watch(
            [SRC_DIR + 'assets/sass/**/*.{scss,css}'],
            [
                'styles',
                reload
            ]
        );
        gulp.watch([SRC_DIR + 'assets/css/**/*.css'], reload);
        gulp.watch([SRC_DIR + 'app/**/*.js'], ['jshint']);
        gulp.watch([SRC_DIR + 'assets/img/**/*'], reload);
    }
);

/**
 * Build and serve the output from the dist build
 */
gulp.task(
    'serve:dist', ['default'], () =>
        browserSync(
            {
                notify: false,
                logPrefix: 'WSK',
                // Run as an https by uncommenting 'https: true'
                // Note: this uses an unsigned certificate which on first access
                //       will present a certificate warning in the browser.
                // https: true,
                //server: DIST_DIR,
                //baseDir: DIST_DIR
                proxy: 'http://localhost:7100',
                port: 3000
            }
        )
);

/**
 * Build production files, the default task
 */
gulp.task(
    'default', ['clean'], cb =>
        runSequence(
            'styles',
            ['html-prep', 'jshint', 'html', 'scripts', 'images', 'fonts', 'copy'],
            'generate-service-worker',
            cb
        )
);

/**
 * Run PageSpeed Insights
 */
gulp.task(
    'pagespeed', cb =>
        // Update the below URL to the public URL of your site
        pagespeed(
            'example.com', {
                strategy: 'mobile'
                // By default we use the PageSpeed Insights free (no API key) tier.
                // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
                // key: 'YOUR_API_KEY'
            }, cb
        )
);

// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
gulp.task(
    'generate-service-worker', cb => {
        const rootDir = DIST_DIR;

        swPrecache(
            {
                // Used to avoid cache conflicts when serving on localhost.
                cacheId: pkg.name || 'web-starter-kit',
                staticFileGlobs: [
                    // Add/remove glob patterns to match your directory setup.
                    `${rootDir}/assets/fonts/**/*.woff`,
                    `${rootDir}/assets/img/**/*`,
                    `${rootDir}/app/**/*.js`,
                    `${rootDir}/assets/css/**/*.css`,
                    `${rootDir}/*.{html,json}`
                ],
                // Translates a static file path to the relative URL that it's served from.
                stripPrefix: path.join(rootDir, path.sep)
            }, (err, swFileContents) => {
                if (err) {
                    cb(err);
                    return;
                }

                const filepath = path.join(rootDir, 'service-worker.js');

                fs.writeFile(
                    filepath, swFileContents, err => {
                        if (err) {
                            cb(err);
                            return;
                        }

                        cb();
                    }
                );
            }
        );
    }
);

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }

