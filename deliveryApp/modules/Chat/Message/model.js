const {Schema, model} = require('mongoose');

const MessageSchema = new Schema({
    author: {
        type: 'ObjectId',
        required: true,
    },
    sentAt: {
        type: 'Date',
        required: true,
        default: Date.now,
    },
    text: {
        type: 'string',
        required: true,
    },
    readAt: {
        type: 'Date',
    }
})

module.exports = model('Message', MessageSchema)