const multer = require("multer")

const uploadDirectory = process.env.VERCEL ? "/tmp" : "./public/temp"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const videoFilter = (req, file, cb) => {
    console.log(file,"file")
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video required'), false);
    }
};


const upload = multer({ 
    storage: storage,
    fileFilter: videoFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 
    }
});

module.exports = {upload}