/**
 * Determine of the current user can edit the given event
 * @param {*} event The event Object
 * @param {*} user The user trying to perform the action
 * @param {*} guard The guard to use
 * @returns Boolean
 */
export default function canEditEvent (event, user, organisableType = 'User') {
	try {
		if (!user) {
			return false
		}
		if (event.organisable_type === 'User') {
			return event.organisable_id === user.id && event.organisable_type === organisableType
		}
		if(!event.organiser || !event.organiser.adminIds) {
			return false
		}
		const ids = event.organiser.adminIds.map(r => r.user_id)
		return ids.includes(user.id)
	} catch (error) {
		throw new Error(error)
	}
}
