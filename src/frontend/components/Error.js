import React from 'react'
import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Error = () => {
    const msg = useSelector((state) => state.error)
    return <>{msg && <Alert severity={msg.type}>{msg.msg}</Alert>}</>
}

export default Error
