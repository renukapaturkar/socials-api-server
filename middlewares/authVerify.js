const jwt = require('jsonwebtoken');
const { findUserById } = require('../controllers/user.controller');
const userTokenKey = process.env['TOKEN_KEY'] ;




const authVerify = async(req, res, next) => {
    const token = req.headers.authorization;
	console.log(token)
    try {
        let {userId} = jwt.verify(token, userTokenKey)
		console.log(userId, "userId from authverify")
        if(userId){
            req.user = userId;
            return next();
        }
        
    }catch(error){
        res.json(401).json({success: false, message: "UnAuthorized request"})
    }

}

module.exports = {authVerify}