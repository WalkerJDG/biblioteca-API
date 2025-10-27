// middleware/roleMiddleware.js
function authorizeRole(allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'User missing in request' });
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    next();
  };
}

module.exports = { authorizeRole };
