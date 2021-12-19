/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import DateTimePicker from '@mui/lab/DateTimePicker'
import {
    Card,
    TextField,
    Button,
    CardContent,
    Stack,
    CardHeader,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { findRoute } from '../reducers/routeReducer'

const Search = () => {
    const [startStop, setStartStop] = useState('HSL:4620205')
    const [endStop, setEndStop] = useState('HSL:1240118')
    const [startTime, setStartTime] = useState(new Date())
    const [startStopsList, setStartStopsList] = useState([null])
    const [endStopsList, setEndStopsList] = useState([null])
    const [showFindStart, setShowFindStart] = useState(null)
    const [showFindEnd, setShowFindEnd] = useState(null)

    const regex = /^HSL:[0-9]{7}$/

    const dispatch = useDispatch()
    const handleFindRoute = async (event) => {
        event.preventDefault()

        if (startStop.match(regex) !== null && endStop.match(regex) !== null) {
            setStartStopsList([null])
            setEndStopsList([null])
            dispatch(findRoute(startStop, endStop, startTime))
        }
    }

    const handleStartStop = (event) => {
        event.preventDefault()
        setStartStop(event.target.value)
        console.log(event.target.value, event.target.value.match(regex))
        if (event.target.value.match(regex) !== null) {
            setStartStopsList([null])
            setShowFindStart(undefined)
        }
        if (event.target.value.match(regex) === null) {
            setShowFindStart(true)
        }
    }

    const handleEndStop = (event) => {
        event.preventDefault()
        setEndStop(event.target.value)
        if (event.target.value.match(regex) !== null) {
            setEndStopsList([null])
            setShowFindEnd(null)
        }
        if (event.target.value.match(regex) === null) {
            setShowFindEnd(true)
        }
    }

    const handleStartToGtfsId = async (event) => {
        event.preventDefault()

        if (startStop.match(regex) !== null) {
            return
        }

        const stops = await axios.post('http://localhost:3001/findStops', {
            searchTerm: startStop,
        })
        setStartStopsList(stops.data.stops)
        setShowFindStart(null)
    }

    const handleEndToGtfsId = async (event) => {
        event.preventDefault()

        if (endStop.match(regex) !== null) {
            return
        }

        const stops = await axios.post('http://localhost:3001/findStops', {
            searchTerm: endStop,
        })
        setEndStopsList(stops.data.stops)
    }

    return (
        <Card>
            <CardHeader
                avatar={<SearchIcon fontSize="large" />}
                title="Find route"
                titleTypographyProps={{ variant: 'h5' }}
            />
            <CardContent>
                <Stack
                    spacing={2}
                    direction="column"
                    margin="normal"
                    id="searchBox"
                >
                    <Stack
                        spacing={2}
                        direction="row"
                        margin="normal"
                        alignItems="stretch"
                    >
                        <TextField
                            color="secondary"
                            label="From:"
                            onChange={(event) => handleStartStop(event)}
                            value={startStop}
                        />
                        {showFindStart && (
                            <Button
                                size="large"
                                variant="contained"
                                color="secondary"
                                onClick={(event) => handleStartToGtfsId(event)}
                                type="submit"
                            >
                                Find
                            </Button>
                        )}
                    </Stack>
                    {startStopsList
                        .filter((value) => value !== null)
                        .filter(
                            (value) =>
                                value.vehicleMode !== 'SUBWAY' &&
                                value.vehicleMode !== 'FERRY'
                        )
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((startStopOption) => (
                            <Button
                                onClick={() => {
                                    setStartStop(startStopOption.gtfsId)
                                    setStartStopsList([null])
                                }}
                            >
                                {startStopOption.name} {startStopOption.code} (
                                {startStopOption.vehicleMode})
                            </Button>
                        ))}

                    <Stack spacing={2} direction="row" margin="normal">
                        <TextField
                            color="secondary"
                            label="Destination:"
                            onChange={(event) => handleEndStop(event)}
                            value={endStop}
                        />
                        {showFindEnd && (
                            <Button
                                size="large"
                                variant="contained"
                                color="secondary"
                                onClick={(event) => handleEndToGtfsId(event)}
                                type="submit"
                            >
                                Find
                            </Button>
                        )}
                    </Stack>
                    {endStopsList
                        .filter((value) => value !== null)
                        .filter((value) => value.vehicleMode !== 'SUBWAY')
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((endStopOption) => (
                            <Button
                                onClick={() => {
                                    setEndStop(endStopOption.gtfsId)
                                    setEndStopsList([null])
                                }}
                            >
                                {endStopOption.name} {endStopOption.code} (
                                {endStopOption.vehicleMode})
                            </Button>
                        ))}

                    <DateTimePicker
                        color="secondary"
                        renderInput={(props) => (
                            <TextField color="secondary" {...props} />
                        )}
                        label="Start time:"
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                    />

                    <Button
                        size="large"
                        variant="contained"
                        color="secondary"
                        onClick={(event) => handleFindRoute(event)}
                        type="submit"
                    >
                        Find
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default Search
