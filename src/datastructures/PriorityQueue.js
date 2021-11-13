/**
 * PriorityQueue-luokka mallintaa prioriteettijonoa tietorakenteena.
 * HOX! Toteutus on väliaikainen ei-tehokas, ja tullaan korvaamaan minimikeolla projektin e.
 */
module.exports = class PriorityQueue {
    constructor() {
        this.arr = new Array()
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
        this.arr.sort()
    }

    /**
     * Palauttaa tietorakenteen ensimmäisen alkion, jolla pienin arvo.
     * @return {Any} Tietorakenteessa ollut ensimmäinen alkio.
     */
    pop() {
        return this.arr.shift()
    }

    /**
     * Tuottaa tietorakenteesta merkkijonoesityksen, jonka perusteella tietorakenteen sisältöä voidaan tarkastella.
     * @returns {String} Merkkijonoesitys tietorakenteesta.
     */
    toString() {
        return this.arr.toString()
    }
}
