const {colors, managers, commandsMap} = require('./constants');
const {logger, logInfo, logError} = require("./logger");

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

const arrayReplaceIfExists = (arr, find, replace) => {
    const index = arr.indexOf(find)
    if (index === -1) {
        return arr;
    }

    return ([...arr.slice(0, index), replace, ...arr.slice(index + 1)])
}

const handleInstall = (manager, args) => {
    if (!(manager === 'npm' && args.includes('install')  && args.includes('--dev'))) {
        return [manager, arrayReplaceIfExists(args, '--dev', commandsMap.installDev[manager])]
    }

    return [manager, args]
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
    logStatus('running', commandToExecute)
}

const init = (args) => {
    if (args.length === 0) {
        logInfo('Run "apm --help" for available commands.')
        return false
    }

    if (args[0] === '--help') {
        getInfoContent()
        return false
    }

    const pm = getManager()

    if (!pm) {
        logError('No supported package manager found in project')
        return false
    }

    return pm
}

const execAndLog = (pm, args) => {
    logCommand(pm, args)
    execCommand(pm, args)
}

const runDlx = (args) => {
    logInfo('running Agnostic Package Executor (APX)')
    const pm = init(args)

    if (!pm) {
        return
    }

    logStatus('package manager', pm)

    if (pm === 'npm') {
        execAndLog('npx', args)
        return
    }

    execAndLog(pm, ['dlx', ...args])
}

const runRun = (args) => {
    logInfo('running Agnostic Package Runner (APR)')
    const pm = init(args)

    if (!pm) {
        return
    }

    logStatus('package manager', pm)

    const [cmd, argsAfterGetCommand] = getCommand(pm, ['run', ...args])
    const arguments = removeEmpty([cmd, ...(argsAfterGetCommand ?? [])])
    execAndLog(pm, arguments)
}

const run = (args) => {
    const pm = init(args)

    if (!pm) {
        return
    }

    logStatus('package manager', pm)

    const [pmExec, argsAfterHandleNpx] = handleNpx(pm, args)
    const [cmd, argsAfterGetCommand] = getCommand(pmExec, argsAfterHandleNpx)
    const arguments = removeEmpty([cmd, ...(argsAfterGetCommand ?? [])])
    execAndLog(pmExec, arguments)
}

module.exports = {
    run,
    runRun,
    runDlx
}
