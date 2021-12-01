const MinHeap = require('@datastructures/MinHeap')

describe('MinHeap', () => {
    test('MinHeap initializes', () => {
        const queue = new MinHeap((a, b) => a - b)
        expect(queue.arr.toString()).toBe([0].toString())
    })

    test('minHeapify makes correct order', () => {
        const queue = new MinHeap((a, b) => a - b)
        const values = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.heapSize = queue.arr.length - 1
        console.log(queue.arr, queue.heapSize)
        queue.minHeapify(2)
        console.log(queue.arr)
        // [1, 2, 3, 17, 19, 36, 7, 25, 100]
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 8, 7, 9, 3, 2, 4, 1].toString()
        )
    })

    test('buildMinHeap makes correct order', () => {
        const queue = new MinHeap((a, b) => a - b)
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        // console.log(queue.arr)
        queue.buildMinHeap()
        // console.log(queue.arr)
        // [1, 2, 3, 17, 19, 36, 7, 25, 100]
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 8, 7, 9, 3, 2, 4, 1].toString()
        )
    })

    test('heapsort makes correct order', () => {
        const queue = new MinHeap((a, b) => a - b)
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.heapsort()
        expect(queue.arr.toString()).toBe(
            [0, 1, 2, 3, 4, 7, 8, 9, 10, 14, 16].toString()
        )
    })
})
