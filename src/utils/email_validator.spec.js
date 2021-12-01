class EmailValidator {
    isValid(email) {
        return true;
    }
}

describe('Email Validator', () => {
    test('Should return true if validator returns true', () => {
        let sut = new EmailValidator();
        let isEmailValid = sut.isValid('valid_email@email.com');
        expect(isEmailValid).toBe(true);
    });
});