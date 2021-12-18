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
                    <TextField
                        color="secondary"
                        label="From:"
                        onChange={(event) => setStartStop(event.target.value)}
                        value={startStop}
                    />

                    <TextField
                        color="secondary"
                        label="Destination:"
                        onChange={(event) => setEndStop(event.target.value)}
                        value={endStop}
                    />

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
