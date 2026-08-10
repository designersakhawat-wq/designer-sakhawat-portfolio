const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'sakhawat_portfolio_secret_2024';
// Password: admin19671 (bcrypt hash)
const PASSWORD_HASH = bcrypt.hashSync('admin19671', 10);

router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const valid = await bcrypt.compare(password, PASSWORD_HASH);
  if (!valid) return res.status(401).json({ error: 'Incorrect password' });

  const token = jwt.sign({ admin: true }, SECRET, { expiresIn: '24h' });
  res.json({ token });
});

router.post('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ valid: false });
  try {
    jwt.verify(token, SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
module.exports.SECRET = SECRET;
