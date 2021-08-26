const express = require('express')
const router = express.Router()
const {createPost, deletePost, likePost, getPost, getAllPosts, commentOnPost, getFeed} = require('../controllers/post.controller')
const passport = require('passport')
const jwt = require('../config/passport')


router.post('/newpost', createPost)
router.delete('/:postId', deletePost)
router.post('/:postId/like', likePost)
router.get('/:postId',getPost)
router.get('/:userId/posts', getAllPosts)
router.post('/:postId/comment', commentOnPost)
router.get('/feed', getFeed)





module.exports = router