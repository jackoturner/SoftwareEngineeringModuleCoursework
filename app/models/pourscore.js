const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer to save files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../static/uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'pint-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialise Multer
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.render("pourscore");
});

// Multer intercepts the request, saves the file, and returns req.file
router.post("/", upload.single('image'), (req, res) => {
    // Check if the user actually sent an image
    if (!req.file) {
        return res.status(400).send("No image uploaded.");
    }

    // Render the result page
    const results = {
        image: "/static/uploads/" + req.file.filename,
    }
    res.render("pourscore-result", { results });
});

module.exports = router;