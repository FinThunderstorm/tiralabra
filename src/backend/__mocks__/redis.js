const check = async (key) => {
    const expired = 0
    return expired > 0
}

const set = async (key, value) => {
    const nothing = key
    const allting = value
}

const get = async (key) => {
    const value = {}
    value[key] = 2
    return value
}

const getAllKeys = async () => {
    const keys = [1, 2, 3]
    return keys
}

const getAllValues = async (keys) => {
    console.log(keys)
    return [1, 2, 3]
}

const flushall = async () => {
    const result = 'nothing'
    return result
}

module.exports = {
    test,
    check,
    set,
    get,
    getAllKeys,
    getAllValues,
    flushall,
}
