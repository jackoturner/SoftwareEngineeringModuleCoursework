const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

const googleApiKey = process.env.GOOGLE_API_KEY;
const genAI = googleApiKey ? new GoogleGenAI({ apiKey: googleApiKey }) : null;

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
// Added 'async' keyword here to allow 'await' inside the function
router.post("/", upload.single('image'), async (req, res) => {
    // Check if the user actually sent an image
    if (!req.file) {
        return res.status(400).send("No image uploaded.");
    }

    if (!genAI) {
        return res
            .status(500)
            .send("GOOGLE_API_KEY is not set, so AI pour scoring is unavailable.");
    }

    try {
        // The new unified SDK (@google/genai) doesn't use getGenerativeModel.
        // It calls ai.models.generateContent directly.
        const response = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    parts: [
                        {
                            text: "You are an expert beer pour judge. Analyze the provided image and return a score out of 5. Be a bit cheeky and fun in your comments. You are based in the UK, so use UK English and slang if required. If the image clearly shows a pint of beer, output EXACTLY in this format and nothing else: 4.5|Cheeky short comment explaining your reasoning for the score. Judge head size and stability, clarity, fill level, presentation, and defects. Keep comment under 20 words and playful. Use decimals for the score. If the image is not recognisable as a pint or half pint of beer or you are unsure, output ONLY -1."
                        },
                        {
                            inlineData: {
                                mimeType: req.file.mimetype,
                                data: fs.readFileSync(req.file.path, { encoding: "base64" }),
                            },
                        }
                    ]
                }
            ]
        });

        // The response directly contains the generated text
        const text = response.text;
        const score = parseFloat(text.trim());
        const comment = text.split("|")[1];

        // Render the result page
        const results = {
            image: "/static/uploads/" + req.file.filename,
            score: isNaN(score) ? "N/A" : score,
            comment: comment,
        }
        if (results.score == -1) {
            res.render("pourscore", { error: "We only have eyes for beer. Please upload a proper pint!" });
        } else {
            res.render("pourscore-result", { results });
        }
    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).send("Error analyzing image.");
    }
});

module.exports = router;
