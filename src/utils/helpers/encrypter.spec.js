const bcrypt = require('bcrypt');
const Encrypter = require('./encrypter');
const MissingParamError = require('../errors/missing_param_error');

const makeSut = () => {
    return new Encrypter();
}

describe('Encrypter', () => {

    test('Should return true if bcrypt return trues', async () => {
        const sut = makeSut();
        const is_valid = await sut.compare('value', 'hashed_value');
        expect(is_valid).toBe(true);
    });

    test('Should return false if bcrypt return false', async () => {
        const sut = makeSut();
        bcrypt.is_valid = false;
        const is_valid = await sut.compare('value', 'hashed_value');
        expect(is_valid).toBe(false);
    });

    test('Should calls bcrypt with correct values', async () => {
        const sut = makeSut();
        await sut.compare('value', 'hashed_value');
        expect(bcrypt.value).toBe('value');
        expect(bcrypt.hash).toBe('hashed_value');
    });

    test('Should throws if no params are provided', async () => {
        const sut = makeSut();
        expect(sut.compare()).rejects.toThrow(new MissingParamError('value'));
        expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'));
    });



});