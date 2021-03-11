/**
 * Determine of the current user can edit the given event
 * @param {*} event The event Object
 * @param {*} user The user trying to perform the action
 * @param {*} guard The guard to use
 * @returns Boolean
 */
module.exports = function canEditEvent (event, user, guard = 'users') {
  return event.organisable_id === user.id
}
