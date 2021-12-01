const { MissingParamError } = require('../../utils/errors');
const makeSut = (loadUserByEmailRepositorySpy) => {
    class AuthUseCase {
        constructor(loadUserByEmailRepository) {
            this.loadUserByEmailRepository = loadUserByEmailRepository;
        }
        async auth(email, password) {
            if (!email) {
                throw new MissingParamError('email');
            }
            if (!password) {
                throw new MissingParamError('password');
            }
            await this.loadUserByEmailRepository.load(email);
        }
    }

    const authUseCase = new AuthUseCase(loadUserByEmailRepositorySpy);
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

    test('Should call LoadUserByEmailRepository with correct email', async () => {
        class LoadUserByEmailRepositorySpy {
            async load(email) {
                this.email = email;
            }
        }
        loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();

        const sut = makeSut(loadUserByEmailRepositorySpy);
        sut.auth('any_email@email.com', 'any_password');

        expect(loadUserByEmailRepositorySpy.email).toBe('any_email@email.com');
    });
});