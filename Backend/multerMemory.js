// multerMemory.js
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB per file
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|jpg|png)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG/PNG images are allowed"));
  },
});

module.exports = upload;
