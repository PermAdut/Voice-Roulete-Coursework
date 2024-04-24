const {Schema, model} = require('mongoose')


const UserInfo = new Schema({
    nickName: {type:String, required:true, unique:true},
    password: {type: String, required:true},
    currentNAT:{type:String},
    //isConnected:{type:Boolean},
    //connectedIP:{type:String}
})



module.exports = model('UserInfo', UserInfo)