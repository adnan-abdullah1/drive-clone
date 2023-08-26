

const { body, check,validationResult } = require('express-validator');

const registerValidator = (req, res, next) => {
    check('email')
        .notEmpty()
        .trim()
        .isEmail()

    const isError = validationResult(req);
    if (isError.isEmpty()) {
        next();
    }
    else
    return res.status(404).json({ message: 'Validation error', data: {} })

}

module.exports = registerValidator
