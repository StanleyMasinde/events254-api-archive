/* eslint-disable no-undef */
const Page = require('../pageObjects/main.page')

describe('Example test', () => {
  it('should open correct app', () => {
    Page.open()
    expect(browser).toHaveTitle('events254')
  })
})
