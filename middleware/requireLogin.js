
const jwt=require('jsonwebtoken')
const { JWT_SECRET } = require("../config/keys")
const mongoose=require('mongoose')
const User=mongoose.model("User")


module.exports= (req,res,next)=>{
    const {authentication}= req.headers
    if(!authentication){
        return res.status(401).json({error: "not successfully authenticated"})
    }
    const token=authentication.replace('Bearer ', "")
    jwt.verify(token, JWT_SECRET, (err, payload)=>{
        if(err){
            return res.status(401).json({error: "you are not logged in"})
        }
        const {_id}= payload
        User.findById(_id)
        .then(userData=>{
            req.user= userData
            next()
        })
       
    })
}