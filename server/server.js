// server.js
const express = require("express");
const multer = require("multer");
const fs = require('fs');
const mongoose = require("mongoose");
// const Claim = require('./model/claimScema');
const Claim = require('./model/claimScema');
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Middleware to parse JSON body
connectDB();
app.use(express.json());
app.use(cors());


// Enable CORS for the frontend (Vercel)
// TODO:
// const allowedOrigins = ['https://your-frontend.vercel.app']; // Add your Vercel URL here

// app.use(cors({
//   origin: allowedOrigins,  // Allow access only from your frontend
//   methods: ['GET', 'POST'],
// }));
// ===

// allow to file publically accesable
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// console.log(path.dirname);


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);  // Create the 'uploads' folder if it doesn't exist
}

// Set up Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Define POST route to handle claims submission
app.post("/api/claims", upload.single("file"), async (req, res) => {
  const { claimType, policyNumber, claimAmount, incidentDate, description, email,alternameEmaile, phone } = req.body;
  const filePath = req.file ? req.file.path : null;
// filePath =>  In Multer, when a single file is uploaded using upload.single('file'), 
// the uploaded file's details are attached to the req.file object.
//   const filePath = req.file ? path.normalize(req.file.path) : null;
  
const newForm = {
  claimType, policyNumber, claimAmount, incidentDate, description, email,alternameEmaile, phone
};
console.log("Backend form",req.body);
  try {
    const claim = new Claim({
      claimType,
      policyNumber,
      claimAmount,
      incidentDate,
      description,
      email,
      alternameEmaile,
      phone,
      filePath,
    });

    await claim.save();
    res.json({ success: true, message: "Claim submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/claims", async (req, res) => {
    try {
      const claims = await Claim.find();
      res.json({ success: true, claims });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
