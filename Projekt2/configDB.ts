//import mongoose from 'mongoose'

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://username:password@cluster0.hlmgs.mongodb.net/pab?retryWrites=true&w=majority')

const UserSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
  },
  token: {
    type: Number,
    default: 0,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model("User", UserSchema);

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

export const Tag = mongoose.model("Tag", TagSchema);

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  createDate: {
    type: Date,
    default: false,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sharedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
});

export const Note = mongoose.model("Note", NoteSchema);
// mongoose.connect('mongodb://username:password@cluster0.hlmgs.mongodb.net:27017/pab');
//mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]

