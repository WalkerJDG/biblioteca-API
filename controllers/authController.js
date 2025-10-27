// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const saltRounds = 10;

// 🔹 Generar token JWT usando tu .env
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
}

// 🔹 Registro de usuario
async function register(req, res) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Missing fields: fullName, email and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role: role || 'user'
    });

    return res.status(201).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// 🔹 Login de usuario
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    return res.json({
      access_token: token,
      token_type: 'bearer'
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };
