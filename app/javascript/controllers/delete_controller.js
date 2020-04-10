const RESET_TIMEOUT_MILLIS = 3000;
const CONFIRMATION_MESSAGE = '<strong>Are you sure?</strong>';

import { Controller } from "stimulus"

export default class extends Controller {

  static targets = ['link']

  initialize() {
    this.handleSuccess = (event) => {
      clearTimeout(this.timeout)
      this.element.parentNode.removeChild(this.element)
    }
    this.handleError = (event) => {
      clearTimeout(this.timeout)
      this.resetState()
      this.element.style = ''
      alert("Failed to delete.")
    }
  }

  connect() {
    this.delete = false
  }

  click(event) {
    if (this.delete) {
      this.element.style = 'display: none;'
      this.linkTarget.addEventListener('ajax:success', this.handleSuccess)
      this.linkTarget.addEventListener('ajax:error', this.handleError)
    } else {
      this.oldMessage = this.linkTarget.innerHTML
      this.linkTarget.innerHTML = CONFIRMATION_MESSAGE
      this.delete = true
      this.timeout = setTimeout(() => {
        this.resetState()
      }, RESET_TIMEOUT_MILLIS)
      event.preventDefault()
      return false
    }
  }

  resetState() {
    if (this.delete) {
      this.linkTarget.removeEventListener('ajax:success', this.handleSuccess)
      this.linkTarget.removeEventListener('ajax:error', this.handleError)
      this.linkTarget.innerHTML = this.oldMessage
      this.delete = false
    }
  }
}
