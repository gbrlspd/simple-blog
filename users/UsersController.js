const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users: users});
    })
});

router.get('/login', (req, res) => {
    res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
    var login = req.body.login;
    var password = req.body.password;
    User.findOne({where: {login: login}}).then(user => {
        if(user != undefined) {
            var correct = bcrypt.compareSync(password, user.password);
            if(correct) {
                req.session.user = {
                    id: user.id,
                    login: user.login
                }
                res.redirect('/admin/users');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    });
});

router.get('/admin/users/new', adminAuth, (req, res) => {
    res.render('admin/users/new');
});

router.post('/users/save', adminAuth, (req, res) => {
    var login = req.body.login;
    var password = req.body.password;
    User.findOne({where: {login: login}}).then(user => {
        if(user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            User.create({
                login: login,
                password: hash
            }).then(() => {
                res.redirect('/admin/users');
            });
        } else {
            res.redirect('/admin/users/new');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

module.exports = router;