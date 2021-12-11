import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Application from './components/Application'
import PerformanceTest from './components/PerformanceTest'

const App = () => {
    console.log('toot')

    return (
        <Routes>
            <Route path="/" element={<Application />} />
            <Route path="/performance" element={<PerformanceTest />} />
        </Routes>
    )
}

export default App
