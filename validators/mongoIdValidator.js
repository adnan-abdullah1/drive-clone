const mongoose = require('mongoose');
const areMongoIdsValid =  (ids,res = undefined) => {
    if (!Array.isArray(ids) || !ids.length) {
        if(res) {
            return res.status(400).json({message:'Object Id should have array format for validation'})
        }
        return { valid: false, message: 'ids should be in array and valid' }
    }
    const areIdsValid = ids.every(id => mongoose.Types.ObjectId.isValid(id))
    if(res){
        if(!areIdsValid){
            return res.status(400).json({message:`ObjectId is not valid`});
        }
    }
    return areIdsValid;
}

module.exports = areMongoIdsValid;
