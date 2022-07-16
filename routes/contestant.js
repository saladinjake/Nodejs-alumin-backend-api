
const express = require('express')
const router = express.Router();

const mongoose = require('mongoose')
const User = mongoose.model("User")
const Contestants = mongoose.model("Contestant")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/key')
const requireLogin = require('../middleware/requireLogin')
const Roles = require("../models/roles");
const rolesChecker = require('../middleware/roleschecker')


//All Contestants
router.get('/', rolesChecker([Roles.admin,Roles.siteAdmin]), (req, res) =>
{
           
  Contestants.find({}, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        errors: [JSON.stringify(err)]
      });
    }

    return res.json(result);
  });


})
//For Registering Contestants

router.post("/", (req, res) => {
  
    const {position,party, userIds, imageUrl} = req.body 
    if(!position || !userIds || !party){
       return res.status(422).json({error:"Position/Title or type and candidates are required"}) 
    }

   
    const potentialCandidate = new Contestants({
        position,
        party,
        candidates:[{id: userIds, imageUrl: imageUrl}]    
    })
    

    potentialCandidate.save()
    .then(user=>{
        res.json({message:"saved successfully"})
    })
    .catch(err=>{
      console.log(err)
    })

});



router.delete("/:id/delete", (req,res)=>{
  Contestants.findByIdAndRemove(req.params.id, (err, user) => {
    if (err || !user) {
      if (err) console.log(err);
      return res.status(404).json({
        success: false,
        errors: [ err ? err.message : `user id '${req.params.id} not found'` ]
      });
    }

    return res.json({
      success: true,
      data: user
    });
  });
})











module.exports = router;