const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
    dotenv.config(); // fallback to current dir
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const fs = require('fs');

// Serve Frontend in Production
const distPath = path.join(__dirname, '../client/dist');
const indexPath = path.resolve(__dirname, '../', 'client', 'dist', 'index.html');

if (fs.existsSync(indexPath)) {
    app.use(express.static(distPath));
    
    app.use((req, res) => {
        res.sendFile(indexPath);
    });
} else {
    app.get('/', (req, res) => {
        res.send('Team Task Manager API is running... (React frontend not built yet. Please run npm run build in Railway)');
    });
}

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Start Server immediately for Railway Health Checks
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Connect to Database
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected Successfully');
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
    });
