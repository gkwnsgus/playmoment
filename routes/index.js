const path = require('path');

const express = require('express');
const { User } = require('../models');

const router = express.Router();
router.get('/data', async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'password', 'name', 'email'],
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
