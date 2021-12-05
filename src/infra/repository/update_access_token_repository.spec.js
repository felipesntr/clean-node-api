const MongoHelper = require('../helpers/mongo_helper');

let db;

class UpdateAccessTokenRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async update(id, accessToken) {
        this.accessToken = accessToken;
        await this.userModel.updateOne(
            { _id: id },
            {
                $set: {
                    accessToken
                }
            });
    }
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
        const userModel = db.collection('users');
        const sut = new UpdateAccessTokenRepository(userModel);
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

});