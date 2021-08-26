const {User} = require('../models/user.model')
const {Post} = require('../models/post.model')
const {cloudinary} = require('../config/cloudinary')

const createPost = async(req, res) => {
	const {userId} = req.user; 
	const {content, image} = req.body
	try{
		let uploadData, imageData
		if(image){
			uploadInfo = await cloudinary.uploader.upload(image)
			imageData = {
				public_id: uploadImage.public_id,
				url: uploadImage.url
			}
		}
		const newPost = await new Post({userId: userId, content: content, image:imageData})
		console.log("newPost", newPost)
		const post = await newPost.save()
		console.log("saved Post", post)
		res.status(200).json({success: true, message: "new post created", data: post})


	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
	
}

const deletePost = async(req, res) => {
	const {postId} = req.params
	console.log(postId)
	try {
		const post = await Post.findByIdAndRemove(postId)
		res.status(200).json({success: true})
	}catch(error){
		res.status(500).json({success:false, message: "Internal Server Error", errMessage: error.message})
	}
}

const likePost = async(req, res) => {
	const {postId} = req.params
	const {userId} = req.body
	try {
		const post = await Post.findById(postId)
		if(!post.likes.includes(userId)){
			await post.updateOne({$push: {likes: userId}})
			await Post.findByIdAndUpdate(post.userId, {$push: {
				notification: {
					notify: 'like', 
					sourceUser: userid,
            		post: post._id,
            		date: new Date().toISOString()
				}
			}})
			res.status(200).json({success: true, message: "Post liked successfully"})
		}else {
			await post.updateOne({$pull: {likes: userId}})
			res.status(200).json({success: true, message: "Post is unliked successfully"})
		}
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
}


const getPost = async(req, res) => {
	const {postId} = req.params
	try {
		const post = await Post.findById(postId).populate("userId", "name username profilePicture")
		res.status(200).json({success: true, post: post})

	}catch(error){
		res.status(500).json({success:false, message: "Internal Server Error", errMessage: error.message})
	}
}


const getAllPosts = async(req, res)=> {
	const {userId} = req.user
	try {
		const currentUser = await User.findById(userId)
		const userPosts = await Post.find({userId: currentUser._id})
		const followingPost = await Promise.all(
			currentUser.following.map((friendId)=> {
				Post.find({userId: friendId})
			})
		)
		const allPosts = userPosts.concat(...followingPost)
		res.status(200).json({success: true, posts: allPosts})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
}

//comment on post 

const commentOnPost = async(req, res) => {
	const postId = req.params
	const {userId} = req.user
	const {comment} = req.body
	try {
		const post = Post.findByIdAndUpdate(postId, {$push: {
			comment: {
				userid: userId, 
				comment: comment
			}
		}}, {new: true}).populate("userId", "name username profilePicture").populate("comment.userId", "name username profilePicture")
		if(post && post.userId._id !== userId){
			await Post.findByIdAndUpdate(post.userId._id, {$push: {
				notifications: {
					notify: "comment",
					user: userId, 
					post: post._id, 
					date: new Date().toISOString()
				}
			}})
		}
		res.status(200).json({success: true, post})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
}


//delete comment

const deleteComment = async(req, res) => {
	const {postId, commentId} = req.params
	const {userId} = req.user
	try {
		const post = await Post.findByIdAndUpdate(postId, {$pull: {
			comment: {_id: commentId }
		}}).populate("userId", "name username profilePicture").populate("comment.userId", "name username profilePicture")
		if(post && post.userId._id !== userId){
			
		}

	}catch(error){
		res.status.json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
}

//get feed 

const getFeed = async(req, res) => {
	const {userId} = req.user
	try {
		const post = await Post.find({userId: userId}).populate("userId", "name username profilePicture")	

		const user = User.findById(userId)
		const postsFromFollowings = await Promise.all(
			user.following.map(followingId => {
				return Post.find({userId: followingId}).populate("userId","name username profilePicture")
			})
		)
		post.__v = undefined
		post.updatedAt = undefined
		const allFeedPosts = post.concat(...postsFromFollowings)
		res.status(200).json({success: true, posts: allFeedPosts})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server error", errMessage: error.message})
	}
}


module.exports = {createPost, deletePost, likePost, getPost, getAllPosts, commentOnPost, getFeed}