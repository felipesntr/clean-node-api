
class LoginRouter {
    route(httpRequest) {
        if (!httpRequest || !httpRequest.body) {
            return HttpResponse.serverError();
        }
        const { email, password } = httpRequest.body;
        if (!email) {
            return HttpResponse.badRequest('email');
        }
        if (!password) {
            return HttpResponse.badRequest('password');
        }
    }
}

class HttpResponse {
    static badRequest(paramName) {
        return {
            statusCode: 400,
            body: new MissingParamError(paramName)
        }
    }
    static serverError() {
        return {
            statusCode: 500
        }
    }
}

class MissingParamError extends Error {
    constructor(paramName) {
        super(`Missing param: ${paramName}`);
        this.name = 'MissingParamError';
    }
}

describe('Login Router', () => {
    test('Should return 400 if no email is provided', () => {
        let sut = new LoginRouter();
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
        let sut = new LoginRouter();
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
        let sut = new LoginRouter();
        let httpResponse = sut.route();
        expect(httpResponse.statusCode).toBe(500);
    });

    test('Should return 500 if no httpRequest has no body', () => {
        let sut = new LoginRouter();
        let httpRequest = {};
        let httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
    })
})
