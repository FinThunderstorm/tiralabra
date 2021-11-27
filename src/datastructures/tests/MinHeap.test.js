const MinHeap = require('@datastructures/MinHeap')

describe('MinHeap', () => {
    test('MinHeap initializes', () => {
        const queue = new MinHeap((a, b) => a - b)
        expect(queue.arr.toString()).toBe([].toString())
    })

    // test('minHeapify makes correct order', () => {
    //     const queue = new MinHeap((a, b) => a - b)
    //     const values = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1].sort()
    //     values.forEach((value) => {
    //         queue.arr.push(value)
    //     })
    //     console.log(queue.arr)
    //     queue.buildMinHeap()
    //     console.log(queue.arr)
    //     // [1, 2, 3, 17, 19, 36, 7, 25, 100]
    //     expect(queue.arr).toBe([16, 14, 10, 8, 7, 9, 3, 2, 4, 1])
    // })
})
