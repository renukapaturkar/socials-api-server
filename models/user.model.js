const mongoose = require('mongoose')
const {Schema} = mongoose

const UserSchema = new Schema({
	name: {
		type:String, 
		required: true
	},
	email: {
		type:String, 
		required: true, 
		unique: true
	}, 
	username: {
		type:String, 
		required: true, 
		min:5,
		max:20,
		unique: true,
	},
	password: {
		type: String, 
		required: true, 
		min: 8 
	}, 
	bio: {
		type:String, 
		max:100
	},
	profilePicture: {
		type: String,
		default: ""
	}, 
	followers:{
		type: Array, 
		default: []
	},
	following:{
		type: Array, 
		default: []
	}, 
	notification: {
		notify: {
			type:String, 
			enum: ['follow', 'like', 'comment']
		},
		user: String, 
		post: String, 
		date: Date
	}


}, {timestamps: true})

const User = mongoose.model("User", UserSchema)

module.exports = {User}