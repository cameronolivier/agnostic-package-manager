#! /usr/bin/env node
const { exec } = require("node:child_process");
const fs = require('node:fs');

const [,, ...args] = process.argv

if (args[0] === 'init') {
    exec('npm link', () => {
        console.log('initialised')
    })
    return;
}

const commandsMap = {
    add: {
        npm: 'install',
        yarn: 'add',
        pnpm: 'add',
    },
    install: {
        npm: 'install',
        yarn: 'install',
        pnpm: 'install',
    },
    run: {
        npm: 'run',
        yarn: 'run',
        pnpm: 'run',
    }
}


// ref: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const logFoundManager = (pm) => {
    console.log('\x1b[36m%s\x1b[0m', 'project found:', `\x1b[1;33m${pm}\x1b[0m` );
}

const getManager = () => {
    if (fs.existsSync('package-lock.json')) {
        logFoundManager('npm')
        return 'npm'
    }
    if (fs.existsSync('pnpm-lock.yaml')) {
        logFoundManager('pnpm')
        return 'pnpm'
    }
if (fs.existsSync('yarn.lock')) {
    logFoundManager('yarn')
    return 'yarn'
}
    console.log('\x1b[31m%s\x1b[0m', 'No supported package manager found in project');
}

getManager()


// TODO: use 'exec' to call the accepted pm with the commands.
//  Will need to set up a mapping of standard commands for each manager. eg: { add: { pnpm: 'add', npm: 'install', yarn: 'add')), etc.
//  Then we want build our command up with [package manager] [command] [args].
//  And finally use the exec fn to catch and handle the response.
//  (see here for example usage: https://stackabuse.com/executing-shell-commands-with-node-js/)
