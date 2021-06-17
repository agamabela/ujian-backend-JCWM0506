const express = require('express')
const cors = require('cors')
const { db } = require('./config')
const bearerToken = require('express-bearer-token')



// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bearerToken())
db.getConnection((err, connection) => {
    if (err) {
        return console.error('Error mysql', err.message)
    }
    console.log(`Connected to MySQL server: ${connection.threadId}`)
})

const { userRouter, movieRouter } = require('./router')
app.use('/user', userRouter)
app.use('/movies', movieRouter)


app.use((error, req, res, next) => {
    console.log("Handling Error", error)
    res.status(500).send({ status: 'Error Mysql', message: error })
})
// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM0506</h1>')
app.get('/', response)

// bind to local machine
const PORT = process.env.PORT || 2025
app.listen(PORT, () => `CONNECTED : port ${PORT}`)