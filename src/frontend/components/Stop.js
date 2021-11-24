/* eslint-disable react/prop-types */
import React from 'react'

const Stop = ({ stop }) => {
    if (stop === null) {
        return <></>
    }
    return (
        <>
            <h5>
                {stop.name} - ({stop.code} / {stop.gtfsId})
            </h5>
            <p>
                Coordinates: {stop.coordinates.latitude}{' '}
                {stop.coordinates.longitude}
            </p>
            <p>Stop type: {stop.locationType}</p>
        </>
    )
}

export default Stop
