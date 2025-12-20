import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Static folder for serving uploaded files
const uploadDir = path.join(__dirname, 'music_uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/music_uploads', express.static(uploadDir));

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename: remove special chars, keep extension
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, `${Date.now()}_${sanitized}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed!'));
        }
    }
});

// Routes

// GET /api/music - List all uploaded songs
app.get('/api/music', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }

        // Filter for audio files
        // Filter for audio files
        const audioFiles = files.filter(file => {
            const lowerCheck = file.toLowerCase();
            return lowerCheck.endsWith('.mp3') || lowerCheck.endsWith('.wav') || lowerCheck.endsWith('.m4a');
        });

        const trackList = audioFiles.map((file, index) => {
            return {
                id: `upload_${index}_${file}`,
                title: file.replace(/^[0-9]+_/, '').replace(/\.[^/.]+$/, "").replace(/_/g, " "), // Remove timestamp prefix & extension
                artist: 'Uploaded',
                src: `http://localhost:${PORT}/music_uploads/${file}`,
                category: 'Uploaded',
                duration: 'Unknown' // Duration extraction requires 'music-metadata' or similar, strict requirement? 
                // User said "Simple interface". We can skip precise duration for now.
            };
        });

        res.json(trackList);
    });
});

// POST /api/upload - Upload a new song
app.post('/api/upload', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        message: 'File uploaded successfully',
        file: req.file,
        url: `http://localhost:${PORT}/music_uploads/${req.file.filename}`
    });
});

// Delete endpoint (Optional but good for admin)
app.delete('/api/music/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ message: 'Deleted successfully' });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Uploads folder: ${uploadDir}`);
});
