const bcrypt = require('bcrypt');
const MissingParamError = require('../errors/missing_param_error');

module.exports = class Encrypter {
    async compare(value, hash) {
        if (!value) throw new MissingParamError('value');
        if (!hash) throw new MissingParamError('hash');
        const is_valid = await bcrypt.compare(value, hash);
        return is_valid;
    }
}