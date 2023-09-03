const mongoose = require('mongoose');
const areMongoIdsValid = (ids) => {
    try {
        const areIdsValid = ids.every(id => mongoose.Types.ObjectId.isValid(id))
        return areIdsValid;
    }
    catch (err) {
        console.log(err)
    }
}
module.exports = areMongoIdsValid;
