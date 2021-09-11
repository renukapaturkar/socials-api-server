const express = require('express')
const router = express.Router()
const {createPost, deletePost, likePost, getPost, getUserPosts, commentOnPost, getAllFeed} = require('../controllers/post.controller')


router.get('/userfeed',getAllFeed)
router.get('/:postId',getPost)
router.post('/newpost', createPost)
router.delete('/:postId', deletePost)
router.post('/:postId/comment', commentOnPost)
router.post('/:postId/like', likePost)
router.get('/:userId/userposts', getUserPosts)








module.exports = router