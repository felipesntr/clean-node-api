const MissingParamError = require('./missing_param_error');
const UnauthorizedError = require('./unauthorized_error');

module.exports = class HttpResponse {
    static badRequest(paramName) {
        return {
            statusCode: 400,
            body: new MissingParamError(paramName)
        }
    }
    static serverError() {
        return {
            statusCode: 500
        }
    }
    static unauthorizedError() {
        return {
            statusCode: 401,
            body: new UnauthorizedError()
        }
    }
}
