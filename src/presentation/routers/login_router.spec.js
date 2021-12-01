const LoginRouter = require('./login_router');
const MissingParamError = require('../helpers/missing_param_error');
const InvalidParamError = require('../helpers/invalid_param_error');
const UnauthorizedError = require('../helpers/unauthorized_error');
const ServerError = require('../helpers/server_error');
const e = require('express');

const makeEmailValidator = () => {
    class EmailValidatorSpy {
        isValid(email) {
            this.email = email;
            return this.isEmailValid;
        }
    }
    const emailValidatorSpy = new EmailValidatorSpy();
    emailValidatorSpy.isEmailValid = true;
    return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
    class EmailValidatorSpy {
        isValid(email) {
            throw new Error();
        }
    }
    return new EmailValidatorSpy();;
}

const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidator();
    authUseCaseSpy.accessToken = 'valid_token';
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    return {
        sut,
        authUseCaseSpy,
        emailValidatorSpy
    }
}

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        async auth(email, password) {
            this.email = email;
            this.password = password;
            return this.accessToken;
        }
    }
    return new AuthUseCaseSpy();
}


const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        async auth() { throw new Error() }
    }

    return new AuthUseCaseSpy();
}

describe('Login Router', () => {
    test('Should return 400 if no email is provided', async () => {
        let { sut } = makeSut();
        let httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    test('Should return 400 if an invalid email is provided', async () => {
        let { sut, emailValidatorSpy } = makeSut();
        emailValidatorSpy.isEmailValid = false;
        let httpRequest = {
            body: {
                email: 'any@+54.com',
                password: 'any_password'
            }
        }
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    test('Should return 400 if no password is provided', async () => {
        let { sut } = makeSut();
        let httpRequest = {
            body: {
                email: 'any_email@email.com'
            }
        }
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });

    test('Should return 500 if no httpRequest is provided', async () => {
        let { sut } = makeSut();
        let httpResponse = await sut.route();
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if no httpRequest has no body', async () => {
        let { sut } = makeSut();
        let httpRequest = {};
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should call AuthUseCase with correct params', async () => {
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

    test('Should return 200 if valid credentials are provided', async () => {
        let { sut, authUseCaseSpy } = makeSut();
        let httpRequest = {
            body: {
                email: 'valid_email@email.com',
                password: 'valid_password'
            }
        };
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
    });

    test('Should return 401 when invalid credentials are provided', async () => {
        let { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accessToken = null;
        let httpRequest = {
            body: {
                email: 'invalid@email.com',
                password: 'invalid_password'
            }
        };
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    test('Should return 500 if no AuthUseCase is provided', async () => {
        let sut = new LoginRouter();
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if no AuthUseCase has no auth method', async () => {
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

        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if no AuthUseCase throws', async () => {
        authUseCaseSpy = makeAuthUseCaseWithError();
        let sut = new LoginRouter(authUseCaseSpy);
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if no EmailValidator is provided', async () => {
        let authUseCaseSpy = makeAuthUseCase();
        let sut = new LoginRouter(authUseCaseSpy);
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if EmailValidator has no isValid method', async () => {
        let authUseCaseSpy = makeAuthUseCase();
        let sut = new LoginRouter(authUseCaseSpy, {});
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should return 500 if EmailValidator throws', async () => {
        let authUseCaseSpy = makeAuthUseCase();
        let emailValidatorSpy = makeEmailValidatorWithError();
        let sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        let httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should call EmailValidator with correct email', async () => {
        let { sut, emailValidatorSpy } = makeSut();
        let httpRequest = {
            body: {
                email: 'any@email.com',
                password: 'any_password'
            }
        };
        sut.route(httpRequest);
        expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
    });

});
