const express = require('express');
const router = express.Router();
const { GlobalConfig } = require('../models');
const auth = require('../middleware/auth');

router.get('/sos', auth, async (req, res) => {
    try {
        const config = await GlobalConfig.findOne({ where: { key: 'sos_number' } });
        res.json({ number: config ? config.value : '' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/sos', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }
        const { number } = req.body;
        let config = await GlobalConfig.findOne({ where: { key: 'sos_number' } });
        if (config) {
            config.value = number;
            await config.save();
        } else {
            await GlobalConfig.create({ key: 'sos_number', value: number });
        }
        res.json({ message: 'SOS Number updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
