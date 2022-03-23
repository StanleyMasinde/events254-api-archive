import { DB } from 'mevn-orm'
import pluralize from 'pluralize'
/**
   * Get the event organisers
   * @param {import('../models/event')} event
   * @returns Object || null
   */
const getEventOrganiser = async (event = {}) => {
	if (!event.organisable_type || !event.organisable_id) {
		return {}
	}
	const organisableType = event.organisable_type
	if (organisableType === 'User') {
		const organiser = await DB(pluralize(organisableType.toLowerCase()))
			.where({
				id: event.organisable_id
			}).first('name', 'id')
		if (organiser) {
			organiser.type = 'user'
		}
		return organiser
	}
	const organiser = await DB(pluralize(organisableType.toLowerCase()))
		.where({
			id: event.organisable_id
		}).first('name', 'slug', 'id')
	if (organiser) {
		organiser.type = 'group'
		organiser.adminIds = await DB('group_organisers').where('group_id', '=', organiser.id).select('user_id')
	}
	if (!organiser.name) {
		organiser.name = 'Unknown'
	}
	if (!organiser.email) {
		organiser.email = 'info@events254.co.ke'
	}

	return organiser

}
export default getEventOrganiser
