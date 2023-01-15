import { randomBytes } from 'crypto'
import { DB } from 'mevn-orm'

/**
 * ---------------------------------------------------------------
 * Create an access
 * @param {Array} options The tokenable id and type
 * This includes the tokenable_id, tokenable_name and the token
 * The token name can be used to identify the devices that the user is logged into
 * --------------------------------------------------------------
 */
const createToken = async (options = { tokenable_id: 0, tokenable_type: 'users', name: 'My mobile Device' }) => {
	const token = randomBytes(99).toString('base64')
	// eslint-disable-next-line camelcase
	const { tokenable_id, tokenable_type, name } = options
	const now = new Date()
	await DB.table('personal_access_tokens').insert({
		tokenable_type,
		tokenable_id,
		name,
		token,
		abilities: '*',
		last_used_at: now, // TODO #377 add a middleware to update this on every request
		created_at: now,
		updated_at: now
	})
	return token
}

export default createToken
