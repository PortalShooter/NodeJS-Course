const express = require('express');
const router = express.Router();
const path = require('path')
const Chat = require('./service');

// router.post('/', async (req, res) => {
//     const {receiver, text} = req.body
//     const author = req.session.passport.user.id

//     const data = {receiver, text, author}

//     const message = await Chat.sendMessage(data);

//     // console.log('message', message);

    
// })


module.exports = router;