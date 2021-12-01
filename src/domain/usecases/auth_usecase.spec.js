const { MissingParamError } = require('../../utils/errors');
const makeSut = () => {
    class AuthUseCase {
        async auth(email, password) {
            if (!email) {
                throw new MissingParamError('email');
            }
            if (!password) {
                throw new MissingParamError('password');
            }
        }
    }

    const authUseCase = new AuthUseCase();
    return authUseCase;
}

describe('Auth UseCase', () => {
    test('Should throw if no email is provided', async () => {
        const sut = makeSut();
        const promise = sut.auth();
        expect(promise).rejects.toThrow(new MissingParamError('email'));
    });

    test('Should throw if no password is provided', async () => {
        const sut = makeSut();
        const promise = sut.auth('any_email@email.com');
        expect(promise).rejects.toThrow(new MissingParamError('password'));
    });
});