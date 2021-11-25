/**
 * PriorityQueue-luokka mallintaa prioriteettijonoa tietorakenteena.
 * HOX! Toteutus on väliaikainen ei-tehokas, ja tullaan korvaamaan minimikeolla projektin edistyessä.
 */
module.exports = class PriorityQueue {
    constructor(sortMethod) {
        this.arr = []
        this.sortMethod = sortMethod
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
