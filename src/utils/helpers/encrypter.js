const bcrypt = require('bcrypt');
module.exports = class Encrypter {
    async compare(string, hashed_string) {
        const is_valid = await bcrypt.compare(string, hashed_string);
        return is_valid;
    }
}