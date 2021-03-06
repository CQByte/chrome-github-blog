const path = require('path');
const Entry = require('./build/entries');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

let entry = Entry.entries();
let htmlPlugins = Entry.htmlPlugins();

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry,
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader'
			}
		]
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new CleanWebpackPlugin(),
		...htmlPlugins,
		new CopyWebpackPlugin([
			'manifest.json',
			{from: 'assets', to: 'assets'}
		],{copyUnmodified: true})// 因为每次都会清理dist，所以要强制复制所有文件
	],
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			'@': path.resolve('src'),
			'@assets': path.resolve('assets')
		}
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			// chunks: "all",
			cacheGroups: {
				vendors: {
					chunks: "all",
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					reuseExistingChunk: true
				}
			}
		}
	}
};
