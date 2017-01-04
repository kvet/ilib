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
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|public\/)/,
                loader: "babel"
            },
            { 
                test: /\.css$/, 
                loader: "style-loader!css-loader"
            }
        ]
    },
    resolve: {
        alias: {
            'ilib': path.join(__dirname, '../../core/dist'),
            'ilib-react': path.join(__dirname, '../code/dist')
        },
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
    }
}