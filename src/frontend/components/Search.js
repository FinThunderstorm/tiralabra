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
    Grid,
    Typography,
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
            <CardContent>
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    margin="normal"
                    id="searchBox"
                    justifyContent="flex-start"
                >
                    <Grid item>
                        <Typography variant="h6">Hae reittiä</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Lähtöpysäkki:"
                            onChange={(event) =>
                                setStartStop(event.target.value)
                            }
                            value={startStop}
                        />
                    </Grid>

                    <Grid item>
                        <TextField
                            label="Kohdepysäkki:"
                            onChange={(event) => setEndStop(event.target.value)}
                            value={endStop}
                        />
                    </Grid>

                    <Grid item>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Lähtöaika:"
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                        />
                    </Grid>

                    <Grid item>
                        <Button
                            size="large"
                            variant="outlined"
                            onClick={(event) => handleFindRoute(event)}
                            type="submit"
                        >
                            Etsi
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>

            {searching ? <CircularProgress /> : <></>}
        </Card>
    )
}

export default Search
