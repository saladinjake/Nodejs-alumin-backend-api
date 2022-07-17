
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
router.get('/', rolesChecker([Roles.admin,Roles.siteAdmin, Roles.user]), (req, res) =>
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


router.get('/:id', rolesChecker([Roles.admin,Roles.siteAdmin, Roles.user]), (req, res) =>
{
           console.log(req.params.id)
  Contestants.find({_id:req.params.id}, (err, result) => {
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
  
    const {position,party, imageUrl , dateVal, contestants, detail} = req.body 
    if(!position || !contestants || !party){
       return res.status(422).json({error:"Position/Title or type and candidates are required"}) 
    }
    console.log(contestants )
   
    const potentialCandidate = new Contestants({
        position,
        party,
        reg_time:dateVal,
        detail,
        //candidates:[{id: userIds, data: userIds}] 
        candidates: contestants   
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