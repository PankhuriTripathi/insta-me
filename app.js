const express= require('express')
const app= express()
const mongoose= require('mongoose')
const PORT= process.env.PORT || 5000
const {MONGOURI}= require('./config/keys')




mongoose.connect(MONGOURI)
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongo")
})
mongoose.connection.on('error', (err)=>{
    console.log("err connecting",err)
})


require('./models/user')
require('./models/post')
  //to parse it into json and order matters!!
 
  app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


// const customMiddleware= (req, res, next)=>{
//     console.log("hey")
//     next()
// }

// app.use(customMiddleware)

// app.get('/', (req,res)=>{
//     res.send("yo yo")
// })
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path =require('path')
    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname,'client/build','index.html'))
    })
}


app.listen(PORT, ()=>{
    console.log("server is running", PORT)
})