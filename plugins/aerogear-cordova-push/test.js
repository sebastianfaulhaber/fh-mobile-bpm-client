"use strict";
var cordova = require('cordova');

cordova.on('results', console.log);
cordova.on('log', console.log);
cordova.on('warn', console.warn);

process.chdir('/tmp/');

cordova.create('test', function(result) {
  process.chdir('/tmp/test');
  cordova.platform('add', 'android', function() {
    cordova.build(function() {
      console.log('done');
    });
  })
});