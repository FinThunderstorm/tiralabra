/* eslint-disable react/prop-types */
import React from 'react'
import { Card, CardContent } from '@mui/material'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import RouteOnMap from './RouteOnMap'

const Map = () => {
    const position = [60.29549, 25.0614]

    return (
        <Card variant="outlined">
            <CardContent>
                <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: '60vh', width: '25wh' }}
                >
                    <TileLayer
                        attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, 
                        <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                        id="hsl-map"
                        tileSize={512}
                        zoomOffset={-1}
                        url="https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}@2x.png"
                    />
                    <RouteOnMap />
                </MapContainer>
            </CardContent>
        </Card>
    )
}

export default Map
