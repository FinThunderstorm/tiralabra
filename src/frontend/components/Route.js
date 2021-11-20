/* eslint-disable react/prop-types */
import React from 'react'
import { useDispatch } from 'react-redux'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Marker, Polyline, Popup } from 'react-leaflet'
import markerLogo from '../marker.svg'
import { setDepartures } from '../reducers/departuresReducer'

const Route = ({ stops, routeLine }) => {
    const dispatch = useDispatch()
    const handleDepartures = (event) => {
        event.preventDefault()
        const gtfsId = event.target.gtfsId.value
        const startTime = event.target.startTime.value
        console.log(gtfsId, startTime)
        dispatch(setDepartures(gtfsId, Date.parse(startTime)))
    }
    const scale = 0.05
    if (stops === null || routeLine === null) {
        return <></>
    }
    console.log('stops:', stops)

    return (
        <>
            {stops.via.map((stop) => (
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
                        <h1>{stop.route}</h1>
                        <form onSubmit={handleDepartures}>
                            <input
                                name="gtfsId"
                                hidden
                                value={stop.stop.gtfsId}
                            />
                            <input
                                name="startTime"
                                hidden
                                value={stop.stop.arrivesAt ?? stops.startTime}
                            />
                            <button type="submit">
                                {stop.stop.name} ({stop.stop.code}) -{' '}
                                {stop.stop.gtfsId}
                            </button>
                        </form>
                        <p>
                            Arrived at: {stop.stop.arrivesAt ?? stops.startTime}
                        </p>
                    </Popup>
                </Marker>
            ))}
            <Polyline pathOptions={{ color: 'purple' }} positions={routeLine} />
        </>
    )
}

export default Route
