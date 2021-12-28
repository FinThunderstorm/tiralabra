/**
 * MinHeap-luokka mallintaa minimikekoa prioriteettijonotietorakenteena.
 *
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

    /**
     * minHeapify tarkastaa noudattaako keko minimikeon periaatteita annetusta indeksistä alaspäin.
     * Noudattaa minimikeon prioriteettiä A[parent(i)] ≤ A[i], missä i on kyseisen solmun indeksi.
     *
     * @param {Number} index indeksi, josta tarkastusta lähdetään tekemään.
     */
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

    /**
     * maxHeapify tarkastaa noudattaako keko maksimikeon periaatteita annetusta indeksistä alaspäin.
     * Noudattaa maksimikeon prioriteettiä A[parent(i)] ≥ A[i], missä i on kyseisen solmun indeksi.
     * Toteutuksessa mukana, jotta voin tulostaa listan minimikeosta, jossa alkiot pienimmästä suurimpaan.
     *
     * @param {Number} index indeksi, josta tarkastusta lähdetään tekemään.
     */
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

    /**
     * buildMinHeap järjestelee keon vastaamaan minimikeon toteutusta.
     * Toteuttaa kutsumalla minHeapifyä ensin puolivälistä kekoa viimeisestä
     * lisätystä solmusta edeten sieltä kohti ylempiä solmuja.
     */
    buildMinHeap() {
        this.heapSize = this.arr.length - 1
        for (let i = Math.floor((this.arr.length - 1) / 2); i > 0; i -= 1) {
            this.minHeapify(i)
        }
    }

    /**
     * buildMaxHeap järjestelee keon vastaamaan maksimikeon toteutusta.
     *   Toteuttaa kutsumalla maxHeapifyä ensin puolivälistä kekoa viimeisestä
     * lisätystä solmusta edeten sieltä kohti ylempiä solmuja.
     *   Toteutuksessa mukana, jotta voin tulostaa listan minimikeosta,
     * jossa alkiot pienimmästä suurimpaan.
     */
    buildMaxHeap() {
        this.heapSize = this.arr.length - 1
        for (let i = Math.floor((this.arr.length - 1) / 2); i > 0; i -= 1) {
            this.maxHeapify(i)
        }
    }

    /**
     * heapsort järjestelee keon pienimmästä suurimpaan alkioon.
     *   Toteutus on maksimikeon periaatetta noudattaen, käytetään
     * keon tulostamiseen pienimmästä suurimpaan alkioon.
     */
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

    /**
     * minHeapsort järjestelee alkiot suurimmasta pienimpään.
     * Toteutus minimikeon periaatetta noudattaen.
     */
    minHeapsort() {
        this.buildMinHeap()
        for (let i = this.arr.length - 1; i > 1; i -= 1) {
            const temp = this.arr[i]
            this.arr[i] = this.arr[1] // eslint-disable-line prefer-destructuring
            this.arr[1] = temp
            this.heapSize -= 1
            this.minHeapify(1)
        }
    }

    /**
     * min palauttaa keon pienimmän alkion, mutta ei poista sitä keosta.
     *
     * @returns {Any}
     */
    min() {
        return this.arr[1]
    }

    /**
     * pop palauttaa tietorakenteen pienimmän arvon
     * omaavan alkion poistaen sen keosta.
     *
     * @return {Any} Tietorakenteessa ollut pienin alkio.
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

    /**
     * heapDecreaseKey järjestelee annettuun indeksiin (index)
     * lisättävän arvon (key) oikeaan kohtaan minimikekoa.
     *
     * @param {*} index indeksi, johon arvo (key) asetetaan.
     * @param {*} key kekoon talletettava arvo
     * @returns kun lisättävä arvo on oikealla paikalla minimikekoa
     */
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
     * push lisää kekoon uusi alkio oikealle paikalle minimikekoa.
     *
     * @param {Any} item lisättävä alkio
     */
    push(item) {
        this.heapSize += 1
        this.arr.push(Infinity)
        this.heapDecreaseKey(this.heapSize, item)
    }

    /**
     * Palauttaa keossa olevien alkioiden määrän.
     *
     * @return {Number} Keossa olevien alkioiden määrä
     */
    get length() {
        return this.heapSize
    }

    /**
     * Tuottaa tietorakenteesta merkkijonoesityksen pienin ensin suuruusjärjestyksessä,
     * jonka perusteella tietorakenteen sisältöä voidaan tarkastella.
     * TODO: tee fiksumpi tästä, nyt turhaa resurssien hukkausta :D
     *
     * @returns {String} Merkkijonoesitys tietorakenteesta.
     */
    toString() {
        this.heapsort()
        const retVal = this.arr.slice(1).toString()
        this.buildMinHeap()
        return retVal
    }
}
