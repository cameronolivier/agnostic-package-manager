#! /usr/bin/env node
const {runRun} = require('./utils');
const [,, ...args] = process.argv

runRun(args)
