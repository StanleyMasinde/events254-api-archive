/**
 * Convert text to url friedly slugs
 * e.g Welcome to events 254 would be welcome-to-events254
 * @param {String} text
 * @returns String
 */
const slugify = (text = '', separator = '-') => {
  return text.toLocaleLowerCase().split(' ').join(separator)
}

module.exports = slugify
