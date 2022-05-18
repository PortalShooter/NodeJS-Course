const express = require('express');
const router = express.Router();
const Advertisement = require('./service');

router.post('/create', async (req, res) => {
    const advertisement = await Advertisement.create(req.body);
    res.json(advertisement)
})

router.post('/remove:id', async (req, res) => {
    const {id} = req.params
    const advertisement = await Advertisement.remove(id);
    res.json(advertisement)
})

router.get('/', async (req, res) => {
    const advertisements = await Advertisement.find(req.body);
    res.json(advertisements)
})

router.post('/', async (req, res) => {
    const advertisements = await Advertisement.find(req.body);

    
    res.json(advertisements)
})

router.get('/:id', async (req, res) => {
    const {id} = req.params
    const advertisements = await Advertisement.find(id);
    res.json(advertisements)
})

module.exports = router;