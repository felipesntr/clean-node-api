module.exports = class ServerError extends Error {
    constructor() {
        super(`An error occurred while processing your request. Please try again later.`);
        this.name = 'ServerError';
    }
}