const convertEpochToDate = (epoch) => new Date(epoch * 1000)
const convertDateToEpoch = (date) => date.valueOf() / 1000

const speeds = {
    tram: 14,
    bus: 20,
    mainlineBus: 26,
    metro: 44,
}

module.exports = {
    convertEpochToDate,
    convertDateToEpoch,
    speeds,
}
