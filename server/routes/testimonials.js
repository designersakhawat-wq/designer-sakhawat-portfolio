const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const SECRET = 'sakhawat_portfolio_secret_2024';

const dataPath = path.join(__dirname, '..', 'data', 'testimonials.json');

// Helper to read data
function readData() {
  try {
    if (!fs.existsSync(dataPath)) {
      return { testimonials: [], nextId: 1 };
    }
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { testimonials: [], nextId: 1 };
  }
}

// Helper to write data
function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Middleware to protect routes
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// GET all testimonials
router.get('/', (req, res) => {
  const data = readData();
  res.json(data.testimonials);
});

// POST new testimonial (Protected)
router.post('/', auth, (req, res) => {
  const data = readData();
  const newTestimonial = {
    id: data.nextId++,
    clientName: req.body.clientName || 'Anonymous',
    clientCompany: req.body.clientCompany || '',
    quote: req.body.quote || '',
    rating: req.body.rating !== undefined ? parseInt(req.body.rating) : 5,
    avatarUrl: req.body.avatarUrl || '',
    projectDate: req.body.projectDate || ''
  };
  data.testimonials.push(newTestimonial);
  writeData(data);
  res.status(201).json(newTestimonial);
});

// DELETE testimonial (Protected)
router.delete('/:id', auth, (req, res) => {
  const data = readData();
  const idx = data.testimonials.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  data.testimonials.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

module.exports = router;
