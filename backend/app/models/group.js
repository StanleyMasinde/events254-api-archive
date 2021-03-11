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
}

module.exports = Group
