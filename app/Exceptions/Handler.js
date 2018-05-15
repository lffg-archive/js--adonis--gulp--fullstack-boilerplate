'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')
const Env = use('Env')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (errror, ctx) {
    this.error = errror
    this.ctx = ctx

    // Handle invalid session error:
    if (code === 'E_INVALID_SESSION') {
      return this._respond(401)
    }

    // Handle 404 error:
    if (name === 'HttpException' && status === 404) {
      return this._respond(404)
    }

    // Handle others errros (in development):
    if (Env.get('NODE_ENV') === 'development') {
      return super.handle(...arguments)
    }

    // Handle 500 error if in production:
    return this._respond(500)
  }

  _respond (status = 500) {
    const { request, response, view } = this.ctx

    if (request.accepts(['html', 'json']) === 'json') {
      return this._respondViaJSON(status)
    }

    response.status(status)

    try {
      response.send(view.render(`errors.${status}`))
    } catch (error) {
      // If there is no view:
      response.send(`ERROR: ${status} server errror.`)
    }
  }

  _respondViaJSON (status = 500) {
    const { response } = this.ctx

    const message = ({
      401: 'Unauthorized',
      404: 'Page not found',
      500: 'Internal server error' // default one
    })[status]

    return response.status(status).json({
      error: true, message, status
    })
  }
}

module.exports = ExceptionHandler
