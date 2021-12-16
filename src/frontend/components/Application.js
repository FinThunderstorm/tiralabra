/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react'
import AdapterDateFns from '@mui/lab/AdapterDayjs'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { useDispatch } from 'react-redux'
// import './App.css'
import { TextField, Button, CircularProgress } from '@mui/material'

import { findRoute } from '../reducers/routeReducer'
import Departures from './Departures'
import Map from './Map'
import RouteViewer from './RouteViewer'
import Search from './Search'

const Application = () => {
    const [startStop, setStartStop] = useState('HSL:4620205')
    const [endStop, setEndStop] = useState('HSL:1240118')
    const [startTime, setStartTime] = useState(new Date())
    const [searching, setSearching] = useState(false)

    const dispatch = useDispatch()
    const handleFindRoute = (event) => {
        event.preventDefault()
        console.log('>>', startStop, endStop, startTime)
        dispatch(findRoute(startStop, endStop, startTime))
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale="fi">
            <div className="App">
                <h1>T</h1>
                <Search />
                <Map />
                <Departures />
                <RouteViewer />
            </div>
        </LocalizationProvider>
    )
}

export default Application
