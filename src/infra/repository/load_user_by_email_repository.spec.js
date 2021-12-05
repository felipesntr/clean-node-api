const MongoHelper = require('../helpers/mongo_helper');
const LoadUserByEmailRepository = require('./load_user_by_email_repository')

let db;

const makeSut = () => {
    const userModel = db.collection('users');
    const sut = new LoadUserByEmailRepository(userModel);

    return {
        sut,
        userModel
    }
}

describe('LoadUserByEmail Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
        db = MongoHelper.db;
    });

    beforeEach(async () => {
        await db.collection('users').deleteMany({});
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    test('Should return null if no user is found', async () => {
        const { sut } = makeSut();
        const user = await sut.load('invalid_email@email.com');
        expect(user).toBeNull();
    });

    test('Should return an user if user is found', async () => {
        const { sut, userModel } = makeSut();
        const fakeUser = await userModel.insertOne({
            email: 'valid_email@email.com',
            name: 'valid_name',
            age: 20,
            state: 'valid_state',
            city: '_city',
            password: 'hashed_password'
        });
        const user = await sut.load('valid_email@email.com');
        expect(user).toEqual({
            _id: fakeUser.ops[0]._id,
            password: fakeUser.ops[0].password,
        });
    });

    test('Should throw if no userModel is provided', async () => {
        const sut = new LoadUserByEmailRepository();
        const promise = sut.load('any_email@email.com');
        expect(promise).rejects.toThrow();
    });

});

