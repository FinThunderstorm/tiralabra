/* eslint-disable */
import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Marker, Polyline, Popup } from 'react-leaflet'
import markerLogo from '../marker.svg'
import { setDepartures } from '../reducers/departuresReducer'
import { Button, Stack, Typography } from '@mui/material'

const RouteOnMap = () => {
    const routeState = useSelector((state) => state.route)
    const dispatch = useDispatch()

    if (routeState === null) {
        return <></>
    }

    const handleDepartures = (event) => {
        event.preventDefault()
        const gtfsId = event.target.gtfsId.value
        const startTime = event.target.startTime.value
        dispatch(setDepartures(gtfsId, startTime))
    }
    const scale = 0.05

    const { route, routeLine } = routeState

    return (
        <>
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
                        <Stack spacing={2} direction="column" margin="normal">
                            <Typography variant="h5">
                                Arrived with {stop.route}
                            </Typography>
                            <form onSubmit={handleDepartures}>
                                <input
                                    name="gtfsId"
                                    hidden
                                    readOnly
                                    value={stop.stop.gtfsId}
                                />
                                <input
                                    name="startTime"
                                    hidden
                                    readOnly
                                    value={stop.stop.arrivesAt}
                                />
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    type="submit"
                                >
                                    {stop.stop.name} ({stop.stop.code}) -{' '}
                                    {stop.stop.gtfsId}
                                </Button>
                            </form>
                            <Typography variant="body2">
                                Arrived at:{' '}
                                {new Date(stop.stop.arrivesAt).toLocaleString(
                                    'fi-FI',
                                    {
                                        timeZone: 'Europe/Helsinki',
                                    }
                                )}
                            </Typography>
                        </Stack>
                    </Popup>
                </Marker>
            ))}
            <Polyline pathOptions={{ color: 'purple' }} positions={routeLine} />
        </>
    )
}

export default RouteOnMap
