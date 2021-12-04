const MinHeap = require('@datastructures/MinHeap')
const Route = require('@datastructures/Route')

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
        queue.maxHeapify(2)
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
        queue.buildMaxHeap()
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

    test('minHeapsort makes correct order', () => {
        const queue = new MinHeap()
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.minHeapsort()
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

    test('heapDecreaseKey does nothing, if correct', () => {
        const queue = new MinHeap()
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.buildMinHeap()
        queue.heapDecreaseKey(10, 32)
        expect(queue.arr[10]).toBe(16)
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

    test('pop returns undefined if empty', () => {
        const queue = new MinHeap()
        const value = queue.pop()
        expect(value).toBe(undefined)
    })

    test('push works correctly', () => {
        const queue = new MinHeap()
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

    test('length is correct', () => {
        const queue = new MinHeap()
        const values = [5, 3, 1, 7, 8, 2, 5, 3, 2]
        values.forEach((value) => {
            queue.push(value)
        })
        expect(queue.length).toBe(values.length)
    })

    test('toString prints correct', () => {
        const queue = new MinHeap()
        const values = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
        values.forEach((value) => {
            queue.arr.push(value)
        })
        queue.buildMinHeap()
        expect(queue.toString()).toBe(
            [1, 2, 3, 4, 7, 8, 9, 10, 14, 16].toString()
        )
    })

    test('push works correctly with objects with valueOf() (Routes in this case)', () => {
        const queue = new MinHeap()

        const stop = {
            name: 'Kumpulan kampus',
            code: 'H3029',
            coordinates: {
                latitude: 60.203679,
                longitude: 24.965952,
            },
            locationType: 'STOP',
        }

        const route1 = new Route(stop, 8, new Date(), '8')
        const route2 = new Route(stop, 7, new Date(), '7')
        const route3 = new Route(stop, 14, new Date(), '14')
        const route4 = new Route(stop, 5, new Date(), '5')

        queue.push(route1)
        expect(queue.arr.toString()).toBe([0, 8].toString())
        queue.push(route2)
        expect(queue.arr.toString()).toBe([0, 7, 8].toString())
        queue.push(route3)
        expect(queue.arr.toString()).toBe([0, 7, 8, 14].toString())
        queue.push(route4)
        expect(queue.arr.toString()).toBe([0, 5, 7, 14, 8].toString())
    })
})
