/**
 * Determine of the current user can edit the given event
 * @param {*} group The event Object
 * @param {*} user The user trying to perform the action
 * @param {*} guard The guard to use
 * @returns Boolean
 */
module.exports = function canManageGroup (group, user, guard = 'users') {
  if (!user) {
    return false
  }
  const organiserIds = group.organisers.map((o) => {
    return o.id
  })
  return organiserIds.includes(user.id)
}
