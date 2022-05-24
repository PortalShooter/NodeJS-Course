const express = require('express');
const router = express.Router();
const path = require('path')
const Chat = require('./service');

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/chat.html'))
})


module.exports = router;