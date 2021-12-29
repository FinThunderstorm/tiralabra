import React from 'react'
import { useDispatch } from 'react-redux'
import {
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Stack,
} from '@mui/material'
import RouteViewer from './RouteViewer'
import { findPerformance } from '../reducers/routeReducer'
import PerfResult from './PerfResult'
import AltRouteViewer from './AltRouteViewer'

/**
 * PerformanceTest-komponentti huolehtii suorituskykytestauksen komponenttien esittämisestä
 * @returns React-komponentti
 */
const PerformanceTest = () => {
    const dispatch = useDispatch()
    const today = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
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

    const times = [new Date(today.valueOf() + 24 * 60 * 60 * 1000)]

    const handleStart = async (event, startStop, endStop, startTime) => {
        event.preventDefault()
        console.log(startStop, endStop, startTime)

        dispatch(findPerformance(startStop, endStop, startTime))
    }

    return (
        <Grid container className="performance" margin="normal" spacing={2}>
            <Grid item xs={6}>
                {stops.map((stopPairs) => (
                    <Stack spacing={2} direction="column" margin="normal">
                        <Card>
                            <CardContent>
                                <Typography variant="body2">
                                    From: {stopPairs.startStop}
                                </Typography>
                                <Typography variant="body2">
                                    To: {stopPairs.endStop}
                                </Typography>
                                {times.map((time) => (
                                    <Button
                                        onClick={(event) =>
                                            handleStart(
                                                event,
                                                stopPairs.startStop,
                                                stopPairs.endStop,
                                                time
                                            )
                                        }
                                    >
                                        {time.toLocaleString('fi-FI', {
                                            timeZone: 'Europe/Helsinki',
                                        })}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </Stack>
                ))}
            </Grid>
            <Grid item xs={6}>
                <Stack spacing={2} direction="column" margin="normal">
                    <PerfResult />
                    <RouteViewer />
                    <AltRouteViewer alt />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default PerformanceTest
