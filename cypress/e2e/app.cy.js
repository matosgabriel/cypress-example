import assert from 'assert'

class RegisterForm {
  elements = {
    titleInput: () => cy.get('#title'),
    imageUrlInput: () => cy.get('#imageUrl'),
    titleFeedback: () => cy.get('#titleFeedback'),
    urlFeedback: () => cy.get('#urlFeedback'),
    submitButton: () => cy.get('#btnSubmit')
  }

  typeTitle(text) {
    if (!text) return;
    this.elements.titleInput().type(text)
  }
  typeUrl(text) {
    if (!text) return;
    this.elements.imageUrlInput().type(text)
  }
  clickSubmit() {
    this.elements.submitButton().click()
  }
}

describe('Image Registration', () => {

  const registerForm = new RegisterForm();
  const colors = {
    errors: 'rgb(220, 53, 69)'
  }

  describe('Submitting an image with invalid inputs', () => {

    after(() => {
      cy.clearAllLocalStorage()
    })

    const input = {
      "title": "",
      "url": ""
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })

    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })

    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit()
    })

    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      registerForm.elements.titleFeedback().should('contain.text', 'Please type a title for the image')
    })
    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements.urlFeedback().should('contain.text', 'Please type a valid URL')
    })
    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border_color = styles.getPropertyValue('border-right-color')
        
        assert.strictEqual(border_color, colors.errors)
      })
    })
  })
})