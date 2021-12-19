/* eslint-disable */
import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Marker, Polyline, Popup } from 'react-leaflet'
import markerLogo from '../marker2.svg'
import dotLogo from '../dot2.svg'
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
        console.log(new Date(startTime).toISOString())
        dispatch(setDepartures(gtfsId, startTime))
    }
    const scale = 0.05

    const { route, routeLine } = routeState

    const colors = [
        '#00bfa6',
        '#dd2c00',
        '#ff0000',
        '#ffff00',
        '#03a9f4',
        '#00ea00',
    ]

    let colorIndex = 0
    const getColor = () => {
        const ret = colorIndex
        colorIndex += 1
        if (colorIndex == colors.length) {
            colorIndex = 0
        }
        return ret
    }

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
                                Arrived with {stop.route ?? 'your choice'}
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
                                    value={
                                        stop.stop.realtimeArrivesAt ??
                                        stop.stop.arrivesAt
                                    }
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
                                {stop.stop.realtimeArrivesAt &&
                                    new Date(
                                        stop.stop.realtimeArrivesAt
                                    ).toLocaleString('fi-FI', {
                                        timeZone: 'Europe/Helsinki',
                                    })}
                            </Typography>
                        </Stack>
                    </Popup>
                </Marker>
            ))}
            {Object.keys(routeLine).map((key) => (
                <>
                    <Marker
                        position={routeLine[key][0][0]}
                        icon={L.icon({
                            iconUrl: dotLogo,
                            iconSize: [256 * scale, 256 * scale],
                            iconAnchor: [5, 5],
                        })}
                    />
                    <Polyline
                        pathOptions={{
                            color: colors[getColor()],
                        }}
                        positions={routeLine[key]}
                    />
                    <Marker
                        position={
                            routeLine[key][routeLine[key].length - 1][
                                routeLine[key][routeLine[key].length - 1]
                                    .length - 1
                            ]
                        }
                        icon={L.icon({
                            iconUrl: dotLogo,
                            iconSize: [256 * scale, 256 * scale],
                            iconAnchor: [5, 5],
                        })}
                    />
                </>
            ))}
        </>
    )
}

export default RouteOnMap
