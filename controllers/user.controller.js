const {User} = require('../models/user.model')

//update user
//delete user//
//get user
//search user
//follow user
//unfollow user


const updateUser = async(req, res) => {
	const {userId} = req.params
	const {name, email, username,password, bio, profilePicture } = req.body
	try {


		if(profilePicture && !profilePicture.includes("res.cloudinary.com/conclave")) {
			if(userId.profilePicture.public_id){
				await cloudinary.uploader.destroy(userId.image.public_id)
			if(profilePicture.length > 0 ){
				const uploadInfo = await cloudinary.uploader.upload(profilePicture)
				const imageData = {
					public_id: uploadInfo.public_id, 
					imageUrl: uploadInfo.url
				}
				const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture: imageData})
				console.log(updatedUser)
				
			}
			}
		}

		if(password){
			const salt = await bcrypt.genSalt(10)
			const newPassword = await bcrypt.hash(password, salt) 

			const updatedUser = await User.findByIdAndUpdate(userId, {password: newPassword})
		}
		res.status(200).json({success: true, user: updatedUser})


	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
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
	console.log(userId, "userId")
	const {targetId} = req.body
	console.log(targetId, "targetId")
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
    }, { new: true }).select("followers")
		res.status(200).json({success: true, message: "following the user", user: targetUser})
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server error",errMessage: error.message })
	}
}

const unfollowUser = async(req, res) => {
	const {userId} = req.user
	const {userToUnfollow} = req.body
	try {
		const user = await User.findByIdAndUpdate(userId, {$pull: {following: userToUnfollow}}, {new: true})

		const unfollowedUser = await User.findByIdAndUpdate(userToUnfollow, { $pull: { followers: userId }}, {new: true})
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

const getUsersPosts = async(req, res) => {
	
}


module.exports = {updateUser, deleteUser, getUser, followUser, unfollowUser, getAllFollowers, getAllFollowing, updateUser}


