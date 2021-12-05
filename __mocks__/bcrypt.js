module.exports = {
    is_valid: true,
    value: '',
    hash: '',
    async compare(value, hash) {
        this.value = value;
        this.hash = hash;
        return this.is_valid;
    }
}