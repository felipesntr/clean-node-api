const MissingParamError = require('../../utils/errors/missing_param_error');
const MongoHelper = require('../helpers/mongo_helper');
const UpdateAccessTokenRepository = require('./update_access_token_repository');

let db;

const makeSut = () => {
    const userModel = db.collection('users');
    const sut = new UpdateAccessTokenRepository(userModel);
    return {
        sut,
        userModel
    };
}

describe('UpdateAccessTokenRepositorySpy', () => {
    let fakeUserId;

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
        db = MongoHelper.db;
    });

    beforeEach(async () => {
        const userModel = await db.collection('users').deleteMany({});
        await userModel.deleteMany({});
        const fakeUser = await userModel.insertOne({
            email: 'valid_email@email.com',
            name: 'valid_name',
            age: 20,
            state: 'valid_state',
            city: '_city',
            password: 'hashed_password'
        });
        fakeUserId = fakeUser.ops[0]._id;
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    test('Should update the user with the given accessToken', async () => {
        const { sut } = makeSut();
        await sut.update(fakeUserId, 'valid_access_token');
        const updatedFakeUser = await userModel.findOne({ _id: fakeUserId });
        expect(updatedFakeUser.accessToken).toBe('valid_access_token');
    });


    test('Should throw if no userModel is provided', async () => {
        const sut = new UpdateAccessTokenRepository();
        const promise = sut.update(fakeUserId, 'valid_access_token');
        expect(promise).rejects.toThrow();
    });


    test('Should throw if no params are provided', async () => {
        const { sut } = makeSut();
        expect(sut.update()).rejects.toThrow(new MissingParamError('userId'));
        expect(sut.update(fakeUserId).rejects.toThrow(new MissingParamError('accessToken')));
    });
});