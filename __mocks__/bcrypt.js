module.exports = {
    is_valid: true,
    string: '',
    hashed_string: '',
    async compare(string, hashed_string) {
        this.string = string;
        this.hashed_string = hashed_string;
        return this.is_valid;
    }
}