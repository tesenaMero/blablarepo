const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;

// For production. This will separate the css from the compiled js file and add it into another file
// This way js and css will load in parallel
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractDLS = new ExtractTextPlugin("dls.bundle.css")

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: ['.js', '.ts'] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.ts$/, include: /ClientApp/, use: ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] },
                { test: /\.html$/, use: 'html-loader?minimize=false' },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
                { test: /\.css$/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize'] },
                //{ test: /\.(sass|scss)$/, loader: ['to-string-loader'].concat(ExtractTextPlugin.extract(['raw-loader', 'sass-loader'])) }
                { test: /\.(sass|scss)$/, use: ["raw-loader", "sass-loader"] },
                { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] }
            ]
        },
        plugins: [
            new CheckerPlugin(),
        ]
    };

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig, {
        entry: { 'main-client': './ClientApp/boot-client.ts' },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig, {
        resolve: { mainFields: ['main'] },
        entry: { 'main-server': './ClientApp/boot-server.ts' },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            })
        ],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node',
        devtool: 'inline-source-map'
    });

    /**
     * This task compiles submodules needed.
     * Current submodules:
     * 
     * DLS (https://bitbucket.org/cemex/dlsdraft):
     *  deploys minified css with images needed as base64 data
     */
    const dlsBundleConfig = {
        entry: {
            dls: [
                "./submodules/dls/src/js/app.js",
                "./submodules/customizations/dls.custom.js",
            ]
        },
        output: {
            path: path.join(__dirname, clientBundleOutputDir, 'dls'),
            filename: '[name].bundle.js',
            publicPath: '/dist/dls/'
        },
        module: {
            rules: [
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
                { test: /\.(eot|svg|ttf|woff|woff2)$/, use: 'file-loader' },
                {
                    test: /\.s?css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            { loader: 'css-loader', options: { minimize: true } },
                            { loader: 'sass-loader' }
                        ],
                    })
                }
            ]
        },
        plugins: [
                new ExtractTextPlugin("dls.bundle.css"),
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                }),
            ]
            // .concat(isDevBuild ? [] : [
            //     new webpack.optimize.UglifyJsPlugin()
            // ])
    }

    return [clientBundleConfig, serverBundleConfig, dlsBundleConfig];
};