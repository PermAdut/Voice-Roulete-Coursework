const express = require('express')
const mogoose = require('mongoose')
const config = require('config')
const authRouter = require('./routes/authRoutes')
const app = express()
const PORT = config.get('serverPort')
const corsMiddleware = require('./middleware/cors.middleware')

app.use(corsMiddleware)
app.use(express.json())
app.use('/api/auth', authRouter)


const start = async()=> {
    try{
        await mogoose.connect(config.get('dbUrl'))

        app.listen(PORT , () => {
            console.log('sss',PORT)
        })
    } catch(e){
        console.log(e)
    }
}

start()