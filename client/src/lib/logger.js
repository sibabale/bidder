const isDev = process.env.NODE_ENV === 'development'

const logger = {
    log: (...args) => isDev && console.log(...args),
    warn: (...args) => isDev && console.warn(...args),
    error: (...args) => console.error(...args),
}

export default logger
