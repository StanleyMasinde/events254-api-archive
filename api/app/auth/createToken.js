const { randomBytes } = require('crypto')
const { DB } = require('mevn-orm')

/**
 * ---------------------------------------------------------------
 * Create an access
 * @param {Array} options The tokenable id and type
 * This includes the tokenable_id, tokenable_name and the token
 * The token name can be used to identify the devices that the user is logged into
 * --------------------------------------------------------------
 */
const createToken = async (options = { tokenable_id: 0, tokenable_type: 'users', name: 'My mobile Device' }) => {
  const token = randomBytes(64).toString('hex')
  // eslint-disable-next-line camelcase
  const { tokenable_id, tokenable_type, name } = options
  const now = new Date().toISOString()
  return await DB.table('personal_access_tokens').insert({
    tokenable_type,
    tokenable_id,
    name,
    token,
    abilities: '*',
    last_used_at: now,
    created_at: now,
    updated_at: now
  })
}

module.exports = createToken
