const validator = require('validator');

class EmailValidator {
    isValid(email) {
        return validator.isEmail(email);
    }
}

describe('Email Validator', () => {
    test('Should return true if validator returns true', () => {
        let sut = new EmailValidator();
        let isEmailValid = sut.isValid('valid_email@email.com');
        expect(isEmailValid).toBe(true);
    });

    test('Should return true if validator returns true', () => {
        validator.isEmailValid = false;
        let sut = new EmailValidator();
        let isEmailValid = sut.isValid('invalid_email@email.com');
        expect(isEmailValid).toBe(false);
    });
});