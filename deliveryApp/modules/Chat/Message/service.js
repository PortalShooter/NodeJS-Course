const MessageModel = require('./model');

const Message = {
    sendMessage: async (data) => {
        // const {text} = data
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