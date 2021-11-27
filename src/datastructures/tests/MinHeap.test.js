const MinHeap = require('@datastructures/MinHeap')

describe('MinHeap', () => {
    test('MinHeap initializes', () => {
        const queue = new MinHeap((a, b) => a - b)
        expect(queue.arr.toString()).toBe([].toString())
    })

    test('minHeapify makes correct order', () => {
        const queue = new MinHeap((a, b) => a - b)
        const values = [1, 2, 3, 7, 17, 19, 25, 36, 100]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.buildMinHeap()
        expect(queue.arr).toBe([1, 2, 3, 17, 19, 36, 7, 25, 100])
    })
})
