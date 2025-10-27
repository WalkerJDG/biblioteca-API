// routes/users.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');

// PATCH /users/:id/role — cambiar rol (admin/user)
router.patch('/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or user' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ role });
    res.json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    console.error('updateRole error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
