const jwt = require('jsonwebtoken');
const { findUserById } = require('../controllers/user.controller');
const userTokenKey = process.env['TOKEN_KEY'] ;




const authVerify = async(req, res, next) => {
    const token = req.headers.authorization;
    try {
        let {userId} = jwt.verify(token, userTokenKey)
        if(userId){
            req.user = userId;
            return next();
        }
        
    }catch(error){
        res.status(401).json({success: false, message: "UnAuthorized request"})
    }

}

module.exports = {authVerify}