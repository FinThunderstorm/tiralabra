import React from 'react'
// import axios from 'axios'

const PerformanceTest = () => {
    const today = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDay(),
        12,
        0,
        0,
        0
    )
    const stops = [
        {
            startStop: 'HSL:4620205',
            endStop: 'HSL:1240118',
        },
        {
            startStop: 'HSL:9650105',
            endStop: 'HSL:4510255',
        },
        {
            startStop: 'HSL:1361108',
            endStop: 'HSL:1150110',
        },
        {
            startStop: 'HSL:1431187',
            endStop: 'HSL:1304161',
        },
        {
            startStop: 'HSL:9650105',
            endStop: 'HSL:1240118',
        },
        {
            startStop: 'HSL:1495151',
            endStop: 'HSL:1201127',
        },
        {
            startStop: 'HSL:9620109',
            endStop: 'HSL:6100206',
        },
        //
        {
            startStop: 'HSL:2222210',
            endStop: 'HSL:4160211',
        },
        {
            startStop: 'HSL:1531102',
            endStop: 'HSL:1473221',
        },
        {
            startStop: 'HSL:3170231',
            endStop: 'HSL:9040200',
        },
    ]

    let suites = []
    stops.forEach((stop) => {
        for (let add = 0; add < 12 * 300000; add += 300000) {
            const time = new Date(today.valueOf() + add)
            console.log('new time', time.toISOString())
            suites = suites.concat([
                {
                    startStop: stop.startStop,
                    endStop: stop.endStop,
                    startTime: time,
                },
            ])
        }
    })

    // const runAllSuites = () => {
    //     let running = false
    //     let ready = false

    //     while (ready !== true) {}
    // }

    return (
        <div>
            <p>Performance test</p>
        </div>
    )
}

export default PerformanceTest
