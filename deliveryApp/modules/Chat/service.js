const ChatModel = require('./model');
const MessageModel = require('./Message/model')
const User = require('../UserModule/service')

const Chat = {
    async sendMessage(data) {
        const {receiverEmail, text, author} = data

        const findUser = await User.findByEmail(receiverEmail)
        
        if(!findUser) {return {status: 'error', msg: 'Пользователя с такой почтой нет.'}}
        if (findUser) {
            const receiver = findUser._id
            const newMessage = await new MessageModel({author, text})
            const findChat = await ChatModel.findOneAndUpdate({users: [author, receiver]},{ "$push": { "messages": newMessage._id } })

            if(!findChat) {
                const newChat = await new ChatModel({users: [author, receiver], messages: newMessage._id})
                try {
                    await newMessage.save()
                    await newChat.save()
                    return {status: 'ok', msg: 'Чат успешно создан'}
                }
                catch (e) {
                    return {status: 'error', error: e}
                }
            }

            try {
                await newMessage.save()
                return {status: 'ok', msg: 'Сообщение отправлено'}
            }
            catch (e) {
                return {status: 'error', error: e}
            }
        }
    },
    
    find(data) {
        console.log('data', data);
        return ChatModel.findOne({users: data})
    },

    subscribe(data) {
        return data
    },

    async getHistory({idCompanion, author}) {
        const findChat = await this.find([author, idCompanion])

        if(findChat && findChat.messages) {
            const messages = await MessageModel.find( { _id: { $in : findChat.messages } } )
            return messages
        } 

        return {status: 'error', msg: 'Такого чата нет'}
    }
}

module.exports = Chat