const { Model, DB } = require('mevn-orm')
const { hash } = require('bcrypt')

class User extends Model {
  /**
     * Register a new User
     * @param {Object} details user details
     * @returns {Promise|any} registers a user
     */
  static async register (details = []) {
    const { password } = details
    const p = await hash(password, 10)
    details.password = p

    // TODO add the timestamp functionality to the base model
    details.created_at = new Date()
    details.updated_at = new Date()
    return this.create(details)
  }

  /**
   * Get the events created by the current User
   */
  events () {
    // return this.morphMany('Event', 'organisable') // TODO Fix this in the future
    return DB.table('events').where({
      organisable_id: this.id,
      organisable_type: 'User'
    })
  }

  /**
   * Get the curreny users access tokens
   * The access tokens are stored in the personal_access tokens table
   */
  tokens () {
    return this.morphMany('Personal_access_token', 'tokenable')
  }
}

module.exports = User
