(function() {
    'use strict';

    var gulp = require('gulp');
    var args = require('yargs').argv;
    var $ = require('gulp-load-plugins')({lasy:true});
    var browserSync = require('browser-sync');
    var config = require('./gulp.config')();
    var del = require('del');
    var port = process.env.PORT || config.defaultPort;


    gulp.task('help', $.taskListing);
    gulp.task('default', ['help']);

    ////////////////////
    //
    // Run Code through JSHint and JSCS
    //
    ////////////////////
    gulp.task('vet', function() {
        log('Analyzing source with JSHint and JSCS.');

        return gulp
            .src(config.alljs)
            .pipe($.if(args.verbose, $.print()))
            .pipe($.jscs())
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
            .pipe($.jshint.reporter('fail'));
    });

    ////////////////////
    //
    // Complie LESS --> CSS
    // Clean the styles folder first
    //
    ////////////////////
    gulp.task('styles', ['clean-styles'], function() {
        log('Compiling Less --> CSS');

        return gulp
            .src(config.less)
            .pipe($.plumber()) // Catch any errors
            .pipe($.less())
            .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
            .pipe(gulp.dest(config.temp));
    });

    ////////////////////
    //
    // Copy fonts to build folder
    // Clean the fonts folder first
    //
    ////////////////////
    gulp.task('fonts', ['clean-fonts'], function() {
        log('Copying fonts.');
        return gulp
            .src(config.fonts)
            .pipe(gulp.dest(config.build + 'fonts'));
    });

    ////////////////////
    //
    // Optimize images then copy them to build folder
    // Clean the images folder first
    //
    ////////////////////
    gulp.task('images', ['clean-images'], function() {
        log('Copying images.');
        return gulp
            .src(config.images)
            .pipe($.imagemin({optimizationLevel: 4}))
            .pipe(gulp.dest(config.build + 'images'));
    });

    ////////////////////
    //
    // Clean the build and temp folders
    //
    ////////////////////
    gulp.task('clean', function(done) {
        var delconfig = [].concat(config.build, config.temp);
        log('Cleaning: ' + $.util.colors.blue(delconfig));
        del(delconfig, done);
    });

    ////////////////////
    //
    // Clean the fonts folder
    //
    ////////////////////
    gulp.task('clean-fonts', function(done) {
        clean(config.build + 'fonts/**/*.*', done);
    });

    ////////////////////
    //
    // Clean the images folder
    //
    ////////////////////
    gulp.task('clean-images', function(done) {
        clean(config.build + 'images/**/*.*', done);
    });

    ////////////////////
    //
    // Clean the styles folder
    //
    ////////////////////
    gulp.task('clean-styles', function(done) {
        clean(config.temp + '**/*.css', done);
    });

    ////////////////////
    //
    // Clean the html and js from the temp & build folders
    //
    ////////////////////
    gulp.task('clean-code', function(done) {
        var files = [].concat(
            config.temp + '**/*.js',
            config.build + '**/*.html',
            config.build + 'js/**/*.js'
        );
        clean(files, done);
    });

    ////////////////////
    //
    // Watch the .less files and run the styles task on save
    //
    ////////////////////
    gulp.task('less-watcher', function(done) {
        gulp.watch([config.less], ['styles']);
    });

    ////////////////////
    //
    // Create the $templateCache for AngularJS
    //
    ////////////////////
    gulp.task('templatecache', ['clean-code'], function() {
        //TODO There is an error in here when running serve-build and editing an html file.
        log('Creating AngularJS $templateCache');
        return gulp
            .src(config.htmltemplates)
            .pipe($.plumber()) // Catch any errors
            .pipe($.minifyHtml({empty:true}))// minify the html and leave any empty elements intact
            .pipe($.angularTemplatecache(
                config.templateCache.file,
                config.templateCache.options
            ))
        .pipe(gulp.dest(config.temp));
    });

    ////////////////////
    //
    // Run Wiredep to look at bower_components amd pull the lib js files into index.html
    //
    ////////////////////
    gulp.task('wiredep', function() {
        log('Wire up the bower css, js and our app js into the html.');
        var options = config.getWiredepDefaultOptions();
        var wiredep = require('wiredep').stream;

        return gulp
            .src(config.index)
            .pipe(wiredep(options))
            .pipe($.inject(gulp.src(config.js)))
            .pipe(gulp.dest(config.client));
    });

    ////////////////////
    //
    // Inject the css into index.html
    // First run styles task to compile LESS
    // Also make sure $templateCache and wiredep have run
    //
    ////////////////////
    gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
        log('Wire up the css into the html, and call wiredep');

        return gulp
            .src(config.index)
            .pipe($.inject(gulp.src(config.css)))
            .pipe(gulp.dest(config.client));
    });

    ////////////////////
    //
    // Inject templates.js ($templateCache) into index.html
    // Also remove individual js & css references
    // Replace with single reference for each concatenated file
    // (app.css, lib.css, app.js, lib.js)
    //
    ////////////////////
    gulp.task('optimize', ['inject', 'fonts', 'images'], function() {
        log('Optimizing the javascript, css, html');

        var assets = $.useref.assets({searchPath: './'});
        var templateCache = config.temp + config.templateCache.file;
        var cssFilter = $.filter('**/*.css');
        var jsLibFilter = $.filter('**/' + config.optimized.lib);
        var jsAppFilter = $.filter('**/' + config.optimized.app);

        return gulp
            .src(config.index)
            .pipe($.plumber())
            .pipe($.inject(gulp.src(templateCache, {read: false}), {
                starttag: '<!-- inject:templates:js -->' // injects templates.js into index.html at this tag location
            }))
            .pipe(assets) // Gets the build assets marked with <!-- build:xxx --> tags
            .pipe(cssFilter) // Go get CSS
            .pipe($.csso()) // Minify/optimize CSS
            .pipe(cssFilter.restore()) // Restore CSS
            .pipe(jsLibFilter)// Go get Vendor JS
            .pipe($.uglify()) // Minify Vendor JS
            .pipe(jsLibFilter.restore())// Restore Vendor JS
            .pipe(jsAppFilter)// Go get App JS
            .pipe($.ngAnnotate()) // Fixes angular DI issues with minifying
            .pipe($.uglify()) // Minify App JS
            .pipe(jsAppFilter.restore())// Restore App JS
            .pipe($.rev())// Renames file from app.js --> app-k3huy7.js or similar
            .pipe(assets.restore()) // Restores the build assets
            .pipe($.useref()) // This line replaces all references & comment tags
            .pipe($.revReplace())// Point script refs in index.html to newly rev'd file
            .pipe(gulp.dest(config.build)) // Write files to build folder
            .pipe($.rev.manifest()) // Create a manifest file to show rev from & to filenames
            .pipe(gulp.dest(config.build)); // Write out rev manifest file to build folder
    });

    ////////////////////
    //
    // Bump the version number in package.json
    // --type=pre will bump the prerelease version *.*.*-x
    // --type=patch or no flag will bump the patch version *.*.x
    // --type=minor will bump the minor version *.x.*
    // --type=major will bump the major version x.*.*
    // --version=1.2.3 will bump to a specific version and ignore other flags
    //
    ////////////////////
    gulp.task('bump', function() {
        var msg = 'Bumping versions';
        var type = args.type;
        var version = args.version;
        var options = {};

        if (version) {
            options.version = version;
            msg += ' to ' + version;
        } else {
            options.type = type;
            msg += ' to ' + type;
        }
        log(msg);

        return gulp
            .src(config.packages)
            .pipe($.bump(options))
            .pipe($.print())
            .pipe(gulp.dest(config.root));
    });

    ////////////////////
    //
    // Run nodemon to serve the build version
    //
    ////////////////////
    gulp.task('serve-build', ['optimize'], function() {
        serve(false /* isDev */);
    });

    ////////////////////
    //
    // Run nodemon to serve the dev version
    //
    ////////////////////
    gulp.task('serve-dev', ['vet', 'inject'], function() {
        serve(true /* isDev */);
    });







    ////////////////////////////////////////////////////////////
    //
    // Subtasks
    //
    ////////////////////////////////////////////////////////////

    ////////////////////
    //
    // Serve the site (build or dev)
    //
    ////////////////////
    function serve(isDev) {

        var nodeOptions = {
            script: config.nodeServer,
            delayTime: 1,
            env: {
                'PORT': port,
                'NODE_ENV': isDev ? 'dev' : 'build'
            },
            watch: [config.server] // Watch for changes to app.js. Currently not working for some freaking reason
        };

        return $.nodemon(nodeOptions)
            ////////////////////
            //
            // restart nodemon and browsersync and run vet task
            //
            ////////////////////
            .on('restart', ['vet'], function(ev) {
                log('*** nodemon restarted ***');
                log('files changed on resart:\n' + ev);
                setTimeout(function() {
                    browserSync.notify('reloading now ...');
                    browserSync.reload({stream:false});
                }, config.browserReloadDelay);
            })
            ////////////////////
            //
            // start nodemon and browsersync
            //
            ////////////////////
            .on('start', function() {
                log('*** nodemon started ***');
                startBrowserSync(isDev);
            })
            ////////////////////
            //
            // notify on crash
            //
            ////////////////////
            .on('crash', function() {
                log('*** nodemon crashed: script crashed for some reason ***');
            })
            ////////////////////
            //
            // notify on clean exit
            //
            ////////////////////
            .on('exit', function() {
                log('*** nodemon exited cleanly ***');
            });
    }

    ////////////////////
    //
    // This tells us what changed during the gul watch event
    // It will give us a really long file path so we use
    // a RegEx to remove the path and just show what file changed
    // and what type of change it was
    //
    ////////////////////
    function changeEvent(event) {
        var srcPattern =  new RegExp('/.*(?=/' + config.source + ')/');
        log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
    }

    ////////////////////
    //
    // Configure browsersync
    // Use gulp serve-dev --nosync to disable browsersync
    //
    ////////////////////
    function startBrowserSync(isDev) {
        if (args.nosync || browserSync.active) {
            return;
        }

        log('Starting browser-sync on port' + port);

        ////////////////////
        //
        // Make sure LESS is compiled when browsersync is started
        //
        ////////////////////
        if (isDev) {
            // watch the LESS files and re-compile if changed
            gulp.watch([config.less], ['styles'])
                .on('change', function(event) {
                    changeEvent(event);
                });
        } else {
            // Watch all the files in and rebuild and restart browsersync
            gulp.watch([config.less, config.js, config.html], ['optimize', browserSync.reload])
                .on('change', function(event) {
                    changeEvent(event);
                });
        }

        var options = {
            proxy: 'localhost:' + port,
            port: 3000,
            ////////////////////
            //
            // In Dev mode we want to watch the LESS and complie and
            // browsersync is already handling the reloading the files
            // In build mode we want to watch all the files in the build then restart browsersync
            // Because we want EVERYTHING to happen them for browsersync to kick in
            //
            ////////////////////
            files: isDev ? [
                config.client + '**/*.*',
                '!' + config.less,
                config.temp + '**/*.css'
            ] : [],
            ghostMode: {
                clicks: true,
                location: false,
                forms: true,
                scroll: true
            },
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'debug',
            logPrefix: 'gulp-patterns',
            notify: true,
            reloadDelay: 0
        };

        browserSync(options);
    }

    ////////////////////
    //
    // Clean function
    //
    ////////////////////
    function clean(path, done) {
        log('Cleaning: ' + $.util.colors.blue(path));
        del(path, done);
    }

    ////////////////////
    //
    // Log function
    //
    ////////////////////
    function log(msg) {
        if (typeof (msg) === 'object') {
            for (var item in msg) {
                if (msg.hasOwnProperty(item)) {
                    $.util.log($.util.colors.blue(msg[item]));
                }
            }
        } else {
            $.util.log($.util.colors.blue(msg));
        }
    }
})();
