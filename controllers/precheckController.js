
// GET /api/messages/public1
exports.getPublicMessage1 = function(req, res, next) {
  return res.json({
    message: 'public message 1 from /api/messages/public1'
  });
};

// GET /api/messages/private1
exports.isUserAuthenticated = function(req, res, next) {
  return res.json({
      message: 'Authorized'
  });
};

// GET /api/messages/admin1
exports.isAdminAuthenticated = function(req, res, next) {
  return res.json({
    message: 'Authorized'
  });
};
