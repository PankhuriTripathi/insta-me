const express= require('express')
const router= express.Router()
const mongoose= require('mongoose')
const Post=mongoose.model("Post")
const User=mongoose.model("User")
const requireLogin= require('../middleware/requireLogin')

router.get('/user/:id', (req,res)=>{
    User.findOne({_id:req.params.id})
    .select('-password')            //in order to subtract i.e. not show password
    .then(user=>{
       Post.find({postedBy:req.params.id})
       .populate("postedBy", '_id name')
       .exec((err,posts)=>{
        if(err)
        return res.status(422).json({error:err})
        res.json({user, posts})
       })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow', requireLogin, (req,res)=>{
    User.findByIdAndUpdate(req.body.followid, {
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err)
       return res.status(422).json({error:err})
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followid}
        },
        {
            new:true
        }).select('-password')
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow', requireLogin, (req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowid, {
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err)
       return res.status(422).json({error:err})
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowid}
        },
        {
            new:true
        }).then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put("/updatepic",(requireLogin), (req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
        if(err){
            return res.status(422).json({error:"pic cannot post"})
        }
        res.json(result)
    })
})

router.post('/search-users', (req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router