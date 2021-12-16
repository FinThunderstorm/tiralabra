/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import Stop from './Stop'

const RouteViewer = () => {
    const routeState = useSelector((state) => state.route)

    if (routeState === null) {
        return <></>
    }

    const { route } = routeState

    return (
        <>
            <div>
                <h3>From:</h3>
                <Stop stop={route.from} />
            </div>
            <div>
                <h3>Destination:</h3>
                <Stop stop={route.to} />
            </div>
            <div>
                <p>
                    Start time:{' '}
                    {new Date(route.startTime).toLocaleString('fi-FI', {
                        timeZone: 'Europe/Helsinki',
                    })}
                </p>
                <p>Total travel time: {route.travelTime / (60 * 1000)}</p>
                <p>
                    Arrived to destination:{' '}
                    {new Date(route.arrived).toLocaleString('fi-FI', {
                        timeZone: 'Europe/Helsinki',
                    })}
                </p>
            </div>
            <hr />
            <div>
                <p>Route:</p>
                {route.via.map((stop) => (
                    <div>
                        <p>
                            Stop {stop.stop.name} ({stop.stop.code}/
                            {stop.stop.gtfsId})
                        </p>
                        <p>
                            Arrived with {stop.route}, arrives here at{' '}
                            {new Date(stop.stop.arrivesAt).toLocaleString(
                                'fi-FI',
                                {
                                    timeZone: 'Europe/Helsinki',
                                }
                            )}
                        </p>
                        <hr />
                    </div>
                ))}
            </div>
        </>
    )
}

export default RouteViewer
