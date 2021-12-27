const PathFinder = require('@pathfinder/PathFinder')

const runPathFinder = async (from, to, startTime) => {
    const result = await PathFinder.search(from, to, startTime)
    return result
}
const runCache = async (from, to, startTime) => {
    const result = await PathFinder.search(from, to, startTime)
    const result2 = await PathFinder.search(result.from, result.to, startTime)
    const result3 = await PathFinder.search(result2.from, result2.to, startTime)
    const result4 = await PathFinder.search(result3.from, result3.to, startTime)
    const result5 = await PathFinder.search(result4.from, result4.to, startTime)
    return result5
}

module.exports = {
    runCache,
    runPathFinder,
}
