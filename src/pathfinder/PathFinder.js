const haversine = require('haversine')

const distanceBetweenTwoPoints = (coord1, coord2) => {
    // haversine yhtälöllä voidaan muuttaa, TODO tee itse oma
    console.log('coord1 >', coord1)
    console.log('coord2 >', coord2)
    return haversine(coord1, coord2)
}

module.exports = distanceBetweenTwoPoints
