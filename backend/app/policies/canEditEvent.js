/**
 * Determine of the current user can edit the given event
 * @param {*} event The event Object
 * @param {*} user The user trying to perform the action
 * @param {*} guard The guard to use
 * @returns Boolean
 */
module.exports = function canEditEvent (event, user, organisableType = 'User', guard = 'users') {
  console.log()
  if (!user) {
    return false
  }
  if (event.organiser.type === 'user') {
    return event.organisable_id === user.id && event.organisable_type === organisableType
  }
  const ids = event.organiser.adminIds.map(r => r.user_id)
  return ids.includes(user.id)
}
