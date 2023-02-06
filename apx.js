#! /usr/bin/env node
const {runDlx} = require('./utils');
const [,, ...args] = process.argv

runDlx(args)