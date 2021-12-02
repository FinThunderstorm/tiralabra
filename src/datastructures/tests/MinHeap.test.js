const MinHeap = require('@datastructures/MinHeap')

describe('MinHeap', () => {
    test('MinHeap initializes', () => {
        const queue = new MinHeap()
        expect(queue.arr.toString()).toBe([0].toString())
    })

    test('minHeapify makes correct order', () => {
        const queue = new MinHeap()
        const values = [1, 7, 2, 4, 3, 8, 9, 14, 10, 16]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.heapSize = queue.arr.length - 1
        queue.minHeapify(2)
        expect(queue.arr.toString()).toBe(
            [0, 1, 3, 2, 4, 7, 8, 9, 14, 10, 16].toString()
        )
    })

    test('buildMinHeap makes correct order', () => {
        const queue = new MinHeap()
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.buildMinHeap()
        expect(queue.arr.toString()).toBe(
            [0, 1, 2, 3, 4, 7, 9, 10, 14, 8, 16].toString()
        )
    })

    test('maxHeapify makes correct order', () => {
        const queue = new MinHeap((a, b) => a - b)
        const values = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.heapSize = queue.arr.length - 1
        console.log(queue.arr, queue.heapSize)
        queue.maxHeapify(2)
        console.log(queue.arr)
        // [1, 2, 3, 17, 19, 36, 7, 25, 100]
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 8, 7, 9, 3, 2, 4, 1].toString()
        )
    })

    test('buildMaxHeap makes correct order', () => {
        const queue = new MinHeap((a, b) => a - b)
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        // console.log(queue.arr)
        queue.buildMaxHeap()
        // console.log(queue.arr)
        // [1, 2, 3, 17, 19, 36, 7, 25, 100]
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 8, 7, 9, 3, 2, 4, 1].toString()
        )
    })

    test('heapsort makes correct order', () => {
        const queue = new MinHeap()
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.heapsort()
        expect(queue.arr.toString()).toBe(
            [0, 1, 2, 3, 4, 7, 8, 9, 10, 14, 16].toString()
        )
    })

    test('maxHeapsort makes correct order', () => {
        const queue = new MinHeap()
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.maxHeapsort()
        expect(queue.arr.toString()).toBe(
            [0, 16, 14, 10, 9, 8, 7, 4, 3, 2, 1].toString()
        )
    })

    test('min returns correct value', () => {
        const queue = new MinHeap()
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.buildMinHeap()
        expect(queue.min()).toBe(1)
    })

    test('pop takes correct value out and leaves heap into right state', () => {
        const queue = new MinHeap()
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.buildMinHeap()
        const min = queue.pop()
        expect(min).toBe(1)
        expect(queue.arr.toString()).toBe(
            [0, 2, 4, 3, 8, 7, 9, 10, 14, 16].toString()
        )
    })

    test('push works correctly', () => {
        const queue = new MinHeap()
        // 4 1 3 2 16 9 10 14 8 7
        queue.push(8)
        expect(queue.arr.toString()).toBe([0, 8].toString())
        queue.push(7)
        expect(queue.arr.toString()).toBe([0, 7, 8].toString())
        queue.push(14)
        expect(queue.arr.toString()).toBe([0, 7, 8, 14].toString())
        queue.push(10)
        expect(queue.arr.toString()).toBe([0, 7, 8, 14, 10].toString())
        queue.push(9)
        expect(queue.arr.toString()).toBe([0, 7, 8, 14, 10, 9].toString())
        queue.push(16)
        expect(queue.arr.toString()).toBe([0, 7, 8, 14, 10, 9, 16].toString())
        queue.push(2)
        expect(queue.arr.toString()).toBe(
            [0, 2, 8, 7, 10, 9, 16, 14].toString()
        )
        queue.push(3)
        expect(queue.arr.toString()).toBe(
            [0, 2, 3, 7, 8, 9, 16, 14, 10].toString()
        )
        queue.push(1)
        expect(queue.arr.toString()).toBe(
            [0, 1, 2, 7, 3, 9, 16, 14, 10, 8].toString()
        )
        queue.push(4)
        expect(queue.arr.toString()).toBe(
            [0, 1, 2, 7, 3, 4, 16, 14, 10, 8, 9].toString()
        )
    })
})
