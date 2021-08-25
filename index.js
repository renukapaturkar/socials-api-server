const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const {authVerify} = require('./middlewares/authVerify')


const app = express()
app.use(express.json())
app.use(cors())


const authRoute = require('./routes/auth.route')
const postsRoute = require('./routes/post.route')

const {initializeDBConnection}  = require('./db/db.connect.js')

initializeDBConnection()

app.use(authRoute)
app.use('/posts', authVerify, postsRoute)






app.get('/',(req,res)=>res.send("API for Socials app- social media platform"))


app.listen(process.env['PORT'] , () => console.log(`Socials app listening at http://localhost:${process.env['PORT']}`))
