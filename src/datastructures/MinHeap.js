/**
 * MinHeap-luokka mallintaa minimikekoa prioriteettijonotietorakenteena.
 * min-heap-priority => A[parent(i)] ≤ A[i]
 * Lähde: Stein, C. et al. (2009) Introduction to algorithms. The MIT Press.
 */
const parent = (index) => Math.floor(index / 2)
const left = (index) => 2 * index
const right = (index) => 2 * index + 1

module.exports = class MinHeap {
    constructor() {
        this.arr = [0]
        this.heapSize = 0
    }

    minHeapify(index) {
        const leftIndex = left(index)
        const rightIndex = right(index)
        let smallest = index

        if (
            leftIndex <= this.heapSize &&
            this.arr[leftIndex].valueOf() < this.arr[index].valueOf()
        ) {
            smallest = leftIndex
        } else {
            smallest = index
        }

        if (
            rightIndex <= this.heapSize &&
            this.arr[rightIndex].valueOf() < this.arr[smallest].valueOf()
        ) {
            smallest = rightIndex
        }

        if (smallest !== index) {
            const temp = this.arr[index]
            this.arr[index] = this.arr[smallest]
            this.arr[smallest] = temp
            this.minHeapify(smallest)
        }
    }

    maxHeapify(index) {
        const leftIndex = left(index)
        const rightIndex = right(index)
        let largest = index

        if (
            leftIndex <= this.heapSize &&
            this.arr[leftIndex].valueOf() > this.arr[index].valueOf()
        ) {
            largest = leftIndex
        } else {
            largest = index
        }

        if (
            rightIndex <= this.heapSize &&
            this.arr[rightIndex].valueOf() > this.arr[largest].valueOf()
        ) {
            largest = rightIndex
        }

        if (largest !== index) {
            const temp = this.arr[index]
            this.arr[index] = this.arr[largest]
            this.arr[largest] = temp
            this.maxHeapify(largest)
        }
    }

    buildMinHeap() {
        this.heapSize = this.arr.length - 1
        for (let i = Math.floor((this.arr.length - 1) / 2); i > 0; i -= 1) {
            this.minHeapify(i)
        }
    }

    buildMaxHeap() {
        this.heapSize = this.arr.length - 1
        for (let i = Math.floor((this.arr.length - 1) / 2); i > 0; i -= 1) {
            this.maxHeapify(i)
        }
    }

    // creates asc order
    heapsort() {
        this.buildMaxHeap()
        for (let i = this.arr.length - 1; i > 1; i -= 1) {
            const temp = this.arr[i]
            this.arr[i] = this.arr[1] // eslint-disable-line prefer-destructuring
            this.arr[1] = temp
            this.heapSize -= 1
            this.maxHeapify(1)
        }
    }

    // creates desc order
    maxHeapsort() {
        this.buildMinHeap()
        for (let i = this.arr.length - 1; i > 1; i -= 1) {
            const temp = this.arr[i]
            this.arr[i] = this.arr[1] // eslint-disable-line prefer-destructuring
            this.arr[1] = temp
            this.heapSize -= 1
            this.minHeapify(1)
        }
    }

    min() {
        return this.arr[1]
    }

    /**
     * HEAP-EXTRACT-MIN
     * Palauttaa tietorakenteen ensimmäisen alkion, jolla pienin arvo.
     * @return {Any} Tietorakenteessa ollut ensimmäinen alkio.
     */
    pop() {
        if (this.heapSize < 1) {
            return undefined
        }
        const min = this.arr[1]
        this.arr[1] = this.arr[this.heapSize]
        this.heapSize -= 1
        this.minHeapify(1)
        this.arr.pop()
        return min
    }

    heapDecreaseKey(index, key) {
        let i = index
        if (key.valueOf() > this.arr[i].valueOf()) {
            return
        }
        this.arr[i] = key
        while (i > 1 && this.arr[parent(i)].valueOf() > this.arr[i].valueOf()) {
            const temp = this.arr[i]
            this.arr[i] = this.arr[parent(i)]
            this.arr[parent(i)] = temp
            i = parent(i)
        }
    }

    /**
     * Min-Heap-Insert
     * Push-funktiolla lisätään tietorakenteeseen uusi alkio.
     * @param {ParamDataTypeHere} item - Lisättävä alkio
     */
    push(item) {
        this.heapSize += 1
        this.arr.push(Infinity)
        this.heapDecreaseKey(this.heapSize, item)
    }

    /**
     * Palauttaa tietorakenteessa olevien alkioiden määrän, eli tietorakenteen pituus.
     * @return {int} Tietorakenteessa olevien alkioiden määrä
     */
    get length() {
        return this.heapSize
    }

    /**
     * Tuottaa tietorakenteesta merkkijonoesityksen pienin ensin suuruusjärjestyksessä, jonka perusteella tietorakenteen sisältöä voidaan tarkastella.
     * TODO: tee fiksumpi tästä, nyt turhaa resurssien hukkausta :D
     * @returns {String} Merkkijonoesitys tietorakenteesta.
     */
    toString() {
        this.heapsort()
        const retVal = this.arr.slice(1).toString()
        this.buildMinHeap()
        return retVal
    }
}
