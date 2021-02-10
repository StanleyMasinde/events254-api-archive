const { randomBytes } = require('crypto')
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
              if (req.requiresToken()) {
                // Create a new access token
                // TODO the token name should include the device details and IP
                const token = randomBytes(64).toString('hex')
                const now = new Date()

                // TODO move this into a reusable function
                DB.table('personal_access_tokens').insert({
                  tokenable_type: 'users',
                  tokenable_id: u.id,
                  name: 'Mobile device',
                  token,
                  abilities: '*',
                  last_used_at: now,
                  created_at: now,
                  updated_at: now
                })

                return res.json({ token })
              }
              // The login was sucessful and session is required
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

    /**
     * Get the current user
     * @param {*} guard the guard to use default is users
     * @returns
     */
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
    req.requiresToken = () => {
      const header = req.header('X-requested-with')
      if (header) { // We first check for the header before the value
        if (header === 'mobile') { // We can use multiple like true, 1 etc for now let us use mobile
          return true
        }
        return false // The value might have been set by mistake
      }
      return false // No headers set
    }
    next()
  }
}

module.exports = auth()
