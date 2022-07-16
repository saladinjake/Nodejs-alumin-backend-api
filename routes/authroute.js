const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/key')
const requireLogin = require('../middleware/requireLogin')
const Roles = require("../models/roles");
const rolesChecker = require('../middleware/roleschecker')

const precheckController = require("../controllers/precheckController")





router.post("/register", (req, res) => {
  
    const {name,email,password, lastname, passwordRepeat} = req.body 
    if(!email || !password || !name || !lastname){
       return res.status(422).json({error:"All fields are required"}) 
    }

    if(password!=passwordRepeat){
       return res.status(422).json({error:"password do not match"}) 
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
           return res.status(422).
           json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
              const user = new User({
                  email,
                  password:hashedpassword,
                  name
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

});

router.post("/login", (req, res) => {
    

    const {email,password } = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,role} = savedUser
               res.json({token,user:{_id,name,email,role}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })

  });

  router.get("/protected",requireLogin,(req, res) => {
      return res.json({message:"authenticated"})
  })

  // router.get('/authcheck/user', rolesChecker(), precheckController.isUserAuthenticated);
  // router.get('/authcheck/admin', rolesChecker([Roles.admin,Roles.siteAdmin]), precheckController.isAdminAuthenticated);


module.exports = router
