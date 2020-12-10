const { hashSync } = require('bcrypt')
const { Model } = require('mevn-orm')

class User extends Model {
  /**
     * Register a new user
     * @param {Array} details
     */
  static register (details = []) {
    const { password } = details
    const hash = hashSync(password, 10)
    details.password = hash
    return this.create(details)
  }
}

module.exports = User
