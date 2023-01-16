const {colors} = require("./constants");
const logger = (msgs) => {
    const message = msgs.map(msg => msg.concat([colors.reset]).join('')).join('')
    console.log(`${colors.reset}${message}`);
}

const logError = (msg) => {
    logger([[colors.red, msg]])
}

const logInfo = (msg) => {
    logger([[colors.cyan, msg]])
}

const logSuccess = (msg) => {
    logger([[colors.green, msg]])
}

const logWarn = (msg) => {
    logger([[colors.yellow, msg]])
}

module.exports = {
    logger,
    logError,
    logInfo,
    logSuccess,
    logWarn
}