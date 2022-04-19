//import mongoose from 'mongoose'

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://username:password@cluster0.hlmgs.mongodb.net/pab?retryWrites=true&w=majority')

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 0,
    },
  });
  
  const User = mongoose.model("User", UserSchema);
// mongoose.connect('mongodb://username:password@cluster0.hlmgs.mongodb.net:27017/pab');
//mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]

