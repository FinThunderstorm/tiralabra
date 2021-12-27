/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import React from 'react'

const Stop = ({ stop, title, color = 'inherit' }) => {
    if (stop === null) {
        return <></>
    }

    const subheader = `${stop.name} - (${stop.code} / ${stop.gtfsId})`
    return (
        <Card>
            <CardHeader
                title={title}
                subheader={subheader}
                avatar={<LocationOnIcon color={color} fontSize="large" />}
            />
            <CardContent>
                <Typography variant="body2">
                    Coordinates: {stop.coordinates.latitude}{' '}
                    {stop.coordinates.longitude}
                </Typography>
                <Typography variant="body2">
                    Stop type: {stop.locationType}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Stop
