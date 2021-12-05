const bcrypt = require('bcrypt');
const Encrypter = require('./encrypter');

const makeSut = () => {
    return new Encrypter();
}

describe('Encrypter', () => {

    test('Should return true if bcrypt return trues', async () => {
        const sut = makeSut();
        const is_valid = await sut.compare('string', 'hashed_string');
        expect(is_valid).toBe(true);
    });

    test('Should return false if bcrypt return false', async () => {
        const sut = makeSut();
        bcrypt.is_valid = false;
        const is_valid = await sut.compare('string', 'hashed_string');
        expect(is_valid).toBe(false);
    });

    test('Should calls bcrypt with correct values', async () => {
        const sut = makeSut();
        bcrypt.is_valid = false;
        const is_valid = await sut.compare('string', 'hashed_string');
        expect(bcrypt.string).toBe('string');
        expect(bcrypt.hashed_string).toBe('hashed_string');
    });

});