/**
 * MinHeap-luokka mallintaa minimikekoa prioriteettijonotietorakenteena.
 * min-heap-priority => A[parent(i)] ≤ A[i]
 * Lähde: Stein, C. et al. (2009) Introduction to algorithms. The MIT Press.
 */
const parent = (index) => Math.floor(index / 2)
const left = (index) => 2 * index
const right = (index) => 2 * index + 1

module.exports = class MinHeap {
    constructor(sortMethod) {
        this.arr = []
        this.sortMethod = sortMethod
        this.heapSize = 0
    }

    minHeapify(index) {
        const leftIndex = left(index)
        const rightIndex = right(index)
        let largest = index

        if (
            leftIndex <= this.heapSize &&
            this.arr[leftIndex] > this.arr[index]
        ) {
            largest = leftIndex
        } else {
            largest = index
        }

        if (
            rightIndex <= this.heapSize &&
            this.arr[rightIndex] > this.arr[largest]
        ) {
            largest = rightIndex
        }

        if (largest !== index) {
            const temp = this.arr[index]
            this.arr[index] = this.arr[largest]
            this.arr[largest] = temp
            this.minHeapify(largest)
        }
    }

    buildMinHeap() {
        this.heapSize = this.arr.length
        for (let i = Math.floor(this.arr.length / 2); i > 0; i--) {
            this.minHeapify(i)
        }
    }

    heapsort() {
        this.buildMinHeap()
        for (let i = this.arr.length; i > 0; i--) {
            const temp = this.arr[i]
            this.arr[i] = this.arr[0]
            this.arr[0] = temp
            this.heapSize--
            this.minHeapify(0)
        }
    }

    get min() {
        return this.arr[0]
    }

    /**
     * HEAP-EXTRACT-MIN
     * Palauttaa tietorakenteen ensimmäisen alkion, jolla pienin arvo.
     * @return {Any} Tietorakenteessa ollut ensimmäinen alkio.
     */
    get pop() {
        if (this.heapSize < 1) {
            return null
        }
        let min = this.arr[1]
        this.arr[1] = this.arr[this.heapSize]
        this.heapSize--
        this.minHeapify(1)
        return min
    }

    heapDecreaseKey(index, key) {
        if (key > this.arr[index]) {
            return
        }
        this.arr[index] = key
        while (index > 1 && this.arr[parent(index)] > this.arr[index]) {
            console.log()
        }
    }

    /**
     * Palauttaa tietorakenteessa olevien alkioiden määrän, eli tietorakenteen pituus.
     * @return {int} Tietorakenteessa olevien alkioiden määrä
     */
    get length() {
        return this.arr.length
    }

    /**
     * Push-funktiolla lisätään tietorakenteeseen uusi alkio.
     * @param {ParamDataTypeHere} item - Lisättävä alkio
     */
    push(item) {
        this.arr.push(item)
        this.arr.sort(this.sortMethod)
    }

    /**
     * Tuottaa tietorakenteesta merkkijonoesityksen, jonka perusteella tietorakenteen sisältöä voidaan tarkastella.
     * @returns {String} Merkkijonoesitys tietorakenteesta.
     */
    toString() {
        return this.arr.toString()
    }
}