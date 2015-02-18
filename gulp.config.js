module.exports = function() {
    var client = './src/client/';
    var clientApp = client + 'app/';
    var root = './';
    var server = './src/server/';
    var temp = './.tmp/';

    var deploy = '//axcuscatwsweb01/c$/inetpub/wwwroot/launchpad';

    var config = {


        /*
         * Files paths
         */
        alljs: [
            './src/**/*.js',
            './*js'
        ],
        build: './build/',
        client: client,
        css: [
            client + 'styles/*.css',
            clientApp + '**/*.css'
        ],
        cssLess: temp + 'styles.css',
        deploy: deploy,
        fonts: [
            './bower_components/font-awesome/fonts/**/*.*',
            './bower_components/webfont-opensans/fonts/**/*.*'
        ],
        html: '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        less: client + 'styles/styles.less',
        root: root,
        server: server,
        temp: temp,

        /*
         * Optimized Files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /*
         * Template Cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }
        },

        /*
         * Browser Sync
         */
        browserReloadDelay: 1000,

        /*
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'
        },
        packages: [
            './package.json',
            './bower.json'
        ],

        /*
         * Node Settings
         */
        defaultPort: 7203,
        nodeServer: './src/server/app.js'

    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};
