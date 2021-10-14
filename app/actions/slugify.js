/* eslint-disable no-useless-escape */
/**
 * Convert text to url friedly slugs
 * e.g Welcome to events 254 would be welcome-to-events254
 * @param {String} text
 * @returns {String} slug
 */
const slugify = (text) => {
  return text.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export default slugify
