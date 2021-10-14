class Controller {
  /**
    * Return a response Object
    * @param {any} message message the message to send to client
    * @param {Number} status status the status code
    * @returns {Object} response to be sent to the client
    */
  response (message = '', status = 200) {
    return { status, message }
  }
}

export default Controller
