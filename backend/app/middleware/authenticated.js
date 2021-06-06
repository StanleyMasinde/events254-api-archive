const authenticated = (guard = 'users') => {
  return async function (req, res, next) {
    await req.isAuthenticated(guard) ? next() : res.status(401).json('Unauthenticated')
  }
}
module.exports = authenticated
