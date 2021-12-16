/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
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

    const dispatch = useDispatch()
    const handleFindRoute = (event) => {
        event.preventDefault()
        dispatch(findRoute(startStop, endStop, startTime))
    }

    return (
        <Card>
            <CardHeader
                avatar={<SearchIcon fontSize="large" />}
                title="Hae reittiä"
                titleTypographyProps={{ variant: 'h5' }}
            />
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
                        variant="contained"
                        color="secondary"
                        onClick={(event) => handleFindRoute(event)}
                        type="submit"
                    >
                        Etsi
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default Search
