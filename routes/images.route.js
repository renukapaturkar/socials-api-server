const {cloudinary} = require('../config/cloudinary')
const upload = require('../config/multer')
const express = require('express')
const router = express.Router()


router.post('/upload', upload.single("image"), async(req, res) => {
	try{
		const result = await cloudinary.uploader.upload(req.file.path)
		res.status(201).json({success: true, url: result.url, public_id: result.public_id})
		console.log(result)
	}catch(error){
		console.log(error)
	}
})


router.delete('/delete/:public_id', async(req, res) => {
	try {
		const {public_id} = req.params
		await cloudinary.uploader.destroy(public_id)

	}catch(error){
		console.log(error)
	}
})

module.exports = router