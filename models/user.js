const mongoose= require("mongoose")
const {ObjectId} = mongoose.Schema.Types
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/jjkaisen/image/upload/v1658695442/no-user-image_jx3tra.gif"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]


})

mongoose.model("User", userSchema)