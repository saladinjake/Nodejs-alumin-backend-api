  
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/key')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Contestants = mongoose.model("Contestant")

module.exports = (req,res,next)=>{
    return next()
}