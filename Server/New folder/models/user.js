const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
   firstname:{
    type:String,
    require:true,
   },

   lastname:{
    type:String,
    require:true,
   },

   email:{
    type: String,
    required: true,
    unique: true,
   },

   password:{
    type: String,
    required: true,
   },

   createdAt:{
    type: Date,
    default: Date.now()
   },

   role:{
      type: String,
      required: true,
      default:"user"
     },
     isActive :{
      type : String,
      default : 'Active'
     },

     userImage:{
      type:String,
     }

});


const User = mongoose.model('User', userSchema);

module.exports = User;

