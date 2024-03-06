function keyFromValue(obj, val) {
    for (const [key, value] of Object.entries(obj)) {
        if (value === val) {
            return key;
        }
    }
}

module.exports = {
    keyFromValue
}