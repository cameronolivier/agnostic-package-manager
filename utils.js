const {colors, managers, commandsMap} = require('./constants');
const {logger, logInfo, logError} = require("./logger");

const { spawn } = require('node:child_process')
const fs = require('node:fs');

const logFoundManager = (pm) => {
    logger([[colors.cyan, 'package manager: '], [colors.brightYellow, pm]]);
}

const itemWithDescription = (num, content) => {
    return [[colors.brightCyan, `${num}: `], [colors.yellow, content]]
}

const getInfoContent = () => {
    logInfo('APM currently works with Npm, Yarn and Pnpm.')
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
    return false
}

const handleNpx = (manager, args) => {
    if (!(manager === 'npm' && args.includes('dlx'))) {
        return [manager, args]
    }

    return ['npx', args.slice(1)]
}

const removeEmpty = (arr) =>
    arr.filter(item => !!item)

const removeWhiteSpace = (str) => str.replace(/\s/g, ' ').trim()


const execCommand = (manager, command, args) => {
    const arguments = removeEmpty([command, ...(args ?? [])])

    const commandToExecute = removeWhiteSpace([manager, arguments.join(' ')].join(' '))
    logInfo(`Running: ${commandToExecute}`)
    spawn(manager, arguments, {stdio: "inherit"})
}

const getCommand = (manager, args) => {
    const cmd = commandsMap[args[0]] || false

    if (!cmd) {
        return ['', args]
    }

    return [cmd[manager], args.slice(1)]
}

const run = (args) => {
    if (args.length === 0) {
        logInfo('Run "apm --help" for available commands.')
        return
    }

    if (args[0] === '--help') {
        getInfoContent()
        return
    }

    const man = getManager()

    if (!man) {
        logError('No supported package manager found in project')
        return
    }

    const [manager, argsAfterHandleNpx] = handleNpx(man, args)
    const [cmd, argsAfterGetCommand] = getCommand(manager, argsAfterHandleNpx)
    console.log({cmd, argsAfterGetCommand})
    execCommand(manager, cmd, argsAfterGetCommand)
}

module.exports = {
    run
}
