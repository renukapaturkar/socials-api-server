const mongoose = require('mongoose')
const {Schema} = mongoose
const {User} = require('./user.model.js')

const PostSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}, 
	content: {
		type:String, 
		max: 100
	}, 
	image: {
		type: String
	}, 
	likes: {
		type: Array, 
		default: []
	},
	comments:  [
		{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, comment: String }]
		
	
}, {timestamps: true})

const Post = mongoose.model('Post', PostSchema)


module.exports = {Post}