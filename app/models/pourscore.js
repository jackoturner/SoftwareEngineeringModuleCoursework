const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure exactly how and where Multer should save the uploaded files
const storage = multer.diskStorage({
    // Step 1: Tell Multer to save files in the public static/uploads directory
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../static/uploads/'));
    },
    // Step 2: Tell Multer how to name the file (to avoid overwriting files with the same name)
    filename: function (req, file, cb) {
        // Generate a random unique suffix using the current timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Save it as 'pint-[random-number].jpg'
        cb(null, 'pint-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize Multer with the storage configuration we just built
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.render("pourscore");
});

// Step 3: Use upload.single('image') as a middleware.
// Multer intercepts the request before it reaches our function, saves the file, and gives us req.file
router.post("/", upload.single('image'), (req, res) => {
    // Failsafe: check if the user actually sent an image
    if (!req.file) {
        return res.status(400).send("No image uploaded.");
    }

    // Step 4: Render the result page, pointing the image source to where Multer saved it
    const results = {
        image: "/static/uploads/" + req.file.filename,
    }
    res.render("pourscore-result", { results });
});

module.exports = router;