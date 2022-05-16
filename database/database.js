const Sequelize = require('sequelize');
const connection = new Sequelize('simpleblog', 'root', '2d02090ea1', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;