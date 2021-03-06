const EmailValidator = require('./email_validator');
const validator = require('validator');
const MissingParamError = require('../errors/missing_param_error');

const makeSut = () => {
    return new EmailValidator();
}

describe('Email Validator', () => {
    test('Should return true if validator returns true', () => {
        let sut = makeSut();
        let isEmailValid = sut.isValid('valid_email@email.com');
        expect(isEmailValid).toBe(true);
    });

    test('Should return true if validator returns true', () => {
        validator.isEmailValid = false;
        let sut = makeSut();
        let isEmailValid = sut.isValid('invalid_email@email.com');
        expect(isEmailValid).toBe(false);
    });

    test('Should call validator with correct email', () => {
        let sut = makeSut();
        sut.isValid('any_email@email.com');
        expect(validator.email).toBe('any_email@email.com');
    });

    test('Should throws if no email are provided', async () => {
        const sut = makeSut();
        expect(() => sut.isValid()).toThrow(new MissingParamError('email'));
    });
});