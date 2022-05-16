const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
    login: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

/* just remove the comment bellow to create the users table */
//User.sync();

module.exports = User;