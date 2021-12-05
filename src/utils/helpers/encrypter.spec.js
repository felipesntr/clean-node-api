const bcrypt = require('bcrypt');
class Encrypter {
    async compare(string, hashed_string) {
        const is_valid = await bcrypt.compare(string, hashed_string);
        return is_valid;
    }
}

describe('Encrypter', () => {

    test('Should return true if bcrypt return trues', async () => {
        const sut = new Encrypter();
        const is_valid = await sut.compare('string', 'hashed_string');
        expect(is_valid).toBe(true);
    });

    test('Should return false if bcrypt return false', async () => {
        const sut = new Encrypter();
        bcrypt.is_valid = false;
        const is_valid = await sut.compare('string', 'hashed_string');
        expect(is_valid).toBe(false);
    });

});