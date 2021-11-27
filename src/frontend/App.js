/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-props-no-spreading */
import L from 'leaflet'
import React, { useState, useEffect } from 'react'
import AdapterDateFns from '@mui/lab/AdapterDayjs'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
// import './App.css'
import { TextField, Button } from '@mui/material'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import markerLogo from './marker.svg'
import Departures from './components/Departures'
import RouteOnMap from './components/RouteOnMap'
import RouteViewer from './components/RouteViewer'

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
    const [startTime, setStartTime] = useState(new Date())

    const findRoute = () => {
        const uStartTime = Date.parse(startTime)
        axios
            .post('http://localhost:3001/search', {
                startStop,
                endStop,
                uStartTime,
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

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale="fi">
            <div className="App">
                <h1>{serviceName}</h1>
                <div id="searchBox">
                    <TextField
                        label="Lähtöpysäkki:"
                        onChange={(event) => setStartStop(event.target.value)}
                        value={startStop}
                    />
                    <TextField
                        label="Kohdepysäkki:"
                        onChange={(event) => setEndStop(event.target.value)}
                        value={endStop}
                    />
                    <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Lähtöaika:"
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                    />
                    <Button
                        size="large"
                        variant="outlined"
                        onClick={() => findRoute()}
                        type="submit"
                    >
                        Etsi
                    </Button>
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
                <Departures />
                <RouteViewer route={route} />
            </div>
        </LocalizationProvider>
    )
}

export default App
