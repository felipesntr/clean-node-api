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

    test('Should update the user with the given accessToken', async () => {
        const { sut, userModel } = makeSut();
        const fakeUser = await userModel.insertOne({
            email: 'valid_email@email.com',
            name: 'valid_name',
            age: 20,
            state: 'valid_state',
            city: '_city',
            password: 'hashed_password'
        });
        await sut.update(fakeUser.ops[0]._id, 'valid_access_token');
        const updatedFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id });
        expect(updatedFakeUser.accessToken).toBe('valid_access_token');
    });


    test('Should throw if no userModel is provided', async () => {
        const userModel = db.collection('users');
        const sut = new UpdateAccessTokenRepository();
        const fakeUser = await userModel.insertOne({
            email: 'valid_email@email.com',
            name: 'valid_name',
            age: 20,
            state: 'valid_state',
            city: '_city',
            password: 'hashed_password'
        });
        const promise = sut.update(fakeUser.ops[0]._id, 'valid_access_token');
        expect(promise).rejects.toThrow();
    });


    test('Should throw if no params are provided', async () => {
        const { sut, userModel } = makeSut();
        const fakeUser = await userModel.insertOne({
            email: 'valid_email@email.com',
            name: 'valid_name',
            age: 20,
            state: 'valid_state',
            city: '_city',
            password: 'hashed_password'
        });
        expect(sut.update()).rejects.toThrow(new MissingParamError('userId'));
        expect(sut.update(fakeUser.ops[0]._id)).rejects.toThrow(new MissingParamError('accessToken'));
    });
});