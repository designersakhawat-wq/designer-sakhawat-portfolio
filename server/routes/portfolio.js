const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const SECRET = 'sakhawat_portfolio_secret_2024';

const dataPath = path.join(__dirname, '..', 'data', 'portfolio.json');

// Helper to read data
function readData() {
  try {
    if (!fs.existsSync(dataPath)) {
      return { portfolio: [], nextId: 1 };
    }
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { portfolio: [], nextId: 1 };
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

// GET all portfolio items
router.get('/', (req, res) => {
  const data = readData();
  res.json(data.portfolio);
});

// GET single item
router.get('/:id', (req, res) => {
  const data = readData();
  const item = data.portfolio.find(p => p.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST new item (Protected)
router.post('/', auth, (req, res) => {
  const data = readData();
  const newItem = {
    id: data.nextId++,
    title: req.body.title || 'Untitled Project',
    category: req.body.category || 'Meta Ads',
    industry: req.body.industry || 'E-commerce',
    badge: req.body.badge || 'Concept Project',
    shortDescription: req.body.shortDescription || '',
    thumbnailBg: req.body.thumbnailBg || 'bg-[#171717]',
    imageUrl: req.body.imageUrl || '',
    thumbnailFit: req.body.thumbnailFit || 'cover',
    bannerUrl: req.body.bannerUrl || '',
    bannerFit: req.body.bannerFit || 'cover',
    caseStudy: {
      challenge: req.body.caseStudy?.challenge || '',
      objective: req.body.caseStudy?.objective || '',
      creativeStrategy: req.body.caseStudy?.creativeStrategy || '',
      creativeDirection: req.body.caseStudy?.creativeDirection || '',
      finalDesigns: req.body.caseStudy?.finalDesigns || [],
      creativeVariations: req.body.caseStudy?.creativeVariations || '',
      outcome: req.body.caseStudy?.outcome || ''
    }
  };
  data.portfolio.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// PUT update item (Protected)
router.put('/:id', auth, (req, res) => {
  const data = readData();
  const idx = data.portfolio.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const current = data.portfolio[idx];
  const updated = {
    ...current,
    title: req.body.title !== undefined ? req.body.title : current.title,
    category: req.body.category !== undefined ? req.body.category : current.category,
    industry: req.body.industry !== undefined ? req.body.industry : current.industry,
    badge: req.body.badge !== undefined ? req.body.badge : current.badge,
    shortDescription: req.body.shortDescription !== undefined ? req.body.shortDescription : current.shortDescription,
    thumbnailBg: req.body.thumbnailBg !== undefined ? req.body.thumbnailBg : current.thumbnailBg,
    imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : current.imageUrl,
    thumbnailFit: req.body.thumbnailFit !== undefined ? req.body.thumbnailFit : (current.thumbnailFit || 'cover'),
    bannerUrl: req.body.bannerUrl !== undefined ? req.body.bannerUrl : (current.bannerUrl || ''),
    bannerFit: req.body.bannerFit !== undefined ? req.body.bannerFit : (current.bannerFit || 'cover'),
    caseStudy: {
      challenge: req.body.caseStudy?.challenge !== undefined ? req.body.caseStudy.challenge : current.caseStudy.challenge,
      objective: req.body.caseStudy?.objective !== undefined ? req.body.caseStudy.objective : current.caseStudy.objective,
      creativeStrategy: req.body.caseStudy?.creativeStrategy !== undefined ? req.body.caseStudy.creativeStrategy : current.caseStudy.creativeStrategy,
      creativeDirection: req.body.caseStudy?.creativeDirection !== undefined ? req.body.caseStudy.creativeDirection : current.caseStudy.creativeDirection,
      finalDesigns: req.body.caseStudy?.finalDesigns !== undefined ? req.body.caseStudy.finalDesigns : current.caseStudy.finalDesigns,
      creativeVariations: req.body.caseStudy?.creativeVariations !== undefined ? req.body.caseStudy.creativeVariations : current.caseStudy.creativeVariations,
      outcome: req.body.caseStudy?.outcome !== undefined ? req.body.caseStudy.outcome : current.caseStudy.outcome
    }
  };

  data.portfolio[idx] = updated;
  writeData(data);
  res.json(updated);
});

// DELETE item (Protected)
router.delete('/:id', auth, (req, res) => {
  const data = readData();
  const idx = data.portfolio.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  data.portfolio.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

module.exports = router;
