const validator = require('validator');
const MissingParamError = require('../errors/missing_param_error');

module.exports = class EmailValidator {
    isValid(email) {
        if (!email) throw new MissingParamError('email');
        return validator.isEmail(email);
    }
}

