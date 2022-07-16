const mongoose = require('mongoose')
// const {ObjectId} = mongoose.Schema.Types
const contestantSchema = new mongoose.Schema({
    position:{
        type:String,
        required:true
    },
     party:{
        type:String,
    },
    
   
    
    reg_time:{
        type:Date,
        default: Date.now
    },
    // counter: {
    //     type:String,
    //     default:0
    // },

    candidates: [
    {  
      id: {
        type: mongoose.Types.ObjectId
       }, 

       imageUrl:{
         type:String
       }
    }

       ]

 
})




// user = req.user;
//   console.log("adding friend to db");
//   models.User.findOne({'email': req.params.email}, '_id', function(err, newFriend){
//     models.User.findOne({'_id': user._id}, function(err, user){
//       if (err) { return next(err); }
//       user.friends.push(newFriend);
//     });
//   });
// User
//  .find()
//  .populate('friends')
//  .exec(...)

//Contestant.votes.push(newUserVote._id);
mongoose.model("Contestant",contestantSchema)