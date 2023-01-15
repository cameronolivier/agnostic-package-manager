const managers = {
    npm: 'npm',
    pnpm: 'pnpm',
    yarn: 'yarn',
}

const colors = {
    reset: '\x1b[0m',
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
    brightRed: "\x1b[1;31m",
    brightGreen: "\x1b[1;32m",
    brightYellow: "\x1b[1;33m",
    brightBlue: "\x1b[1;34m",
    brightMagenta: "\x1b[1;35m",
    brightCyan: "\x1b[1;36m",
    brightWhite: "\x1b[1;37m",
    brightGray: "\x1b[1;90m",
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
    uninstall: {
        npm: 'uninstall',
        yarn: 'remove',
        pnpm: 'uninstall',
    },
    update: {
        npm: 'update',
        yarn: 'upgrade',
        pnpm: 'update',
    },
    dlx: {
        npm: '',
        yarn: 'dlx',
        pnpm: 'dlx',
    }
}

module.exports = {
    colors,
    commandsMap,
    managers
}