# HSL:4610206

{
station(id: "HSL:4000011") {
name
locationType
stops {
cluster {
id
name
gtfsId
stops {
name
code
gtfsId
platformCode
}

      }
      name
      code
      platformCode
      transfers(maxDistance: 100) {
        distance
        id
        stop {
          name
          code
          gtfsId
        }
      }
    }

}
}

{
cluster(id: "C650") {
name
stops{
name
code
gtfsId
platformCode
}
}
}
