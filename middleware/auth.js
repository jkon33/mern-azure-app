// Simple auth middleware (upgrade later with JWT)
const protect = (req, res, next) => {
  // For now, just allow all requests
  // In production, verify JWT token here
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // For now, just allow all roles
    // In production, check user roles here
    next();
  };
};

module.exports = { protect, authorize };