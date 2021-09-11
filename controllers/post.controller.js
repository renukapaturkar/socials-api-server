const {User} = require('../models/user.model')
const {Post} = require('../models/post.model')


const createPost = async(req, res) => {
	const userId = req.user; 
	const {content, image} = req.body

	try{
		const newPost = await new Post({userId: userId, content: content, image: image})
		const post = await newPost.save()
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
		res.status(200).json({success: true, data: post, message: "Post liked!"})
	}catch(error){
		res.status(500).json({success:false, message: "Internal Server Error", errMessage: error.message})
	}
}

const likePost = async(req, res) => {
	const {postId} = req.params
	console.log(postId, "postId")
	const userId = req.user
	console.log(userId, "UserId")
	try {
		const post = await Post.findById(postId)

		if(!post.likes.includes(userId)){
			const updatedPost = await Post.findByIdAndUpdate(postId,{$push: {likes: userId}}, {new: true}).populate("userId", "name username profilePicture")
			await User.findByIdAndUpdate(post.userId, {$push: {
				notification: {
					notify: 'like', 
					sourceUser: userId,
            		post: post._id,
            		date: new Date().toISOString()
				}
			}})
			console.log(updatedPost, "UPDATEDPOST")
			res.status(200).json({success: true, post: updatedPost, message: "Post liked successfully"})
		}else {
			const updatedPost = await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}}, {new: true}).populate("userId", "name username profilePicture")
			res.status(200).json({success: true,post: updatedPost, message: "Post is unliked successfully"})
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


const getUserPosts = async(req, res)=> {
	const {userId}= req.params
	console.log(userId, "userId")
	try {
		const userPosts = await Post.find({userId: userId}).populate("userId", "name username profilePicture")
		console.log(userPosts, "This is users posts")
		res.status(200).json({success: true, posts: userPosts})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
}



const commentOnPost = async(req, res) => {
	const {postId} = req.params
	console.log(postId, "postId")
	const userId = req.user
	console.log(userId, "userId")
	const {comment} = req.body
	console.log(req.body, "req.body")
	try {
		const post = await Post.findByIdAndUpdate(postId, {$push: {
			comments: {
				userId: userId, 
				comment: comment
			}
		}}, {new: true}).populate("userId", "name username profilePicture").populate("comments.userId", "name username profilePicture")

		console.log(post, "Post")
		if(post && post.userId !== userId){
			await User.findByIdAndUpdate(post.userId, {$push: {
				notifications: {
					notify: "comment",
					user: userId, 
					post: post._id, 
					date: new Date().toISOString()
				}
			}})
		}
		res.status(200).json({success: true, post:post})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
}


//delete comment

// const deleteComment = async(req, res) => {
// 	const {postId, commentId} = req.params
// 	const {userId} = req.user
// 	try {
// 		const post = await Post.findByIdAndUpdate(postId, {$pull: {
// 			comment: {_id: commentId }
// 		}}).populate("userId", "name username profilePicture").populate("comment.userId", "name username profilePicture")
// 		if(post && post.userId._id !== userId){
			
// 		}

// 	}catch(error){
// 		res.status.json({success: false, message: "Internal Server Error", errMessage: error.message})
// 	}
// }


const getAllFeed = async(req, res) => {

	const userId = req.user

	try{
		const posts = await Post.find({userId: userId}).populate("userId", "name username profilePicture")

		const user = await User.findById(userId)
    const followingPosts = await Promise.all(
      user.following.map(followingId => {
        return Post.find({ userId: followingId }).populate("userId", "name username profilePicture")
      })
    );
		allPosts = posts.concat(...followingPosts)
		res.status(200).json({success: true, post: allPosts})
	}catch(error){
		res.status(500).json({success: false, errMessage: error.message, message: "Internal Server error" })
	}
}


module.exports = {createPost, deletePost, likePost, getPost, getUserPosts, commentOnPost, getAllFeed}