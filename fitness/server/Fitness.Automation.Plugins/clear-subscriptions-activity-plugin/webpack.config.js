var path = require('path');

module.exports = {
    entry: {
        'clear-subscriptions-activity': './src/clear-subscriptions-activity/clear-subscriptions-activity-plugin.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: path.resolve(__dirname, "node_modules")
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'plugin.js',
        library: "publishActivities",
        libraryTarget: "umd"
    },
	devtool: 'source-map',
    externals: [
        "@sitecore/ma-core",
        "@angular/core",
        "@angular/common",
        "@ngx-translate/core"
    ]
};