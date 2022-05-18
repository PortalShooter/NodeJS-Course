const AdvertisementModel = require('./model');

const Advertisement = {
    find: (params) => {
        if (typeof params === 'object') {
            const {shortText, description, userId, tags} = params
            const search = {isDeleted: false}

            if (userId) { search.userId = userId }
            if (shortText) { search.shortText = { $regex: shortText, $options: 'i' } }
            if (description) { search.description = { $regex: description, $options: 'i' } }
            if (tags) { search.tags = { $in: tags } }

            return AdvertisementModel.find(search)
        } else {
            return AdvertisementModel.findById(params)
        }
        
    },

    create: async (data) => {
        const {shortText, description, userId, tags, isDeleted} = data
        const createdAt = new Date;
        const updatedAt = createdAt;

        const newAdvertisement = new AdvertisementModel({shortText, description, userId, tags, isDeleted, createdAt, updatedAt})

        try {
            await newAdvertisement.save()
            return {status: 'ok'}
        }
        catch (e) {
            return {status: 'error', error: e}
        }
    },

    remove: async (id) => {
        await AdvertisementModel.deleteOne({_id: id})

        try {
            return {status: 'ok', msg: 'Объявление удалено'}
        }
        catch (e) {
            return {status: 'error', error: e}
        }
    }

}

module.exports = Advertisement