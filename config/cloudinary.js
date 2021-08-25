const cloudinary = require('cloudinary')
cloudinary.config({ 
  cloud_name: 'renukapaturkar-cloud-area', 
  api_key: '614148835589397', 
  api_secret: 'c3p8w3Nyk9vI6gMEsCm7qy62miE' 
});

module.exports = {cloudinary};