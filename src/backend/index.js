const express = require('express')
const app = express()

app.get('/health', (req, res) => {
    res.send('<h1>Health check ok!</h1>')
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`🔥 Backend on port ${PORT} is up!`)
})