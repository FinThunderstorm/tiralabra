/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import {
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material'
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from '@mui/lab'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import RouteIcon from '@mui/icons-material/Route'

import Stop from './Stop'

const RouteViewer = () => {
    const routeState = useSelector((state) => state.route)

    if (routeState === null) {
        return <></>
    }

    const { route } = routeState

    return (
        <Stack spacing={2} direction="column" margin="normal">
            <Stop stop={route.from} title="From" color="error" />
            <Stop stop={route.to} title="Destination" color="success" />

            <Card>
                <CardContent>
                    <Typography variant="body1">
                        Start time:{' '}
                        {new Date(route.startTime).toLocaleString('fi-FI', {
                            timeZone: 'Europe/Helsinki',
                        })}
                    </Typography>
                    <Typography variant="body1">
                        Total travel time:{' '}
                        {(route.travelTime / (60 * 1000)).toFixed(0)} minutes
                    </Typography>
                    <Typography variant="body1">
                        Arrived to destination:{' '}
                        {new Date(route.arrived).toLocaleString('fi-FI', {
                            timeZone: 'Europe/Helsinki',
                        })}
                    </Typography>
                    <hr />
                    <Timeline>
                        {route.via.map((stop) => (
                            <TimelineItem>
                                <TimelineOppositeContent>
                                    {new Date(
                                        stop.stop.arrivesAt
                                    ).toLocaleString('fi-FI', {
                                        timeZone: 'Europe/Helsinki',
                                    })}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <LocationOnIcon />
                                            </ListItemIcon>
                                            <ListItemText>
                                                {`${stop.stop.name} (${stop.stop.code} / ${stop.stop.gtfsId})`}
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <RouteIcon />
                                            </ListItemIcon>
                                            <ListItemText>
                                                {`Arrived with ${stop.route}`}
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </CardContent>
            </Card>
        </Stack>
    )
}

export default RouteViewer
