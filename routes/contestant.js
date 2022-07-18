
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
const rolesChecker = require('../middleware/roleschecker');
const userHasVoted = require('../middleware/userHasVoted')


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


// check if the contestant information is a valid user
router.get('/:email/user-exist', rolesChecker([Roles.admin,Roles.siteAdmin, Roles.user]), (req, res) =>
{
  User.find({email:req.params.email}, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(404).json({
        success: false,
        errors: [JSON.stringify(err)]
      });
    }
    return res.json(result);
  });
})



//For Registering Contestants

router.post("/", rolesChecker([Roles.admin,Roles.siteAdmin]), (req, res) => {
    const {position,party, imageUrl , dateVal, contestants, detail} = req.body 
    if(!position || !contestants || !party){
       return res.status(422).json({error:"Position/Title or type and candidates are required"}) 
    }


    
    // to do find each user in the contestants field and envelop their id into the candidates
    const potentialCandidate = new Contestants({
        position,
        party,
        reg_time:dateVal,
        detail,
        //candidates:[{id: userIds, data: userIds}] 
        candidates: contestants,   
    })
    
    potentialCandidate.save()
    .then(user=>{
        res.json({message:"saved successfully"})
    })
    .catch(err=>{
      console.log(err)
    })
});





router.put("/:poolId/vote/:contestantId", rolesChecker([Roles.user]) , (req,res)=>{

  // get the user _id by the token
     const token  = req.headers["auth-token"];
     let usersPVC = null // user trying to vote
    if(!token){
       return res.status(401).json({error:"you must be logged in"})
    }
   
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }
        console.log(payload)

        const {_id} = payload;
        usersPVC = _id;
        //console.log(_id)
        User.findById(_id).then(userdata=>{

            // let the contestant be sorted out by the request id 
            // for which the votes field will be sorted or scanned
            // to find the user existing id
           // console.log(req.params)
            // if votes exist already

            const expectedCandidatesId = req.params.contestantId;
            
            
            //get the contest pool by the request id of the pool
            Contestants.find({ _id: req.params.poolId}, (error, result)=>{
                 if(err){
                    return   res.status(401).json({error:"User does not exist"})
                 }
             //    console.log(result)
                  const contestantDetails = result[0].candidates[0];
                 
                  Object.keys(contestantDetails).forEach(contester =>{
          
                     console.log(contestantDetails[contester].contestant_id)

                     // if we have a match of expected user voting his choice
                     if(contestantDetails[contester].contestant_id == expectedCandidatesId){
                         console.log("we are here")
                         // initialize the ballot if it dont exist or if nobody has voted
                         if(!contestantDetails[contester].hasOwnProperty("ballot")){
                            console.log("we are here 2")
                            contestantDetails[contester]['ballot'] = [];
                            //save the users voters card ie: the identity id
                            contestantDetails[contester]['ballot'].push(usersPVC)
                            // increse the candidates vote id
                            contestantDetails[contester].votes=  parseInt(contestantDetails[contester].votes) + 1
                          
                            console.log(contestantDetails[contester].votes)
                            // update the reserve
                            Contestants.findOne({ _id: req.params.poolId }).
                              then(doc => Contestants.updateOne({ _id: doc._id }, { candidates: [contestantDetails] })).
                              // then(() => Contestants.findOne({ name: 'Neo' })).
                              then(doc => {
                                console.log(doc)


                                // return positive res

                                // return success
                                return res.json({
                                  success: true,
                                  data: doc,
                                  voteCounter:  contestantDetails[contester].votes
                                }); 

                              });


                            

                         }else{
                            // a ballot already exist for this candidate which is not empty
                            console.log("we are here 3")
                            // check if the user has already voted this
                            const ballot = contestantDetails[contester]['ballot'];
                            if(ballot.includes(usersPVC)){
                              console.log("we are here 4")
                              // you cant vote again
                              return   res.status(401).json({
                                error:"Sorry you cant vote twice",
                                 voteCounter:  contestantDetails[contester].votes
                              })
               

                            }else{
                              console.log("we are here 5")
                                //save the users voters card ie: the identity id
                                contestantDetails[contester]['ballot'].push(usersPVC)
                                // increse the candidates vote id
                                contestantDetails[contester].votes=  parseInt(contestantDetails[contester].votes) + 1
                          
                            
                                // update the reserve
                            Contestants.findOne({ _id: req.params.poolId }).
                              then(doc => Contestants.updateOne({ _id: doc._id }, { candidates: candidates })).
                             // then(() => Contestants.findOne({ name: 'Neo' })).
                              then(doc =>{ 
                                console.log(doc)



                                // return positive res

                                // return success
                                return res.json({
                                  success: true,
                                  data: doc,
                                  voteCounter:  contestantDetails[contester].votes
                                
                                });
                                
                              })



                                

                            }
                         }
                          
                     }
                  })
                 
                 
                 
            }).catch(err =>{
                    return   res.status(401).json({error:"Some ERROR OCCURED"})
               })
            
        }).catch(err =>{
                
            return   res.status(401).json({error:"Some ERROR OCCURED"})    
        })
    })
})

router.delete("/:id/delete", rolesChecker([Roles.admin,Roles.siteAdmin]), (req,res)=>{
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