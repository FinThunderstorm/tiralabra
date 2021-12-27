import React from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import { useSelector } from 'react-redux'

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
                </>
            )}
        </>
    )
}

export default PerfResult
