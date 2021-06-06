/**
 * Convert text to url friedly slugs
 * e.g Welcome to events 254 would be welcome-to-events254
 * @param {String} text
 * @returns {String} slug
 */
const slugify = (text = '', separator = '-') => {
  return text
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, separator)
}

module.exports = slugify
