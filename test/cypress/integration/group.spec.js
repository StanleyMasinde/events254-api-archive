/* eslint-disable no-undef */
const { expect } = require('chai')
const faker = require('faker')
const delay = 50

describe('User creates a group', () => {
  it('test one', () => {
    cy.fixture('../../../static/icon.png').as('icon')
    cy.visit('/register')
    cy.get('input[name=name]').type(faker.name.findName(), { delay })
    cy.get('input[name=email]').type(faker.internet.email(), { delay })
    cy.get('input[name=password]').type(faker.internet.password(), { delay })
    cy.get('button[type="submit"]').click()
    cy.get('[data-profile-menu]').click()
    cy.get('[data-start-your-group]').click({ delay })
    cy.get('input[name=picture]').then(function (el) {
      const blob = Cypress.Blob.base64StringToBlob(this.icon, 'image/png')
      const file = new File([blob], 'icon.png', { type: 'image/png' })
      const list = new DataTransfer()

      list.items.add(file)
      const myFileList = list.files

      el[0].files = myFileList
      el[0].dispatchEvent(new Event('change', { bubbles: true }))
    })
    cy.get('input[name=name]').type(faker.company.companyName('full'), { delay })
    cy.get('textarea[name=description]').type(faker.lorem.sentences(20))
    cy.get('button[type="submit"]').click()

    expect(1).equals(1)
  })
})
