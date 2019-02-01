/*
 * The MIT License (MIT)
 * Copyright (c) 2019. Wise Wild Web
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  @author : Nathanael Braun
 *  @contact : n8tz.js@gmail.com
 */

var wpInherit = require('webpack-inherit');
var fs        = require("fs");
var webpack   = require("webpack");
var path      = require("path");
const wpiCfg  = wpInherit.getConfig()

var autoprefixer = require('autoprefixer');

module.exports = [
	{
		mode   : wpiCfg.vars.production ? "production" : "development",
		entry  : {
			App: [
				wpiCfg.vars.rootAlias + '/index.server'
			] // default to 'App'
		},
		target : 'async-node',
		output : {
			path         : wpInherit.getHeadRoot() + "/" + (wpiCfg.vars.targetDir || 'dist'),
			filename     : "[name].server.js",
			publicPath   : "/",
			libraryTarget: "commonjs2"
		},
		devtool: 'source-map',
		
		resolve: {
			symlinks  : false,
			extensions: [
				".",
				".api.js",
				".api.jsx",
				".js",
				".jsx",
				".json",
				".scss",
				".css",
			],
		},
		
		module : {
			rules: [
				{
					test   : /\.jsx?$/,
					exclude: wpInherit.isFileExcluded(),
					use    : {
						loader : 'babel-loader',
						options: {
							cacheDirectory: true, //important for performance
							presets       : [
								'@babel/preset-env',
								'@babel/preset-react',
							].map(require.resolve),
							plugins       : [
								[require.resolve("@babel/plugin-proposal-decorators"), { "legacy": true }],
								[require.resolve('@babel/plugin-proposal-class-properties'), {
									"loose": true
								}],
								[require.resolve("@babel/plugin-transform-runtime"), {}]
							]
						}
					}
				},
				{ test: /\.html$/, use: "file-loader?name=[name].[ext]" },
				{ test: /\.tpl$/, loader: "dot-tpl-loader?append=true" },
				{
					test  : /\.(scss|css|less|woff2|ttf|eot)(\?.*$|$)$/,
					loader: 'null-loader'
				}
			],
		},
		plugins:
			[
				wpInherit.plugin(),
				new webpack.BannerPlugin(fs.readFileSync("./LICENCE.HEAD.MD").toString())
			],
	}
]