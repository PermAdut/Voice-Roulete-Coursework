const express = require('express')
const mogoose = require('mongoose')
const config = require('config')

const app = express()
const PORT = config.get('serverPort')


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