const {colors, managers, commandsMap} = require('./constants');
const {logger, logInfo, logError, logSuccess} = require("./logger");

const { spawn } = require('node:child_process')
const fs = require('node:fs');

const logStatus = (cat, what) => {
    logger([[colors.cyan, `${cat}: `], [colors.brightCyan, what]]);
}
const itemWithDescription = (num, content) => {
    return [[colors.brightCyan, `${num}: `], [colors.yellow, content]]
}

const getInfoContent = () => {
    logInfo('APM currently works with Npm, Yarn and Pnpm.')
    logInfo('')
    logInfo('APM has the following API:')
    logger(itemWithDescription('› add', 'adds dependencies. Uses "install" command for npm.'))
    logger(itemWithDescription('› dlx', 'works like "npx" across all package managers'))
    logger(itemWithDescription('› install', 'installs packages'))
    logger(itemWithDescription('› run', 'Runs a script. Consistent across all managers.'))
    logger(itemWithDescription('› uninstall', 'uninstall command. Uses "remove" for yarn.'))
    logger(itemWithDescription('› update', 'Update command. Uses "upgrade" for yarn.'))
    logInfo('')
    logInfo('All other commands the above will be passed to the underlying package manager.')
}

const getManager = () => {
    if (fs.existsSync('package-lock.json')) {
        return managers.npm
    }
    if (fs.existsSync('pnpm-lock.yaml')) {
        return managers.pnpm
    }
    if (fs.existsSync('yarn.lock')) {
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


const execCommand = (manager, args) => {
    spawn(manager, args, {stdio: "inherit"})
}

const getCommand = (manager, args) => {
    const cmd = commandsMap[args[0]] || false

    if (!cmd) {
        return ['', args]
    }

    return [cmd[manager], args.slice(1)]
}

const logCommand = (manager, arguments) => {
    const commandToExecute = removeWhiteSpace([manager, arguments.join(' ')].join(' '))
    logStatus('Running', commandToExecute)
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

    const pm = getManager()

    if (!pm) {
        logError('No supported package manager found in project')
        return
    }

    logStatus('package manager', pm)

    const [pmExec, argsAfterHandleNpx] = handleNpx(pm, args)
    const [cmd, argsAfterGetCommand] = getCommand(pmExec, argsAfterHandleNpx)
    const arguments = removeEmpty([cmd, ...(argsAfterGetCommand ?? [])])
    logCommand(pmExec, arguments)
    execCommand(pmExec, arguments)
}

module.exports = {
    run
}
