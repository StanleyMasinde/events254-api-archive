/* eslint-disable no-undef */
class Page {
  open (path = '/') {
    browser.url(path)
  }
}

module.exports = new Page()
