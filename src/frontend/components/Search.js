/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DateTimePicker from '@mui/lab/DateTimePicker'
import {
    Card,
    TextField,
    Button,
    CircularProgress,
    CardContent,
    Stack,
    CardHeader,
} from '@mui/material'

import { findRoute } from '../reducers/routeReducer'

const Search = () => {
    const [startStop, setStartStop] = useState('HSL:4620205')
    const [endStop, setEndStop] = useState('HSL:1240118')
    const [startTime, setStartTime] = useState(new Date())

    const searching = useSelector((state) => state.loading)

    const dispatch = useDispatch()
    const handleFindRoute = (event) => {
        event.preventDefault()
        dispatch(findRoute(startStop, endStop, startTime))
    }

    return (
        <Card>
            <CardHeader title="Hae reittiä" />
            <CardContent>
                <Stack
                    spacing={2}
                    direction="column"
                    margin="normal"
                    id="searchBox"
                >
                    <TextField
                        label="Lähtöpysäkki:"
                        onChange={(event) => setStartStop(event.target.value)}
                        value={startStop}
                    />

                    <TextField
                        label="Kohdepysäkki:"
                        onChange={(event) => setEndStop(event.target.value)}
                        value={endStop}
                    />

                    <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Lähtöaika:"
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                    />

                    <Button
                        size="large"
                        variant="outlined"
                        onClick={(event) => handleFindRoute(event)}
                        type="submit"
                    >
                        Etsi
                    </Button>
                </Stack>
            </CardContent>

            {searching ? <CircularProgress /> : <></>}
        </Card>
    )
}

export default Search
