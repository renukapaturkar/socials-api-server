const {User} = require('../models/user.model')


const updateUser = async(req, res) => {
	const userId = req.user
	console.log(userId, "userId")
	const userDetails= req.body
	console.log(userDetails, "userDetails")
	try {
		const user = await User.findByIdAndUpdate(userId, {$set: userDetails}, {new: true}).select("name username profilePicture bio followers following")
		res.status(200).json({success: true, user: user})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
}


const searchUser = async(req, res) => {
	const {username} = req.query
	try{
		const user = await User.find({ $or: [{ name: { $regex: username, $options:"$i" } }, { username: { $regex: username, $options:"$i"} }] }).select("name username profilePicture")
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server error", errMessage: error.message})
	}
}

const deleteUser = async(req, res) => {
	const {userId} = req.params
	try {
		const user = await User.findByIdAndRemove(userId)
		res.status(200).json({success: false, message: "user is deleted"})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server error", errMessage: error.message})
	}
}

const getUser = async(req,res)=> {
	const {username} = req.params
	try{
		const user = await User.findOne({username: username}).select('username name email bio profilePicture followers following')
		if(user){
			res.status(200).json({success: true, user})
		}else{
			res.status(404).json({success: false, message: "User not found!"})
		}
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server error", errMessage: error.message})
	}
}


const followUser = async(req,res) => {
	const userId = req.user
	const {targetId} = req.body
	try {
		const currentUser = await User.findByIdAndUpdate(userId, { $addToSet: { following: targetId } }, {new: true})
    const targetUser = await User.findByIdAndUpdate(targetId, {
      $addToSet: {
        followers: userId
      }, $push: {
        notification: {
          notifytype: "follow",
          sourceUser: userId,
          date: new Date().toISOString()
        }
      }
    }, { new: true }).select("followers following")
		res.status(200).json({success: true, message: "following the user", user: targetUser})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server error",errMessage: error.message })
	}
}

const unfollowUser = async(req, res) => {
	const userId = req.user
	const {targetId} = req.body
	try {
		const user = await User.findByIdAndUpdate(userId, {$pull: {following: targetId}}, {new: true})

		const unfollowedUser = await User.findByIdAndUpdate(targetId, { $pull: { followers: userId }}, {new: true}).select("following followers")
		res.status(200).json({success: true, message: "unfollowed the user", user: unfollowedUser})
	}catch(error){
		res.status(500).json({success:false, message: "Internal Server Error", errMessage: error.message})
	}
}


const getAllFollowers = async(req, res) => {
	const {username}= req.params
	try {
		const user = await User.findOne({username: username}).select('followers')
		const followers = await Promise.all(
			user.followers.map((userid)=> {
				return User.findById(userid).select('username name profilePicture')
			})
		)
		if(followers){
			res.status(200).json({success: true, followers: followers})
		}else {
			res.status(404).json({success: false, message: "No followers found!"})
		}
		

	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error"})
	}
}


const getAllFollowing = async(req, res) => {
	const {username} = req.params
	try {
		const user = await User.findOne({username: username}).select('following')
		const following = await Promise.all(
		user.following.map((userid)=> {
			return User.findById(userid).select('username name profilePicture')
			})
		)
		if(following){
			res.status(200).json({success: true, followings: following})
		}else {
			res.status(404).json({success: false, message: "User do not follow anyone!"})
		}


	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}

}


module.exports = {updateUser, deleteUser, getUser, followUser, unfollowUser, getAllFollowers, getAllFollowing, updateUser, searchUser}


