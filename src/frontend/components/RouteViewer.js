/* eslint-disable react/prop-types */
import React from 'react'
import Stop from './Stop'

const RouteViewer = ({ route }) => {
    if (route === null) {
        return <></>
    }
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
                <p>Start time: {route.startTime}</p>
                <p>Total travel time: {route.travelTime}</p>
                <p>Arrived to destination: {route.arrived}</p>
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
                            {stop.stop.arrivesAt}
                        </p>
                        <hr />
                    </div>
                ))}
            </div>
        </>
    )
}

export default RouteViewer
