
class LoginRouter {
    route(httpRequest) {
        if (!httpRequest.email) {
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
    })
})