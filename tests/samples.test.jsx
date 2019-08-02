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

var fs            = require('fs');
var path          = require('path');

let util  = require('util'),
    spawn = require('child_process').spawn,
    kill  = require('fkill'),
    exec  = require('child_process').exec,
    cmd;

let samplesDir = path.normalize(__dirname + "/../samples/"),
    scopes     = {};
before(function () {
	return new Promise((resolve => {
		fs.readdir(samplesDir, function ( err, items ) {
			
			for ( let sample, i = 0; i < items.length; i++ ) {
				sample = items[i];
				describe('Test sample \'' + sample + "\' : ", () => {
					
					it('it setup correctly ' + sample, function ( done ) {
						this.timeout(Infinity);
						
						cmd = exec('npm i',
						           {
							           cwd: samplesDir + "/" + sample,
						           },
						           function ( code, outLog ) {
							           code && console.warn('setup fail : ' + code + '\n\n');
							           done(code);
						           }
						);
						
						
					});
					it('it run tests correctly ' + sample, function ( done ) {
						this.timeout(Infinity);
						
						cmd = exec('npm run test',
						           {
							           cwd: samplesDir + "/" + sample,
						           },
						           function ( code, outLog ) {
							           code && console.warn('setup fail : ' + code + '\n\n');
							           done(code);
						           }
						);
						
						cmd.stdout.on('data', data => process.stdout.write(data));
						cmd.stderr.on('data', data => process.stdout.write(data));
						
						
					});
					// ....
					after(function () {
						this.timeout(Infinity);
						return kill([":8080"], { tree: true, force: true, silent: true });
					});
				});
			}
			resolve();
		});
	}))
});
it('Load all sample tests', function () {
});