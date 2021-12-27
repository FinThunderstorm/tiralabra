import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Application from './components/Application'
import PerformanceTest from './components/PerformanceTest'

const App = () => {
    const appName = 'Reittiopas'

    return (
        <>
            <AppBar color="primary">
                <Toolbar>
                    <Typography variant="h5" noWrap component="div">
                        {appName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Routes>
                <Route path="/" element={<Application />} />
                <Route path="/performance" element={<PerformanceTest />} />
            </Routes>
        </>
    )
}

export default App
