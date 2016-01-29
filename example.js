#!/usr/bin/env node
// run: node example.js

var path = require('path');

var Markov = require('./markov');

var file_path = process.argv[2] || path.join(__dirname , 'tom_sawyer.txt');
console.log(new Markov(file_path).generate(20));

