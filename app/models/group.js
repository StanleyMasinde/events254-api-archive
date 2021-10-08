const { Model, DB } = require('mevn-orm')

class Group extends Model {
  /**
     * A group has several organisers
     * @returns relationship
     */
  organisers () {
    const organisers = DB('group_organisers').where({
      group_id: this.id
    }).select('user_id').then((userIDs) => {
      return DB('users').whereIn('id', userIDs.map(id => id.user_id))
    })
    return organisers
    // return this.belongsToMany('group_organiser') // TODO this should be it
  }

  /**
   * Get the events created by the current Group
   * All events by default
   */
  events () {
    // return this.morphMany('Event', 'organisable') TODO this should be it
    return DB('events').where({
      organisable_id: this.id,
      organisable_type: 'group'
    })
  }

  /**
   * Upcoming events
   * All events in the future
   */
  async upcomingEvents () {
    return await DB('events').where({
      organisable_type: 'Group',
      organisable_id: this.id
    }).where('startDate', '>', new Date())
  }

  /**
   * This shows the past events from the group
   * @returns
   */
  async pastEvents () {
    return await DB('events').where({
      organisable_type: 'Group',
      organisable_id: this.id
    }).where('startDate', '<', new Date())
  }

  /**
   * This get the group members
   *
   */
  async members () {
    return await DB('group_user')
      .where('group_id', this.id)
      .join('users', 'group_user.user_id', '=', 'users.id')
      .select('users.id AS userId', 'users.name', 'users.bio', 'group_user.created_at AS memberSince')
  }

  /**
   * Get the member count
   * @returns
   */
  async memberCount () {
    return await DB('group_user')
      .where('group_id', this.id)
      .join('users', 'group_user.user_id', '=', 'users.id')
      .count('users.id AS members').first()
  }

  /**
   * Determine if the current user is a member
   *
   */
  async isMember (user) {
    if (!user) {
      return false
    }

    const exists = await DB('group_user').where({
      user_id: user.id,
      group_id: this.id
    }).first()

    return exists
  }
}

module.exports = Group
