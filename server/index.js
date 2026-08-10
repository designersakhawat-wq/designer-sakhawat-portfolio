const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../dist')));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/portfolio',    require('./routes/portfolio'));
app.use('/api/upload',       require('./routes/upload'));
app.use('/api/settings',     require('./routes/settings'));
app.use('/api/testimonials', require('./routes/testimonials'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Fallback to index.html for SPA routing (React Router)
app.get('/{*splat}', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend not built. Please run "npm run build" first.');
  }
});



app.listen(PORT, () => {
  console.log(`\n  🚀 Server running at http://localhost:${PORT}`);
});
