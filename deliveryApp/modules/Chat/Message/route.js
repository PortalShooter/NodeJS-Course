const express = require('express');
const router = express.Router();
const Message = require('./service');

router.post('/', async (req, res) => {
    const {author, text} = req.body
    const message = await Message.send({author, text})
    res.json(message)
})


module.exports = router;