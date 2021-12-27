import React from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import { useSelector } from 'react-redux'
import AltRouteViewer from './AltRouteViewer'

const PerfResult = () => {
    const result = useSelector((state) => state.performance)
    return (
        <>
            {result && (
                <>
                    <Card>
                        <CardContent>
                            <Typography variant="body2">
                                {result.took.resultText}
                            </Typography>
                            <Typography variant="body2">
                                {result.took.comparation}
                            </Typography>
                        </CardContent>
                    </Card>
                    {result.uncachedRoute && (
                        <>
                            <Typography variant="h3">
                                Alternative route:
                            </Typography>
                            <AltRouteViewer alt />
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default PerfResult
