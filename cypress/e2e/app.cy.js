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
    errors: 'rgb(220, 53, 69)',
    success: 'rgb(222, 226, 230)'
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

  describe('Submitting an image with valid inputs using enter key', () => {

    const input = {
      title: "puppy",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWc39Z8jQRTl5HmvTtiU9IU_LkRtf4Ln_zkQ&s",

    }

    after(() => {
      cy.clearLocalStorage()
    })

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })

    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })

    it('I should see a check icon in the imageUrl field', () => {
      registerForm.elements.titleInput().should(([$input]) => {
        const styles = window.getComputedStyle($input);
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.success)
      })
    })

    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit()
    })

    it('And the list of registered images should be updated with the new item', () => {
      cy.get('#card-list .card-img').should((elements) => {
        const lastElement = elements[elements.length - 1]
        const src = lastElement.getAttribute('src')
        assert.strictEqual(src, input.url)
      })
    });

    it('And the new item should be stored in the localStorage', () => {
      cy.getAllLocalStorage().should((ls) => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]

        assert.deepStrictEqual(lastElement, {
          title: input.title,
          imageUrl: input.url,
        })

      })
    })

    it('Then The inputs should be cleared', () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')
    })

  })
})