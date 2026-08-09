const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const SECRET = 'sakhawat_portfolio_secret_2024';

const dataPath = path.join(__dirname, '..', 'data', 'settings.json');

// Helper to read data
function readData() {
  try {
    if (!fs.existsSync(dataPath)) {
      return {};
    }
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

// Helper to write data
function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Middleware to protect routes
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  console.log('--- Settings Auth Debug ---');
  console.log('Token:', token);
  console.log('Secret:', SECRET);
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    console.log('Verification Success, Decoded:', decoded);
    next();
  } catch (err) {
    console.log('Verification Failed:', err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// GET settings
router.get('/', (req, res) => {
  const data = readData();
  data.logo = data.logo || "/logo.png";
  data.brandColor = data.brandColor || "#C8FF00";
  if (data.hero) {
    data.hero.image1 = data.hero.image1 || "";
    data.hero.image1Fit = data.hero.image1Fit || "cover";
    data.hero.image2 = data.hero.image2 || "";
    data.hero.image2Fit = data.hero.image2Fit || "cover";
    data.hero.image3 = data.hero.image3 || "";
    data.hero.image3Fit = data.hero.image3Fit || "cover";
  }
  // Spotlight
  data.spotlight = data.spotlight || {};
  data.spotlight.image1 = data.spotlight.image1 || "";
  data.spotlight.image1Fit = data.spotlight.image1Fit || "cover";
  data.spotlight.image2 = data.spotlight.image2 || "";
  data.spotlight.image2Fit = data.spotlight.image2Fit || "cover";
  data.spotlight.image3 = data.spotlight.image3 || "";
  data.spotlight.image3Fit = data.spotlight.image3Fit || "cover";

  res.json(data);
});

// PUT update settings (Protected)
router.put('/', auth, (req, res) => {
  const current = readData();
  const updated = {
    logo: req.body.logo !== undefined ? req.body.logo : (current.logo || "/logo.png"),
    brandColor: req.body.brandColor !== undefined ? req.body.brandColor : (current.brandColor || "#C8FF00"),
    hero: {
      eyebrow: req.body.hero?.eyebrow !== undefined ? req.body.hero.eyebrow : current.hero?.eyebrow,
      headline: req.body.hero?.headline !== undefined ? req.body.hero.headline : current.hero?.headline,
      subheading: req.body.hero?.subheading !== undefined ? req.body.hero.subheading : current.hero?.subheading,
      cta_primary: req.body.hero?.cta_primary !== undefined ? req.body.hero.cta_primary : current.hero?.cta_primary,
      cta_secondary: req.body.hero?.cta_secondary !== undefined ? req.body.hero.cta_secondary : current.hero?.cta_secondary,
      image1: req.body.hero?.image1 !== undefined ? req.body.hero.image1 : (current.hero?.image1 || ""),
      image1Fit: req.body.hero?.image1Fit !== undefined ? req.body.hero.image1Fit : (current.hero?.image1Fit || "cover"),
      image2: req.body.hero?.image2 !== undefined ? req.body.hero.image2 : (current.hero?.image2 || ""),
      image2Fit: req.body.hero?.image2Fit !== undefined ? req.body.hero.image2Fit : (current.hero?.image2Fit || "cover"),
      image3: req.body.hero?.image3 !== undefined ? req.body.hero.image3 : (current.hero?.image3 || ""),
      image3Fit: req.body.hero?.image3Fit !== undefined ? req.body.hero.image3Fit : (current.hero?.image3Fit || "cover")
    },
    spotlight: {
      image1: req.body.spotlight?.image1 !== undefined ? req.body.spotlight.image1 : (current.spotlight?.image1 || ""),
      image1Fit: req.body.spotlight?.image1Fit !== undefined ? req.body.spotlight.image1Fit : (current.spotlight?.image1Fit || "cover"),
      image2: req.body.spotlight?.image2 !== undefined ? req.body.spotlight.image2 : (current.spotlight?.image2 || ""),
      image2Fit: req.body.spotlight?.image2Fit !== undefined ? req.body.spotlight.image2Fit : (current.spotlight?.image2Fit || "cover"),
      image3: req.body.spotlight?.image3 !== undefined ? req.body.spotlight.image3 : (current.spotlight?.image3 || ""),
      image3Fit: req.body.spotlight?.image3Fit !== undefined ? req.body.spotlight.image3Fit : (current.spotlight?.image3Fit || "cover")
    },
    contact: {
      email: req.body.contact?.email !== undefined ? req.body.contact.email : current.contact?.email,
      phone: req.body.contact?.phone !== undefined ? req.body.contact.phone : current.contact?.phone,
      whatsapp: req.body.contact?.whatsapp !== undefined ? req.body.contact.whatsapp : current.contact?.whatsapp,
      location: req.body.contact?.location !== undefined ? req.body.contact.location : current.contact?.location,
      availability: req.body.contact?.availability !== undefined ? req.body.contact.availability : current.contact?.availability
    },
    social: {
      linkedin: req.body.social?.linkedin !== undefined ? req.body.social.linkedin : current.social?.linkedin,
      instagram: req.body.social?.instagram !== undefined ? req.body.social.instagram : current.social?.instagram,
      behance: req.body.social?.behance !== undefined ? req.body.social.behance : current.social?.behance,
      dribbble: req.body.social?.dribbble !== undefined ? req.body.social.dribbble : current.social?.dribbble
    },
    seo: {
      title: req.body.seo?.title !== undefined ? req.body.seo.title : current.seo?.title,
      description: req.body.seo?.description !== undefined ? req.body.seo.description : current.seo?.description
    }
  };

  writeData(updated);
  res.json(updated);
});

module.exports = router;
