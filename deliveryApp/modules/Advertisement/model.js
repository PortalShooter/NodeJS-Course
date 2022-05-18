const {Schema, model} = require('mongoose');

const advertisementSchema = new Schema({
    shortText: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'string',
    },
    images: {
        type: 'string',
    },
    userId: {
        type: 'ObjectId',
        required: true,
    },
    createdAt: {
        type: 'Date',
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: 'Date',
        required: true,
        default: Date.now,
    },
    tags: {
        type: [String],
    },
    isDeleted: {
        type: 'Boolean',
        required: true,
    }

})

module.exports = model('Advertisement', advertisementSchema);