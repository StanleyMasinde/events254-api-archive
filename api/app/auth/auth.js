const { compareSync } = require('bcrypt')
const { DB } = require('mevn-orm')

const auth = () => {
  return function (req, res, next) {
    /**
       * Attempt to login a user with the given credentials
       * @param {*} guard
       */
    req.attempt = function (guard = 'users') {
      const { email, password } = this.body
      DB.table(guard)
        .where({ email })
        .first()
        .then((u) => {
          // The email is correct
          if (u) {
            if (compareSync(password, u.password)) {
              // The login was sucessful
              req.session.auth = {
                userId: u.id,
                guard
              }
              return res.json(u)
            }
            return res.status(401).json({ message: 'These credentials do not match our records' }) // The password did not match
          }
          return res.status(401).json({ message: 'These credentials do not match our records' }) // The email is wrong
        })
        .catch((err) => {
          return res.status(500).json(err) // An error occoured possibly a database error
        })
    }

    /**
       * Login a user using the database ID
       * @param {*} id
       */
    req.logIn = (id) => {
      DB.table(this.guard())
        .where({ id })
        .first()
    }

    req.user = (guard = 'users') => {
      const { userId } = req.session.auth
      return DB.table(guard)
        .where({ id: userId })
        .first()
        .then((u) => {
          return u
        })
        .catch(() => {
        // TODO handle this properly for now we just return blank
          return null
        })
    }

    /**
     * Destroy a user's sessions
     */
    req.logOut = () => {
      req.session.auth = {}
    }

    /**
     * Determine weather the current request requires toke
     */
    req.requiresToken = () => {}
    next()
  }
}

module.exports = auth()
