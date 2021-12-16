/* eslint-disable react/prop-types */
import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import RouteOnMap from './RouteOnMap'

const Map = () => {
    const position = [60.29549, 25.0614]

    return (
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
            <RouteOnMap />
        </MapContainer>
    )
}

export default Map
