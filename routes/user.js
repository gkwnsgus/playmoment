const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/user');

const router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
        try {
            const users = await User.findAll({
                attributes: ['id']
            });

            res.locals.title = require('../package.json').name;
            res.locals.port = process.env.PORT;
            res.locals.users = users.map(v => v.id);
            res.render('/');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        const { id, password, name, email } = req.body;
        
        if (!id || !password || !name || !email) return res.send("<script>alert('모든 정보를 입력해주세요'); window.location.replace('user.html');</script>");

        const user = await User.findOne({ where: { id } });
        if (user) {
            res.send("<script>alert('이미 등록된 아이디입니다.'); window.location.replace('user.html');</script>");
            return;
        }
        try {
            const hash = await bcrypt.hash(password, 12);
            await User.create({
                id,
                password: hash,
                name,
                email
            });
            res.send("<script>alert('가입완료! 로그인페이지로 이동합니다'); window.location.replace('/login');</script>");
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'name', 'email']
        });
        res.json(user);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
