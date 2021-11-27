class Logger {
    constructor() {
        this.log = []
    }

    add(data) {
        this.log.push(data)
    }

    getLog() {
        return this.log
    }
}

module.exports = Logger
