  
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/key')
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports = (req,res,next)=>{
    //const {authorization} = req.headers
    //authorization === Bearer ewefwegwrherhe
     //const token = authorization.replace("Bearer ","")
     const token  = req.headers["auth-token"]
    if(!token){
       return res.status(401).json({error:"you must be logged in"})
    }
   
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }
        console.log(payload)

        const {_id} = payload
        //console.log(_id)
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
    })
}