const express = require('express');
const router = express.Router()
const {updateUser, deleteUser, getUser, followUser, unfollowUser, getAllFollowers, getAllFollowing, searchUser} = require('../controllers/user.controller.js')
const passport = require('passport')
const jwt = require('../config/passport')


router.post('/updateuser', updateUser)

router.delete('/deleteuser', deleteUser)

router.get('/:username', getUser)

router.get('/', searchUser)

router.post('/follow', followUser)

router.post('/unfollow', unfollowUser)

router.get('/:username/followers', getAllFollowers)

router.get('/:username/followings', getAllFollowing)

router.post('/updateuser', updateUser)





module.exports = router;