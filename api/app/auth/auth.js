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
                return DB.table('personal_access_tokens').insert({
                  tokenable_type: 'users',
                  tokenable_id: u.id,
                  name: 'Mobile device',
                  token,
                  abilities: '*',
                  last_used_at: now,
                  created_at: now,
                  updated_at: now
                })
                  .then(() => {
                    return res.json({ token })
                  })
                  .catch((e) => {
                    return res.status(500).json(e)
                  })
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
      /**
       * ------------------------------------------------
       * The request requires a token hence no session is set
       * We lookup for the exsistence of the token and use the token
       * to get the owner
       */
      if (req.requiresToken()) {
        // eslint-disable-next-line func-call-spacing
        const token = req.header('Authorization').split(' ')[1]

        // eslint-disable-next-line no-unexpected-multiline
        return (async function () {
          try {
            const tk = await DB.table('personal_access_tokens')
              .where({ token, tokenable_type: guard }).first()
            const u = await DB.table(guard).where({ id: tk.tokenable_id }).first(['id', 'username', 'email', 'bio', 'created_at', 'updated_at'])
            return u
          } catch (e) {
            return e // TODO handle this error properly
          }
        })()
      }

      /**
       * -----------------------------------------------
       * The request requires a session so we get
       * the userId from the session and use it to fetch
       * The user from the Database
       * ------------------------------------------------
       */
      if (req.session.auth) { // If the Auth Object is set in session
        const { userId } = req.session.auth
        if (!userId) {
          return res.status(401).json('You are not authenticated')
        }
        return DB.table(guard)
          .where({ id: userId })
          .first()
          .then((u) => {
            return u
          })
          .catch(() => {
          // TODO handle this properly for now we just return blank
            return res.status(401).json('You are not authenticated')
          })
      }
      return res.status(401).json('You are not authenticated')
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
