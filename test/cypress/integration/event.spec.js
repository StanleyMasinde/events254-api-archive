/* eslint-disable no-undef */
const faker = require('faker')
const currentUser = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}

describe('Events test', () => {
  before(() => {
    cy.request('POST', '/api/auth/register', currentUser)
      .its('body')
      .as('currentUser')
  })

  it('User creates an event', () => {
    cy.fixture('../../../static/icon.png').as('image')
    cy.visit('/events/create')
    const { email, password } = currentUser
    cy.get('input[name=username]').type(email)
    cy.get('input[type=password]').type(password)
    cy.get('button[type=submit]').click()
    cy.get('input[name=image]').then(function (el) {
      const blob = Cypress.Blob.base64StringToBlob(this.image, 'image/png')
      const file = new File([blob], 'image.png', { type: 'image/png' })
      const list = new DataTransfer()
      list.items.add(file)
      const myFileList = list.files
      el[0].files = myFileList
      el[0].dispatchEvent(new Event('change', { bubbles: true }))
    })
    cy.get('input[data-evtype]').click({ force: true })
    cy.contains('Enter location').click()
    cy.get('textarea[name=location]').type(faker.address.streetAddress())
    cy.get('input[name=about]').type(faker.lorem.sentence())
    cy.get('input[data-date-input]').type(faker.date.future().toISOString().substr(0, 10), { force: true })
    cy.get('button[data-save-date]').click()
    cy.get('input[data-time-input]').type('09:30', { force: true })
    cy.get('button[data-save-time]').click()
    cy.get('[contenteditable]').type(faker.lorem.paragraphs())
    cy.get('button[type=submit]').click()
  })
})
