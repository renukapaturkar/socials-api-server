const express = require('express')
const router = express.Router()
const {updateUser, deleteUser, getUser, followUser, unfollowUser, getAllFollowers, getAllFollowings} = require('../controllers/user.controller.js')


router.post('/updateuser', updateUser)

router.delete('/deleteuser', deleteUser)

router.get('/:username', getUser)

router.post('/follow', followUser)

router.post('/unfollow', unfollowUser)

router.get('/followers', getAllFollowers)

router.get('/followings', getAllFollwings)

