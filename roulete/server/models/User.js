const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema, model } = mongoose;

const UserInfoSchema = new Schema({
  userId: Number,
  nickName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentNAT: { type: String },
});

UserInfoSchema.plugin(AutoIncrement, { 
  id: 'userId_seq', 
  inc_field: 'userId', 
  start_seq: 1000000 
});

module.exports = model('UserInfo', UserInfoSchema);
