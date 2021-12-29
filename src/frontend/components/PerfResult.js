import React from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import { useSelector } from 'react-redux'

/**
 * PerfResult-komponentia käytetään suorituskykytestin tuloksien esittämiseen
 * @returns React-komponentti
 */
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
