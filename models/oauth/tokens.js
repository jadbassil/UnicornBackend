const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    email: {type: String, required:true, unique:true},
    password: { type: String, required: true },
    token: String,
    created_at: Date,
    verified: {type: Boolean, default: false},
  });

const TokensSchema = new Schema({
    accessToken: String,
	expires: Date,
	clientId: String,
	user: userSchema
});

module.exports = TokensSchema;