const MongoClient = require('mongodb');

module.exports = {
    async connect(url, db_name = undefined) {
        this.client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.db = this.client.db(db_name);
        this.db_name = db_name;
    },

    async disconnect() {
        await this.client.close();
        this.client = undefined;
        this.db = undefined;
    }
}