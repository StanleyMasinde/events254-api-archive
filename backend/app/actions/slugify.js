/**
 * Convert text to url friedly slugs
 * e.g Welcome to events 254 would be welcome-to-events254
 * @param {String} text
 * @returns String
 */
const slugify = (text = '', separator = '-') => {
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaeeeeiiiioooouuuunc------'
  for (let i = 0, l = from.length; i < l; i++) {
    text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  return text.toLocaleLowerCase().trim().replace(/[^a-z0-9 -]/g, '').split(' ').join(separator)
}

module.exports = slugify
