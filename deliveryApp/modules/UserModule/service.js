const crypto = require('crypto');
const User = require('./model');

const salt = 'f844b09ff50c';

const UserModule = {
    create: async (req) => {
        const {email, password, name, contactPhone} = req.body
        const hash = crypto.pbkdf2Sync(password, salt , 310000, 32, 'sha256')
        const passwordHash = hash.toString(`hex`)
        const newUser = new User({
            email, passwordHash, name, contactPhone
        }) 
        try {
            await newUser.save();
            return newUser
        } catch (e) {
            return null
        }
        
    },

    findByEmail: (email) => {
        return User.findOne({ email })
    }
}

module.exports = UserModule