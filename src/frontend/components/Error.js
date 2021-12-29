import React from 'react'
import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

/**
 * Error-komponentti vastaa viestien esittämisestä käyttöliittymässä
 * @returns React-komponentti
 */
const Error = () => {
    const msg = useSelector((state) => state.error)
    return <>{msg && <Alert severity={msg.type}>{msg.msg}</Alert>}</>
}

export default Error
