#! /usr/bin/env node
const fs = require('node:fs');
const {run} = require('./utils');
const [,, ...args] = process.argv

run(args)

// TODO: use 'exec' to call the accepted pm with the commands.
//  Will need to set up a mapping of standard commands for each manager. eg: { add: { pnpm: 'add', npm: 'install', yarn: 'add')), etc.
//  Then we want build our command up with [package manager] [command] [args].
//  And finally use the exec fn to catch and handle the response.
//  (see here for example usage: https://stackabuse.com/executing-shell-commands-with-node-js/)
