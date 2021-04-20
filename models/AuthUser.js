const mongoose = require('mongoose');

//web user schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  resetToken:String,
  expireToken:Date,
  
  date: {
    type: Date,
    default: Date.now
  }

});

const User = mongoose.model('Userdata', UserSchema);

module.exports = User;
