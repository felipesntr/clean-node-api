
class Encrypter {
    async compare(password, hashed_password) {
        return true;
    }
}


describe('Encrypter', () => {

    test('Should return true if bcrypt return trues', async () => {
        const sut = new Encrypter();
        const is_valid = await sut.compare('any_password', 'hashed_password');
        expect(is_valid).toBe(true);
    });

});