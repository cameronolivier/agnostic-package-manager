const {colors, managers, commandsMap} = require('./constants');

const { exec } = require("node:child_process");
const fs = require('node:fs');

// ref: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const logger = (msgs) => {
    const message = msgs.map(msg => msg.concat([colors.reset]).join('')).join('')
    console.log(`${colors.reset}${message}`);
}
const logFoundManager = (pm) => {
    logger([[colors.cyan, 'project found:'], [colors.brightYellow, pm]]);
}

const logError = (msg) => {
    logger([[colors.red, msg]])
}

const logInfo = (msg) => {
    logger([[colors.cyan, msg]])
}
const logWarn = (msg) => {
    logger([[colors.yellow, msg]])
}

const itemWithDescription = (num, content) => {
    return [[colors.brightCyan, `${num}: `], [colors.yellow, content]]
}

const info = () => {
    logInfo('APM has the following API:')
    logger(itemWithDescription('add', 'adds dependencies. Uses "install" command for npm.'))
    logger(itemWithDescription('install', 'installs packages'))
    logger(itemWithDescription('uninstall', 'uninstall command. Uses "remove" for yarn.'))
    logger(itemWithDescription('update', 'Update command. Uses "upgrade" for yarn.'))
    logger(itemWithDescription('dlx', 'works like "npx" across all package managers'))
    logInfo('All other commands the above will be passed to the underlying package manager.')
}

const getManager = () => {
    if (fs.existsSync('package-lock.json')) {
        logFoundManager(managers.npm)
        return managers.npm
    }
    if (fs.existsSync('pnpm-lock.yaml')) {
        logFoundManager(managers.pnpm)
        return managers.pnpm
    }
    if (fs.existsSync('yarn.lock')) {
        logFoundManager(managers.yarn)
        return managers.yarn
    }
    logError('No supported package manager found in project')
}

const handleNpx = (manager, args) => {
    if (!(manager === 'npm' && args.contains('dlx'))) {
        return [manager, args]
    }

    return ['npx', args.slice(1)]
}

const execPackageManagerCommand = (manager, command, args) => {
    const execCommand = [manager, command, args].join(' ')
    exec(execCommand, () => {
        logInfo('Command completed successfully.')
    })
}

const run = (givenArgs) => {
    if (givenArgs.length === 0) {
        logInfo('Run "apm --help" for available commands.')
        return
    }

    if (givenArgs[0] === '--help') {
        info()
        return
    }
    const [manager, args] = handleNpx(getManager(), givenArgs)
    const cmd = commandsMap[args[0]] ?? ''
    execPackageManagerCommand(manager, cmd, (cmd === '' ? args: args.slice(1)))
}

module.exports = {
    run
}