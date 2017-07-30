var path = require('path');

module.exports = {
    context: __dirname,
    entry: path.join(__dirname, 'src/index'),
    output: {
		publicPath: '/',
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components|public\/)/,
                loader: "babel-loader"
            },
            { 
                test: /\.css$/, 
                loader: "style-loader!css-loader"
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'ilib': path.join(__dirname, '../../core/dist'),
            'ilib-vue': path.join(__dirname, '../code/dist')
        },
        extensions: [".webpack.js", ".web.js", ".js", ".jsx"]
    },
    devtool: 'eval'
}