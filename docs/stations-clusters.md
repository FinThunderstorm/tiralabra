# HSL:4610206

{
stop(id: "HSL:4610553") {
name
code
lat
lon
locationType
vehicleMode
parentStation {
parentStation {
name
}
name
gtfsId
stops {
name
code
gtfsId
vehicleMode
}
}
platformCode
cluster {
name
gtfsId
stops {
name
code
gtfsId
vehicleMode
}
}
}
}

HSL:4610206 - tiksin bussien jättölaituri nro 17

{
stop(id: "HSL:4620205") {
name
code
lat
lon
locationType
vehicleMode
platformCode
cluster {
name
gtfsId
lat
lon
stops {
name
code
gtfsId
vehicleMode
}
}
}
}

{
nearest(lat: 60.29549, lon: 25.0614) {
edges {
node {
id
}
}
}
}

{
nearest(lat: 60.29549, lon: 25.0614, filterByPlaceTypes: DEPARTURE_ROW, maxDistance: 100) {
edges {
node {
place {
... on DepartureRow {
stop {
name
code
gtfsId
}
pattern {
code
name
headsign
route {
mode
}
}
stoptimes {
scheduledDeparture
realtimeDeparture
scheduledArrival
realtimeArrival
realtime
serviceDay
stopSequence
trip {
gtfsId
routeShortName
stoptimesForDate {
stop {
code
name
gtfsId
lat
lon
locationType
}
pickupType
scheduledArrival
realtimeArrival
scheduledDeparture
realtimeDeparture
serviceDay
}
}
}
}
}
distance
}
}
}
}

Tuohon PDF-ongelmaan ihan näppärä työkalu on https://pdf2jpg.net/, millä saa muutettua PDF-tiedoston JPG-kuviksi.
