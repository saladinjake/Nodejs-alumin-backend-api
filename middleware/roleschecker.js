/**
 * Auth Checker middleware function.
 *
 * @param {array} roles User roles to grant permision for a route
 *                      If undefined, any user with login token can access
 */
 const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/key')
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports = function(roles) {

  // Return middleware
  return (req,res,next)=>{
    //  const {authorization} = req.headers
    //  console.log(req.headers)
    // //authorization === Bearer ewefwegwrherhe
     const token  = req.headers["auth-token"]
    if(!token){
       return res.status(401).json({error:"you must be logged in"})
    }
    // const token = authorization.replace("Bearer ","")
    if(!token){
       return res.status(401).json({error:"you must be logged in"})
    }
   // const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload

        console.log(payload)

        
        User.findById(_id).then(userdata=>{
            


            if (roles) {
              if (roles.indexOf(userdata.role) > -1) { req.user = userdata ;return next();}
              else return res.status(401).end();
            }

            return next();
          
        })
    })
}

}











 


