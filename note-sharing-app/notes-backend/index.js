const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require('mongoose');

// Initialize express app
const app = express();
const PORT = 5001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/note-sharing-app', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// User model
const User = require('./data/User');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Path to notes.json file
const notesFilePath = path.join(__dirname, "data", "notes.json");

// Ensure directories exist
fs.ensureDirSync(path.join(__dirname, "data"));
fs.ensureDirSync(path.join(__dirname, "uploads"));

// Ensure notes.json exists and is readable with robust error handling
const ensureNotesFile = () => {
  try {
    fs.ensureFileSync(notesFilePath);
    const currentContent = fs.readFileSync(notesFilePath, 'utf8').trim();
    return currentContent ? JSON.parse(currentContent) : [];
  } catch (error) {
    console.error("Error reading notes file:", error);
    fs.writeJSONSync(notesFilePath, []); // Create empty array if file is corrupted
    return [];
  }
};

// Load notes, with error handling
let notes = ensureNotesFile();

// Storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    fs.ensureDirSync(uploadPath); // Ensure upload directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Configure multer with file filter and limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 1. Fetch all notes
app.get("/api/notes", (req, res) => {
  try {
    notes = ensureNotesFile();
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// 2. Upload notes
app.post("/api/notes", upload.array("files", 10), (req, res) => {
  try {
    const { course, subject, topic, title } = req.body;

    if (!course || !subject || !topic || !req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Missing required fields or files" });
    }

    const newNotes = req.files.map((file) => ({
      id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      title: title || file.originalname,
      course,
      subject,
      topic,
      fileUrl: `/uploads/${file.filename}`,
      uploadedAt: new Date().toISOString(),
      likes: 0,                 // Initialize likes
      dislikes: 0,              // Initialize dislikes
      hasLiked: false,          // Initialize hasLiked
      hasDisliked: false        // Initialize hasDisliked
    }));

    notes.push(...newNotes);
    fs.writeJSONSync(notesFilePath, notes);

    res.status(201).json({
      message: "Notes uploaded successfully!",
      newNotes
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload notes" });
  }
});

// 3. Delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  try {
    const { id } = req.params;

    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ error: "Note not found" });
    }

    const [deletedNote] = notes.splice(noteIndex, 1);

    fs.writeJSONSync(notesFilePath, notes);

    const filePath = path.join(__dirname, "uploads", path.basename(deletedNote.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.removeSync(filePath);
    }

    res.status(200).json({
      message: "Note deleted successfully!",
      deletedNote
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});
// 4. Like a note by ID
app.post("/api/notes/:id/like", (req, res) => {
  try {
    const { id } = req.params;
    const note = notes.find((note) => note.id === id);

    if (!note) return res.status(404).json({ error: "Note not found" });

    // Remove dislike if it exists
    if (note.hasDisliked) {
      note.dislikes -= 1;
      note.hasDisliked = false;
    }

    // Toggle like
    note.hasLiked = !note.hasLiked;
    note.likes += note.hasLiked ? 1 : -1;

    fs.writeJSONSync(notesFilePath, notes);
    res.status(200).json({ message: "Note like toggled successfully!", note });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

// 5. Dislike a note by ID
app.post("/api/notes/:id/dislike", (req, res) => {
  try {
    const { id } = req.params;
    const note = notes.find((note) => note.id === id);

    if (!note) return res.status(404).json({ error: "Note not found" });

    // Remove like if it exists
    if (note.hasLiked) {
      note.likes -= 1;
      note.hasLiked = false;
    }

    // Toggle dislike
    note.hasDisliked = !note.hasDisliked;
    note.dislikes += note.hasDisliked ? 1 : -1;

    fs.writeJSONSync(notesFilePath, notes);
    res.status(200).json({ message: "Note dislike toggled successfully!", note });
  } catch (error) {
    console.error("Dislike error:", error);
    res.status(500).json({ error: "Failed to toggle dislike" });
  }
});





// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Middleware Error:', err);
  res.status(500).json({
    error: "Server Error",
    details: err.message || 'Unknown server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Notes API. Use the endpoints to interact with the server.");
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
