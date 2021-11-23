/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import L from 'leaflet'
import React, { useState, useEffect } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
// import './App.css'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import markerLogo from './marker.svg'
import Departures from './components/Departures'
import RouteOnMap from './components/RouteOnMap'

const App = () => {
    const serviceName = 'työnimi pirkkaReittiopas'
    const position = [60.29549, 25.0614]
    const scale = 0.05
    // useEffect(() => {
    //     const map = L.map('map').setView(position, 13)
    //     const osmMapnik = L.tileLayer(
    //         'https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}@2x.png',
    //         {
    //             maxZoom: 19,
    //             tileSize: 512,
    //             zoomOffset: -1,
    //             id: 'hsl-map',
    //         }
    //     ).addTo(map)
    // }, [])

    const [route, setRoute] = useState(null)
    const [routeLine, setRouteLine] = useState(null)
    const [startStop, setStartStop] = useState('HSL:4620205')
    const [endStop, setEndStop] = useState('HSL:1240118')

    const findRoute = () => {
        axios
            .post('http://localhost:3001/search', {
                startStop,
                endStop,
            })
            .then((res) => {
                console.log('res:', res.data)
                setRoute(res.data)
                let stops = []
                res.data.via.forEach((stop) => {
                    stops = stops.concat([
                        [
                            stop.stop.coordinates.latitude,
                            stop.stop.coordinates.longitude,
                        ],
                    ])
                })
                console.log('stops:', stops)
                setRouteLine(stops)
            })
    }

    const [departures, setDepartures] = useState(null)

    const handleDepartures = (event) => {
        event.preventDefault()
        axios
            .post('http://localhost:3001/nextDepartures', {
                gtfsId: event.target.stopGtfsId.value,
                startTime: Date.parse(event.target.startTime.value),
            })
            .then((res) => {
                setDepartures(res.data)
            })
    }

    return (
        <div className="App">
            <h1>{serviceName}</h1>
            <div id="searchBox">
                <input
                    onChange={(event) => setStartStop(event.target.value)}
                    value={startStop}
                />
                <input
                    onChange={(event) => setEndStop(event.target.value)}
                    value={endStop}
                />
                <button onClick={() => findRoute()} type="submit">
                    Etsi
                </button>
            </div>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '60vh', width: '25wh' }}
            >
                <TileLayer
                    id="hsl-map"
                    tileSize={512}
                    zoomOffset={-1}
                    url="https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}@2x.png"
                />
                <RouteOnMap stops={route} routeLine={routeLine} />
            </MapContainer>
            <Departures departures={departures} />
        </div>
    )
}

export default App
