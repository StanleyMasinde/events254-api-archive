export const state = () => ({
  list: []
})

export const getters = {
  initials (state) {
    const user = state.auth.user
    if (!user.name) {
      return
    }
    const [firstName, lastName] = user.name.split(' ')
    if (!lastName) {
      return `${firstName.split('')[0]}`
    }
    return `${firstName.split('')[0]}${lastName.split('')[0]}`
  }
}
