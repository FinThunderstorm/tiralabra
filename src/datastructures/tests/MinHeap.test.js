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
        queue.minHeapify(2)
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
        queue.buildMinHeap()
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

    test('min returns correct value', () => {
        const queue = new MinHeap((a, b) => a - b)
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.buildMinHeap()
        expect(queue.min()).toBe(16)
    })

    test('pop takes correct value out and leaves heap into right state', () => {
        const queue = new MinHeap((a, b) => a - b)
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7, 18]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.buildMinHeap()
        const min = queue.pop()
        expect(min).toBe(18)
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 8, 7, 9, 3, 2, 1, 4].toString()
        )
    })

    test('push works correctly', () => {
        const queue = new MinHeap((a, b) => a - b)

        queue.push(4)
        expect(queue.arr.toString()).toBe([0, 4].toString())
        queue.push(1)
        expect(queue.arr.toString()).toBe([0, 4, 1].toString())
        queue.push(3)
        expect(queue.arr.toString()).toBe([0, 4, 1, 3].toString())
        queue.push(2)
        expect(queue.arr.toString()).toBe([0, 4, 2, 3, 1].toString())
        queue.push(16)
        expect(queue.arr.toString()).toBe([0, 16, 4, 3, 1, 2].toString())
        queue.push(9)
        expect(queue.arr.toString()).toBe([0, 16, 4, 9, 1, 2, 3].toString())
        queue.push(10)
        expect(queue.arr.toString()).toBe([0, 16, 4, 10, 1, 2, 3, 9].toString())
        queue.push(14)
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 4, 2, 3, 9, 1].toString()
        )
        queue.push(8)
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 8, 2, 3, 9, 1, 4].toString()
        )
        queue.push(7)
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 8, 7, 3, 9, 1, 4, 2].toString()
        )
    })
})
