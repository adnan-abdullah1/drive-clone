const mongoose = require('mongoose');
const areMongoIdsValid = async (ids) => {
    if (!Array.isArray(ids) || !ids.length) {
        return { valid: false, message: 'ids should be in array and valid' }
    }
    return ids.every(id => mongoose.Types.ObjectId.isValid(id))
}

module.exports = areMongoIdsValid;
