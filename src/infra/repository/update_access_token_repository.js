const MissingParamError = require("../../utils/errors/missing_param_error");

module.exports = class UpdateAccessTokenRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async update(id, accessToken) {
        if (!id) throw new MissingParamError('userId');
        if (!accessToken) throw new MissingParamError('accessToken');
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