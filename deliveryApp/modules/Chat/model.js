const {Schema, model} = require('mongoose');

const ChatSchema = new Schema({

    users: [
        {
            type: 'ObjectId',
            required: true,
        },
        {
            type: 'ObjectId',
            required: true,
        }
    ],
    createdAt: {
        type: 'Date',
        required: true,
        default: Date.now,
    },
    messages: {
        type: ['ObjectId'],
    }
})

module.exports = model('Chat', ChatSchema)