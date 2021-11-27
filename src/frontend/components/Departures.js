/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'

const Departures = () => {
    const departures = useSelector((state) => state)
    console.log('all departures', departures)
    if (departures === null) {
        return <></>
    }
    return (
        <>
            <h2>
                Departures for stop {departures.data.stop.name} (
                {departures.data.stop.code} / {departures.data.stop.gtfsId})
            </h2>
            <ul>
                {departures.data.departures.map((dep) => (
                    <li>
                        {dep.name.split(' ')[0]} - departures at{' '}
                        {new Date(dep.departuresAt).toLocaleString('fi-FI', {
                            timeZone: 'Europe/Helsinki',
                        })}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Departures
