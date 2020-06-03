const multer = require("multer")

// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

const MIME_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype]
    let error = new Error("Invalid Mime Type")
    console.log("isValid", isValid)
    if(isValid){
      error =null
    }

    cb(error, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname
    .toLowerCase()
    .split(' ')
    .join('-')
    const ext = MIME_TYPE[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
})

module.exports = multer({storage: storage}).single("image")
