import React from 'react'
import { CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'

const Loading = () => {
    const loading = useSelector((state) => state.loading)
    return <>{loading ? <CircularProgress /> : <></>}</>
}

export default Loading
