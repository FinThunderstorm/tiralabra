/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import L from 'leaflet'
import React, { useState, useEffect } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import markerLogo from './marker.svg'

const App = () => {
    const serviceName = 'työnimi pirkkaReittiopas'
    const position = [60.29549, 25.0614]
    const scale = 0.15
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

    useEffect(() => {
        axios
            .post('http://localhost:3001/search', {
                startStop: 'HSL:4620205',
                endStop: 'HSL:1240103',
            })
            .then((res) => {
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
    }, [])
    if (route === null || routeLine === null) {
        return <div>error</div>
    }

    return (
        <div className="App">
            <h1>{serviceName}</h1>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '75vh', width: '100wh' }}
                id="hsl-map"
            >
                <TileLayer
                    id="hsl-map"
                    tileSize={512}
                    zoomOffset={-1}
                    url="https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}@2x.png"
                />
                {route.via.map((stop) => (
                    <Marker
                        key={stop.stop.gtfsId}
                        icon={L.icon({
                            iconUrl: markerLogo,
                            iconSize: [200 * scale, 350 * scale],
                            iconAnchor: [0, 350 * scale],
                        })}
                        position={[
                            stop.stop.coordinates.latitude,
                            stop.stop.coordinates.longitude,
                        ]}
                    >
                        <Popup>
                            <p>{stop.route}</p>
                        </Popup>
                    </Marker>
                ))}
                <Polyline
                    pathOptions={{ color: 'purple' }}
                    positions={routeLine}
                />
            </MapContainer>
        </div>
    )
}

export default App
