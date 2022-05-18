const MessageModel = require('./model');

const Message = {
    send: async (data) => {
        const newMessage = await new MessageModel(data)

        try {
            await newMessage.save()
            return {status: 'ok', msg: 'Сообщение успешно сохранено'}
        } catch (e) {
            return {status: 'error', msg: e}
        }
    }
}

module.exports = Message