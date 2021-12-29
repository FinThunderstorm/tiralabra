import {
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import React from 'react'
import { useSelector } from 'react-redux'

/**
 * Departures-komponentti vastaa pysäkiltä lähtevien linjojen esittämisestä käyttöliittymässä.
 * @returns React-komponentti
 */
const Departures = () => {
    const departures = useSelector((state) => state.departures)

    if (departures === null) {
        return <></>
    }

    const subheader = `${departures.data.stop.name} (
                    ${departures.data.stop.code} / ${departures.data.stop.gtfsId})`
    return (
        <Card>
            <CardContent>
                <CardHeader title="Departures for stop" subheader={subheader} />
                <List>
                    {departures.data.departures.map((dep) => (
                        <ListItem>
                            <ListItemIcon>
                                <DirectionsBusIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {dep.name} - departures at{' '}
                                {new Date(
                                    dep.realtimeDeparturesAt
                                ).toLocaleString('fi-FI', {
                                    timeZone: 'Europe/Helsinki',
                                })}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    )
}

export default Departures
