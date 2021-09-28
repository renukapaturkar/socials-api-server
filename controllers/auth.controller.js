const bcrypt = require('bcryptjs');
const {User} = require('../models/user.model');
const {cloudinary} = require('../config/cloudinary')
const jwt = require('jsonwebtoken');

const findUserByEmail = async(email) => {
    const user = await User.findOne({email})
    return user;
}

const saveNewUserDetails = async({name, email, username, password}) => {
    const newUser = new User({
       name, email, username, password
    })
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword

    const savedUser = await newUser.save()
    return savedUser; 
}


const findUserById = async(userid)=> {
    const user = await User.findById(userid)
	return user;
}

const generateNewToken = async(userId, res) => {
	const {_id, name, email, username} = await findUserById(userId)
    jwt.sign(
        {userId}, 
        process.env.TOKEN_KEY, {expiresIn : '24h'},
        function(error, token){
            if(error){
                res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message});
            }
            res.status(200).json({success: true, token:token , userData: {_id: _id, name: name, email:email, username: username}})
        }
    )
    
} 

const userSignUp = async(req, res) => {
	try {
		const {email} = req.body
		const user = await findUserByEmail(email)
		if(user){
			res.status(409).json({success: false, message: "User already exists"})
		}
		const data = await saveNewUserDetails(req.body)
		if(data){
			return await generateNewToken(data._id, res)
		}
	
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server Error", errMessage: error.message})
	}
	finally {
		console.log("user saved successfully!")
	}
}


const userSignIn = async(req, res) => {
	const {email, password} = req.body;
	try {
		const user = await findUserByEmail(email)
		console.log(user)
		if(!user){
			res.status(404).json({success: false, message: "User does not exists, Please sign up"})
		}
		const passwordMatch = await bcrypt.compare(password, user.password)
		if(!passwordMatch){
			res.status(400).json({success: false, message: "Password does not match"})
		}
		return await generateNewToken(user._id, res)
	}catch(error){
		res.status(500).json({success: false, message: "Internal Server error", errMessage: error.message})
	}
}






module.exports = {userSignUp, userSignIn}