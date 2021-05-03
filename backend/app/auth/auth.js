const { compareSync } = require('bcrypt')
const { DB } = require('mevn-orm')
const createToken = require('./createToken')

const auth = () => {
  return function (req, res, next) {
    /**
       * Attempt to login a user with the given credentials
       * @param {String} guard The current user table
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
                return createToken({
                  tokenable_id: u.id,
                  tokenable_type: 'users'
                }).then((token) => {
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
       * -------------------------------------------------------
       * The request requires a token hence no session is set
       * We lookup for the exsistence of the token and use the token
       * to get the owner
       */
      if (req.requiresToken()) {
        if (req.header('Authorization')) {
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
        return null
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
          return null
        }
        return DB.table(guard)
          .where({ id: userId })
          .first()
          .then((u) => {
            return u
          })
          .catch((e) => {
            // TODO handle this properly for now we just return blank
            return e
          })
      }
      return null
    }

    /**
     * Destroy a user's sessions
     */
    req.logOut = () => {
      req.session.auth = {}
    }

    req.isAuthenticated = (guard = 'users') => {
      return !!req.user(guard)
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
