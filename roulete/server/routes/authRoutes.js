const Router = require('express')
const User = require('../models/User')
const router = new Router()
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')


router.post('/registration',
    [
        check('nickName', "Incorrect User").isString(),
        check('password', "Password must be longer than 3 and shorter than 12").isLength({min:3,max:12}),
    ],
async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:"Invalid request", errors})
        }

        const  {nickName, password} = req.body

        const candidate = await User.findOne({nickName})

        if(candidate){
            return res.status(400).json({message:"Пользователь с таким никнеймом уже существует"})
        }

        if(password.length <= 3){
            return res.status(400).json({message:"Слишком короткий пароль"})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({nickName,password:hashPassword})
        await user.save()
        return res.json({message:"Пользователь создан"})

    } catch(e){
        console.log(e)
        res.send({message:`Ошибка сервера ${e}`})
    }
})


router.post('/login',
async (req, res) => {
    try{
        console.log(req.body)
        const {nickName, password} = req.body
        const user = await User.findOne({nickName})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isValidPass = bcrypt.compareSync(password, user.password)
        if (!isValidPass)
        {
            return res.status(400).json({message:"Not valid password"})
        }
        user.currentNAT = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        const token = jwt.sign({is:user.userId},config.get("secretKey"), {expiresIn : "1h"} )
        return res.json({
            token,
            user:{
                id:user.userId,
                nickName:user.nickName,
                currentNAT: user.currentNAT,
            }
        })
    } catch(e){
        console.log(e)
        res.send({message:`Server error ${e}`})
    }
})


module.exports = router