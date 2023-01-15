const {colors, managers, commandsMap} = require('./constants');

const { spawn } = require('node:child_process')
const fs = require('node:fs');

// ref: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const logger = (msgs) => {
    const message = msgs.map(msg => msg.concat([colors.reset]).join('')).join('')
    console.log(`${colors.reset}${message}`);
}
const logFoundManager = (pm) => {
    logger([[colors.cyan, 'package manager: '], [colors.brightYellow, pm]]);
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

const getInfoContent = () => {
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
    if (!(manager === 'npm' && args.includes('dlx'))) {
        return [manager, args]
    }

    return ['npx', args.slice(1)]
}

const execCommand = (manager, command, args) => {
    console.log({manager, command, args})
    const commandToExecute = [manager, command, args].join(' ').replace('  ', ' ').trim()
    logInfo(`Running: ${commandToExecute}`)
    spawn(manager, [command, args], {stdio: "inherit"})
}

const getCommand = (manager, args) => {
    const cmd = commandsMap[args[0]] || false

    if (!cmd) {
        return ['', args]
    }

    return [cmd[manager], args.slice(1)]
}

const run = (args) => {
    console.log({args})

    if (args.length === 0) {
        logInfo('Run "apm --help" for available commands.')
        return
    }

    if (args[0] === '--help') {
        getInfoContent()
        return
    }
    const [manager, argsAfterHandleNpx] = handleNpx(getManager(), args)
    const [cmd, argsAfterGetCommand] = getCommand(manager, argsAfterHandleNpx)
    execCommand(manager, cmd, argsAfterGetCommand)
}

module.exports = {
    run
}