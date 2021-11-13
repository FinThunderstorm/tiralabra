const PriorityQueue = require('@datastructures/PriorityQueue')

describe('PriorityQueue', () => {
    test('PriorityQueue initializes', () => {
        const queue = new PriorityQueue()
        expect(queue.arr.toString()).toBe([].toString())
    })
    test('length is correct', () => {
        const queue = new PriorityQueue()
        for (let i = 0; i < 5; i++) {
            queue.push(i)
        }
        expect(queue.length).toBe(5)
    })
    test('push works', () => {
        const queue = new PriorityQueue()
        queue.push('value')
        expect(queue.length).toBe(1)
        expect(queue.arr.toString()).toBe(['value'].toString())
    })
    test('pop returns always smallest', () => {
        const queue = new PriorityQueue()
        const values = [1, 5, 2, 3, 4]
        values.forEach((value) => queue.push(value))
        values.sort().forEach((value) => expect(queue.pop()).toBe(value))
    })
    test('toString returns right formatted string', () => {
        const queue = new PriorityQueue()
        const values = [1, 5, 2, 3, 4]
        values.forEach((value) => queue.push(value))
        expect(queue.toString()).toBe('1,2,3,4,5')
    })
})
