const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: 'string',
        required: true,
        unique: true,
    },
    passwordHash: {
        type: 'string',
        required: true,
    },
    name: {
        type: 'string',
        required: true,
    },
    contactPhone: {
        type: 'string',
        required: false,
    }
});

module.exports = model('User', userSchema);