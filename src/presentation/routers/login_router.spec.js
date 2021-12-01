const LoginRouter = require('./login_router');
const MissingParamError = require('../helpers/missing_param_error');
const UnauthorizedError = require('../helpers/unauthorized_error');
const ServerError = require('../helpers/server_error');

const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase();
    authUseCaseSpy.accessToken = 'valid_token';
    const sut = new LoginRouter(authUseCaseSpy);
    return {
        sut,
        authUseCaseSpy
    }
}

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        auth(email, password) {
            this.email = email;
            this.password = password;
            return this.accessToken;
        }
    }
    return new AuthUseCaseSpy();
}


const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        auth() { throw new Error() }
    }

    return new AuthUseCaseSpy();
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
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if no httpRequest has no body', () => {
        let { sut } = makeSut();
        let httpRequest = {};
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
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

    test('Should return 200 if valid credentials are provided', () => {
        let { sut, authUseCaseSpy } = makeSut();
        let httpRequest = {
            body: {
                email: 'valid_email@email.com',
                password: 'valid_password'
            }
        };
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
    });

    test('Should return 401 when invalid credentials are provided', () => {
        let { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accessToken = null;
        let httpRequest = {
            body: {
                email: 'invalid@email.com',
                password: 'invalid_password'
            }
        };
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    test('Should return 500 if no AuthUseCase is provided', () => {
        let sut = new LoginRouter();
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if no AuthUseCase has no auth method', () => {
        class AuthUseCaseSpy {

        }
        let authUseCaseSpy = new AuthUseCaseSpy();
        let sut = new LoginRouter(authUseCaseSpy);

        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };

        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if no AuthUseCase throws', () => {
        authUseCaseSpy = makeAuthUseCaseWithError();
        let sut = new LoginRouter(authUseCaseSpy);
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });
});
