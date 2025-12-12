const express = require('express');
const router = express.Router();
const { User, Message } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all users (for chat list)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.findAll({ 
            attributes: ['id', 'username', 'role', 'teamLeaderId'],
            where: { id: { [Op.ne]: req.user.id } } // Exclude self
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get message history with a specific user
router.get('/messages/:userId', auth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        const myId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: myId, receiverId: otherId },
                    { senderId: otherId, receiverId: myId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
