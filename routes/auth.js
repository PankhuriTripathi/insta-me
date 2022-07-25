const express = require('express')
const router =express.Router()
const mongoose= require('mongoose')
const User=mongoose.model("User")
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const {JWT_SECRET}= require('../config/keys')
const requireLogin= require('../middleware/requireLogin')

// router.get("/protected",requireLogin, (req,res)=>{
//     res.send("hey user")
// })
router.post('/signup', (req,res)=>{
    console.log(req.body.name)
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
            email:email, //can to condensed to just email
            password:hashedpassword,
            name,
            pic
        })
        user.save()
        .then(user=>{
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

module.exports = router