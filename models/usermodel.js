const mongoose = require('mongoose')
// const {ObjectId} = mongoose.Schema.Types
const utils = require('../helpers/utils');
const mongoosePaginate = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');

const userSchema = new mongoose.Schema({
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
    role:{
        type:String,
        default:0
    }
 
})




userSchema.plugin(mongoosePaginate);
userSchema.plugin(timestamps);


/**
 * Override default toJSON, remove password field and __v version
 */
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  obj.id = obj._id;
  delete obj._id;
  return obj;
};


/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
userSchema.methods.comparePassword = function comparePassword(password, callback) {
  utils.compareHash(password, this.password, callback);
};


/**
 * The pre-save hook method.
 *
 * NOTE: pre & post hooks are not executed on update() and findeOneAndUpdate()
 *       http://mongoosejs.com/docs/middleware.html
 */
userSchema.pre('save', function saveHook(next) {
  const user = this;

  // Proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();

  return utils.hash(user.password, (err, hash) => {
    if (err) { return next (err); }

    // Replace the password string with hash value
    user.password = hash;

    return next();
  });
});


mongoose.model("User",userSchema)