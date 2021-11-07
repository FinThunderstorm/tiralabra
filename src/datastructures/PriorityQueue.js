export default class PriorityQueue {
    constructor() {
        this.arr = []
    }

    append(item) {
        this.arr = this.arr.push(item)
        this.arr.sort()
    }

    get() {
        return this.arr.shift()
    }
}
