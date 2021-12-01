const LoginRouter = require('./login_router');
const MissingParamError = require('../helpers/missing_param_error');

const makeSut = () => {
    class AuthUseCaseSpy {
        auth(email, password) {
            this.email = email;
            this.password = password;
        }
    }
    const authUseCaseSpy = new AuthUseCaseSpy();
    const sut = new LoginRouter(authUseCaseSpy);

    return {
        sut,
        authUseCaseSpy
    }
}

describe('Login Router', () => {
    test('Should return 400 if no email is provided', () => {
        let { sut } = makeSut();
        let httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    test('Should return 400 if no password is provided', () => {
        let { sut } = makeSut();
        let httpRequest = {
            body: {
                email: 'any_email@email.com'
            }
        }
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });

    test('Should return 500 if no httpRequest is provided', () => {
        let { sut } = makeSut();
        let httpResponse = sut.route();
        expect(httpResponse.statusCode).toBe(500);
    });

    test('Should return 500 if no httpRequest has no body', () => {
        let { sut } = makeSut();
        let httpRequest = {};
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
    });

    test('Should call AuthUseCase with correct params', () => {
        let { sut, authUseCaseSpy } = makeSut();
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        sut.route(httpRequest);
        expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
    });
})
