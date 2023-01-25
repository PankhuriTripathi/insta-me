const express = require('express')
const router =express.Router()
const mongoose= require('mongoose')
const User=mongoose.model("User")
const crypto = require('crypto')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const {JWT_SECRET}= require('../config/keys')
const nodemailer = require('nodemailer')
const sendgridTransport = require("nodemailer-sendgrid-transport")
const requireLogin= require('../middleware/requireLogin')
const {SENDGRID_API, EMAIL} = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API,

    }
}))

router.post('/signup', (req,res)=>{
    const {name, email, password,pic}= req.body //destructuring our req.body
    if(!name || !password || !email)
    res.json({error:"please enter all fields"})  //sending response in form of json

    User.findOne({email:email}) //to query on database
    .then((savedUser)=>{
        if(savedUser){
           return res.status(422).json({error:"user already exist"})
        }
       bcrypt.hash(password,12)
       .then(hashedpassword=>{
        const user =new User({
            email:email, //can be condensed to just email
            password:hashedpassword,
            name,
            pic
        })
        
        user.save()
        .then(user=>{
            transporter.sendMail({
                to:user.email,
                from:"deanquote2020@gmail.com",
                subject:"signup success",
                html:"<h1>Welcome to insta-me</h1>"


            }).catch(err=>{
                console.log(err)
            })
            res.json({message:"saved successfully"})
        })
        .catch(err=>{
            console.log(err)
        })

       })
        
    })
    .catch(err=>{
        console.log(err)
    })
    

})

router.post('/signin', (req,res)=>{
    const {email,password}= req.body
    if(!email || !password)
     return res.status(422).json({error: "please carefully add email and password"})
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
        return res.status(422).json({error:"invalid email or password"})
        }
      
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
              const token =jwt.sign({_id:savedUser._id}, JWT_SECRET);
              const {_id, name,email, followers, following,pic} =savedUser
              res.json({token, user:{_id, name, email, followers, following,pic}})
            }
            else{
                return res.status(422).json({error:"invalid email or password"})
            }
        })
         
        .catch(err=>{                     //error from our side therefore console logging
            console.log(err)
        })
    })
})

router.post('/reset-password', (req,res)=>{
    crypto.randomBytes(32,(err, buffer)=>{
        if(err){
            console.log(err)
        }
        //converting from hex to string so...
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user)
            return res.status(422).json({error:"user dont exist with that email."})
            user.resetToken = token
            //within 1 hr reset password
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"deanquote2020@gmail.com",
                    subject:"Password reset",
                    html:`
                    <p>You requested for password reset<p/>
                    <h5>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password.</h5>
                    `
                })
                .catch(err=>{
                    console.log(err)
                })
                res.json({message:"check your mail"})
            })

    })
    })
})

router.post('/newpassword', (req,res)=>{
    const newToken = req.body.token
    const newPassword = req.body.password
    User.findOne({resetToken:newToken, expireToken:{$gt:Date.now()}}) //adding one more condition that expire token is greater than current time
    .then(user=>{
        if(!user)
        return res.status(422).json({error:"Try again session expired"})
        bcrypt.hash(newPassword,12)
        .then(hashedpassword=>{
               user.password = hashedpassword
               user.resetToken = undefined
               user.expireToken = undefined
               user.save().then((saveduser)=>{
                res.json({message:"password updated successfuly"})
               })
          })

    }).catch(err=>{
        console.log(err)
    })
    
})



module.exports = router