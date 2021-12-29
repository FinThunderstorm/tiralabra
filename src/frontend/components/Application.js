import React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { Grid, Stack } from '@mui/material'

import Departures from './Departures'
import Map from './Map'
import RouteViewer from './RouteViewer'
import Search from './Search'
import Loading from './Loading'
import Error from './Error'

/**
 * Application-komponentti vastaa reitinhaun käyttöliittymäkokonaisuudesta
 * @returns React-komponentti
 */
const Application = () => {
    console.log('toot')
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale="fi">
            <Grid container className="App" margin="normal" spacing={2}>
                <Grid item xs={3}>
                    <Stack spacing={2} direction="column" margin="normal">
                        <Search />
                        <Error />
                        <Loading />
                        <RouteViewer />
                    </Stack>
                </Grid>

                <Grid item xs={9}>
                    <Stack spacing={2} direction="column" margin="normal">
                        <Map />
                        <Departures />
                    </Stack>
                </Grid>
            </Grid>
        </LocalizationProvider>
    )
}

export default Application
