
class LoginRouter {
    route(httpRequest) {
        if (!httpRequest.email || !httpRequest.password) {
            return {
                statusCode: 400,
            };
        }
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
    });
})
