const {Schema, model} = require('mongoose');

const ChatSchema = new Schema({
    users: {
        type: [ObjectId, ObjectId],
        required: true,
    },
    createdAt: {
        type: 'Date',
        required: true,
        default: Date.now,
    },
    messages: {
        
    }
})

module.exports = model('Chat', ChatSchema)