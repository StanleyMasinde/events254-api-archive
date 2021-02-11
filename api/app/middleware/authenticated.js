const authenticated = (guard = 'users') => {
  return function (req, res, next) {
    req.isAuthenticated(guard) ? next() : res.status(401).json('Unauthenticated')
  }
}
module.exports = authenticated
