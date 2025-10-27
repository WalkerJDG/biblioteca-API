const jwt = require('jsonwebtoken');
const { User } = require('../models');
const SECRET_KEY = process.env.SECRET_KEY || '2025MEDELLINSOFTWARE';

async function getCurrentUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: 'Token requerido' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user)
      return res.status(401).json({ message: 'Usuario no encontrado' });

    req.user = user;
    next();
  } catch (err) {
    console.error('getCurrentUser error:', err);
    res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = { getCurrentUser };
